package com.se.airaware.kafka.service;

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
                    userNotificationProducer.sendUserNotification(notificationData);
                    logger.info("Queued notification for user {}", user.getEmail());
                }
            }
        } catch (Exception e) {
            logger.error("Error processing disease prediction: {}", e.getMessage(), e);
        }
    }
}