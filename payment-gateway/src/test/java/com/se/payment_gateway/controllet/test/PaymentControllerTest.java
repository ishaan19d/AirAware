package com.se.payment_gateway.controllet.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.se.payment_gateway.controller.PaymentController;
import com.se.payment_gateway.kafka.service.PaymentEventProducer;
import com.se.payment_gateway.service.RazorpayService;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @InjectMocks
    private PaymentController paymentController;

    @Mock
    private RazorpayService razorpayService;

    @Mock
    private PaymentEventProducer paymentEventProducer;

    private String orderId;
    private String paymentId;
    private String signature;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        orderId = "order123";
        paymentId = "payment123";
        signature = "signature123";
        jwtToken = "Bearer validToken";
    }

    @Test
    void testVerifyPayment_Success() {
        when(razorpayService.verifyPayment(orderId, paymentId, signature)).thenReturn(true);

        ResponseEntity<?> response = paymentController.verifyPayment(orderId, paymentId, signature, jwtToken);

        verify(paymentEventProducer, times(1)).sendPaymentVerificationEvent(jwtToken, orderId, paymentId, signature);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Payment Verified and Premium Request Submitted", response.getBody());
    }

    @Test
    void testVerifyPayment_Failure() {
        when(razorpayService.verifyPayment(orderId, paymentId, signature)).thenReturn(false);

        ResponseEntity<?> response = paymentController.verifyPayment(orderId, paymentId, signature, jwtToken);

        verify(paymentEventProducer, never()).sendPaymentVerificationEvent(any(), any(), any(), any());
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Payment Verification Failed", response.getBody());
    }

    @Test
    void testVerifyPayment_Exception() {
        when(razorpayService.verifyPayment(orderId, paymentId, signature)).thenReturn(true);
        doThrow(new RuntimeException("Kafka error")).when(paymentEventProducer)
                .sendPaymentVerificationEvent(jwtToken, orderId, paymentId, signature);

        ResponseEntity<?> response = paymentController.verifyPayment(orderId, paymentId, signature, jwtToken);

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Failed to process premium request"));
    }
}
