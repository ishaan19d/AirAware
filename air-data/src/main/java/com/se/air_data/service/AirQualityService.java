package com.se.air_data.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.se.air_data.entity.AirQualityData;
import com.se.air_data.model.AQIResult;
import com.se.air_data.model.AirQualityResponse;
import com.se.air_data.model.Components;
import com.se.air_data.model.GoogleAirQualityRequest;
import com.se.air_data.model.GoogleAirQualityResponse;
import com.se.air_data.repository.AirQualityRepository;

@Service
public class AirQualityService {
    
	@Autowired
    private final AirQualityRepository airQualityRepository;
    
    @Autowired
    private final RestTemplate restTemplate;
    
    @Value("${openweather.api.url.air}")
    private String API_URL;

    @Value("${openweather.api.key}")
    private String API_KEY;

    @Value("${google.api.url.air}")
    private String AQI_API_URL;

    @Value("${google.api.key}")
    private String AQI_API_KEY;
    
    @Autowired
    public AirQualityService(AirQualityRepository airQualityRepository, RestTemplate restTemplate) {
    	
        this.airQualityRepository = airQualityRepository;
        this.restTemplate = restTemplate;
    }
    
    public AQIResult getAirQuality(double lat, double lon) {
        String url = String.format("%s?key=%s", AQI_API_URL, AQI_API_KEY);
        
        // Create request body with LOCAL_AQI in extraComputations
        GoogleAirQualityRequest request = new GoogleAirQualityRequest(lat, lon);
        
        // Make POST request to Google Air Quality API
        GoogleAirQualityResponse response = restTemplate.postForObject(
            url, 
            request, 
            GoogleAirQualityResponse.class);
        
        if (response == null || response.getIndexes() == null || response.getIndexes().isEmpty()) {
            throw new RuntimeException("Failed to fetch air quality data from Google API.");
        }

        // Get AQI for ind_cpcb from response
        int aqi = -1;
        for (GoogleAirQualityResponse.Index index : response.getIndexes()) {
            if ("ind_cpcb".equals(index.getCode())) {
                aqi = index.getAqi();
                System.out.println("Indian CPCB AQI: " + aqi);
                break;
            }
        }
        
        // If ind_cpcb not found, use the universal AQI as fallback
        if (aqi == -1) {
            aqi = response.getIndexes().get(0).getAqi();
            System.out.println("Universal AQI (fallback): " + aqi);
        }
        
        // Still need to get components from OpenWeather for complete data
        String openWeatherUrl = String.format("%s?lat=%f&lon=%f&appid=%s", API_URL, lat, lon, API_KEY);
        AirQualityResponse openWeatherResponse = restTemplate.getForObject(openWeatherUrl, AirQualityResponse.class);
        
        if (openWeatherResponse == null || openWeatherResponse.getList().isEmpty()) {
            throw new RuntimeException("Failed to fetch component data from OpenWeather API.");
        }

        Components components = openWeatherResponse.getList().get(0).getComponents();
        
        // Return result with Google AQI and OpenWeather components
        return new AQIResult(components, aqi);
    }
    
    // Save new air quality data
    public AirQualityData saveAirQualityData(AirQualityData airQualityData) {
        // Set timestamp if not already set
        if (airQualityData.getTimestamp() == null) {
            airQualityData.setTimestamp(LocalDateTime.now());
        }
        return airQualityRepository.save(airQualityData);
    }
    
    // Get air quality data by ID
    public Optional<AirQualityData> getAirQualityDataById(String id) {
        return airQualityRepository.findById(id);
    }
    
    // Get all air quality data
    public List<AirQualityData> getAllAirQualityData() {
        return airQualityRepository.findAll();
    }
    
    // Get air quality data by AQI range
    public List<AirQualityData> getAirQualityDataByAqiRange(int minAqi, int maxAqi) {
        return airQualityRepository.findByAqiBetween(minAqi, maxAqi);
    }
    
    // Get air quality data by city
    public List<AirQualityData> getAirQualityDataByCity(String city) {
        return airQualityRepository.findByLocationCity(city);
    }
    
    // Get air quality data by state
    public List<AirQualityData> getAirQualityDataByState(String state) {
        return airQualityRepository.findByLocationState(state);
    }
    
    // Get air quality data by city and state
    public List<AirQualityData> getAirQualityDataByCityAndState(String city, String state) {
        return airQualityRepository.findByLocationCityAndLocationState(city, state);
    }
    
    // Get air quality data by date range
    public List<AirQualityData> getAirQualityDataByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return airQualityRepository.findByTimestampBetween(startDate, endDate);
    }
    
    // Get air quality data by location and date range
    public List<AirQualityData> getAirQualityDataByLocationAndDateRange(
            String city, String state, LocalDateTime startDate, LocalDateTime endDate) {
        return airQualityRepository.findByLocationCityAndLocationStateAndTimestampBetween(
                city, state, startDate, endDate);
    }
    
    // Get air quality data with PM2.5 exceeding a threshold
    public List<AirQualityData> getAirQualityDataByHighPm25(double threshold) {
        return airQualityRepository.findByPm25GreaterThan(threshold);
    }
    
    // Get air quality data with PM2.5 exceeding a threshold for a specific location
    public List<AirQualityData> getAirQualityDataByHighPm25AndLocation(double threshold, String city, String state) {
        return airQualityRepository.findByPm25GreaterThanAndLocation(threshold, city, state);
    }
    
    // Get the latest air quality data
    public AirQualityData getLatestAirQualityData() {
        return airQualityRepository.findTopByOrderByTimestampDesc();
    }
    
    // Get the latest air quality data for a specific city
    public AirQualityData getLatestAirQualityDataForCity(String city) {
        return airQualityRepository.findTopByLocationCityOrderByTimestampDesc(city);
    }
    
    // Get the latest air quality data for a specific state
    public AirQualityData getLatestAirQualityDataForState(String state) {
        return airQualityRepository.findTopByLocationStateOrderByTimestampDesc(state);
    }
    
    // Get the latest air quality data for a specific city and state
    public AirQualityData getLatestAirQualityDataForLocation(String city, String state) {
        return airQualityRepository.findTopByLocationCityAndLocationStateOrderByTimestampDesc(city, state);
    }
    
    // Get AQI data for a city over a time period (for trend analysis)
    public List<AirQualityData> getAqiTrendForCity(String city, LocalDateTime startDate, LocalDateTime endDate) {
        return airQualityRepository.findAqiByCityAndDateRange(city, startDate, endDate);
    }
    
    // Get cities with AQI above a certain threshold (for pollution alerts)
    public List<AirQualityData> getCitiesWithHighAqi(int threshold) {
        return airQualityRepository.findCitiesWithAqiAbove(threshold);
    }
    
    // Delete air quality data by ID
    public void deleteAirQualityData(String id) {
        airQualityRepository.deleteById(id);
    }
    
    // Get Unique Locations
    public List<AirQualityData.Location> getAllUniqueLocations() {
        return airQualityRepository.findDistinctLocations();
    }
}