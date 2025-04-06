from django.urls import path
from .views import TestView

app_name = 'predictor'

urlpatterns = [
    path('hit-api/', TestView.as_view(), name='hit-api'),
]