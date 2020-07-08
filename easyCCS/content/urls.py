from django.urls import path

from django.contrib.auth.decorators import login_required, permission_required

from . import views


urlpatterns = [
        path('', views.index, name="index"),
        path('getSkills', views.getSkills, name="getSkills"),
        path('<int:skillId>/getTree/', views.getTree, name="getTree"),
        path('graphJson', views.getGraphJson, name="getGraphJson"),
        path('getGraph', views.getGraph, name="getGraph"),
        path('getSkillGraph', views.getSkillGraph, name="getSkillGraph"),

        path('list/skills', login_required(views.SkillListView.as_view()), name="listSkills"),
        path('detail/skill/<int:pk>', login_required(views.SkillDetailView.as_view()), name="detailSkill"),
        path('create/skill', login_required(views.SkillCreate.as_view()), name="createSkill"),
        path('update/skill/<int:pk>', login_required(views.SkillUpdate.as_view()), name="updateSkill"),
        path('delete/skill/<int:pk>', login_required(views.SkillDelete.as_view()), name="deleteSkill"),

        path('list/content', login_required(views.ContentListView.as_view()), name="listContents"),
        path('detail/content/<int:pk>', login_required(views.ContentDetailView.as_view()), name="detailContent"),
        path('create/content', login_required(views.ContentCreate.as_view()), name="createContent"),
        path('update/content/<int:pk>', login_required(views.ContentUpdate.as_view()), name="updateContent"),
        path('delete/content/<int:pk>', login_required(views.ContentDelete.as_view()), name="deleteContent"),

        path('list/module', login_required(views.ModuleListView.as_view()), name="listModules"),
        path('detail/module/<int:pk>', login_required(views.ModuleDetailView.as_view()), name="detailModule"),
        path('create/module', login_required(views.ModuleCreate.as_view()), name="createModule"),
        path('update/module/<int:pk>', login_required(views.ModuleUpdate.as_view()), name="updateModule"),
        path('delete/module/<int:pk>', login_required(views.ModuleDelete.as_view()), name="deleteModule"),

        ]
