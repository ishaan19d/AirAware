package com.se.scheduler.kafka.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class CoordinatesSendingProducer {

    private static final Logger logger = LoggerFactory.getLogger(CoordinatesSendingProducer.class);
    
    @Value("${kafka.topic.coordinates}")
    private String coordinatesTopic;
    
    private final KafkaTemplate<String, Map<String, Object>> kafkaTemplate;
    
    @Autowired
    public CoordinatesSendingProducer(KafkaTemplate<String, Map<String, Object>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    /**
     * Sends coordinates map to Kafka for processing by air-data service
     */
    public void sendCoordinates(Map<String, Object> coordinatesMap) {
        String city = (String) coordinatesMap.get("city");
        String state = (String) coordinatesMap.get("state");
        
        logger.info("Sending coordinates for {}, {} to Kafka", city, state);
        kafkaTemplate.send(coordinatesTopic, coordinatesMap);
        logger.info("Coordinates sent successfully");
    }
}