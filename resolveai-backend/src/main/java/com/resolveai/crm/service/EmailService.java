package com.resolveai.crm.service;

import com.resolveai.crm.entity.EmailLog;
import com.resolveai.crm.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Value("${spring.mail.from:noreply@resolveai.com}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body, String eventType, Long issueId) {
        EmailLog emailLog = EmailLog.builder()
                .recipient(to)
                .subject(subject)
                .body(body)
                .eventType(eventType)
                .issueId(issueId)
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            emailLog.setSuccess(true);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            emailLog.setSuccess(false);
            emailLog.setErrorMessage(e.getMessage());
        }

        emailLogRepository.save(emailLog);
    }

    @Async
    public void sendIssueCreated(String customerEmail, String customerName, Long issueId, String issueTitle) {
        String subject = "[ResolveAI] Issue Created: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                Your issue has been successfully created.
                
                Issue ID: %d
                Title: %s
                
                We will assign a Customer Service Representative to handle your issue shortly.
                
                Thank you for reaching out to us.
                
                Best regards,
                ResolveAI Support Team
                """, customerName, issueId, issueTitle);
        sendEmail(customerEmail, subject, body, "ISSUE_CREATED", issueId);
    }

    @Async
    public void sendIssueAssigned(String customerEmail, String customerName, Long issueId, String issueTitle, String csrName) {
        String subject = "[ResolveAI] Issue Assigned: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                Your issue (ID: %d) has been assigned to %s.
                
                Title: %s
                
                Your issue is now being actively worked on.
                
                Best regards,
                ResolveAI Support Team
                """, customerName, issueId, csrName, issueTitle);
        sendEmail(customerEmail, subject, body, "ISSUE_ASSIGNED", issueId);
    }

    @Async
    public void sendIssueResolved(String customerEmail, String customerName, Long issueId, String issueTitle) {
        String subject = "[ResolveAI] Issue Resolved: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                Your issue (ID: %d - %s) has been resolved.
                
                Please log in to provide your feedback and rate our service.
                
                Best regards,
                ResolveAI Support Team
                """, customerName, issueId, issueTitle);
        sendEmail(customerEmail, subject, body, "ISSUE_RESOLVED", issueId);
    }

    @Async
    public void sendIssueClosed(String customerEmail, String customerName, Long issueId, String issueTitle) {
        String subject = "[ResolveAI] Issue Closed: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                Your issue (ID: %d - %s) has been closed.
                
                Thank you for using ResolveAI. We hope your experience was satisfactory.
                
                Best regards,
                ResolveAI Support Team
                """, customerName, issueId, issueTitle);
        sendEmail(customerEmail, subject, body, "ISSUE_CLOSED", issueId);
    }

    @Async
    public void sendFeedbackRequest(String customerEmail, String customerName, Long issueId, String issueTitle) {
        String subject = "[ResolveAI] Please share your feedback";
        String body = String.format("""
                Dear %s,
                
                We hope your issue (ID: %d - %s) was resolved to your satisfaction.
                
                Please log in and share your feedback to help us improve our services.
                
                Best regards,
                ResolveAI Support Team
                """, customerName, issueId, issueTitle);
        sendEmail(customerEmail, subject, body, "FEEDBACK_REQUEST", issueId);
    }

    @Async
    public void sendCsrAssignedNotification(String csrEmail, String csrName, Long issueId, String issueTitle, String customerName) {
        String subject = "[ResolveAI] New Issue Assigned to You: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                A new issue has been assigned to you.
                
                Issue ID: %d
                Title: %s
                Customer: %s
                
                Please log in to review and start working on this issue.
                
                Best regards,
                ResolveAI Support Team
                """, csrName, issueId, issueTitle, customerName);
        sendEmail(csrEmail, subject, body, "CSR_ASSIGNED", issueId);
    }

    @Async
    public void sendEscalationNotification(String managerEmail, String managerName, Long issueId, String issueTitle, String escalationReason, String csrName) {
        String subject = "[ResolveAI] Issue Escalated: " + issueTitle;
        String body = String.format("""
                Dear %s,
                
                An issue has been escalated and requires your attention.
                
                Issue ID: %d
                Title: %s
                Escalated By: %s
                Reason: %s
                
                Please log in to review and take appropriate action.
                
                Best regards,
                ResolveAI Support Team
                """, managerName, issueId, issueTitle, csrName, escalationReason);
        sendEmail(managerEmail, subject, body, "ISSUE_ESCALATED", issueId);
    }

    public void sendSolutionNotification(String customerEmail, String customerName, Long issueId, String issueTitle, String solution, String csrName) {
        String subject = "Solution Provided for Your Issue #" + issueId;
        String body = String.format("""
                Dear %s,
                
                Our support team has provided a solution for your issue: %s
                
                <strong>Solution:</strong>
                %s
                
                The support representative %s will be updating you further with the resolution status.
                
                Please reply if you have any questions.
                
                Best regards,
                ResolveAI CRM Support Team
                """, customerName, issueTitle, solution, csrName);
        sendEmail(customerEmail, subject, body, "SOLUTION_PROVIDED", issueId);
    }

    public void sendManagerInputNotification(String customerEmail, String customerName, Long issueId, String issueTitle, String managerNotes) {
        String subject = "Manager Review for Your Issue #" + issueId;
        String body = String.format("""
                Dear %s,
                
                Your escalated issue has been reviewed by our management team.
                
                <strong>Manager's Input:</strong>
                %s
                
                We are working on the best resolution for you. You will be notified once further action is taken.
                
                Thank you for your patience.
                
                Best regards,
                ResolveAI CRM Support Team
                """, customerName, managerNotes);
        sendEmail(customerEmail, subject, body, "MANAGER_INPUT_PROVIDED", issueId);
    }
}
