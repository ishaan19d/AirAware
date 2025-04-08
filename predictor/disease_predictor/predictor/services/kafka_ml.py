import json
import logging
from django.conf import settings
from kafka import KafkaConsumer, KafkaProducer

logger = logging.getLogger(__name__)

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
        
        for message in self.consumer:
            try:
                air_quality_data = message.value
                logger.info(f"Received air quality data for {air_quality_data.get('city')}, {air_quality_data.get('state')}")
                print(f"Received air quality data for {air_quality_data.get('city')}, {air_quality_data.get('state')}")
                
                # Extract location data
                city = air_quality_data.get('city')
                state = air_quality_data.get('state')
                
                # For now, use hardcoded disease predictions as requested
                # In the future, this would call your ML model
                diseases = ["Sinusitis", "Hay Fever"]
                
                # Create prediction result
                prediction = {
                    'city': city,
                    'state': state,
                    'diseases': diseases
                }
                
                # Send prediction to backend
                self.producer.send(self.disease_topic, prediction)
                logger.info(f"Sent disease prediction for {city}, {state}: {diseases}")
                print(f"Sent disease prediction for {city}, {state}: {diseases}")
                
            except Exception as e:
                logger.error(f"Error processing air quality data: {str(e)}")
                print(f"Error processing air quality data: {str(e)}")
