package com.se.air_data.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se.air_data.entity.AirQualityData;
import com.se.air_data.service.AirQualityService;

@RestController
@RequestMapping("/api/air-quality")
public class AirQualityController {

    private final AirQualityService airQualityService;
    
    @Autowired
    public AirQualityController(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }
    
    @PostMapping("/save")
    public ResponseEntity<AirQualityData> saveAirQualityData(@RequestBody AirQualityData airQualityData) {
        AirQualityData saved = airQualityService.saveAirQualityData(airQualityData);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AirQualityData> getAirQualityDataById(@PathVariable("id") String id) {
        Optional<AirQualityData> data = airQualityService.getAirQualityDataById(id);
        return data.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get the latest air quality data
    @GetMapping("/latest")
    public ResponseEntity<AirQualityData> getLatestAirQualityData() {
        AirQualityData latest = airQualityService.getLatestAirQualityData();
        if (latest != null) {
            return new ResponseEntity<>(latest, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // Get the latest air quality data for a specific city and state
    @GetMapping("/latest/location")
    public ResponseEntity<AirQualityData> getLatestAirQualityDataForLocation(
            @RequestParam("city") String city, @RequestParam("state") String state) {
        AirQualityData latest = airQualityService.getLatestAirQualityDataForLocation(city, state);
        if (latest != null) {
            return new ResponseEntity<>(latest, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // Get air quality data by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<AirQualityData>> getAirQualityDataByCity(@PathVariable("city") String city) {
        List<AirQualityData> dataList = airQualityService.getAirQualityDataByCity(city);
        return new ResponseEntity<>(dataList, HttpStatus.OK);
    }
    
    // Get air quality data by state
    @GetMapping("/state/{state}")
    public ResponseEntity<List<AirQualityData>> getAirQualityDataByState(@PathVariable("state") String state) {
        List<AirQualityData> dataList = airQualityService.getAirQualityDataByState(state);
        return new ResponseEntity<>(dataList, HttpStatus.OK);
    }
    
    // Get air quality data by AQI range
    @GetMapping("/aqi-range")
    public ResponseEntity<List<AirQualityData>> getAirQualityDataByAqiRange(
            @RequestParam("minAqi") int minAqi, @RequestParam("maxAqi") int maxAqi) {
        List<AirQualityData> dataList = airQualityService.getAirQualityDataByAqiRange(minAqi, maxAqi);
        return new ResponseEntity<>(dataList, HttpStatus.OK);
    }
    
    // Get air quality data by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<AirQualityData>> getAirQualityDataByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AirQualityData> dataList = airQualityService.getAirQualityDataByDateRange(startDate, endDate);
        return new ResponseEntity<>(dataList, HttpStatus.OK);
    }
    
    // Get cities with high AQI (for alerts)
    @GetMapping("/alerts")
    public ResponseEntity<List<AirQualityData>> getCitiesWithHighAqi(@RequestParam("threshold") int threshold) {
        List<AirQualityData> dataList = airQualityService.getCitiesWithHighAqi(threshold);
        return new ResponseEntity<>(dataList, HttpStatus.OK);
    }
    
    // Create from raw JSON data example
    @PostMapping("/raw")
    public ResponseEntity<AirQualityData> createFromRaw(@RequestBody Map<String, Object> rawData) {
        try {
            // Parse the raw data
            Map<String, Object> componentsMap = (Map<String, Object>) rawData.get("components");
            int aqi = ((Number) rawData.get("aqi")).intValue();
            
            // Create components object
            AirQualityData.Components components = new AirQualityData.Components(
                    ((Number) componentsMap.get("co")).doubleValue(),
                    ((Number) componentsMap.get("no")).doubleValue(),
                    ((Number) componentsMap.get("no2")).doubleValue(),
                    ((Number) componentsMap.get("o3")).doubleValue(),
                    ((Number) componentsMap.get("so2")).doubleValue(),
                    ((Number) componentsMap.get("pm2_5")).doubleValue(),
                    ((Number) componentsMap.get("pm10")).doubleValue(),
                    ((Number) componentsMap.get("nh3")).doubleValue()
            );
            
            // Create location (assuming it's passed separately or using default)
            String city = (String) rawData.getOrDefault("city", "Unknown");
            String state = (String) rawData.getOrDefault("state", "Unknown");
            AirQualityData.Location location = new AirQualityData.Location(city, state);
            
            // Create and save the data
            AirQualityData airQualityData = new AirQualityData(components, aqi, location);
            AirQualityData saved = airQualityService.saveAirQualityData(airQualityData);
            
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete air quality data
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirQualityData(@PathVariable("id") String id) {
        try {
            airQualityService.deleteAirQualityData(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}