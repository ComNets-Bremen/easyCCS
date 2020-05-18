from django import forms

from .models import Skill, Content

# Form to select required and already known skills
class ExtendedSkillForm(forms.Form):
    skills = Skill.objects.all()

    required_skills = forms.MultipleChoiceField(
            choices = [(s.id, s.skillName) for s in skills],
            label = "Required Skills",
            required = True,
            widget = forms.CheckboxSelectMultiple(),
            )

    known_skills = forms.MultipleChoiceField(
            choices = [(s.id, s.skillName) for s in skills],
            label = "Known Skills",
            required = False,
            widget = forms.CheckboxSelectMultiple(),
            )

