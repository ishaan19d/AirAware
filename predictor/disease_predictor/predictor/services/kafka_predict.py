import json
import logging
import pandas as pd
import pickle
import os
import sys
from django.conf import settings
from kafka import KafkaConsumer, KafkaProducer
import torch
import numpy as np
from torch import nn

logger = logging.getLogger(__name__)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class SVMModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(SVMModel, self).__init__()
        self.linear = nn.Linear(input_dim, output_dim)
        
    def forward(self, x):
        return self.linear(x)

class DiseasePredictor:
    def __init__(self, model_path='air_pollution_disease_model_cuda_svm.pkl'):
        # Register the SVMModel class in the main module before loading
        sys.modules['__main__'].__dict__['SVMModel'] = SVMModel
        
        # Now load the model
        model_data = torch.load(model_path, map_location='cpu', weights_only=False)

        self.models = model_data['models']
        self.scaler = model_data['scaler']
        self.diseases_list = model_data['diseases']
        self.pollutants_list = model_data['pollutants']
        self.pollutant_categories = model_data['pollutant_categories']
        
        self.disease_pollutant_mapping = {
            'Asthma': ['PM2.5', 'O3', 'NO2'],
            'COPD': ['PM2.5', 'CO', 'O3', 'NO2'],
            'Bronchitis': ['PM2.5', 'PM10', 'NO2', 'SO2'],
            'Emphysema': ['PM2.5', 'PM10', 'O3', 'NO2'],
            'Pneumonia': ['PM2.5', 'NO2', 'SO2'],
            'Lung cancer': ['PM2.5', 'PM10'],
            'Allergic rhinitis': ['PM2.5', 'PM10', 'NO2', 'NH3'],
            'Sinusitis': ['PM2.5', 'PM10', 'NO2', 'NH3'],
            'Respiratory tract infection': ['PM2.5', 'PM10', 'NO2', 'SO2'],
            'Cough and throat irritation': ['O3', 'PM2.5', 'SO2'],
            'Pulmonary fibrosis': ['PM2.5', 'PM10', 'O3'],
            'Tuberculosis': ['PM2.5', 'NO2'],
            'Obstructive sleep apnea': ['PM2.5', 'NO2']
        }

    def get_pollutant_category(self, pollutant, value):
        categories = self.pollutant_categories[pollutant]
        for category, (min_val, max_val) in categories.items():
            if min_val <= value <= max_val:
                return category
        return 'Severe'

    def predict(self, pollutant_dict):
        for pollutant in self.pollutants_list:
            if pollutant not in pollutant_dict:
                print(f"Warning: Missing pollutant {pollutant}. Setting to 0.")
                pollutant_dict[pollutant] = 0

        pollutant_categories_list = []
        for pollutant in self.pollutants_list:
            value = pollutant_dict[pollutant]
            category = self.get_pollutant_category(pollutant, value)
            pollutant_categories_list.append(category)

        X = np.array([pollutant_dict[p] for p in self.pollutants_list]).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        X_tensor = torch.FloatTensor(X_scaled).to(device)

        y_pred_proba = np.zeros((1, len(self.diseases_list)))

        for i, model in enumerate(self.models):
            model.eval()
            with torch.no_grad():
                outputs = model(X_tensor)
                outputs = outputs.cpu().numpy()
                proba = 1 / (1 + np.exp(-1.2 * outputs))
                y_pred_proba[0, i] = proba.flatten()[0]

        poor_severe_count = pollutant_categories_list.count('Poor') + pollutant_categories_list.count('Severe')
        sensitivity_boost = min(0.15, poor_severe_count * 0.03)
        y_pred_proba = np.minimum(y_pred_proba + sensitivity_boost, 1.0)

        for i, disease in enumerate(self.diseases_list):
            related_pollutants = self.disease_pollutant_mapping[disease]
            threshold_factor = 0
            relevant_pollutant_count = 0
            for pollutant in related_pollutants:
                value = pollutant_dict[pollutant]
                category = self.get_pollutant_category(pollutant, value)
                if category in ['Good', 'Fair']:
                    relevant_pollutant_count += 1
                    min_val, max_val = self.pollutant_categories[pollutant][category]
                    range_width = max_val - min_val
                    position = (value - min_val) / range_width if range_width > 0 else 0.5
                    threshold_factor += position * 0.1
            if relevant_pollutant_count > 0:
                avg_threshold_factor = threshold_factor / relevant_pollutant_count
                y_pred_proba[0, i] = min(y_pred_proba[0, i] + avg_threshold_factor, 1.0)

        results = []
        proba_disease_pairs = [(prob, disease) for prob, disease in zip(y_pred_proba[0], self.diseases_list)]
        proba_disease_pairs.sort(reverse=True)

        print("\nTop 5 potential diseases:")
        for prob, disease in proba_disease_pairs[:5]:
            status = "HIGH RISK" if prob > 0.75 else "MODERATE RISK" if prob > 0.4 else "LOW RISK"
            print(f"{disease}: {prob*100:.2f}% ({status})")
            if prob > 0.65:
                results.append(disease)

        return results

class MLConsumerProducer:
    """
    Class to handle consuming air quality data and producing disease predictions
    """
    def __init__(self):
        self.consumer = KafkaConsumer(
            settings.KAFKA_AIR_QUALITY_TOPIC,
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        
        self.producer = KafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

        self.disease_topic = settings.KAFKA_DISEASE_PREDICTION_TOPIC

    def start_processing(self):
        """Start consuming air quality data and producing disease predictions"""
        logger.info("Starting ML consumer-producer service")
        print("Starting ML consumer-producer service")

        model_path_docker = os.path.join(os.path.dirname(__file__), 'air_pollution_disease_model_cuda_svm.pkl')
        predictor = DiseasePredictor(model_path=model_path_docker)
        
        for message in self.consumer:
            try:
                air_quality_data = message.value
                logger.info(f"Received air quality data for {air_quality_data.get('city')}, {air_quality_data.get('state')}")
                print(f"Received air quality data for {air_quality_data.get('city')}, {air_quality_data.get('state')}")
                
                # Extract location data
                city = air_quality_data.get('city')
                state = air_quality_data.get('state')

                # Prepare data for prediction
                prediction_input = {
                    'PM2.5': float(air_quality_data.get('pm2_5')),
                    'PM10': float(air_quality_data.get('pm10')),
                    'NO2': float(air_quality_data.get('no2')),
                    'SO2': float(air_quality_data.get('so2')),
                    'CO': float(air_quality_data.get('co')),
                    'O3': float(air_quality_data.get('o3')),
                    'NH3': float(air_quality_data.get('nh3'))
                }
                
                # Log the input data for debugging
                for key, value in prediction_input.items():
                    print(f"{key}: {value}")

                # Make prediction
                prediction_result = predictor.predict(prediction_input)
            
                
                # Create prediction message
                prediction_message = {
                    'city': city,
                    'state': state,
                    'diseases': prediction_result,
                    'timestamp': air_quality_data.get('timestamp')  # Forward the timestamp if available
                }
                
                # Send prediction to backend
                self.producer.send(self.disease_topic, prediction_message)
                logger.info(f"Sent disease prediction for {city}, {state}: {prediction_result}")
                print(f"Sent disease prediction for {city}, {state}: {prediction_result}")
                
            except Exception as e:
                logger.error(f"Error processing air quality data: {str(e)}")
                print(f"Error processing air quality data: {str(e)}")

# Run the service if this file is executed directly
if __name__ == "__main__":
    ml_service = MLConsumerProducer()
    ml_service.start_processing()