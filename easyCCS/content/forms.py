from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .models import Skill, Content, Module, Keyword, StoredConfiguration

from django.forms.utils import ErrorList

SELECT_CSS_ATTRS = {
        "class" : "selectpicker form-control",
        "data-size" : 10,
        "data-live-search" : "true",
        }


# Form to select required and already known skills
class ExtendedSkillForm(forms.Form):

    ## Create fields in init method. Direct definition will let the
    # migration fail
    def __init__(self, *args, **kwargs):
        # Is an error_class given? No -> use our one with bootstrap
        if not "error_class" in kwargs:
            kwargs["error_class"] = DivErrorList

        self.request = kwargs.pop("request", None)

        super().__init__(*args, **kwargs)

        skills = Skill.objects.all()

        self.fields["required_skills"] = forms.MultipleChoiceField(
                choices = [(s.id, s.skill_name) for s in skills],
                label = "Required Skills",
                required = True,
                widget = SelectMultipleTokens(
                    attrs = SELECT_CSS_ATTRS,
                    keyword_model=Skill,
                    keyword_field="skill_descriptive_keywords",
                    ),
                )

        self.fields["known_skills"] = forms.MultipleChoiceField(
                choices = [(s.id, s.skill_name) for s in skills],
                label = "Known Skills",
                required = False,
                widget = SelectMultipleTokens(
                    attrs = SELECT_CSS_ATTRS,
                    keyword_model=Skill,
                    keyword_field="skill_descriptive_keywords",
                    ),
                )

        self.fields["title"] = forms.CharField(max_length=100, required=False)

    def clean(self):
        # Ensure in and out skills are not the same
        same_skills = list(set(self.cleaned_data["required_skills"]) & set(self.cleaned_data["known_skills"]))
        same_skills = [int(s) for s in same_skills]

        same_skill_objects = Skill.objects.filter(id__in=same_skills)

        if same_skills:
            raise ValidationError(_("The following skills can not be required and known skill at the same time: ") + str(", ".join([s.skill_name for s in same_skill_objects])))

        # Ensure a name is given
        if "store_data" in self.data and len(self.cleaned_data["title"]) == 0:
            raise ValidationError(_("Title is too short"))

        # Ensure unique names (for one user)
        if "store_data" in self.data and StoredConfiguration.objects.filter(user=self.request.user, storage_name=self.cleaned_data["title"]).count():
            raise ValidationError(_("Name already used. Cannot store this configuration with the given name."))

        return self.cleaned_data

# Form for loading stored data from db
class LoadExtendedSkillForm(forms.Form):
    def __init__(self, *args, **kwargs):
        # Is an error_class given? No -> use our one with bootstrap
        if not "error_class" in kwargs:
            kwargs["error_class"] = DivErrorList

        self.request = kwargs.pop("request", None)

        super().__init__(*args, **kwargs)

        configNames = None
        if self.request.user.is_superuser:
            configNames = StoredConfiguration.objects.all()
        else:
            configNames = StoredConfiguration.objects.filter(user=self.request.user)

        choices=[(c.id, c.storage_name) for c in configNames],

        if self.request.user.is_superuser:
            choices=[(c.id, c.storage_name + " (" + str(c.user) + ")") for c in configNames]



        self.fields["config_id"] = forms.ChoiceField(
                choices=choices,
                label="Select configuration to load",
                widget = forms.Select(
                    attrs = SELECT_CSS_ATTRS,
                )
                )

    def clean(self):
        config_id = self.cleaned_data["config_id"]
        if not self.request.user.is_superuser and StoredConfiguration.objects.filter(user=self.request.user, id=config_id).count() == 0:
            raise ValidationError(_("User has no access to this dataset"))
        return self.cleaned_data

## Error list formats

# Format the unbound field errors using the bootstrap danger class
class DivErrorList(ErrorList):
    def __str__(self):
        return self.as_divs()
    def as_divs(self):
        if not self: return ''
        return ''.join(['<div class="alert alert-danger">%s</div>' % e for e in self])

## Widgets

# Widget which allow searching by keywords
class SelectMultipleTokens(forms.SelectMultiple):
    def __init__(self, *args, **kwargs):
        self.keyword_model = kwargs.pop("keyword_model")
        self.keyword_field = kwargs.pop("keyword_field")
        super().__init__(*args, **kwargs)


    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        ids = []

        # Collect the id of the skills from the widget
        for og in context["widget"]["optgroups"]:
            if len(og[1]) > 0:
                ids.append(og[1][0]["value"])

        # One query: Get all descriptions / keywords from the db
        skill_desc = self.keyword_model.objects.filter(id__in=ids).values_list("id", self.keyword_field)
        # Reordering: Create a dict with the id as the key and the description
        # as the value
        desc_dict = {s[0] : s[1] for s in skill_desc}

        # Set the data-tokens attribute for the corresponding options
        for og in context["widget"]["optgroups"]:
            if len(og[1]) > 0:
                value = og[1][0]["value"]
                if value in desc_dict and len(desc_dict[value]) > 0:
                    og[1][0]["attrs"]["data-tokens"] = desc_dict[value]

        # new context done
        return context

## ModelForms

# Form config for Content modules
class ContentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        # Is an error_class given? No -> use our one with bootstrap
        if not "error_class" in kwargs:
            kwargs["error_class"] = DivErrorList
        super().__init__(*args, **kwargs)

    class Meta:
        model = Content
        fields = ["content_name", "content_description", "required_skills", "new_skills", "content_keywords", "content_workload", "binary_content"]

        widgets = {
                "required_skills" : SelectMultipleTokens(attrs=SELECT_CSS_ATTRS, keyword_model=Skill, keyword_field="skill_descriptive_keywords"),
                "new_skills" : SelectMultipleTokens(attrs=SELECT_CSS_ATTRS, keyword_model=Skill, keyword_field="skill_descriptive_keywords"),
                "new_skills" : SelectMultipleTokens(attrs=SELECT_CSS_ATTRS, keyword_model=Skill, keyword_field="skill_descriptive_keywords"),
                "content_keywords" : SelectMultipleTokens(attrs=SELECT_CSS_ATTRS, keyword_model=Keyword, keyword_field="keyword_name"),
                "content_name" : forms.TextInput(attrs={"class" : "form-control"}),
                "content_description" : forms.Textarea(attrs={"class" : "form-control"}),
                "content_workload" : forms.NumberInput(attrs={"class" : "form-control"}),
                "binary_content" : forms.ClearableFileInput(attrs={
                    "class" : "form-control",

                    }),
                }


    def clean(self):
        # Ensure in and out skills are not the same
        same_skills = list(set(self.cleaned_data["required_skills"]) & set(self.cleaned_data["new_skills"]))

        if same_skills:
            raise ValidationError(_("The following skills can not be input and output skill at the same time: ") + str(", ".join([s.skill_name for s in same_skills])))

        return self.cleaned_data


# Form config for Skill modules
class SkillForm(forms.ModelForm):
    class Meta:
        model = Skill
        fields = ["skill_name", "skill_descriptive_keywords", "skill_keywords"]

        widgets = {
                "skill_name" : forms.TextInput(attrs={"class" : "form-control"}),
                "skill_descriptive_keywords" : forms.Textarea(attrs={"class" : "form-control"}),
                "skill_keywords" : SelectMultipleTokens(attrs=SELECT_CSS_ATTRS, keyword_model=Keyword, keyword_field="keyword_name"),
                }


# Form config for Module modules
class ModuleForm(forms.ModelForm):
    class Meta:
        model = Module
        fields = ["module_name", "module_description", "module_content_modules"]

        widgets = {
                "module_content_modules" : forms.SelectMultiple(attrs = {
                    "class" : "selectpicker form-control",
                    "data-size" : 10,
                    "data-live-search" : "true",
                    }),
                "module_description" : forms.Textarea(attrs={"class" : "form-control"}),
                "module_name" : forms.TextInput(attrs={"class" : "form-control"}),

                }


