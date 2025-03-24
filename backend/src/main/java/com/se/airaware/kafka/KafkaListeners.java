package com.se.airaware.kafka;

import java.util.List;
import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {
    
    @KafkaListener(topics = "topic1", groupId = "group_id")
    void listener(String message) {
        System.out.println("Received Messasge in group group_id: " + message);
    }

    @KafkaListener(topics = "payment-verification", groupId = "payment-group")
    public void processAffectedUsers(Map<String, String> payload) {
        System.out.println(payload);
        // process the data
    }

    @KafkaListener(topics = "api-data", groupId = "api-group")
    public void processAPIData(List<Map<String, String>> affectedUsers) {
        // process the data
    }
}
