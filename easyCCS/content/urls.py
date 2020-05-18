from django.urls import path

from . import views


urlpatterns = [
        path('', views.index, name="index"),
        path('getSkills', views.getSkills, name="getSkills"),
        path('<int:skillId>/getTree/', views.getTree, name="getTree"),
        path('graphJson', views.getGraphJson, name="getGraphJson"),
        path('getGraph', views.getGraph, name="getGraph"),
        path('getSkillGraph', views.getSkillGraph, name="getSkillGraph"),
        path('list/skills', views.SkillListView.as_view(), name="listSkills"),
        path('detail/skills/<int:pk>', views.SkillDetailView.as_view(), name="detailSkill"),
        path('create/skill', views.SkillCreate.as_view(), name="createSkill"),
        path('create/content', views.ContentCreate.as_view(), name="createContent"),
        path('update/skill/<int:pk>', views.SkillUpdate.as_view(), name="updateSkill"),
        path('delete/skill/<int:pk>', views.SkillDelete.as_view(), name="deleteSkill"),

        ]
