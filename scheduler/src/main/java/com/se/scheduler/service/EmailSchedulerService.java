package com.se.scheduler.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.se.scheduler.model.Notification;
import com.se.scheduler.repository.NotificationRepository;

@Service
public class EmailSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(EmailSchedulerService.class);
    
    private final JavaMailSender mailSender;
    
    @Value("${app.notification.sender}")
    private String senderEmail;

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    public EmailSchedulerService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Schedules an email alert for a user about upcoming disease risks
     */
    @Async
    public void scheduleEmailAlert(String userEmail, List<String> diseases) {
        try {
            // In a real implementation, you might want to use a more sophisticated
            // scheduling system like Quartz, but this demonstrates the concept
            
            // Create email content
            String subject = "Health Alert: Air Quality Warning";
            String content = buildEmailContent(diseases);
            
            // Create and configure the email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(userEmail);
            message.setSubject(subject);
            message.setText(content);
            
            // Send email (in a real system, you'd schedule this)
            mailSender.send(message);

            Notification notificaton=notificationRepository.save(new Notification(
                userEmail,
                "PREMIUM",
                subject,
                content,
                diseases
            ));

            System.out.println("Notification saved: " + notificaton);
            logger.info("Email alert sent to {}", userEmail);
        } catch (Exception e) {
            logger.error("Failed to schedule email for {}: {}", userEmail, e.getMessage(), e);
        }
    }

    @Async
    public void scheduleFreeUserEmailAlert(String userEmail, List<String> pollutants) {
        try {
            String subject = "Air Quality Alert: Unsafe Pollution Levels";
            String content = buildFreeUserEmailContent(pollutants);
    
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(userEmail);
            message.setSubject(subject);
            message.setText(content);
    
            mailSender.send(message);

            Notification notification=notificationRepository.save(new Notification(
                userEmail,
                "FREE",
                subject,
                content,
                pollutants
            ));
            
            System.out.println("Notification saved: " + notification);
            logger.info("Air quality alert email sent to FREE user {}", userEmail);
        } catch (Exception e) {
            logger.error("Failed to send air quality alert to FREE user {}: {}", userEmail, e.getMessage(), e);
        }
    }
    
    /**
     * Builds the content of the email based on the predicted diseases
     */
    private String buildEmailContent(List<String> diseases) {
        StringBuilder builder = new StringBuilder();
        builder.append("Dear User,\n\n");
        builder.append("Based on recent air quality data in your area, there is an increased risk of the following conditions:\n\n");
        
        for (String disease : diseases) {
            builder.append("- ").append(disease).append("\n");
        }
        
        builder.append("\nPlease take necessary precautions and consult with a healthcare professional if you experience any symptoms.\n\n");
        builder.append("Stay healthy,\nAirAware Team");
        
        return builder.toString();
    }
    
        private String buildFreeUserEmailContent(List<String> pollutants) {
            return "Dear User,\n\n"
                 + "Based on recent air quality data in your area, there is an increased concentration of the following pollutants registered: "
                 + String.join(", ", pollutants) + "."
                 + "\n\nPlease take necessary precautions.\n\n"
                 + "Stay healthy,\nAirAware Team";
        }
}