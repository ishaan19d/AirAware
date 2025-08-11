# AirAware — Air Quality Monitoring and Awareness Platform

**AirAware** is a full-stack, multi-module platform that monitors, analyzes, and streams real-time air quality data. It integrates environmental data with health predictors and user services to provide a complete ecosystem for awareness and response.

---

## 📁 Project Structure

```graphql
AirAware/
├── air-data/           # Module for fetching and processing AQI from external APIs
├── backend/            # Core backend APIs for user management, admin, JWT auth, and Kafka integration
├── frontend/           # ReactJS-based UI for dashboards and landing pages
├── scheduler/          # Scheduled jobs to fetch, process, and publish air quality data
├── payment-gateway/    # Kafka-based microservice for handling and logging online payments
├── predictor/          # Python service for health/disease prediction based on AQI data
├── nginx/              # Deployment configuration, including reverse proxy setup
└── .vscode/            # VS Code workspace settings
```

---

## 🧰 Technologies Used

### 🔹 Backend (Java - Spring Boot)
- Spring Boot 3.4.4
- Spring Data JPA
- Spring Security (JWT-based)
- Apache Kafka (inter-service communication)
- Gradle

### 🔹 Frontend
- ReactJS 18.3.1
- React Router DOM
- Context API
- Axios

### 🔹 Scheduler
- Spring Boot scheduler
- Kafka Producer

### 🔹 Predictor
- Python 3.11
- Django REST Framework

### 🔹 Payment Gateway
- Kafka event-driven logging
- Spring Boot microservice for transactions

### 🔹 Infrastructure
- Kafka + Zookeeper
- PostgreSQL
- NGINX (for deployment proxying)
- VSCode Dev Environment

---

## 🔄 Kafka Topics Used
- `air_quality_data` — Streams AQI data from scheduler to backend
- `payment_logs` — Stores payment transactions
- `user_notifications` — Sends OTPs, alerts, etc.

---

## 📦 Modules Overview

### 🧪 `air-data/`
- Pulls live AQI data from OpenWeatherMap API
- Calculates AQI
- Publishes data to Kafka

### 🔐 `backend/`
- User APIs
- Email/OTP notifications
- Auth with JWT
- Kafka consumers for AQI + OTP topics

### 🌐 `frontend/`
- React-based dashboard & landing
- Connects to backend APIs for users, AQI, and login

### 💳 `payment-gateway/`
- Processes payments
- Logs transaction events via Kafka

### 🧠 `predictor/`
- Python microservice for disease prediction
- REST API endpoints using Django

### ⏰ `scheduler/`
- Spring scheduled job
- Periodically fetches data and pushes to Kafka

---

## 🚀 How to Run

### Prerequisites
- Java 23
- Node 22.15.0
- Python 3.11
- Kafka & Zookeeper running
- PostgreSQL
- Gradle

### Run Instructions

```bash
# Backend
cd backend
./gradlew bootRun

# Scheduler
cd scheduler
./gradlew bootRun

# Payment Gateway
cd payment-gateway
./gradlew bootRun

# Predictor
cd predictor/disease_predictor
python manage.py runserver

# Frontend
cd frontend
npm install
npm start

```
