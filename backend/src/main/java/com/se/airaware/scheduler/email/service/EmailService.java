package com.se.airaware.scheduler.email.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) throws MessagingException {
    	System.out.println("hello");
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Welcome to AirAware");	
        helper.setText("Welcome to AirAware – Your Personalized Alert System! 🌍\n\n" +
                "You're just one step away from unlocking real-time updates tailored to your preferences.\n\n" +
                "Your OTP code is: " + otp + "\n\n" +
                "Stay informed, stay safe!\n\n" +
                "Best Regards,\n" +
                "The AirAware Team");

        mailSender.send(message);
    }
}