package com.se.payment_gateway.kafka.service.test;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import com.se.payment_gateway.kafka.service.PaymentEventProducer;

@ExtendWith(MockitoExtension.class)
class PaymentEventProducerTest {

    @InjectMocks
    private PaymentEventProducer paymentEventProducer;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    private String jwtToken;
    private String orderId;
    private String paymentId;
    private String signature;

    @BeforeEach
    void setUp() {
        jwtToken = "Bearer validJwtToken";
        orderId = "order123";
        paymentId = "payment123";
        signature = "signature123";
    }

    @Test
    void testSendPaymentVerificationEvent() {
        // Prepare the expected payload
        Map<String, String> expectedPayload = new HashMap<>();
        expectedPayload.put("jwtToken", "validJwtToken");
        expectedPayload.put("orderId", orderId);
        expectedPayload.put("paymentId", paymentId);
        expectedPayload.put("signature", signature);

        // Call the method under test
        paymentEventProducer.sendPaymentVerificationEvent(jwtToken, orderId, paymentId, signature);

        // Verify if the Kafka template's send method was called with the correct parameters
        verify(kafkaTemplate, times(1)).send("payment-verification", expectedPayload);
    }
}

