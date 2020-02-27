from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.urls import reverse

from .models import Skill, Content

def index(request):
    skills = Skill.objects
    return render(request, 'content/skillOverview.html', {'skills':skills})


def getTree(request, skillId):
    requiredSkill = Skill.objects.get(pk=skillId)

    containingSkill = Content.objects.filter(newSkills = requiredSkill)
    print(containingSkill)
    trees= containingSkill

    return render(request, 'content/printTree.html', {"trees" : trees, "skill": requiredSkill.skillName})


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


# Redirect to the app
def redirectToApp(request):
    return redirect("/content")


