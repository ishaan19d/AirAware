package com.se.scheduler.air_quality;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SimpleGeocoder {

    private static final Logger logger = LoggerFactory.getLogger(SimpleGeocoder.class);
    
    // Hard-coded location
    private static final String CITY = "Mumbai";
    private static final String STATE = "Maharashtra";
    private static final String COUNTRY = "India";

    /**
     * Scheduled task to run every 10 minutes (600,000 milliseconds)
     */
    @Scheduled(fixedRate = 600000)
    public void scheduledGeocodingTask() {
        printMumbaiCoordinates();
    }
    
    /**
     * Simple function to print coordinates for Mumbai, Maharashtra
     */
    public void printMumbaiCoordinates() {
        try {
            // Get current timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            logger.info("----- Geocoding check at {} -----", timestamp);
            
            String location = CITY + ", " + STATE + ", " + COUNTRY;
            logger.info("Fetching coordinates for: {}", location);
            
            // Build the URL for OpenStreetMap Nominatim API
            String encodedLocation = URLEncoder.encode(location, StandardCharsets.UTF_8.toString());
            String apiUrl = "https://nominatim.openstreetmap.org/search?q=" + encodedLocation + "&format=json&limit=1";
            
            // Create connection
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Set request properties
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "GeocodingApp/1.0");
            
            // Read the response
            int responseCode = connection.getResponseCode();
            
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                // Parse response using regex
                String jsonResponse = response.toString();
                
                if (jsonResponse.startsWith("[") && !jsonResponse.equals("[]")) {
                    // Extract latitude using regex
                    Pattern latPattern = Pattern.compile("\"lat\":\"([\\d.]+)\"");
                    Matcher latMatcher = latPattern.matcher(jsonResponse);
                    
                    // Extract longitude using regex
                    Pattern lonPattern = Pattern.compile("\"lon\":\"([\\d.]+)\"");
                    Matcher lonMatcher = lonPattern.matcher(jsonResponse);
                    
                    if (latMatcher.find() && lonMatcher.find()) {
                        String lat = latMatcher.group(1);
                        String lon = lonMatcher.group(1);
                        
                        logger.info("Coordinates for {}, {}:", CITY, STATE);
                        logger.info("Latitude: {}", lat);
                        logger.info("Longitude: {}", lon);
                    } else {
                        logger.error("Could not extract coordinates from response.");
                    }
                } else {
                    logger.error("No results found for: {}", location);
                }
            } else {
                logger.error("Error: HTTP response code {}", responseCode);
            }
            
            connection.disconnect();
            logger.info("Geocoding check completed");
            
        } catch (Exception e) {
            logger.error("Error fetching coordinates: {}", e.getMessage(), e);
        }
    }
}