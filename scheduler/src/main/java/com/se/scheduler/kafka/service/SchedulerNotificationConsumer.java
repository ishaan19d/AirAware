package com.se.scheduler.kafka.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.se.scheduler.service.EmailSchedulerService;

@Service
public class SchedulerNotificationConsumer {

    private static final Logger logger = LoggerFactory.getLogger(SchedulerNotificationConsumer.class);

    private final EmailSchedulerService emailSchedulerService;

    @Autowired
    public SchedulerNotificationConsumer(EmailSchedulerService emailSchedulerService) {
        this.emailSchedulerService = emailSchedulerService;
    }

    /**
     * Receives user notifications from backend and schedules emails
     */
    @KafkaListener(topics = "${kafka.topic.user-notifications}")
    public void processNotification(Map<String, Object> notificationData) {
        try {
            String email = (String) notificationData.get("email");
            @SuppressWarnings("unchecked")
            List<String> diseases = (List<String>) notificationData.get("diseases");
            
            logger.info("Scheduling notification for {} about diseases: {}", email, diseases);
            
            // Schedule the email notification
            emailSchedulerService.scheduleEmailAlert(email, diseases);
            
            logger.info("Successfully scheduled email alert for {}", email);
        } catch (Exception e) {
            logger.error("Error scheduling email notification: {}", e.getMessage(), e);
        }
    }
}