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
}