from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.urls import reverse

import numpy as np

from .models import Skill, Content
from .forms import SkillForm, ExtendedSkillForm

def index(request):
    return render(request, "content/index.html", {"title" : "Overview"})


def getSkills(request):
    skills = Skill.objects
    return render(request, 'content/skillOverview.html', {'skills':skills})


def getTree(request, skillId):
    requiredSkill = Skill.objects.get(pk=skillId)

    # Get list of content objects
    co = getContentsForSkill(skillId)

    return render(request, 'content/printTree.html', {"contents" : co, "skill": requiredSkill.skillName})


def getGraphJson(request):
    returnObject = dict()
    returnObject["nodes"] = list()
    returnObject["links"] = list()

    for c in Content.objects.all():
        returnObject["nodes"].append({
            "id" : c.id,
            "name" : str(c.contentName),
            "label": ""
            })

        # Get all skills pointing to this Content
        for requiredSkill in c.requiredSkills.all():
            containingSkillContentObjects = Content.objects.filter(newSkills = requiredSkill)
            for cs in containingSkillContentObjects:
                returnObject["links"].append({
                    "source" : cs.id,
                    "target" : c.id,
                    "type" : requiredSkill.skillName
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

def getGraph(request):
    return render(request, 'content/d3graph.html', {"jsonUrl":reverse("getGraphJson")})


def getSkillGraph(request):
    form = None
    targetSkill = None
    requiredContents = None

    #TODO: rm known contents

    if request.method == "POST":
        form = ExtendedSkillForm(request.POST)
        if form.is_valid():
            targetSkill = Skill.objects.filter(pk=int(form.cleaned_data["requiredSkill"]))[0] # get or 404
            knownSkills = []
            for field in form.getSkillFields():
                if form.cleaned_data[field.name]:
                    knownSkills.append(int(field.name.split("__")[1]))


            requiredContents = getContentsForSkill(targetSkill.id, ignoreSkills=knownSkills)
    else:
        form = ExtendedSkillForm()

    return render(request, "content/skillGraph.html",
            {
                "form" : form,
                "targetSkill" : targetSkill,
                "requiredContents" : requiredContents,
            })

# Redirect to the app
def redirectToApp(request):
    return redirect("/content")


## Helpers

## Get Content objects for required skill
def getContentsForSkill(skillId, knownContents = [], level=1, ignoreSkills=[]):
    newContents = []

    if skillId in ignoreSkills:
        return None

    content = Content.objects.filter(newSkills=skillId)

    for c in content:
        if c.id not in knownContents and c.id not in newContents:
            newContents.append(ContentObjectWithPrio(c.id, level, c))

    contentRequiredSkills = content.values_list("requiredSkills", flat=True).all()

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
        requiredSkills = Content.objects.filter(pk=node).values("requiredSkills")
        for skill in requiredSkills:
            teachesSkills = sorted(
                    Content.objects.filter(
                        newSkills=skill["requiredSkills"]
                        ).values_list("id", flat=True)
                    )
            for teachesSkill in teachesSkills:
                adjMatrix[nodes.index(node)][nodes.index(teachesSkill)] = 1

    # Get the names
    names = dict()
    for node in nodes:
        names[node] = Content.objects.filter(pk=node).get().contentName

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


