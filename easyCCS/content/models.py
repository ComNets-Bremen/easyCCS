from django.db import models
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models.signals import post_delete
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator

import os
import uuid
import datetime
import json
from SPARQLWrapper import SPARQLWrapper, JSON

from django.urls import reverse

from django.conf import settings

RELATED_PROPERTIES = ["P31", "P279", "P737", "P277", "P366", "1535", "1542", "828", "1709", "527", "1963"]

WIKIDATA_BASE_URL = "https://www.wikidata.org/wiki/"

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
    skill_keywords = models.ManyToManyField("Keyword", blank=True, related_name="skill_keyword")

    class Meta:
        ordering = ["-id"]
        permissions = (('skill_manager', 'Manage Skills')),


    def __str__(self):
        return self.skill_name


    # Get link to detail view
    def get_absolute_url(self):
        return reverse("detailSkill", args=[str(self.id)])

class WikidataEntry(models.Model):
    wikidata_id = models.CharField(
            blank=False,
            unique=True,
            max_length=12,
            help_text=_("The wikidata item id"),
            validators=[RegexValidator("^Q[1-9]\d*$", message=_("Invalid format. Should be Q<number>."))]
            )
    wikidata_name = models.CharField(max_length=100, default="")
    wikidata_related_fields = models.ManyToManyField("self", blank=True, symmetrical=True, help_text="Related fields available in this installations.")
    wikidata_related_fields_raw = models.TextField(blank=True, help_text="Related fields according to wikidata")

    def save(self, *args, **kwargs):
        if self.id and self.wikidata_name != self.wikidata_id:
            # we do not update existing items here. This is only done
            # automatically (unless wikidata download was not successful)
            pass
        else:
            self.wikidata_name = self.wikidata_id
            self.updateWikidata(save=False)


        super().save(*args, **kwargs)  # Call the "real" save() method.


    def __str__(self):
        return self.wikidata_name

    def getRelatedRaw(self):
        related_raw = []
        if self.wikidata_related_fields_raw:
            related_raw = [f["q"] for f in json.loads(self.wikidata_related_fields_raw)]
        return related_raw

    def updateRelated(self):
        ids = WikidataEntry.objects.filter(wikidata_id__in=self.getRelatedRaw()).values_list("id", flat=True)
        for i in ids:
            self.wikidata_related_fields.add(i)

    def updateWikidata(self, save=True):
        results = queryWikidata(self.wikidata_id)
        if results:

            # Find label
            for i in results["results"]["bindings"]:
                if i["propLabel"]["value"] == "identity":
                    self.wikidata_name = i["valLabel"]["value"]
                    break

            # Get the properties from the query and store them
            props = []
            for i in results["results"]["bindings"]:
                if i["propUrl"]["value"].split("/")[-1] in RELATED_PROPERTIES:
                    props.append({
                        "p" : i["propUrl"]["value"].split("/")[-1],
                        "q" : i["valUrl"]["value"].split("/")[-1],
                        "pLabel" : i["propLabel"]["value"],
                        "qLabel" : i["valLabel"]["value"],
                        "pUrl" : i["propUrl"],
                        "qUrl" : i["valUrl"],
                        })

            self.wikidata_related_fields_raw = json.dumps(props)
            if save:
                self.save()
    def getWikidataUrl(self):
        return WIKIDATA_BASE_URL + str(self.wikidata_id)



class Content(models.Model):
    content_name = models.CharField(max_length=200)
    content_description = models.TextField()
    binary_content = models.FileField(upload_to=getFilePath, null=True, blank=True)
    required_skills = models.ManyToManyField("Skill", blank=True, related_name="skills_required")
    new_skills = models.ManyToManyField("Skill", blank=True, related_name="skills_new")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, help_text="User who added this content")
    is_public = models.BooleanField(default=True, help_text="Is this content visible to all users.")

    content_workload = models.FloatField(default=0.0, help_text=str(settings.WORKLOAD_UNIT))

    content_keywords = models.ManyToManyField("Keyword", blank=True, related_name="content_keyword")

    class Meta:
        ordering = ["-id"]
        permissions = (('content_manager', 'Manage Content Items')),



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

# Keyword class for grouping data
class Keyword(models.Model):
    keyword_name = models.CharField(max_length=100)
    keyword_related_wikidata = models.ManyToManyField(WikidataEntry, blank=True, help_text="Related wikidata fields in this installation.")

    class Meta:
        ordering = ["keyword_name"]

    def __str__(self):
        return self.keyword_name


# Store dependency configuration
class StoredConfiguration(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    stored_data = models.TextField()
    storage_name = models.CharField(max_length=100)
    user = models.ForeignKey(
            get_user_model(),
            on_delete = models.CASCADE,
            default=None,
            null=True,
            )

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.storage_name



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


def queryWikidata(q):
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = """
        PREFIX entity: <http://www.wikidata.org/entity/>
        #partial results

        SELECT ?propUrl ?propLabel ?valUrl ?valLabel
        WHERE
        {
            hint:Query hint:optimizer 'None' .
                {       BIND(entity:%s AS ?valUrl) .
                        BIND("N/A" AS ?propUrl ) .
                        BIND("identity"@en AS ?propLabel ) .
                }
            UNION
                {       entity:%s ?propUrl ?valUrl .
                        ?property ?ref ?propUrl .
                        ?property rdf:type wikibase:Property .
                        ?property rdfs:label ?propLabel
                }

            ?valUrl rdfs:label ?valLabel
            FILTER (LANG(?valLabel) = 'en') .
            FILTER (lang(?propLabel) = 'en' )
        }
        ORDER BY ?propUrl ?valUrl
    """ % (q, q)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    ret = None
    try:
        ret = sparql.query().convert()
    except Exception as e:
        ret = None
        print(e)
        # More messages, debugging etc.
    return ret

###
# Config management (overwrite settings.py)
###

# Validator for config code
def is_valid_python(value):
    try:
        eval(value)
    except:
        raise ValidationError(
                _("Invalid python code"),
                )

## Manager class for key value storage access
#
# Tries to access the value from the key value storage. Not defined -> tries to
# access using settings. Not defines -> return None
class ConfigKeyValueStorageManager(models.Manager):
    def get_value(self, key, default=None):
        o = default
        try:
            o = eval(self.model.objects.get(config_key=key).config_value, {}, {})
        except self.model.DoesNotExist:
            # Get key from settings.py
            if hasattr(settings, key):
                o = getattr(settings, key)
        return o

## Simple key value storage management for config (besides settings.py)
class ConfigKeyValueStorage(models.Model):
    config_key = models.CharField(
            max_length = 100,
            unique=True
            )

    config_value = models.CharField(
            max_length = 100,
            validators = [is_valid_python],
            help_text = _("A python expression like \"abc\", [1, 2, 3], True etc."),
            )

    objects = models.Manager()
    config = ConfigKeyValueStorageManager()

    def __str__(self):
        return str(self.config_key) + "=" + str(self.config_value)


