from django import forms

from .models import Skill, Content

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

