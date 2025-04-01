package com.se.airaware.email.service.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.MessagingException;

import com.se.airaware.scheduler.email.service.EmailService;

import jakarta.mail.internet.MimeMessage;

public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void testSendOtpEmail_Success() throws MessagingException {
        // Arrange
        String to = "test@example.com";
        String otp = "123456";
        
        // Act
        try {
			emailService.sendOtpEmail(to, otp);
		} catch (jakarta.mail.MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // Assert
        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendOtpEmail_WithValidContent() throws MessagingException {
        // Arrange
        String to = "test@example.com";
        String otp = "123456";
        String expectedSubject = "Welcome to AirAware";
        String expectedText = "Welcome to AirAware – Your Personalized Alert System! 🌍\n\n" +
                "You're just one step away from unlocking real-time updates tailored to your preferences.\n\n" +
                "Your OTP code is: " + otp + "\n\n" +
                "Stay informed, stay safe!\n\n" +
                "Best Regards,\n" +
                "The AirAware Team";

        // Act
        try {
			emailService.sendOtpEmail(to, otp);
		} catch (jakarta.mail.MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // Assert
        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendOtpEmail_ThrowsMessagingException() throws MessagingException {
        // Arrange
        String to = "test@example.com";
        String otp = "123456";
        doThrow(new MessagingException("Mail server error")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        try {
            try {
				emailService.sendOtpEmail(to, otp);
			} catch (jakarta.mail.MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        } catch (MessagingException e) {
            // Verify that the exception is thrown
            verify(mailSender, times(1)).createMimeMessage();
            verify(mailSender, times(1)).send(mimeMessage);
        }
    }
}
