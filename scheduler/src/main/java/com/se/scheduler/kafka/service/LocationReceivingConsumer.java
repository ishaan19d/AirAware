package com.se.scheduler.kafka.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.scheduler.model.AirQualityData;
import com.se.scheduler.service.GeocodingService;

@Service
public class LocationReceivingConsumer {

    private static final Logger logger = LoggerFactory.getLogger(LocationReceivingConsumer.class);
    
    private final GeocodingService geocodingService;
    
    // Thread pool for parallel processing of locations
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    
    @Autowired
    public LocationReceivingConsumer(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }
    
    /**
     * Receives list of locations from Kafka and processes them
     */
    @KafkaListener(topics = "${kafka.topic.locations}")
    public void receiveLocationsForGeocoding(List<Map<String, String>> locationMaps) {
        try {
            logger.info("Received {} locations for geocoding", locationMaps.size());
            
            // Process each location map asynchronously
            for (Map<String, String> locationMap : locationMaps) {
                executorService.submit(() -> {
                    // Create a Location object from the map
                    String city = locationMap.get("city");
                    String state = locationMap.get("state");
                    
                    if (city != null && state != null) {
                        AirQualityData.Location location = new AirQualityData.Location(city, state);
                        geocodingService.processLocation(location);
                    } else {
                        logger.warn("Received location map with missing city or state: {}", locationMap);
                    }
                });
            }
        } catch (Exception e) {
            logger.error("Error processing locations message: {}", e.getMessage(), e);
        }
    }
}