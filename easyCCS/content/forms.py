from django import forms

from .models import Skill, Content, Module

# Form to select required and already known skills
class ExtendedSkillForm(forms.Form):

    ## Create fields in init method. Direct definition will let the
    # migration fail
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        skills = Skill.objects.all()

        self.fields["required_skills"] = forms.MultipleChoiceField(
                choices = [(s.id, s.skill_name) for s in skills],
                label = "Required Skills",
                required = True,
                widget = forms.CheckboxSelectMultiple(),
                )

        self.fields["known_skills"] = forms.MultipleChoiceField(
                choices = [(s.id, s.skill_name) for s in skills],
                label = "Known Skills",
                required = False,
                widget = forms.CheckboxSelectMultiple(),
                )

## ModelForms

# Form config for Content modules
class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = ["content_name", "content_description", "required_skills", "new_skills", "content_workload"]
        select_options = {
                "class" : "selectpicker form-control",
                "data-size" : 10,
                "data-live-search" : "true",
                }

        widgets = {
                "required_skills" : forms.SelectMultiple(attrs = select_options),
                "new_skills" : forms.SelectMultiple(attrs = select_options),
                "content_name" : forms.TextInput(attrs={"class" : "form-control"}),
                "content_description" : forms.Textarea(attrs={"class" : "form-control"}),
                "content_workload" : forms.NumberInput(attrs={"class" : "form-control"}),
                }


# Form config for Skill modules
class SkillForm(forms.ModelForm):
    class Meta:
        model = Skill
        fields = ["skill_name", "skill_descriptive_keywords"]

        widgets = {
                "skill_name" : forms.TextInput(attrs={"class" : "form-control"}),
                "skill_descriptive_keywords" : forms.Textarea(attrs={"class" : "form-control"}),
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

