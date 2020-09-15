from django.contrib import admin
from django.db.models import Q

from .models import Skill, Content, Module, LinkProperty, Keyword


class ContentAdmin(admin.ModelAdmin):
    readonly_fields = ["created", "updated"]
    save_as = True
    autocomplete_fields = ["required_skills", "new_skills", "content_keywords"]
    search_fields = ["content_keywords__keyword_name", "content_name"]


class LinkPropertyAdmin(admin.ModelAdmin):
    readonly_fields = ["properties",]


class SkillAdmin(admin.ModelAdmin):
    ordering = ["-id"]
    autocomplete_fields = ["skill_keywords"]
    search_fields = ["skill_name", "skill_descriptive_keywords", "skill_keywords__keyword_name"]

class KeywordAdmin(admin.ModelAdmin):
    ordering = ["keyword_name"]
    search_fields = ["keyword_name"]

admin.site.register(Skill, SkillAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(Module)
admin.site.register(LinkProperty, LinkPropertyAdmin)
admin.site.register(Keyword, KeywordAdmin)

