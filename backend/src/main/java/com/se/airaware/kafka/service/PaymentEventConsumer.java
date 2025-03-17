package com.se.airaware.kafka.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.airaware.jwt.JwtService;
import com.se.airaware.user.service.UserService;

@Service
public class PaymentEventConsumer {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @KafkaListener(topics = "payment-verification", groupId = "backend-group")
    public void consumePaymentVerificationEvent(Map<String, String> payload) {
        String jwtToken = payload.get("jwtToken");
        System.out.println("Received payment verification event with JWT token");
        
        try {
            // Extract email from JWT token using the existing JwtService
            String email = jwtService.extractUserName(jwtToken);
            
            userService.markUserAsPremium(email);
            System.out.println("User marked as premium successfully: " + email);
        } catch (Exception e) {
            System.err.println("Error marking user as premium: " + e.getMessage());
        }
    }
}