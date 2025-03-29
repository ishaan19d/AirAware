package com.se.air_data.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.se.air_data.entity.AirQualityData;
import com.se.air_data.repository.AirQualityRepository;

@Service
public class AirQualityService {
    
    private final AirQualityRepository airQualityRepository;
    
    @Autowired
    public AirQualityService(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
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
}