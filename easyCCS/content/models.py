from django.db import models
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_delete
import os
import uuid
import datetime

from django.urls import reverse


def getFilePath(instance, filename):
    filename = "%s_%s" % (uuid.uuid4(), filename)
    return os.path.join("content", filename)

def deleteBinaryFile(instance):
    if instance:
        print(instance.path)
        if instance != "" and os.path.isfile(instance.path):
            os.remove(instance.path)

class Skill(models.Model):
    skillName = models.CharField(max_length=200)
    isAliasFor = models.ForeignKey(
            "self",
            on_delete=models.SET_NULL,
            null=True,
            blank=True
            )

    class Meta:
        ordering = ["-id"]


    def __str__(self):
        returnString = self.skillName

        if self.isAlias():
            returnString += " (Alias for " + str(self.isAliasFor.skillName) + ")"

        return returnString


    # Get link to detail view
    def get_absolute_url(self):
        return reverse("detailSkill", args=[str(self.id)])

    def isAlias(self):
        if self.isAliasFor and self.isAliasFor != "":
            return True
        return False

    def getBaseSkill(self):
        if self.isAlias():
            return self.isAliasFor
        else:
            return self


class Content(models.Model):
    contentName = models.CharField(max_length=200)
    contentDescription = models.TextField()
    binaryContent = models.FileField(upload_to=getFilePath, null=True, blank=True)
    requiredSkills = models.ManyToManyField("Skill", blank=True, related_name="skills_required")
    newSkills = models.ManyToManyField("Skill", blank=True, related_name="skills_new")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]


    def __str__(self):
        skills = [skill.skillName for skill in self.newSkills.all()]
        returnString = "\"" + str(self.contentName) + "\""
        if len(skills) >0:
            returnString += " teaches the skills " + str(", ".join(skills))
        if self.binaryContent == None or self.binaryContent == "":
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
    deleteBinaryFile(instance.binaryContent)

@receiver(models.signals.pre_save, sender=Content)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    sync file system to db: rm files if the file field is updated
    """
    if not instance.pk:
        return False

    old_file = sender.objects.get(pk=instance.pk).binaryContent

    new_file = instance.binaryContent
    if not old_file == new_file:
        deleteBinaryFile(old_file)
