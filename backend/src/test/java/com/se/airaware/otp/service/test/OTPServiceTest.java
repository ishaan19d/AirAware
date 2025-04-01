package com.se.airaware.otp.service.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.se.airaware.scheduler.otp.service.OTPService;

class OTPServiceTest {

    private OTPService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OTPService();
    }

    @Test
    void testGenerateOTP() {
        String email = "test@example.com";
        
        // Generate OTP for the email
        String otp = otpService.generateOTP(email);

        // Verify OTP is generated correctly
        assertNotNull(otp);
        assertEquals(6, otp.length());  // OTP should be 6 digits long
    }

    @Test
    void testVerifyOTP_Success() {
        String email = "test@example.com";
        
        // Generate OTP
        String generatedOtp = otpService.generateOTP(email);
        
        // Verify the OTP
        boolean isVerified = otpService.verifyOTP(email, generatedOtp);
        
        assertTrue(isVerified);
    }

    @Test
    void testVerifyOTP_Failure() {
        String email = "test@example.com";
        
        // Generate OTP
        String generatedOtp = otpService.generateOTP(email);
        
        // Try verifying with wrong OTP
        boolean isVerified = otpService.verifyOTP(email, "wrongOtp");
        
        assertFalse(isVerified);
    }

    @Test
    void testRemoveOTP() {
        String email = "test@example.com";
        
        // Generate OTP
        otpService.generateOTP(email);
        
        // Remove the OTP
        otpService.removeOTP(email);
        
        // Verify the OTP is removed
        boolean isVerified = otpService.verifyOTP(email, "wrongOtp");
        assertFalse(isVerified);  // OTP should no longer be valid
    }
}
