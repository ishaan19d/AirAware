package main.java.com.example.airData.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.com.example.airData.model.AQIResult;
import main.java.com.example.airData.service.AirQualityService;

@RestController
@RequestMapping("/api/air-quality")
public class AirQualityController {

    private final AirQualityService airQualityService;

    public AirQualityController(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }

    @GetMapping
    public AQIResult getAirQuality(@RequestParam double lat, @RequestParam double lon) {
        return airQualityService.getAirQuality(lat, lon);
    }
}
