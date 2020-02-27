from django.urls import path

from . import views

urlpatterns = [
        path('', views.index, name="index"),
        path('<int:skillId>/getTree/', views.getTree, name="getTree"),
        path('graphJson', views.getGraphJson, name="getGraphJson"),
        path('getGraph', views.getGraph, name="getGraph"),
    ]
