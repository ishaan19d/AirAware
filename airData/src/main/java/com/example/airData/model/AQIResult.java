package main.java.com.example.airData.model;

public class AQIResult {
    private Components components;
    private int aqi;

    public AQIResult(Components components, int aqi) {
        this.components = components;
        this.aqi = aqi;
    }

    public Components getComponents() {
        return components;
    }

    public int getAqi() {
        return aqi;
    }
}
