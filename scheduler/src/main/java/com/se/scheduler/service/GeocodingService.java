package com.se.scheduler.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.se.scheduler.kafka.service.CoordinatesSendingProducer;
import com.se.scheduler.model.AirQualityData;

@Service
public class GeocodingService {

    private static final Logger logger = LoggerFactory.getLogger(GeocodingService.class);
    
    private static final String NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search";
    
    private final RestTemplate restTemplate;
    private final CoordinatesSendingProducer coordinatesSendingProducer;
    
    @Autowired
    public GeocodingService(RestTemplate restTemplate, CoordinatesSendingProducer coordinatesSendingProducer) {
        this.restTemplate = restTemplate;
        this.coordinatesSendingProducer = coordinatesSendingProducer;
    }
    
    /**
     * Process a location - geocode and send back results
     */
    public void processLocation(AirQualityData.Location location) {
        try {
            logger.info("Processing location: {}, {}", location.getCity(), location.getState());
            
            // Geocode the location
            String locationString = location.getCity() + ", " + location.getState();
            String encodedLocation = URLEncoder.encode(locationString, StandardCharsets.UTF_8.toString());
            
            // Build the request URL
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_API_URL)
                    .queryParam("q", encodedLocation)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .toUriString();
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "AirQualityScheduler/1.0");
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            // Call the API
            String jsonResponse = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class).getBody();
            
            // Parse response using regex
            if (jsonResponse != null && !jsonResponse.equals("[]")) {
                // Extract latitude using regex
                Pattern latPattern = Pattern.compile("\"lat\":\"([\\d.]+)\"");
                Matcher latMatcher = latPattern.matcher(jsonResponse);
                
                // Extract longitude using regex
                Pattern lonPattern = Pattern.compile("\"lon\":\"([\\d.]+)\"");
                Matcher lonMatcher = lonPattern.matcher(jsonResponse);
                
                if (latMatcher.find() && lonMatcher.find()) {
                    // FIX: Use correct matcher for longitude value
                    double lat = Double.parseDouble(latMatcher.group(1));
                    double lon = Double.parseDouble(lonMatcher.group(1)); // BUG: Should use lonMatcher
                    
                    // Create a map with coordinates data
                    Map<String, Object> coordinatesMap = new HashMap<>();
                    coordinatesMap.put("city", location.getCity());
                    coordinatesMap.put("state", location.getState());
                    coordinatesMap.put("latitude", lat);
                    coordinatesMap.put("longitude", lon);
                    
                    // Send coordinates back to Kafka using the map
                    coordinatesSendingProducer.sendCoordinates(coordinatesMap);
                    logger.info("Sent coordinates for {}, {} to Kafka: lat={}, lon={}", 
                            location.getCity(), location.getState(), lat, lon);
                } else {
                    logger.warn("Could not extract coordinates from response for {}, {}", 
                            location.getCity(), location.getState());
                }
            } else {
                logger.warn("No geocoding results found for {}, {}", 
                        location.getCity(), location.getState());
            }
        } catch (Exception e) {
            logger.error("Error geocoding location {}, {}: {}", 
                    location.getCity(), location.getState(), e.getMessage(), e);
        }
    }
}