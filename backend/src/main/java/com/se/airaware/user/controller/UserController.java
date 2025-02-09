package com.se.airaware.user.controller;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.se.airaware.dto.AuthRequest;
import com.se.airaware.dto.AuthResponse;
import com.se.airaware.payload.response.ErrorResponse;
import com.se.airaware.user.User;
import com.se.airaware.user.service.UserService;

import jakarta.validation.Valid;

@RestController
public class UserController {
	private UserService userService;
	
	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	@PostMapping("/register-user")
	public ResponseEntity<?> registeruser(@RequestBody @Valid User user) {
	    try {
	        User registeredUser = userService.register(user);
	        return ResponseEntity.ok(registeredUser);
	    } catch (DuplicateKeyException e) {
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.CONFLICT,
	            "Email or Phone already exists"
	        );
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
	    } catch (Exception e) {
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.INTERNAL_SERVER_ERROR,
	            e.getMessage()
	        );
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	    }
	}
	
	@PostMapping("/login-user")
	public ResponseEntity<?> loginuser(@RequestBody @Valid AuthRequest authRequest) {
	    try {
	        String token = userService.verify(authRequest);
	        AuthResponse loginResponse = new AuthResponse(token);
	        return ResponseEntity.ok(loginResponse);
	    } catch (BadCredentialsException e) {
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.UNAUTHORIZED,
	            "Invalid username or password"
	        );
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
	    } catch (Exception e) {
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.INTERNAL_SERVER_ERROR,
	            e.getMessage()
	        );
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	    }
	}
}

