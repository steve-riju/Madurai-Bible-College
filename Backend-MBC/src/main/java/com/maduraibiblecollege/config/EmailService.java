package com.maduraibiblecollege.config;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    private final String portalUrl ="https://campusmbc.org/";
    String resetLink = "https://campusmbc.org/auth/reset-password?token=";
    
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

    @Async
    public void sendNewLeaveRequestNotification(List<String> adminEmails, LeaveRequestDto leaveRequest) {
        if (adminEmails == null || adminEmails.isEmpty()) {
            return;
        }

        String subject = "New Leave Request - " + leaveRequest.getStudentName();
        String body = String.format(
                "A new leave request has been submitted.\n\n" +
                "Student: %s\n" +
                "Dates: %s to %s\n" +
                "Leave Type: %s\n" +
                "Reason: %s\n\n" +
                "Please review this request in the Madurai Bible College portal.",
                leaveRequest.getStudentName(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getLeaveType(),
                leaveRequest.getReason()
        );

        for (String adminEmail : adminEmails) {
            sendSimpleEmail(adminEmail, subject, body);
        }
    }

    @Async
    public void sendLeaveStatusNotification(String studentEmail, LeaveRequestDto leaveRequest) {
        if (studentEmail == null || studentEmail.isBlank()) {
            return;
        }

        String subject = "Leave Request " + leaveRequest.getStatus();
        String body = String.format(
                "Your leave request has been %s.\n\n" +
                "Dates: %s to %s\n" +
                "Leave Type: %s\n" +
                "Reason: %s\n" +
                "Admin Remarks: %s\n\n" +
                "Please log in to the Madurai Bible College portal for more details.",
                leaveRequest.getStatus(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getLeaveType(),
                leaveRequest.getReason(),
                leaveRequest.getAdminRemarks() != null ? leaveRequest.getAdminRemarks() : "-"
        );

        sendSimpleEmail(studentEmail, subject, body);
    }

    private void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            System.err.println("Failed to send email to " + to + ": " + ex.getMessage());
        }
    }
}
