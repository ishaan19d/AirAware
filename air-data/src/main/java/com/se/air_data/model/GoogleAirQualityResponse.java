package com.se.air_data.model;

import java.util.List;

public class GoogleAirQualityResponse {
    private String dateTime;
    private String regionCode;
    private List<Index> indexes;

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public List<Index> getIndexes() {
        return indexes;
    }

    public void setIndexes(List<Index> indexes) {
        this.indexes = indexes;
    }

    public static class Index {
        private String code;
        private String displayName;
        private int aqi;
        private String aqiDisplay;
        private Color color;
        private String category;
        private String dominantPollutant;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public int getAqi() {
            return aqi;
        }

        public void setAqi(int aqi) {
            this.aqi = aqi;
        }

        public String getAqiDisplay() {
            return aqiDisplay;
        }

        public void setAqiDisplay(String aqiDisplay) {
            this.aqiDisplay = aqiDisplay;
        }

        public Color getColor() {
            return color;
        }

        public void setColor(Color color) {
            this.color = color;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getDominantPollutant() {
            return dominantPollutant;
        }

        public void setDominantPollutant(String dominantPollutant) {
            this.dominantPollutant = dominantPollutant;
        }
    }

    public static class Color {
        private double red;
        private double green;

        public double getRed() {
            return red;
        }

        public void setRed(double red) {
            this.red = red;
        }

        public double getGreen() {
            return green;
        }

        public void setGreen(double green) {
            this.green = green;
        }
    }
}
