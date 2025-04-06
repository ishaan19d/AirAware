package com.se.air_data.kafka.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.air_data.entity.AirQualityData;
import com.se.air_data.entity.AirQualityData.Components;
import com.se.air_data.model.AQIResult;
import com.se.air_data.service.AirQualityService;

@Service
public class CoordinatesProcessingConsumer {

    private static final Logger logger = LoggerFactory.getLogger(CoordinatesProcessingConsumer.class);

    private final AirQualityService airQualityService;
    private final AirQualityPublisher airQualityPublisher;

    @Autowired
    public CoordinatesProcessingConsumer(AirQualityService airQualityService, 
                                         AirQualityPublisher airQualityPublisher) {
        this.airQualityService = airQualityService;
        this.airQualityPublisher = airQualityPublisher;
    }

    /**
     * Receives coordinates from Kafka as a Map and fetches/saves air quality data
     * Then publishes data to ML component
     */
    @KafkaListener(topics = "${kafka.topic.coordinates}")
    public void processCoordinates(Map<String, Object> coordinatesMap) {
        String city = (String) coordinatesMap.get("city");
        String state = (String) coordinatesMap.get("state");
        Double latitude = (Double) coordinatesMap.get("latitude");
        Double longitude = (Double) coordinatesMap.get("longitude");
        
        logger.info("Processing coordinates for {}, {}: lat={}, lon={}", 
            city, state, latitude, longitude);
        
        try {
            // Get air quality data using the coordinates
            AQIResult airQuality = airQualityService.getAirQuality(latitude, longitude);
            
            // Create new AirQualityData entity
            AirQualityData.Location location = new AirQualityData.Location(city, state);
            AirQualityData data = new AirQualityData(
                new Components(
                    airQuality.getComponents().getCo(),
                    airQuality.getComponents().getNo(),
                    airQuality.getComponents().getNo2(),
                    airQuality.getComponents().getO3(),
                    airQuality.getComponents().getSo2(),
                    airQuality.getComponents().getPm2_5(),
                    airQuality.getComponents().getPm10(),
                    airQuality.getComponents().getNh3()
                ),
                airQuality.getAqi(),
                location
            );
            
            // Save to database
            AirQualityData savedData = airQualityService.saveAirQualityData(data);
            logger.info("Saved air quality data for {}, {}", city, state);
            
            // Send to ML component for disease prediction
            airQualityPublisher.publishAirQualityData(savedData);
        } catch (Exception e) {
            logger.error("Error fetching/saving air quality data for {}, {}: {}", 
                city, state, e.getMessage(), e);
        }
    }
}