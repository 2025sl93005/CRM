package com.resolveai.crm.service;

import com.resolveai.crm.dto.FeedbackRequest;
import com.resolveai.crm.dto.FeedbackResponse;
import com.resolveai.crm.entity.*;
import com.resolveai.crm.exception.BadRequestException;
import com.resolveai.crm.exception.ResourceNotFoundException;
import com.resolveai.crm.repository.FeedbackRepository;
import com.resolveai.crm.repository.IssueRepository;
import com.resolveai.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("unchecked")
    public FeedbackResponse submitFeedback(FeedbackRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Issue issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        if (!issue.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You can only provide feedback for your own issues");
        }

        if (issue.getStatus() != IssueStatus.RESOLVED && issue.getStatus() != IssueStatus.CLOSED) {
            throw new BadRequestException("Feedback can only be submitted for resolved or closed issues");
        }

        if (feedbackRepository.existsByIssue(issue)) {
            throw new BadRequestException("Feedback already submitted for this issue");
        }

        Feedback feedback = Feedback.builder()
                .issue(issue)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return toResponse(feedbackRepository.save(feedback));
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .issueId(feedback.getIssue().getId())
                .issueTitle(feedback.getIssue().getIssueTitle())
                .customerId(feedback.getCustomer().getId())
                .customerName(feedback.getCustomer().getFirstName() + " " + feedback.getCustomer().getLastName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
