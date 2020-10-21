from django.contrib import admin
from django.db.models import Q

from .models import Skill, Content, Module, LinkProperty, Keyword, StoredConfiguration, WikidataEntry



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

class StoredConfigurationAdmin(admin.ModelAdmin):
    ordering = ["-id"]
    readonly_fields = ["created", "stored_data", "user"]
    list_display = ["storage_name", "created", "user"]

class WikidataEntryAdmin(admin.ModelAdmin):
    ordering = ["wikidata_name"]
    readonly_fields = ["wikidata_name", "wikidata_related_fields_raw", "wikidata_related_fields"]
    list_display = ["wikidata_name", ]
    actions = ["update_all_related", "update_from_wikidata"]

    def update_all_related(modeladmin, request, queryset):
        for m in queryset:
            m.updateRelated()
    update_all_related.short_description = "Update all relationships"

    def update_from_wikidata(modeladmin, request, queryset):
        for m in queryset:
            m.updateWikidata()
    update_from_wikidata.short_description = "Update data from wikidata"

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.updateRelated()

admin.site.register(Skill, SkillAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(Module)
admin.site.register(WikidataEntry, WikidataEntryAdmin)
admin.site.register(LinkProperty, LinkPropertyAdmin)
admin.site.register(Keyword, KeywordAdmin)
admin.site.register(StoredConfiguration, StoredConfigurationAdmin)

