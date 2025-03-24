package main.java.com.example.airData.service;

import main.java.com.example.airData.model.AQIResult;
import main.java.com.example.airData.model.AirQualityResponse;
import main.java.com.example.airData.model.Components;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AirQualityService {

    @Autowired
    private final RestTemplate restTemplate;

    @Value("${openweather.api.url.air}")
    private String API_URL;

    @Value("${openweather.api.key}")
    private String API_KEY;

    public AirQualityService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AQIResult getAirQuality(double lat, double lon) {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s", API_URL, lat, lon, API_KEY);
        AirQualityResponse response = restTemplate.getForObject(url, AirQualityResponse.class);
        
        if (response == null || response.getList().isEmpty()) {
            throw new RuntimeException("Failed to fetch air quality data.");
        }

        Components components = response.getList().get(0).getComponents();
        int aqi = AQICalculator.calculateAQI(components);

        return new AQIResult(components, aqi);
    }
}
