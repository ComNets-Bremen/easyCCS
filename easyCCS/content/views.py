from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls import reverse, reverse_lazy
from django.db.models.query import QuerySet

from django.db.models import Q

from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

from django.contrib.auth.decorators import login_required, permission_required
from django.conf import settings
from django.contrib.auth.mixins import PermissionRequiredMixin

import numpy as np

from .models import Skill, Content, Module, Keyword, StoredConfiguration, ConfigKeyValueStorage
from .forms import ExtendedSkillForm, ContentForm, SkillForm, ModuleForm, LoadExtendedSkillForm, RequestAccessForm

import json

from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def index(request):
    return render(request, "content/index.html", {"title" : "Overview"})

@login_required
def current_status(request):
    return render(request, "content/current_status.html", {"title" : "Current Status and System Overview"})

def request_access(request):
    if request.method == "POST":
        form = RequestAccessForm(request.POST)
        if form.is_valid():
            msg = "Request for demo access\n\n"
            for field in form.cleaned_data:
                msg += field + ": " + str(form.cleaned_data[field]) + "\n\n"

            send_mail(
                'Demo Access Request',
                msg,
                str(form.cleaned_data["mail"]),
                [ConfigKeyValueStorage.config.get_value("DEFAULT_RECEIVER_MAIL_ADDRESS"),],
                fail_silently=False,
            )
            return HttpResponseRedirect(reverse('request_access_thanks'))
    else:
        form = RequestAccessForm()

    return render(request, 'content/request_access.html', {'form': form, 'title': "Request demo access"})

def request_access_thanks(request):
    return render(request, 'content/request_access_thanks.html', {'title': "Thanks for your request"})





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
def getSkillGraph(request, loadFormId=None):
    form = ExtendedSkillForm(request=request)
    targetSkills = None
    orderedRequiredContents = None
    knownSkills = None

    jsonSkills = None

    workload = None


    if request.method == "POST":

        if "load_data" in request.POST: # Check which form was clicked. Here: Load data
            loadForm = LoadExtendedSkillForm(request.POST, request=request)
            if loadForm.is_valid():
                print(loadForm.cleaned_data)
                config_data = StoredConfiguration.objects.get(id=loadForm.cleaned_data["config_id"])
                form = ExtendedSkillForm(json.loads(config_data.stored_data), request=request)
        else: # Other form. Populate with request
            form = ExtendedSkillForm(request.POST, request=request)

        if form.is_valid():
            if "store_data" in form.data: # User requested to store the data
                sd = json.dumps(form.cleaned_data)
                sc = StoredConfiguration(
                        storage_name=form.cleaned_data["title"],
                        stored_data = sd,
                        user = request.user,
                        )
                sc.save()
                return HttpResponseRedirect(
                        reverse("getSkillGraphId", args=(sc.id,))
                        )

    else: # GET request
        if loadFormId:
            config_data = None
            if request.user.is_superuser:
                config_data = StoredConfiguration.objects.filter(id=loadFormId)
            else:
                config_data = StoredConfiguration.objects.filter(id=loadFormId, user=request.user)
            if len(config_data) == 1:
                form = ExtendedSkillForm(json.loads(config_data[0].stored_data), request=request)
            else:
                form = ExtendedSkillForm(request=request)

    # We have a form with valid data: Show graph
    if form.is_bound and form.is_valid():
        targetSkills = Skill.objects.filter(pk__in = form.cleaned_data["required_skills"])

        knownSkills = Skill.objects.filter(pk__in = form.cleaned_data["known_skills"]).values_list("id", flat=True)

        requiredContents = getContentsForSkill(targetSkills, ignoreSkills=knownSkills)

        orderedRequiredContents = orderContents(requiredContents)

        # Calculate overall workload
        workload = sum([c.content.content_workload for c in orderedRequiredContents])

        if orderedRequiredContents:
            # Get the levels and the connections aka parents

            jsonSkills = list() # results

            for checkLevel in range(max([orc.level for orc in orderedRequiredContents])+1):
                levelContents = [c for c in orderedRequiredContents if c.level == checkLevel]
                levelContentsDicts = []
                for lc in levelContents:
                    parents = []
                    for rs in lc.content.required_skills.all():
                        for content in orderedRequiredContents:
                            if content.level >= checkLevel:
                                continue
                            if rs in content.content.new_skills.all():
                                parents.append(content.content.id)
                    levelContentsDicts.append({"id" : lc.content.id, "name": lc.content.content_name, "parents" : parents})
                if len(levelContentsDicts):
                    jsonSkills.append(levelContentsDicts)

    print(jsonSkills)


    return render(request, "content/skillGraph.html",
            {
                "form" : form,
                "targetSkills" : targetSkills,
                "requiredContents" : orderedRequiredContents,
                "knownSkills" : knownSkills,
                "jsonSkills" : json.dumps(jsonSkills),
                "workload" : workload,
                "workload_unit" : settings.WORKLOAD_UNIT,
                "load_form" : LoadExtendedSkillForm(request=request),
            })


class SkillListView(ListView):
    model = Skill
    paginate_by = 10
    title = "Skills"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        context["skill_filter"] = self.request.GET.get("skill_filter", '')
        return context

    def get_queryset(self):
        skill_filter = self.request.GET.get("skill_filter", "")
        q_filter =  self.model.objects.filter(
                Q(skill_name__icontains=skill_filter) |
                Q(skill_descriptive_keywords__icontains=skill_filter) |
                Q(skill_keywords__keyword_name__icontains=skill_filter)
                )
        return q_filter



class SkillDetailView(DetailView):
    model = Skill
    title = "Skill detail view"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class SkillCreate(PermissionRequiredMixin, CreateView):
    model = Skill
    title = "Add new skill"
    template_name = "content/generic_form.html"
    permission_required ='content.skill_manager'

    form_class = SkillForm


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listSkills')

class SkillUpdate(PermissionRequiredMixin, UpdateView):
    model = Skill
    title = "Change Skill"
    template_name = "content/generic_form.html"
    permission_required ='content.skill_manager'

    form_class = SkillForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listSkills')

class SkillDelete(PermissionRequiredMixin, DeleteView):
    model = Skill
    title = "Delete Skill"
    success_url = reverse_lazy("listSkills")
    template_name = "content/generic_confirm_delete.html"
    permission_required  =  'content.skill_manager'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

class ContentListView(ListView):
    model = Content
    paginate_by = 10
    title = "Contents"

    def get_queryset(self):
        content_filter = self.request.GET.get("content_filter", "")
        q_filter =  self.model.objects.filter(
                Q(content_name__icontains=content_filter) |
                Q(content_description__icontains=content_filter) |
                Q(content_keywords__keyword_name__icontains=content_filter)
                )

        return q_filter

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        if not "workload_unit" in context:
            context["workload_unit"] = settings.WORKLOAD_UNIT

        context["content_filter"] = self.request.GET.get("content_filter", '')
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

class ContentCreate(PermissionRequiredMixin, CreateView):
    model = Content
    title = "Add new content"
    template_name = "content/generic_form.html"
    permission_required = "content.content_manager"

    form_class = ContentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listContents')

class ContentUpdate(PermissionRequiredMixin, UpdateView):
    model = Content
    title = "Change Content"
    template_name = "content/generic_form.html"
    permission_required = "content.content_manager"

    form_class = ContentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not "title" in context:
            context["title"] = self.title
        return context

    def get_success_url(self):
        return reverse('listContents')


class ContentDelete(PermissionRequiredMixin, DeleteView):
    model = Content
    title = "Delete Content"
    success_url = reverse_lazy("listContents")
    template_name = "content/generic_confirm_delete.html"
    permission_required = "content.content_manager"

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


class KeywordListView(ListView):
    model = Keyword
    paginate_by = 20
    title = "List of known Keywords"

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


## Order the required contents using the level
def orderContents(requiredContents):
    if requiredContents == None:
        return None

    allOutputSkills = []

    handledSkills = []

    for rq in requiredContents:
        rq.level = -1
        for skill in rq.content.new_skills.all():
            if skill not in allOutputSkills:
                allOutputSkills.append(skill)

    for rq in requiredContents:
        if len(rq.content.required_skills.all()):
            foundOne = False
            for skill in rq.content.required_skills.all():
                if skill in allOutputSkills:
                    foundOne = True
                    break
            if not foundOne:
                rq.level = 1
                for s in rq.content.new_skills.all():
                    if s not in handledSkills:
                        handledSkills.append(s)
        else:
            # Empty list -> not skills required
            rq.level = 1
            for s in rq.content.new_skills.all():
                if s not in handledSkills:
                    handledSkills.append(s)


    ## At this point, we know which contents are the base contents. These are set to level 1

    # Idea: We check all contents for skills which are in general taught in
    # this block but not yet taught. If no requirements are there: Set the
    # current level. So the blocks will only show up in the right order if all
    # required input skills are satisfied.

    # level < 0 -> unhandled content module
    # TODO: Lots of loops. Maybe increase performance?

    checkLevel = 2
    while(len([rq.level for rq in requiredContents if rq.level < 0])):
        newSkillsInLoop = []
        for rq in requiredContents:
            if rq.level < 0:
                # unhandled content
                allSkillsKnown = True
                for s in rq.content.required_skills.all():
                    if s in allOutputSkills and s not in handledSkills:
                        allSkillsKnown = False
                        break
                if allSkillsKnown:
                    rq.level = checkLevel
                    for s in rq.content.new_skills.all():
                        if s not in newSkillsInLoop:
                            newSkillsInLoop.append(s)
        checkLevel += 1
        for s in newSkillsInLoop:
            if s not in handledSkills:
                handledSkills.append(s)

    # We have all the correct levels. Now return sorted list
    return sorted(requiredContents, key=lambda k: k.level)





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


