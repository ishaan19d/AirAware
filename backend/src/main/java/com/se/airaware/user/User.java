package com.se.airaware.user;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Document(collection = "user")
public class User {
	@Id
    private String id;

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Phone number cannot be blank")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    @Indexed(unique = true)
    private String phoneNumber;
    
    private Location location;

    private List<String> alertPreferences;
    private boolean isPremiumUser;
    private List<String> diseases;
    
    public static class Location {
        @Indexed
        private String city;
        
        @Indexed
        private String state;
        
        public Location() {
        }
        
        public Location(String city, String state) {
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
            return "Location{" +
                    "city='" + city + '\'' +
                    ", state='" + state + '\'' +
                    '}';
        }
    }
	
	public User() {
		super();
	}

    public User(String id, String name, String email, String password, String phoneNumber,
            Location location, List<String> alertPreferences, boolean isPremiumUser, List<String> diseases) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.location = location;
    this.alertPreferences = alertPreferences;
    this.isPremiumUser = isPremiumUser;
    this.diseases = diseases;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public List<String> getDiseases() {
		return diseases;
	}

	public void setDiseases(List<String> diseases) {
		this.diseases = diseases;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", phoneNumber="
				+ phoneNumber + ", location=" + location + ", alertPreferences=" + alertPreferences + ", isPremiumUser="
				+ isPremiumUser + ", diseases=" + diseases + "]";
	}
}