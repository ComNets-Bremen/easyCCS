from django.contrib import admin
from django.db.models import Q
from django import forms
from django.urls import path
from django.shortcuts import render, redirect

from .models import Skill, Content, Module, LinkProperty, Keyword, StoredConfiguration, WikidataEntry, ConfigKeyValueStorage

import io
import csv
from django.http import HttpResponse


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
    search_fields = ["keyword_name", "keyword_related_wikidata",]
    autocomplete_fields = ["keyword_related_wikidata",]

class StoredConfigurationAdmin(admin.ModelAdmin):
    ordering = ["-id"]
    readonly_fields = ["created", "stored_data", "user"]
    list_display = ["storage_name", "created", "user"]

class WikidataEntryAdmin(admin.ModelAdmin):
    ordering = ["wikidata_name"]
    readonly_fields = ["wikidata_name", "wikidata_related_fields_raw", "wikidata_related_fields"]
    list_display = ["wikidata_name", ]
    actions = ["update_all_related", "update_from_wikidata", "export_to_csv"]
    search_fields = ["wikidata_name", "wikidata_related_fields__wikidata_name"]

    change_list_template = "content/admin/entities/wikidata_entry_changelist.html"

    def update_all_related(modeladmin, request, queryset):
        for m in queryset:
            m.updateRelated()
    update_all_related.short_description = "Update all relationships"

    def update_from_wikidata(modeladmin, request, queryset):
        for m in queryset:
            m.updateWikidata()
    update_from_wikidata.short_description = "Update data from wikidata"

    def export_to_csv(modeladmin, request, queryset):
        meta = modeladmin.model._meta
        export_fields = ["wikidata_id", "wikidata_name"]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(export_fields)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in export_fields])

        return response

    export_to_csv.short_description = "Export selected to csv"

    def get_urls(self):
        urls = super().get_urls()
        local_urls = [
                path('import-csv/', self.import_csv),
                path('export-csv/', self.export_csv),
                path('update-all-related/', self.update_all_related_web),
                ]
        return local_urls + urls

    def update_all_related_web(self, request):
        queryset = WikidataEntry.objects.all()
        self.update_all_related(request, queryset)
        self.message_user(request, "Updated all field relations")
        return redirect("..")

    def export_csv(self, request):
        queryset = WikidataEntry.objects.all()
        return self.export_to_csv(request, queryset)


    def import_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]
            csv_data = io.StringIO(csv_file.read().decode("UTF-8"))
            reader = csv.reader(csv_data)
            # assume 1st column is wikidata id
            known_objects = WikidataEntry.objects.all().values_list("wikidata_id", flat=True)
            ids = []
            for line in reader:
                print(line)
                if line[0].startswith("Q"):
                    if line[0] in known_objects:
                        continue
                    ids.append(WikidataEntry(wikidata_id=line[0]))

            if len(ids):
                for i in ids:
                    i.save()

            # update all relations
            for o in WikidataEntry.objects.all():
                o.updateRelated()


            self.message_user(request, str(len(ids)) + " entrys of your csv file were imported")
            return redirect("..")
        form = CsvImportForm()
        payload = {"form" : form}

        return render(
                request, "content/admin/entities/csv_form.html", payload
                )

    # update related files after saving
    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.updateRelated()

# Generic forms

class CsvImportForm(forms.Form):
    csv_file = forms.FileField()



admin.site.register(Skill, SkillAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(Module)
admin.site.register(WikidataEntry, WikidataEntryAdmin)
admin.site.register(LinkProperty, LinkPropertyAdmin)
admin.site.register(Keyword, KeywordAdmin)
admin.site.register(StoredConfiguration, StoredConfigurationAdmin)
admin.site.register(ConfigKeyValueStorage)

