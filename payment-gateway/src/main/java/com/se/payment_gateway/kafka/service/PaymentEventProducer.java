package com.se.payment_gateway.kafka.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
public class PaymentEventProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String PAYMENT_VERIFICATION_TOPIC = "payment-verification";

    public void sendPaymentVerificationEvent(String jwtToken, String orderId, String paymentId, String signature) {
        Map<String, String> payload = new HashMap<>();
        payload.put("jwtToken", jwtToken.replace("Bearer ", ""));
        payload.put("orderId", orderId);
        payload.put("paymentId", paymentId);
        payload.put("signature", signature);
        
        kafkaTemplate.send(PAYMENT_VERIFICATION_TOPIC, payload);
        System.out.println("Payment verification event sent with JWT token and Razorpay details");
    }
}