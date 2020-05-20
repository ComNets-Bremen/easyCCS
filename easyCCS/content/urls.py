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
        path('detail/skill/<int:pk>', views.SkillDetailView.as_view(), name="detailSkill"),
        path('create/skill', views.SkillCreate.as_view(), name="createSkill"),
        path('update/skill/<int:pk>', views.SkillUpdate.as_view(), name="updateSkill"),
        path('delete/skill/<int:pk>', views.SkillDelete.as_view(), name="deleteSkill"),

        path('list/content', views.ContentListView.as_view(), name="listContents"),
        path('detail/content/<int:pk>', views.ContentDetailView.as_view(), name="detailContent"),
        path('create/content', views.ContentCreate.as_view(), name="createContent"),
        path('update/content/<int:pk>', views.ContentUpdate.as_view(), name="updateContent"),
        path('delete/content/<int:pk>', views.ContentDelete.as_view(), name="deleteContent"),

        ]
