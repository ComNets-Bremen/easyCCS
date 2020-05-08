from django.urls import path

from . import views

urlpatterns = [
        path('', views.index, name="index"),
        path('getSkills', views.getSkills, name="getSkills"),
        path('<int:skillId>/getTree/', views.getTree, name="getTree"),
        path('graphJson', views.getGraphJson, name="getGraphJson"),
        path('getGraph', views.getGraph, name="getGraph"),
        path('getSkillGraph', views.getSkillGraph, name="getSkillGraph"),
        ]
