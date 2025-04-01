package com.se.payment_gateway.paymentTransaction.repository.test;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.se.payment_gateway.paymentTransaction.PaymentTransaction;
import com.se.payment_gateway.paymentTransaction.repository.PaymentTransactionRepository;

@DataMongoTest
@ExtendWith(SpringExtension.class)
class PaymentTransactionRepositoryTest {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    private PaymentTransaction transaction;

    @BeforeEach
    void setUp() {
        // Create a payment transaction object to be used in tests
        transaction = new PaymentTransaction();
        transaction.setId("transaction123");
        transaction.setEmailId("test@example.com");
        transaction.setRazorpayOrderId("order123");
        transaction.setRazorpayPaymentId("payment123");
        transaction.setRazorpaySignature("signature123");
        transaction.setAmount(50000);
        transaction.setPaymentMethod("CreditCard");
        transaction.setStatus("COMPLETED");
        transaction.setCurrency("INR");

        // Save to the in-memory database before tests
        mongoTemplate.save(transaction);
    }

    @Test
    void testFindByRazorpayPaymentId() {
        Optional<PaymentTransaction> result = paymentTransactionRepository.findByRazorpayPaymentId("payment123");

        assertThat(result).isPresent();
        assertThat(result.get().getRazorpayPaymentId()).isEqualTo("payment123");
    }

    @Test
    void testFindByRazorpayOrderId() {
        Optional<PaymentTransaction> result = paymentTransactionRepository.findByRazorpayOrderId("order123");

        assertThat(result).isPresent();
        assertThat(result.get().getRazorpayOrderId()).isEqualTo("order123");
    }

    @Test
    void testFindByEmailId() {
        List<PaymentTransaction> result = paymentTransactionRepository.findByEmailId("test@example.com");

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getEmailId()).isEqualTo("test@example.com");
    }

    @Test
    void testFindByStatus() {
        List<PaymentTransaction> result = paymentTransactionRepository.findByStatus("COMPLETED");

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    void testFindByPaymentMethod() {
        List<PaymentTransaction> result = paymentTransactionRepository.findByPaymentMethod("CreditCard");

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getPaymentMethod()).isEqualTo("CreditCard");
    }
}
