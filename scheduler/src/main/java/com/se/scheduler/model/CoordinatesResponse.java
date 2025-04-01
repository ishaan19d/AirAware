package com.se.scheduler.model;

import java.io.Serializable;

public class CoordinatesResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String city;
    private String state;
    private double latitude;
    private double longitude;
    
    // Default constructor for deserialization
    public CoordinatesResponse() {
    }
    
    public CoordinatesResponse(String city, String state, double latitude, double longitude) {
        this.city = city;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
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
    
    public double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    
    public double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    
    @Override
    public String toString() {
        return "CoordinatesResponse{" +
                "city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}