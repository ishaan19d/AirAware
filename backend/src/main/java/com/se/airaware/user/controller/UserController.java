package com.se.airaware.user.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se.airaware.dto.AuthRequest;
import com.se.airaware.dto.AuthResponse;
import com.se.airaware.jwt.JwtService;
import com.se.airaware.payload.response.ErrorResponse;
import com.se.airaware.scheduler.email.service.EmailService;
import com.se.airaware.scheduler.otp.service.OTPService;
import com.se.airaware.user.Notification;
import com.se.airaware.user.User;
import com.se.airaware.user.UserDataDTO;
import com.se.airaware.user.repository.NotificationRepository;
import com.se.airaware.user.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
    private UserService userService;
    private OTPService otpService;
    private EmailService emailService;
    private JwtService jwtService;

    @Autowired
    NotificationRepository notificationRepository;

    public UserController(UserService userService, OTPService otpService, EmailService emailService,
            JwtService jwtService) {
        super();
        this.userService = userService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    @PostMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String tokenHeader) {
        try {
            // Extract token from header (expected format: "Bearer <token>")
            String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7) : tokenHeader;
            // Extract email from token
            String email = jwtService.extractUserName(token);
            // Get user details by email
            User user = userService.getUserByEmail(email);
            UserDataDTO userDTO = new UserDataDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            userDTO.setPhoneNumber(user.getPhoneNumber());
            userDTO.setLocation(user.getLocation());
            userDTO.setDiseases(user.getDiseases());
            userDTO.setPremiumUser(user.isPremiumUser());
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
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

            String token = jwtService.generateToken(registeredUser.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (DuplicateKeyException e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.CONFLICT,
                    "Email or Phone already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    e.getMessage());
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
                    "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PatchMapping("/mark-premium")
    public ResponseEntity<?> markUserAsPremium(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.markUserAsPremium(email);
            return ResponseEntity.ok(Map.of("message", "User marked as premium successfully"));
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PatchMapping("/modify-disease")
    public ResponseEntity<?> modifyDisease(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String[] diseasesArray = request.get("diseases").split(",");
            List<String> diseases = Arrays.asList(diseasesArray);
            userService.modifyDiseases(email, diseases);
            return ResponseEntity.ok(Map.of("message", "Diseases added successfully"));
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getUserNotifications(@RequestHeader("Authorization") String tokenHeader) {
        try {
            // Extract JWT token from "Bearer <token>"
            String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7) : tokenHeader;

            // Extract email from token using jwtService
            String email = jwtService.extractUserName(token);

            // Fetch notifications using email
            List<Notification> notifications = notificationRepository.findByUserEmail(email);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

}