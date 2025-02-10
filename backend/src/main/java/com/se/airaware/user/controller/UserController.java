package com.se.airaware.user.controller;

import java.util.Map;

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
import com.se.airaware.scheduler.email.service.EmailService;
import com.se.airaware.scheduler.otp.service.OTPService;
import com.se.airaware.user.User;
import com.se.airaware.user.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@RestController
public class UserController {
	private UserService userService;
	private OTPService otpService;
	private EmailService emailService;

	public UserController(UserService userService, OTPService otpService, EmailService emailService) {
		super();
		this.userService = userService;
		this.otpService = otpService;
		this.emailService = emailService;
	}
	
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = otpService.generateOTP(email);

        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to send OTP"));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpService.verifyOTP(email, otp)) {
            otpService.removeOTP(email);
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("error", "Invalid OTP"));
        }
    }

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
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

