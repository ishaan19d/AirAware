package com.se.scheduler.model;

import java.time.LocalDateTime;

public class AirQualityData {
    
    private String id;
    
    private Components components;
    private int aqi;
    private LocalDateTime timestamp;
    private Location location;
    
    // Default constructor required for MongoDB
    public AirQualityData() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public AirQualityData(Components components, int aqi, Location location) {
        this.components = components;
        this.aqi = aqi;
        this.location = location;
        this.timestamp = LocalDateTime.now();
    }
    
    // Location class to store city and state
    public static class Location {
        private String city;
        
        private String state;
        
        // Default constructor
        public Location() {
        }
        
        // Constructor with parameters
        public Location(String city, String state) {
            this.city = city;
            this.state = state;
        }
        
        // Getters and Setters
        public String getCity() {
            return city;
        }
        
        public void setCity(String city) {
            this.city = city;
        }
        
        public String getState() {
            return state;
        }
        
        public void setState(String state) {
            this.state = state;
        }
        
        @Override
        public String toString() {
            return "Location{" +
                    "city='" + city + '\'' +
                    ", state='" + state + '\'' +
                    '}';
        }
    }
    
    // Nested class for the components
    public static class Components {
        private double co;
        private double no;
        private double no2;
        private double o3;
        private double so2;
        private double pm2_5;
        private double pm10;
        private double nh3;
        
        // Default constructor
        public Components() {
        }
        
        // Constructor with parameters
        public Components(double co, double no, double no2, double o3, 
                          double so2, double pm2_5, double pm10, double nh3) {
            this.co = co;
            this.no = no;
            this.no2 = no2;
            this.o3 = o3;
            this.so2 = so2;
            this.pm2_5 = pm2_5;
            this.pm10 = pm10;
            this.nh3 = nh3;
        }
        
        // Getters and Setters
        public double getCo() {
            return co;
        }
        
        public void setCo(double co) {
            this.co = co;
        }
        
        public double getNo() {
            return no;
        }
        
        public void setNo(double no) {
            this.no = no;
        }
        
        public double getNo2() {
            return no2;
        }
        
        public void setNo2(double no2) {
            this.no2 = no2;
        }
        
        public double getO3() {
            return o3;
        }
        
        public void setO3(double o3) {
            this.o3 = o3;
        }
        
        public double getSo2() {
            return so2;
        }
        
        public void setSo2(double so2) {
            this.so2 = so2;
        }
        
        public double getPm2_5() {
            return pm2_5;
        }
        
        public void setPm2_5(double pm2_5) {
            this.pm2_5 = pm2_5;
        }
        
        public double getPm10() {
            return pm10;
        }
        
        public void setPm10(double pm10) {
            this.pm10 = pm10;
        }
        
        public double getNh3() {
            return nh3;
        }
        
        public void setNh3(double nh3) {
            this.nh3 = nh3;
        }
        
        @Override
        public String toString() {
            return "Components{" +
                    "co=" + co +
                    ", no=" + no +
                    ", no2=" + no2 +
                    ", o3=" + o3 +
                    ", so2=" + so2 +
                    ", pm2_5=" + pm2_5 +
                    ", pm10=" + pm10 +
                    ", nh3=" + nh3 +
                    '}';
        }
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public Components getComponents() {
        return components;
    }
    
    public void setComponents(Components components) {
        this.components = components;
    }
    
    public int getAqi() {
        return aqi;
    }
    
    public void setAqi(int aqi) {
        this.aqi = aqi;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Location getLocation() {
        return location;
    }
    
    public void setLocation(Location location) {
        this.location = location;
    }
    
    @Override
    public String toString() {
        return "AirQualityData{" +
                "id='" + id + '\'' +
                ", components=" + components +
                ", aqi=" + aqi +
                ", timestamp=" + timestamp +
                ", location=" + location +
                '}';
    }
}