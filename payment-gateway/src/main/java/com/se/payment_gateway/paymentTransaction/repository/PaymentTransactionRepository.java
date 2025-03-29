package com.se.payment_gateway.paymentTransaction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.se.payment_gateway.paymentTransaction.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {
    
    // Find transaction by Razorpay payment ID
    Optional<PaymentTransaction> findByRazorpayPaymentId(String razorpayPaymentId);
    
    // Find transaction by Razorpay order ID
    Optional<PaymentTransaction> findByRazorpayOrderId(String razorpayOrderId);
    
    // Find all transactions for an email
    List<PaymentTransaction> findByEmailId(String emailId);
    
    // Find transactions by status
    List<PaymentTransaction> findByStatus(String status);
    
    // Find transactions by payment method
    List<PaymentTransaction> findByPaymentMethod(String paymentMethod);
}