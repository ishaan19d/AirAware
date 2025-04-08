FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
RUN chmod +x /app/start-services.sh
WORKDIR /app/disease_predictor
EXPOSE 8085
CMD ["../start-services.sh"]
