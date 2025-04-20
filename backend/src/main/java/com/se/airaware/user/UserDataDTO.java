package com.se.airaware.user;

import java.util.List;

import com.se.airaware.user.User.Location;

public class UserDataDTO {
    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private Location location;
    private List<String> diseases;
    private Boolean premiumUser;

    public UserDataDTO() {
        super();
    }

    public UserDataDTO(String id, String name, String email, String phoneNumber, Location location, List<String> diseases,
            Boolean premiumUser) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.location = location;
        this.diseases = diseases;
        this.premiumUser = premiumUser;
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
    public Location getLocation() {
        return location;
    }
    public void setLocation(Location location) {
        this.location = location;
    }
    public List<String> getDiseases() {
        return diseases;
    }
    public void setDiseases(List<String> diseases) {
        this.diseases = diseases;
    }
    public Boolean getPremiumUser() {
        return premiumUser;
    }
    public void setPremiumUser(Boolean premiumUser) {
        this.premiumUser = premiumUser;
    }
    
    @Override
    public String toString() {
        return "UserDataDTO [id=" + id + ", name=" + name + ", email=" + email + ", phoneNumber=" + phoneNumber
                + ", location=" + location + ", diseases=" + diseases + ", premiumUser=" + premiumUser + "]";
    }
    
}