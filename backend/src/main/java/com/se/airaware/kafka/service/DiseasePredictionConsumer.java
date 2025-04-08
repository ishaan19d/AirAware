package com.se.airaware.kafka.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.airaware.user.User;
import com.se.airaware.user.service.UserService;

@Service
public class DiseasePredictionConsumer {

    private static final Logger logger = LoggerFactory.getLogger(DiseasePredictionConsumer.class);

    private final UserService userService;
    private final UserNotificationProducer userNotificationProducer;

    @Autowired
    public DiseasePredictionConsumer(UserService userService, UserNotificationProducer userNotificationProducer) {
        this.userService = userService;
        this.userNotificationProducer = userNotificationProducer;
    }

    /**
     * Receives disease predictions from ML component and processes them
     */
    @KafkaListener(
    	    topics = "${kafka.topic.disease-predictions}",
    	    properties = {
    	        "spring.json.trusted.packages=*",
    	        "spring.json.value.default.type=java.util.Map"
    	    }
    	)
    public void processDiseaseData(Map<String, Object> diseasePrediction) {
        try {
            String city = (String) diseasePrediction.get("city");
            String state = (String) diseasePrediction.get("state");
            @SuppressWarnings("unchecked")
            List<String> diseases = (List<String>) diseasePrediction.get("diseases");
            
            logger.info("Received disease prediction for {}, {}: {}", city, state, diseases);
            
            // Get all paid users in this location
            List<User> paidUsers = userService.getPaidUsersByLocation(city, state);

            // ✅ Filter users who have any of the predicted diseases
            for (User user : paidUsers) {
                List<String> userDiseases = user.getDiseases(); // Assume this is a list of strings
                boolean shouldNotify = userDiseases.stream().anyMatch(diseases::contains);

                if (shouldNotify) {
                    Map<String, Object> notificationData = new HashMap<>();
                    notificationData.put("email", user.getEmail());
                    notificationData.put("diseases", diseases);
                    userNotificationProducer.sendPaidUserNotification(notificationData);
                    logger.info("Queued notification for user {}", user.getEmail());
                }
            }
        } catch (Exception e) {
            logger.error("Error processing disease prediction: {}", e.getMessage(), e);
        }
    }

    /**
     * Receives disease predictions and processes them for free users
     */
    @KafkaListener(topics = "${kafka.topic.air-quality}",groupId = "backend-group")
    public void processAirQualityDataForFreeUsers(Map<String, Object> airQualityData) {
        try {
            String city = (String) airQualityData.get("city");
            String state = (String) airQualityData.get("state");

            // Extract pollutant values
            double co = ((Number) airQualityData.get("co")).doubleValue();
            double no = ((Number) airQualityData.get("no")).doubleValue();
            double no2 = ((Number) airQualityData.get("no2")).doubleValue();
            double o3 = ((Number) airQualityData.get("o3")).doubleValue();
            double so2 = ((Number) airQualityData.get("so2")).doubleValue();
            double pm2_5 = ((Number) airQualityData.get("pm2_5")).doubleValue();
            double pm10 = ((Number) airQualityData.get("pm10")).doubleValue();
            double nh3 = ((Number) airQualityData.get("nh3")).doubleValue();

            // List to hold pollutants that exceeded the safe threshold
            List<String> unsafePollutants = new ArrayList<>();

            // Threshold checks
            if (co > 4.4) unsafePollutants.add("CO");
            if (no > 0.053) unsafePollutants.add("NO");
            if (no2 > 0.053) unsafePollutants.add("NO2");
            if (o3 > 0.07) unsafePollutants.add("O3");
            if (so2 > 0.075) unsafePollutants.add("SO2");
            if (pm2_5 > 12.0) unsafePollutants.add("PM2.5");
            if (pm10 > 54.0) unsafePollutants.add("PM10");
            if (nh3 > 0.2) unsafePollutants.add("NH3");

            if (unsafePollutants.isEmpty()) {
                logger.info("Air quality is within safe limits for {}, {}", city, state);
                return;
            }

            logger.warn("Unsafe air quality detected in {}, {}. Pollutants: {}", city, state, unsafePollutants);

            // Fetch all free users in the affected location
            List<User> freeUsers = userService.getFreeUsersByLocation(city, state);

            for (User user : freeUsers) {
                Map<String, Object> notificationData = new HashMap<>();
                notificationData.put("email", user.getEmail());
                notificationData.put("unsafePollutants", unsafePollutants);
                userNotificationProducer.sendFreeUserNotification(notificationData);
                logger.info("Queued air quality alert for FREE user {}: {}", user.getEmail(), unsafePollutants);
            }

        } catch (Exception e) {
            logger.error("Error processing air quality data for FREE users: {}", e.getMessage(), e);
        }
    }
}