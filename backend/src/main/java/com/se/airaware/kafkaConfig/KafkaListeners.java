package com.se.scheduler.kafkaConfig;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {
    
    @KafkaListener(topics = "topic1", groupId = "group_id")
    void listener(String message) {
        System.out.println("Received Messasge in group group_id: " + message);
    }
}
