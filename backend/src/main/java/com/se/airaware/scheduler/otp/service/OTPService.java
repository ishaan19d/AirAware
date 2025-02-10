package com.se.airaware.scheduler.otp.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OTPService {
    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOTP(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        otpStorage.put(email, otp);
        return otp;
    }

    public boolean verifyOTP(String email, String inputOtp) {
        return otpStorage.containsKey(email) && otpStorage.get(email).equals(inputOtp);
    }

    public void removeOTP(String email) {
        otpStorage.remove(email);
    }
}