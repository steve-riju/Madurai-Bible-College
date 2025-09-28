package com.maduraibiblecollege.config;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.maduraibiblecollege.entity.Role;


@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    private final String portalUrl ="http://localhost:4200/"; // Remember to change this to your production URL
    String resetLink = "http://localhost:4200/auth/reset-password?token=";
    
    public void sendPasswordEmail(String to, String username, String password, Role role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to the Madurai Bible College Portal");

        String emailBody = String.format(
            "Dear %s,\n\n" +
            "We are delighted to welcome you to Madurai Bible College. Your account for our online educational portal has been successfully created.\n\n" +
            "Please use the following temporary credentials to log in.\n\n" +
            "  • Portal Login Page: %s\n" + 
            "  • Username: %s\n" +
            "  • Temporary Password: %s\n" +
            "  • Your Role: %s\n\n" +
            "For your security, please log in at your earliest convenience and change your temporary password through your account settings.\n\n" +
            "If you have any questions or require assistance, please do not hesitate to contact our administration office.\n\n" +
            "Sincerely,\n" +
            "The Administration\n" +
            "Madurai Bible College",
            username, portalUrl, username, password, role
        );

        message.setText(emailBody);
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String to, String resetToken) {
        // Construct the full URL for the reset link properly
    	resetLink += resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request for Madurai Bible College Portal");

        String emailBody = String.format(
            "Hello,\n\n" +
            "We received a request to reset the password for the account associated with this email address.\n\n" +
            "If you did not make this request, please disregard this email. Your account is still secure, and no further action is required.\n\n" +
            "To reset your password, please click the link below. For security reasons, this link will expire in 15 minutes.\n\n" +
            "%s\n\n" + // This is for the reset link
            "If you continue to have trouble or have any questions, please contact our administration office.\n\n" +
            "Sincerely,\n" +
            "The Administration\n" +
            "Madurai Bible College",
            resetLink
        );

        message.setText(emailBody);
        mailSender.send(message);
    }
}