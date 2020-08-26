from django.db import models
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_delete
from django.utils.translation import gettext_lazy as _

import os
import uuid
import datetime
import json

from django.urls import reverse

from django.conf import settings


def getFilePath(instance, filename):
    filename = "%s_%s" % (uuid.uuid4(), filename)
    return os.path.join("content", filename)

def deleteBinaryFile(instance):
    if instance:
        print(instance.path)
        if instance != "" and os.path.isfile(instance.path):
            os.remove(instance.path)

class Skill(models.Model):
    skill_name = models.CharField(max_length=200)
    skill_descriptive_keywords = models.TextField(blank=True, help_text="Space separated keywords for searching the skill.")

    class Meta:
        ordering = ["-id"]


    def __str__(self):
        return self.skill_name


    # Get link to detail view
    def get_absolute_url(self):
        return reverse("detailSkill", args=[str(self.id)])


class Content(models.Model):
    content_name = models.CharField(max_length=200)
    content_description = models.TextField()
    binary_content = models.FileField(upload_to=getFilePath, null=True, blank=True)
    required_skills = models.ManyToManyField("Skill", blank=True, related_name="skills_required")
    new_skills = models.ManyToManyField("Skill", blank=True, related_name="skills_new")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    content_workload = models.FloatField(default=0.0, help_text=str(settings.WORKLOAD_UNIT))

    class Meta:
        ordering = ["-id"]


    def __str__(self):
        skills = [skill.skill_name for skill in self.new_skills.all()]
        returnString = "\"" + str(self.content_name) + "\""
        if len(skills) >0:
            returnString += " teaches the skills " + str(", ".join(skills))
        if self.binary_content == None or self.binary_content == "":
            returnString += " (No content added)"

        return returnString


    # Get link to detail view
    def get_absolute_url(self):
        return reverse("detailContent", args=[str(self.id)])


class LinkProperty(models.Model):
    content_start = models.ForeignKey("Content", on_delete=models.CASCADE, related_name = "content_start")
    content_target = models.ForeignKey("Content", on_delete=models.CASCADE, related_name = "content_target")
    link_skill = models.ForeignKey("Skill", on_delete=models.CASCADE)
    properties = models.TextField(blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return "Link from " + str(self.content_start) + " to " + str(self.content_target) + " with skill " + str(self.link_skill)

    def get_properties(self):
        return json.loads(self.properties)

    def get_property(self, name):
        p = json.loads(self.properties)
        if name in p:
            return p[name]
        else:
            return None

    def set_property(self, name, value, overwrite=True):
        p = json.loads(self.properties)
        if name in p and not overwrite:
            return False
        p[name] = value
        self.properties = json.dumps(p)
        self.save()


class Module(models.Model):
    module_name = models.CharField(max_length=200)
    module_description = models.TextField()

    module_content_modules = models.ManyToManyField("Content", blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.module_name

    def get_absolute_url(self):
        return reverse("detailModule", args=[str(self.id),])

    def __get_required_skills(self):
        all_required = []
        for c in self.module_content_modules.all():
            for s in c.required_skills.all():
                if s not in all_required:
                    all_required.append(s)
        return all_required

    def __get_new_skills(self):
        all_new = []
        for c in self.module_content_modules.all():
            for s in c.new_skills.all():
                if s not in all_new:
                    all_new.append(s)
        return all_new


    def required_skills(self):
        # Return the skills required by this module
        return [s for s in self.__get_required_skills() if s not in self.__get_new_skills()]

    def new_skills(self):
        # Return the new skills covered by this module
        return [s for s in self.__get_new_skills() if s not in self.__get_required_skills()]

    def get_workload(self):
        # Return the overall workload of this module
        return sum([w.content_workload for w in self.module_content_modules.all()])


# Signals etc. for file handling

@receiver(models.signals.post_delete, sender=Content)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    sync file system to db: rm files if file field is set to blank
    """
    deleteBinaryFile(instance.binary_content)

@receiver(models.signals.pre_save, sender=Content)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    sync file system to db: rm files if the file field is updated
    """
    if not instance.pk:
        return False

    old_file = sender.objects.get(pk=instance.pk).binary_content

    new_file = instance.binary_content
    if not old_file == new_file:
        deleteBinaryFile(old_file)
