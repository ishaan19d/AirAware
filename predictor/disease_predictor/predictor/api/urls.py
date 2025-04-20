from django.urls import path
from .views import TestView, DiseaseListView

app_name = 'predictor'

urlpatterns = [
    path('hit-api/', TestView.as_view(), name='hit-api'),
    path('get-disease-list', DiseaseListView.as_view(), name='disease-list')
]