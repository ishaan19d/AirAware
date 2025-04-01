package com.se.air_data.kafka.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.se.air_data.entity.AirQualityData;
import com.se.air_data.service.AirQualityService;

@Service
public class LocationPublishingProducer {

    private static final Logger logger = LoggerFactory.getLogger(LocationPublishingProducer.class);

    @Value("${kafka.topic.locations}")
    private String locationsTopic;

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final AirQualityService airQualityService;

    @Autowired
    public LocationPublishingProducer(KafkaTemplate<String, Object> kafkaTemplate, AirQualityService airQualityService) {
        this.kafkaTemplate = kafkaTemplate;
        this.airQualityService = airQualityService;
    }

    /**
     * Sends all unique locations to Kafka for processing
     */
    public void publishUniqueLocations() {
        List<AirQualityData.Location> locations = airQualityService.getAllUniqueLocations();
        logger.info("Publishing {} unique locations to Kafka", locations.size());
        
        // Convert locations to a list of maps before sending
        List<Map<String, String>> locationMaps = locations.stream()
            .map(location -> {
                Map<String, String> map = new HashMap<>();
                map.put("city", location.getCity());
                map.put("state", location.getState());
                return map;
            })
            .collect(Collectors.toList());
        
        kafkaTemplate.send(locationsTopic, locationMaps);
        logger.info("Published unique locations to Kafka");
    }
}