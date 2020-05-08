# Content processors

from django.conf import settings

def get_general(request):
    return {
            "general" : {
                "base_title" : settings.MAIN_TITLE,
                }
            }
