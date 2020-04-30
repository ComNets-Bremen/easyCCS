from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.urls import reverse

import numpy as np

from .models import Skill, Content
from .forms import SkillForm, ExtendedSkillForm

def index(request):
    skills = Skill.objects
    return render(request, 'content/skillOverview.html', {'skills':skills})


def getTree(request, skillId):
    requiredSkill = Skill.objects.get(pk=skillId)

    # Also remove dups
    co = list(dict.fromkeys(getContentsForSkill(skillId)))

    names = Content.objects.filter(id__in=co)

    print("Tree for", requiredSkill)
    for name in names:
        print(name)

    return render(request, 'content/printTree.html', {"contents" : names, "skill": requiredSkill.skillName})


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
    requiredSkills = None
    endContent = None
    if request.method == 'POST':
        form = SkillForm(request.POST)
        if form.is_valid():
            checked_ids = []
            for field in form.getSkillFields():
                if form.cleaned_data[field.name]: # field checked
                    checked_ids.append(int(field.name.split("__")[1]))

            requiredSkills = Skill.objects.filter(pk__in=checked_ids)

            endContent = Content.objects.filter(pk=int(form.cleaned_data["endContent"]))[0]
            print(endContent)
    else:
        form = SkillForm()

    names, nodes, matrix = getAdjacencyMatrix()

    print(nodes)
    print(sum(sum(matrix)))
    print(matrix)

    for name in names:
        print(name, names[name])

    return render(request, "content/skillGraph.html", {
        "form":form,
        "requiredSkills" : requiredSkills,
        "endContent" : endContent,
        })

def getExtendedSkillGraph(request):
    form = None
    targetSkill = None
    knownSkillsObjects = None
    requiredContents = None

    if request.method == "POST":
        form = ExtendedSkillForm(request.POST)
        if form.is_valid():
            targetSkill = Skill.objects.filter(pk=int(form.cleaned_data["requiredSkill"]))[0] # get or 404
            knownSkills = []
            for field in form.getSkillFields():
                if form.cleaned_data[field.name]:
                    knownSkills.append(int(field.name.split("__")[1]))

            knownSkillsObjects = Skill.objects.filter(pk__in=knownSkills)

            co = list(dict.fromkeys(getContentsForSkill(targetSkill.id, knownSkills)))

            # Rm known skills
            co = [c for c in co if c not in knownSkills]

            requiredContents = Content.objects.filter(id__in=co)
    else:
        form = ExtendedSkillForm()

    return render(request, "content/extendedSkillGraph.html",
            {
                "form" : form,
                "targetSkill" : targetSkill,
                "knownSkillsObjects" : knownSkillsObjects,
                "requiredContents" : requiredContents,
            })

# Redirect to the app
def redirectToApp(request):
    return redirect("/content")

def getContentsForSkill(skillId, knownContents = []):
    requiredContents = []

    content = Content.objects.filter(newSkills=skillId)
    for c in content:
        requiredContents.append(c.id)

    contentRequiredSkills = content.values_list("requiredSkills", flat=True).all()

    for o in contentRequiredSkills:
        if o and o not in knownContents:
            requiredContents += getContentsForSkill(o, requiredContents)

    return requiredContents

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
