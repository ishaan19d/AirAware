package com.se.airaware.user;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;  
    private String userEmail;
    private String type; // "FREE" or "PREMIUM"
    private String subject;
    private String content;
    private List<String> relatedItems; // diseases or pollutants
    private LocalDateTime timestamp;

    public Notification() {}

    public Notification(String userEmail, String type, String subject, String content, List<String> relatedItems) {
        this.userEmail = userEmail;
        this.type = type;
        this.subject = subject;
        this.content = content;
        this.relatedItems = relatedItems;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getRelatedItems() {
        return relatedItems;
    }

    public void setRelatedItems(List<String> relatedItems) {
        this.relatedItems = relatedItems;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    
}
