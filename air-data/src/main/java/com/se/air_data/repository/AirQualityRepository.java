package com.se.air_data.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.se.air_data.entity.AirQualityData;

@Repository
public interface AirQualityRepository extends MongoRepository<AirQualityData, String> {
    
    // Find data by AQI range
    List<AirQualityData> findByAqiBetween(int minAqi, int maxAqi);
    
    // Find data by city
    List<AirQualityData> findByLocationCity(String city);
    
    // Find data by state
    List<AirQualityData> findByLocationState(String state);
    
    // Find data by city and state
    List<AirQualityData> findByLocationCityAndLocationState(String city, String state);
    
    // Find data by timestamp range
    List<AirQualityData> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find data by location (city and state) and timestamp range
    List<AirQualityData> findByLocationCityAndLocationStateAndTimestampBetween(
            String city, String state, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find data with PM2.5 exceeding a threshold
    @Query("{'components.pm2_5': {$gt: ?0}}")
    List<AirQualityData> findByPm25GreaterThan(double threshold);
    
    // Find data with PM2.5 exceeding a threshold for a specific location
    @Query("{'components.pm2_5': {$gt: ?0}, 'location.city': ?1, 'location.state': ?2}")
    List<AirQualityData> findByPm25GreaterThanAndLocation(double threshold, String city, String state);
    
    // Find the latest air quality data entry
    AirQualityData findTopByOrderByTimestampDesc();
    
    // Find the latest entry for a specific city
    AirQualityData findTopByLocationCityOrderByTimestampDesc(String city);
    
    // Find the latest entry for a specific state
    AirQualityData findTopByLocationStateOrderByTimestampDesc(String state);
    
    // Find the latest entry for a specific city and state
    AirQualityData findTopByLocationCityAndLocationStateOrderByTimestampDesc(String city, String state);
    
    // Get average AQI for a city over a time period
    @Query(value = "{ 'location.city': ?0, 'timestamp': { $gte: ?1, $lte: ?2 } }", 
           count = false, 
           fields = "{ 'aqi': 1, '_id': 0 }")
    List<AirQualityData> findAqiByCityAndDateRange(String city, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find cities with AQI above threshold
    @Query(value = "{ 'aqi': { $gt: ?0 } }", 
           fields = "{ 'location.city': 1, 'location.state': 1, '_id': 0 }")
    List<AirQualityData> findCitiesWithAqiAbove(int threshold);
}