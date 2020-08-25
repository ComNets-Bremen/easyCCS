from django.contrib import admin
from django.db.models import Q

from .models import Skill, Content, Module, LinkProperty


class ContentAdmin(admin.ModelAdmin):
    readonly_fields = ["created", "updated"]
    save_as = True
    autocomplete_fields = ["required_skills", "new_skills"]


class LinkPropertyAdmin(admin.ModelAdmin):
    readonly_fields = ["properties",]


class SkillAdmin(admin.ModelAdmin):
    ordering = ["-id"]
    search_fields = ["skill_name", "skill_descriptive_keywords"]

admin.site.register(Skill, SkillAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(Module)
admin.site.register(LinkProperty, LinkPropertyAdmin)
