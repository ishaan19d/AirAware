package com.se.airaware.kafka.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserNotificationProducer {

    private static final Logger logger = LoggerFactory.getLogger(UserNotificationProducer.class);

    @Value("${kafka.topic.paid-user-notifications}")
    private String paidUserNotificationsTopic;

    @Value("${kafka.topic.free-user-notifications}")
    private String freeUserNotificationsTopic;

    private final KafkaTemplate<String, Map<String, Object>> kafkaTemplate;

    @Autowired
    public UserNotificationProducer(KafkaTemplate<String, Map<String, Object>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Sends notification data to scheduler for email scheduling
     */
    public void sendPaidUserNotification(Map<String, Object> notificationData) {
        String email = (String) notificationData.get("email");
        
        logger.info("Sending notification data for {} to scheduler", email);
        
        // Use email as key for potential partitioning by user
        kafkaTemplate.send(paidUserNotificationsTopic, email, notificationData);
        
        logger.info("Notification data sent successfully");
    }

    public void sendFreeUserNotification(Map<String, Object> notificationData) {
        String email = (String) notificationData.get("email");
        
        logger.info("Sending notification data for {} to scheduler to send to free users.", email);
        
        // Use email as key for potential partitioning by user
        kafkaTemplate.send(freeUserNotificationsTopic, email, notificationData);
        
        logger.info("Notification data sent successfully");
    }
}
