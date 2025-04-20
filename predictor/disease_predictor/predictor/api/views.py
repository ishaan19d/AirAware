from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class TestView(APIView):
    def get(self, request):
        return Response({"message": "Hello"}, status=status.HTTP_200_OK)
    
class DiseaseListView(APIView):
    def get(self, request):
        diseases = [
            'Asthma', 'COPD', 'Bronchitis', 'Emphysema', 'Pneumonia',
            'Lung cancer', 'Allergic rhinitis', 'Sinusitis', 'Respiratory tract infection',
            'Cough and throat irritation', 'Pulmonary fibrosis', 'Tuberculosis',
            'Obstructive sleep apnea'
        ]
        return Response(diseases, status=status.HTTP_200_OK)