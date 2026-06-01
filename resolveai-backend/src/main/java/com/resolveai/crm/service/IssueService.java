package com.resolveai.crm.service;

import com.resolveai.crm.dto.IssueRequest;
import com.resolveai.crm.dto.IssueResponse;
import com.resolveai.crm.dto.AssignRequest;
import com.resolveai.crm.dto.EscalationRequest;
import com.resolveai.crm.dto.StatusUpdateRequest;
import com.resolveai.crm.entity.*;
import com.resolveai.crm.exception.BadRequestException;
import com.resolveai.crm.exception.ResourceNotFoundException;
import com.resolveai.crm.repository.EscalationRepository;
import com.resolveai.crm.repository.IssueRepository;
import com.resolveai.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final EscalationRepository escalationRepository;
    private final PriorityDetectionService priorityDetectionService;
    private final EmailService emailService;

    @SuppressWarnings("unchecked")
    public IssueResponse createIssue(IssueRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Priority priority = priorityDetectionService.detect(
                request.getIssueTitle(), request.getIssueDescription());

        Issue issue = Issue.builder()
                .issueTitle(request.getIssueTitle())
                .issueDescription(request.getIssueDescription())
                .issueType(request.getIssueType())
                .priority(priority)
                .customer(customer)
                .status(IssueStatus.OPEN)
                .inQueue(true)
                .build();

        Issue saved = issueRepository.save(issue);

        emailService.sendIssueCreated(
                customer.getEmail(),
                customer.getFirstName() + " " + customer.getLastName(),
                saved.getId(),
                saved.getIssueTitle());

        return toResponse(saved);
    }

    public List<IssueResponse> getMyIssues(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return issueRepository.findByCustomer(customer)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    public IssueResponse assignIssue(Long issueId, AssignRequest request) {
        Issue issue = getIssueById(issueId);
        User csr = userRepository.findById(request.getCsrId())
                .orElseThrow(() -> new ResourceNotFoundException("CSR not found"));

        if (csr.getRole() != Role.CSR) {
            throw new BadRequestException("User is not a CSR");
        }

        issue.setAssignedCsr(csr);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue.setInQueue(false);
        Issue saved = issueRepository.save(issue);

        User customer = issue.getCustomer();
        emailService.sendIssueAssigned(
                customer.getEmail(),
                customer.getFirstName() + " " + customer.getLastName(),
                saved.getId(),
                saved.getIssueTitle(),
                csr.getFirstName() + " " + csr.getLastName());

        emailService.sendCsrAssignedNotification(
                csr.getEmail(),
                csr.getFirstName() + " " + csr.getLastName(),
                saved.getId(),
                saved.getIssueTitle(),
                customer.getFirstName() + " " + customer.getLastName());

        return toResponse(saved);
    }

    public IssueResponse sendToQueue(Long issueId) {
        Issue issue = getIssueById(issueId);
        issue.setInQueue(true);
        issue.setAssignedCsr(null);
        issue.setStatus(IssueStatus.OPEN);
        return toResponse(issueRepository.save(issue));
    }

    public List<IssueResponse> getQueueIssues() {
        return issueRepository.findByInQueueTrueAndAssignedCsrIsNull()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<IssueResponse> getAssignedIssues(String csrEmail) {
        User csr = userRepository.findByEmail(csrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CSR not found"));
        return issueRepository.findByAssignedCsr(csr)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public IssueResponse pullFromQueue(Long issueId, String csrEmail) {
        Issue issue = getIssueById(issueId);
        if (!issue.isInQueue()) {
            throw new BadRequestException("Issue is not in queue");
        }
        User csr = userRepository.findByEmail(csrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CSR not found"));

        issue.setAssignedCsr(csr);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue.setInQueue(false);
        Issue saved = issueRepository.save(issue);

        User customer = issue.getCustomer();
        emailService.sendCsrAssignedNotification(
                csr.getEmail(),
                csr.getFirstName() + " " + csr.getLastName(),
                saved.getId(),
                saved.getIssueTitle(),
                customer.getFirstName() + " " + customer.getLastName());

        return toResponse(saved);
    }

    public IssueResponse updateStatus(Long issueId, StatusUpdateRequest request, String csrEmail) {
        Issue issue = getIssueById(issueId);
        IssueStatus newStatus = request.getStatus();
        issue.setStatus(newStatus);

        if (newStatus == IssueStatus.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
            User customer = issue.getCustomer();
            emailService.sendIssueResolved(
                    customer.getEmail(),
                    customer.getFirstName() + " " + customer.getLastName(),
                    issue.getId(),
                    issue.getIssueTitle());
            emailService.sendFeedbackRequest(
                    customer.getEmail(),
                    customer.getFirstName() + " " + customer.getLastName(),
                    issue.getId(),
                    issue.getIssueTitle());
        } else if (newStatus == IssueStatus.CLOSED) {
            User customer = issue.getCustomer();
            emailService.sendIssueClosed(
                    customer.getEmail(),
                    customer.getFirstName() + " " + customer.getLastName(),
                    issue.getId(),
                    issue.getIssueTitle());
        }

        return toResponse(issueRepository.save(issue));
    }

    @SuppressWarnings("unchecked")
    public IssueResponse escalateIssue(Long issueId, EscalationRequest request, String csrEmail) {
        Issue issue = getIssueById(issueId);
        User csr = userRepository.findByEmail(csrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CSR not found"));

        issue.setStatus(IssueStatus.ESCALATED);
        issue.setEscalationReason(request.getEscalationReason());
        issueRepository.save(issue);

        Escalation escalation = Escalation.builder()
                .issue(issue)
                .escalatedBy(csr)
                .escalationReason(request.getEscalationReason())
                .build();
        escalationRepository.save(escalation);

        // Notify all managers about escalation
        List<User> managers = userRepository.findAllByRole(Role.MANAGER);
        for (User manager : managers) {
            emailService.sendEscalationNotification(
                    manager.getEmail(),
                    manager.getFirstName() + " " + manager.getLastName(),
                    issue.getId(),
                    issue.getIssueTitle(),
                    request.getEscalationReason(),
                    csr.getFirstName() + " " + csr.getLastName());
        }

        return toResponse(issue);
    }

    public List<IssueResponse> getEscalatedIssues() {
        return issueRepository.findEscalatedIssues()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private Issue getIssueById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));
    }

    public IssueResponse toResponse(Issue issue) {
        return IssueResponse.builder()
                .id(issue.getId())
                .issueTitle(issue.getIssueTitle())
                .issueDescription(issue.getIssueDescription())
                .issueType(issue.getIssueType())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .customerId(issue.getCustomer().getId())
                .customerName(issue.getCustomer().getFirstName() + " " + issue.getCustomer().getLastName())
                .customerEmail(issue.getCustomer().getEmail())
                .assignedCsrId(issue.getAssignedCsr() != null ? issue.getAssignedCsr().getId() : null)
                .assignedCsrName(issue.getAssignedCsr() != null
                        ? issue.getAssignedCsr().getFirstName() + " " + issue.getAssignedCsr().getLastName()
                        : null)
                .escalationReason(issue.getEscalationReason())
                .inQueue(issue.isInQueue())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .resolvedAt(issue.getResolvedAt())
                .build();
    }
}
