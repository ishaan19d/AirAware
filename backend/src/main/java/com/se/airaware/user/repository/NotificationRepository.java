package com.se.airaware.user.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.se.airaware.user.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserEmail(String userEmail);
}
