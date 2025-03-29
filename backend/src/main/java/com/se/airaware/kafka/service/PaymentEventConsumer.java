package com.se.airaware.kafka.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.se.airaware.jwt.JwtService;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;
import com.se.airaware.user.service.UserService;

@Service
public class PaymentEventConsumer {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String PAYMENT_CONFIRMATION_TOPIC = "payment-confirmation";

    @KafkaListener(topics = "payment-verification", groupId = "backend-group")
    public void consumePaymentVerificationEvent(Map<String, String> payload) {
        String jwtToken = payload.get("jwtToken");
        String orderId = payload.get("orderId");
        String paymentId = payload.get("paymentId");
        String signature = payload.get("signature");
        
        System.out.println("Received payment verification event with JWT token and Razorpay details");

        try {
            // Extract email from JWT
            String email = jwtService.extractUserName(jwtToken);
            
            // Find user by email
            User user = userRepository.findByEmail(email);
            
            if (user != null) {
                // Mark user as premium
                userService.markUserAsPremium(email);
                
                // Prepare payload to send back to payment gateway
                Map<String, String> confirmationPayload = new HashMap<>();
                confirmationPayload.put("email", email);
                confirmationPayload.put("amount", "49900"); // Amount in paise (499 INR)
                
                // Include Razorpay details in the confirmation
                if (orderId != null) confirmationPayload.put("orderId", orderId);
                if (paymentId != null) confirmationPayload.put("paymentId", paymentId);
                if (signature != null) confirmationPayload.put("signature", signature);
                
                // Send confirmation back to payment gateway via Kafka
                kafkaTemplate.send(PAYMENT_CONFIRMATION_TOPIC, confirmationPayload);
                
                System.out.println("User marked as premium and confirmation sent for email: " + email);
            } else {
                System.err.println("User not found for email: " + email);
            }
        } catch (Exception e) {
            System.err.println("Error marking user as premium: " + e.getMessage());
            e.printStackTrace();
        }
    }
}