from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    help = 'Run the Kafka consumer for ML processing'

    def handle(self, *args, **options):
        from predictor.services.kafka_predict import MLConsumerProducer
        
        self.stdout.write('Starting ML service...')
        ml_service = MLConsumerProducer()
        ml_service.start_processing()