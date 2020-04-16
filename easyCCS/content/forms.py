from django import forms

from .models import Skill, Content

class SkillForm(forms.Form):

    contents = [(c.id, c.contentName) for c in Content.objects.all()]
    contents.sort()

    endContent = forms.CharField(
            label="End content",
            widget=forms.Select(choices=contents)
            )


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        skills = Skill.objects.all()

        for skill in skills:
            field_name = "skill__" + str(skill.id)
            self.fields[field_name] = forms.BooleanField(
                    required=False,
                    label=skill.skillName
                    )

    def getSkillFields(self):
        for fname in self.fields:
            if fname.startswith('skill__'):
                yield self[fname]

