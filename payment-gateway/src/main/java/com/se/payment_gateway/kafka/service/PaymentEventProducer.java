package com.se.payment_gateway.kafka.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventProducer {
 private static final String PAYMENT_VERIFICATION_TOPIC = "payment-verification";
 
 @Autowired
 private KafkaTemplate<String, Object> kafkaTemplate;
 
 public void sendPaymentVerificationEvent(String jwtToken) {
     // Clean the token (remove "Bearer " prefix if present)
     String cleanToken = jwtToken.startsWith("Bearer ") ? jwtToken.substring(7) : jwtToken;
     
     Map<String, String> payload = Map.of("jwtToken", cleanToken);
     kafkaTemplate.send(PAYMENT_VERIFICATION_TOPIC, payload);
     System.out.println("Payment verification event sent with JWT token");
 }
}