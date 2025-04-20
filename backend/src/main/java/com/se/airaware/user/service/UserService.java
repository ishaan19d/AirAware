package com.se.airaware.user.service;

import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.se.airaware.dto.AuthRequest;
import com.se.airaware.jwt.JwtService;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;

import jakarta.validation.Valid;

@Service
public class UserService {
	
	private UserRepository userRepository;
	private BCryptPasswordEncoder encoder;
	private AuthenticationManager authManager;
	private JwtService jwtService;
	
	public UserService(UserRepository userRepository, BCryptPasswordEncoder encoder,
			AuthenticationManager authManager, JwtService jwtService) {
		super();
		this.userRepository = userRepository;
		this.encoder = encoder;
		this.authManager = authManager;
		this.jwtService = jwtService;
	}
	
    public User register(@Valid User user) {
        if (userRepository.existsByEmail(user.getEmail())||userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new DuplicateKeyException("Email already exists: " + user.getEmail());
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String verify(@Valid AuthRequest authRequest) throws Exception {
    	try {
    		Authentication authentication = authManager.authenticate(
    				new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
    		if (authentication.isAuthenticated()) {
    			return jwtService.generateToken(authRequest.getUsername());
    		}
    	} catch (AuthenticationException e) {
    		System.out.println("Exception in login" + e);
    		throw new BadCredentialsException("Invalid email or password");
    	}
    	return null;
    }
    
    public void markUserAsPremium(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPremiumUser(true);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }
    
    public List<User> getPaidUsersByLocation(String city, String State) {
    	return userRepository.findByIsPremiumUserTrueAndLocation_CityIgnoreCaseAndLocation_StateIgnoreCase(city, State);
    }
	
	public List<User> getFreeUsersByLocation(String city, String State) {
    	return userRepository.findByIsPremiumUserFalseAndLocation_CityIgnoreCaseAndLocation_StateIgnoreCase(city, State);
    }

    public void modifyDiseases(String email, List<String> diseases) {
        User user = userRepository.findByEmail(email);
		if (user != null) {
			user.setDiseases(diseases);
			userRepository.save(user);
		} else {
			throw new RuntimeException("User not found with email: " + email);
		}
    }

	public User getUserByEmail(String email) {
		User user = userRepository.findByEmail(email);
		if (user != null) {
			return user;
		} else {
			throw new RuntimeException("User not found with email: " + email);
		}
	}

	public User checkEmailValidity(String email){
		return userRepository.findByEmail(email);
	}
}

