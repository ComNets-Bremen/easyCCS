from django.contrib import admin
from django.db.models import Q

from .models import Skill, Content

class SkillAdmin(admin.ModelAdmin):
    def change_view(self, request, object_id, form_url='', extra_context=None):
        self.object_id = object_id
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "is_alias_for":
            if hasattr(self, "object_id"):
                kwargs["queryset"] =  Skill.objects.filter(is_alias_for=None).exclude(pk=self.object_id)
            else:
                kwargs["queryset"] =  Skill.objects.filter(is_alias_for=None)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ContentAdmin(admin.ModelAdmin):
    readonly_fields = ["created", "updated"]
    save_as = True

admin.site.register(Skill, SkillAdmin)
admin.site.register(Content, ContentAdmin)
