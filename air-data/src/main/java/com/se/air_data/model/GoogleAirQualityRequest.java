package com.se.air_data.model;

import java.util.Arrays;
import java.util.List;

public class GoogleAirQualityRequest {
    private Location location;
    private List<String> extraComputations;

    public GoogleAirQualityRequest(double latitude, double longitude) {
        this.location = new Location(latitude, longitude);
        this.extraComputations = Arrays.asList("LOCAL_AQI");
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<String> getExtraComputations() {
        return extraComputations;
    }

    public void setExtraComputations(List<String> extraComputations) {
        this.extraComputations = extraComputations;
    }

    public static class Location {
        private double latitude;
        private double longitude;

        public Location(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
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
    }
}
