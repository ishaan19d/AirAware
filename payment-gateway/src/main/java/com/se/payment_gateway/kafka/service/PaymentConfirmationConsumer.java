package com.se.payment_gateway.kafka.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.payment_gateway.paymentTransaction.PaymentTransaction;
import com.se.payment_gateway.paymentTransaction.repository.PaymentTransactionRepository;

@Service
public class PaymentConfirmationConsumer {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @KafkaListener(topics = "payment-confirmation", groupId = "payment-gateway-group")
    public void consumePaymentConfirmation(Map<String, String> payload) {
        try {
            System.out.println("Received payment confirmation with payload: " + payload);
            
            String emailId = payload.get("email");
            String razorpayOrderId = payload.get("orderId");
            String razorpayPaymentId = payload.get("paymentId");
            String razorpaySignature = payload.get("signature");
            String amountStr = payload.get("amount");
            
            if (emailId != null && razorpayOrderId != null && razorpayPaymentId != null && razorpaySignature != null) {
                // Check for existing transaction with this payment ID (idempotency)
                Optional<PaymentTransaction> existingTransaction = 
                    paymentTransactionRepository.findByRazorpayPaymentId(razorpayPaymentId);
                
                if (existingTransaction.isPresent()) {
                    System.out.println("Transaction already exists for payment ID: " + razorpayPaymentId);
                    return; // Skip processing - we've already handled this payment
                }
                
                // Create a new payment transaction record
                PaymentTransaction transaction = new PaymentTransaction();
                transaction.setId(UUID.randomUUID().toString());
                transaction.setEmailId(emailId);
                transaction.setRazorpayOrderId(razorpayOrderId);
                transaction.setRazorpayPaymentId(razorpayPaymentId);
                transaction.setRazorpaySignature(razorpaySignature);
                
                // Set amount
                try {
                    int amount = Integer.parseInt(amountStr);
                    transaction.setAmount(amount);
                } catch (NumberFormatException e) {
                    // Default to 499 if amount can't be parsed
                    transaction.setAmount(49900);
                }
                
                // Set payment method if available
                String paymentMethod = payload.get("paymentMethod");
                if (paymentMethod != null) {
                    transaction.setPaymentMethod(paymentMethod);
                }
                
                // Set additional fields
                transaction.setTimestamp(LocalDateTime.now());
                transaction.setStatus("COMPLETED");
                transaction.setCurrency("INR");
                
                // Save to MongoDB
                paymentTransactionRepository.save(transaction);
                
                System.out.println("Payment transaction saved successfully for email: " + emailId);
            } else {
                System.err.println("Missing required fields in payload");
            }
        } catch (Exception e) {
            System.err.println("Error processing payment confirmation: " + e.getMessage());
            e.printStackTrace();
        }
    }
}