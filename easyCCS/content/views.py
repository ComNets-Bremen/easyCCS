from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.urls import reverse, reverse_lazy
from django.db.models.query import QuerySet

from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from django.contrib.auth.decorators import login_required

from django.conf import settings

import numpy as np

from .models import Skill, Content, Module
from .forms import ExtendedSkillForm, ContentForm, SkillForm, ModuleForm

import json

@login_required
def index(request):
    return render(request, "content/index.html", {"title" : "Overview"})

@login_required
def getSkills(request):
    skills = Skill.objects
    return render(request, 'content/skillOverview.html', {'skills':skills})

@login_required
def getTree(request, skillId):
    requiredSkill = Skill.objects.get(pk=skillId)

    # Get list of content objects
    co = getContentsForSkill(skillId)

    return render(request, 'content/printTree.html', {"contents" : co, "skill": requiredSkill.skill_name})

@login_required
def getGraphJson(request):
    returnObject = dict()
    returnObject["nodes"] = list()
    returnObject["links"] = list()

    for c in Content.objects.all():
        returnObject["nodes"].append({
            "id" : c.id,
            "name" : str(c.content_name),
            "label": ""
            })

        # Get all skills pointing to this Content
        for requiredSkill in c.required_skills.all():
            containingSkillContentObjects = Content.objects.filter(new_skills = requiredSkill)
            for cs in containingSkillContentObjects:
                returnObject["links"].append({
                    "source" : cs.id,
                    "target" : c.id,
                    "type" : requiredSkill.skill_name
                    })

    # fill unhandled skills
    requiredContents = []
    for rc in returnObject["links"]:
        requiredContents.append(str(rc["source"]))

    givenContents = []
    for gc in returnObject["nodes"]:
        givenContents.append(gc["id"])

    print("req", set(requiredContents))
    print("giv", set(givenContents))
    missingSkills = list(set(requiredContents) - set(givenContents))

    print("###",missingSkills,"***")

    return JsonResponse(returnObject)

@login_required
def getGraph(request):
    return render(request, 'content/d3graph.html', {"jsonUrl":reverse("getGraphJson")})


@login_required
def getSkillGraph(request):
    form = None
    targetSkills = None
    requiredContents = None
    knownSkills = None

    jsonSkills = None

    workload = None


    if request.method == "POST":
        form = ExtendedSkillForm(request.POST)
        if form.is_valid():
            targetSkills = Skill.objects.filter(pk__in = form.cleaned_data["required_skills"])

            knownSkills = Skill.objects.filter(pk__in = form.cleaned_data["known_skills"]).values_list("id", flat=True)

            requiredContents = getContentsForSkill(targetSkills, ignoreSkills=knownSkills)

            # Calculate overall workload
            workload = sum([c.content.content_workload for c in requiredContents])

            if requiredContents:
                # Get the levels and the connections aka parents

                jsonSkills = list() # results
                checkLevel = 1      # Start checking at level 1
                foundOneLevel = True# Continue as long as we find at least one item for this level

                while foundOneLevel: # iterate over levels
                    foundOneLevel = False # Didn't find anything till now
                    levelContents = list()

                    for content in requiredContents: # Check if something at this level is available
                        if content.level == checkLevel:
                            foundOneLevel = True
                            parents = [] # Find parents for this level
                            for r_s in content.content.new_skills.all(): # Get required skill for this level
                                for c in requiredContents:
                                    if r_s in c.content.required_skills.all(): # Check for all other required contents if this skill is required.
                                        parents.append(c.id)
                            levelContents.append({"id" : content.id, "name" : content.content.content_name, "parents" : parents}) # Store data for json object
                    checkLevel += 1
                    jsonSkills.append(levelContents)

    else:
        form = ExtendedSkillForm()

    return render(request, "content/skillGraph.html",
            {
                "form" : form,
                "targetSkills" : targetSkills,
                "requiredContents" : requiredContents,
                "knownSkills" : knownSkills,
                "jsonSkills" : json.dumps(jsonSkills),
                "workload" : workload,
                "workload_unit" : settings.WORKLOAD_UNIT,
            })


class SkillListView(ListView):
    model = Skill
    paginate_by = 50
    title = "Skills"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class SkillDetailView(DetailView):
    model = Skill
    title = "Skill detail view"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class SkillCreate(CreateView):
    model = Skill
    title = "Add new skill"
    template_name = "content/generic_form.html"

    form_class = SkillForm


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listSkills')


class SkillUpdate(UpdateView):
    model = Skill
    title = "Change Skill"
    template_name = "content/generic_form.html"

    form_class = SkillForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listSkills')

class SkillDelete(DeleteView):
    model = Skill
    title = "Delete Skill"
    success_url = reverse_lazy("listSkills")
    template_name = "content/generic_confirm_delete.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class ContentListView(ListView):
    model = Content
    paginate_by = 50
    title = "Contents"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        if not "workload_unit" in context:
            context["workload_unit"] = settings.WORKLOAD_UNIT
        return context

class ContentDetailView(DetailView):
    model = Content
    title = "Content detail view"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        if not "workload_unit" in context:
            context["workload_unit"] = settings.WORKLOAD_UNIT

        return context

class ContentCreate(CreateView):
    model = Content
    title = "Add new content"
    template_name = "content/generic_form.html"

    form_class = ContentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listContents')

class ContentUpdate(UpdateView):
    model = Content
    title = "Change Content"
    template_name = "content/generic_form.html"

    form_class = ContentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listContents')


class ContentDelete(DeleteView):
    model = Content
    title = "Delete Content"
    success_url = reverse_lazy("listContents")
    template_name = "content/generic_confirm_delete.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class ModuleListView(ListView):
    model = Module
    paginate_by = 50
    title = "Modules"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        if not "workload_unit" in context:
            context["workload_unit"] = settings.WORKLOAD_UNIT
        return context

class ModuleDetailView(DetailView):
    model = Module
    title = "Module detail view"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        if not "workload_unit" in context:
            context["workload_unit"] = settings.WORKLOAD_UNIT
        return context

class ModuleCreate(CreateView):
    model = Module
    title = "Add new module"
    template_name = "content/generic_form.html"

    form_class = ModuleForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listModules')

class ModuleUpdate(UpdateView):
    model = Module
    title = "Change Module"
    template_name = "content/generic_form.html"

    form_class = ModuleForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listModules')


class ModuleDelete(DeleteView):
    model = Module
    title = "Delete Module"
    success_url = reverse_lazy("listModules")
    template_name = "content/generic_confirm_delete.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context


# Redirect to the app
def redirectToApp(request):
    return redirect("/content")


## Helpers

## Get Content objects for required skill
def getContentsForSkill(skillId, knownContents = [], level=1, ignoreSkills=[]):
    newContents = []
    # Got query set as parameter, iterate and call again

    if isinstance(skillId, QuerySet):
        for skill in skillId:
            if skill.id in ignoreSkills:
                return None
            for nc in getContentsForSkill(skill.id, knownContents, level, ignoreSkills):
                if nc and nc not in newContents and nc not in knownContents:
                    newContents.append(nc)
        return newContents

    # Already known -> skip
    if skillId in ignoreSkills:
        return None

    content = Content.objects.filter(new_skills=skillId).exclude(id__in=[c.id for c in knownContents + newContents])

    for c in content:
        if c.id not in knownContents and c.id not in newContents:
            newContents.append(ContentObjectWithPrio(c.id, level, c))

    contentRequiredSkills = content.values_list("required_skills", flat=True)

    for o in contentRequiredSkills:
        if o and o in ignoreSkills:
            continue
        for nc in getContentsForSkill(o, knownContents + newContents, level+1, ignoreSkills=ignoreSkills):
            if nc and nc not in newContents and nc not in knownContents:
                # add new content id
                newContents.append(ContentObjectWithPrio(nc.id, nc.level, nc.content))

    return newContents


# Get an adjacency matrix based on all skills / content objects
def getAdjacencyMatrix():
    cObjects = Content.objects.all()

    # Nodes also give the mapping between id and the position in the matrix
    nodes = sorted(cObjects.values_list("id", flat=True))

    adjMatrix = np.zeros((len(nodes), len(nodes)), dtype=int)

    for node in nodes:
        requiredSkills = Content.objects.filter(pk=node).values("required_skills")
        for skill in requiredSkills:
            teachesSkills = sorted(
                    Content.objects.filter(
                        newSkills=skill["required_skills"]
                        ).values_list("id", flat=True)
                    )
            for teachesSkill in teachesSkills:
                adjMatrix[nodes.index(node)][nodes.index(teachesSkill)] = 1

    # Get the names
    names = dict()
    for node in nodes:
        names[node] = Content.objects.filter(pk=node).get().content_name

    return (names, nodes, adjMatrix)


## Class for data and level representation
class ContentObjectWithPrio(object):
    def __init__(self, object_id, level=0, content=None):
        self.id = object_id
        self.level = level
        self.content = content

    def __repr__(self):
        return "Content id: " + str(self.id) + " with level " + str(self.level) + " and content " + str(self.content)

    def __lt__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id < other.id

    def __le__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id <= other.id

    def __eq__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id == other.id

    def __ne__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id != other.id

    def __gt__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id > other.id

    def __ge__(self, other):
        if not isinstance(other, ContentObjectWithPrio):
            return NotImplemented

        # Only the id of the object is important
        return self.id >= other.id


