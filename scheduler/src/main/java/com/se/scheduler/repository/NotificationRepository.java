package com.se.scheduler.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.se.scheduler.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    Notification save(Notification notification);
    // Custom query methods can be defined here if needed
    // For example, find notifications by user email or type
    // List<Notification> findByUserEmail(String userEmail);
    // List<Notification> findByType(String type);
}