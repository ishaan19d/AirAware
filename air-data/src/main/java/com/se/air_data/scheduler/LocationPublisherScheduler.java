package com.se.air_data.scheduler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.se.air_data.kafka.service.LocationPublishingProducer;

@Component
public class LocationPublisherScheduler {

    private static final Logger logger = LoggerFactory.getLogger(LocationPublisherScheduler.class);
    
    private final LocationPublishingProducer locationPublishingProducer;
    
    @Autowired
    public LocationPublisherScheduler(LocationPublishingProducer locationPublishingProducer) {
        this.locationPublishingProducer = locationPublishingProducer;
    }
    
    /**
     * Scheduled task that runs every hour to publish unique locations to Kafka
     * fixedRate = 3600000 (1 hour in milliseconds)
     */
    @Scheduled(fixedRate = 10000)
    public void publishLocationsToKafka() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        logger.info("Starting scheduled location publishing at {}", timestamp);
        
        try {
            locationPublishingProducer.publishUniqueLocations();
            logger.info("Successfully published locations to Kafka");
        } catch (Exception e) {
            logger.error("Error publishing locations to Kafka: {}", e.getMessage(), e);
        }
    }
}