package com.se.scheduler.userDTO;

import java.util.List;

public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    
    private LocationDTO location;
    private List<String> alertPreferences;
    private boolean isPremiumUser;
    private List<String> triggers;
    
    public static class LocationDTO {
        private String city;
        private String state;
        
        public LocationDTO() {
        }
        
        public LocationDTO(String city, String state) {
            this.city = city;
            this.state = state;
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
        
        @Override
        public String toString() {
            return "LocationDTO{" +
                    "city='" + city + '\'' +
                    ", state='" + state + '\'' +
                    '}';
        }
    }
    
    public UserDTO() {
    }
    
    public UserDTO(String id, String name, String email, String phoneNumber,
                LocationDTO location, List<String> alertPreferences, boolean isPremiumUser, List<String> triggers) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.location = location;
        this.alertPreferences = alertPreferences;
        this.isPremiumUser = isPremiumUser;
        this.triggers = triggers;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public LocationDTO getLocation() {
        return location;
    }
    
    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public List<String> getAlertPreferences() {
        return alertPreferences;
    }

    public void setAlertPreferences(List<String> alertPreferences) {
        this.alertPreferences = alertPreferences;
    }

    public boolean isPremiumUser() {
        return isPremiumUser;
    }

    public void setPremiumUser(boolean isPremiumUser) {
        this.isPremiumUser = isPremiumUser;
    }

    public List<String> getTriggers() {
        return triggers;
    }

    public void setTriggers(List<String> triggers) {
        this.triggers = triggers;
    }

    @Override
    public String toString() {
        return "UserDTO [id=" + id + ", name=" + name + ", email=" + email + ", phoneNumber=" + phoneNumber +
                ", location=" + location + ", alertPreferences=" + alertPreferences + 
                ", isPremiumUser=" + isPremiumUser + ", triggers=" + triggers + "]";
    }
}