package com.se.airaware.kafka.service.test;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import com.se.airaware.jwt.JwtService;
import com.se.airaware.kafka.service.PaymentEventConsumer;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;
import com.se.airaware.user.service.UserService;

@ExtendWith(MockitoExtension.class)
class PaymentEventConsumerKafkaTest {

    @InjectMocks
    private PaymentEventConsumer paymentEventConsumer;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    private static final String PAYMENT_CONFIRMATION_TOPIC = "payment-confirmation";

    private Map<String, String> payload;

    @BeforeEach
    void setUp() {
        payload = new HashMap<>();
        payload.put("jwtToken", "validToken");
        payload.put("orderId", "order123");
        payload.put("paymentId", "payment123");
        payload.put("signature", "signature123");

        // Mock JWT extraction
        when(jwtService.extractUserName("validToken")).thenReturn("testUser");

        // Mock UserRepository behavior
        User mockUser = mock(User.class);
        when(userRepository.findByEmail("testUser")).thenReturn(mockUser);
    }

    @Test
    void testKafkaMessageSent() {
        paymentEventConsumer.consumePaymentVerificationEvent(payload);

        verify(kafkaTemplate, times(1)).send(eq(PAYMENT_CONFIRMATION_TOPIC), anyMap());
    }

    @Test
    void testKafkaMessageNotSent_WhenNoData() {
        Map<String, String> emptyPayload = new HashMap<>();
        paymentEventConsumer.consumePaymentVerificationEvent(emptyPayload);

        verify(kafkaTemplate, never()).send(anyString(), anyMap());
    }
}
