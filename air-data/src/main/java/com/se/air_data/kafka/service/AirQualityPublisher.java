package com.se.air_data.kafka.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.se.air_data.entity.AirQualityData;

@Service
public class AirQualityPublisher {

    private static final Logger logger = LoggerFactory.getLogger(AirQualityPublisher.class);

    @Value("${kafka.topic.air-quality}")
    private String airQualityTopic;

    private final KafkaTemplate<String, Map<String, Object>> kafkaTemplate;

    @Autowired
    public AirQualityPublisher(KafkaTemplate<String, Map<String, Object>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Sends air quality data to ML component for disease prediction
     */
    public void publishAirQualityData(AirQualityData data) {
        Map<String, Object> airQualityMap = new HashMap<>();
        
        // Add location information
        airQualityMap.put("city", data.getLocation().getCity());
        airQualityMap.put("state", data.getLocation().getState());
        
        // Add air quality components
        airQualityMap.put("co", data.getComponents().getCo());
        airQualityMap.put("no", data.getComponents().getNo());
        airQualityMap.put("no2", data.getComponents().getNo2());
        airQualityMap.put("o3", data.getComponents().getO3());
        airQualityMap.put("so2", data.getComponents().getSo2());
        airQualityMap.put("pm2_5", data.getComponents().getPm2_5());
        airQualityMap.put("pm10", data.getComponents().getPm10());
        airQualityMap.put("nh3", data.getComponents().getNh3());
        
        // Add AQI value
        airQualityMap.put("aqi", data.getAqi());
        
        logger.info("Publishing air quality data for {}, {} to ML component", 
            data.getLocation().getCity(), data.getLocation().getState());
        
        kafkaTemplate.send(airQualityTopic, airQualityMap);
        logger.info("Air quality data published successfully");
    }
}