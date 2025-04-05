package com.se.scheduler.kafka.service.test;

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
import org.springframework.test.util.ReflectionTestUtils;

import com.se.scheduler.kafka.service.CoordinatesSendingProducer;

@ExtendWith(MockitoExtension.class)
public class CoordinatesSendingProducerTest {

    @Mock
    private KafkaTemplate<String, Map<String, Object>> kafkaTemplate;

    @InjectMocks
    private CoordinatesSendingProducer coordinatesSendingProducer;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(coordinatesSendingProducer, "coordinatesTopic", "test-topic");
    }

    @Test
    void testSendCoordinates() {
        Map<String, Object> coordinatesMap = new HashMap<>();
        coordinatesMap.put("city", "New York");
        coordinatesMap.put("state", "NY");
        
        coordinatesSendingProducer.sendCoordinates(coordinatesMap);
        
        verify(kafkaTemplate, times(1)).send("test-topic", coordinatesMap);
    }
}
