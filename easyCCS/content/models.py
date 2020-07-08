from django.db import models
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_delete
import os
import uuid
import datetime

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
    is_alias_for = models.ForeignKey(
            "self",
            on_delete=models.SET_NULL,
            null=True,
            blank=True
            )

    class Meta:
        ordering = ["-id"]


    def __str__(self):
        returnString = self.skill_name

        if self.isAlias():
            returnString += " (Alias for " + str(self.is_alias_for.skill_name) + ")"

        return returnString


    # Get link to detail view
    def get_absolute_url(self):
        return reverse("detailSkill", args=[str(self.id)])

    def isAlias(self):
        if self.is_alias_for and self.is_alias_for != "":
            return True
        return False

    def getBaseSkill(self):
        if self.isAlias():
            return self.is_alias_for
        else:
            return self


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
