#!/bin/bash
# start-services.sh
python manage.py runserver 0.0.0.0:8085 &
python manage.py run_ml_service