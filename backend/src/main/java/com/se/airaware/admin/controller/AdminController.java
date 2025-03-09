package com.se.airaware.admin.controller;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se.airaware.admin.Admin;
import com.se.airaware.admin.service.AdminService;
import com.se.airaware.dto.AuthResponse;
import com.se.airaware.payload.response.ErrorResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class AdminController {
	private AdminService adminService;

	public AdminController(AdminService adminService) {
		super();
		this.adminService = adminService;
	}
	
	@PostMapping("/register-admin")
	public ResponseEntity<?> registerAdmin(@RequestBody @Valid Admin admin) {
	    try {
	        Admin registeredAdmin = adminService.register(admin);
	        return ResponseEntity.ok(registeredAdmin);
	    } catch (DuplicateKeyException e) {
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.CONFLICT,
	            "Username already exists"
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
	
	@PostMapping("/login-admin")
	public ResponseEntity<?> loginAdmin(@RequestBody @Valid Admin admin) {
	    try {
	        String token = adminService.verify(admin);
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
