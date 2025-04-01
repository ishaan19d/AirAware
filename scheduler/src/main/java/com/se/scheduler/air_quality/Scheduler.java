package com.se.scheduler.air_quality;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

//@Component
public class Scheduler {
    private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);
    
    // Hard-coded location
    private static final String CITY = "Palasbari";
    private static final String STATE = "Assam";
    

    @Scheduled(fixedRate = 15000) // 15 milliseconds
    public void logLocationData() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        logger.info("Air quality check at {}", timestamp);
        logger.info("Location: {}, {}", CITY, STATE);
        
        // Here you would normally call your air quality API
        // For now, we're just logging the location
        
        logger.info("Air quality check completed for {}, {}", CITY, STATE);
    }
}