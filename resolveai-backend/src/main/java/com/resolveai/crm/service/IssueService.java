package com.resolveai.crm.service;

import com.resolveai.crm.dto.IssueRequest;
import com.resolveai.crm.dto.IssueResponse;
import com.resolveai.crm.dto.AssignRequest;
import com.resolveai.crm.dto.EscalationRequest;
import com.resolveai.crm.dto.StatusUpdateRequest;
import com.resolveai.crm.dto.DetailedIssueDto;
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

    @org.springframework.beans.factory.annotation.Autowired
    private CommentService commentService;

    @org.springframework.beans.factory.annotation.Autowired
    private ActivityService activityService;

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

        boolean isReassignment = issue.getStatus() == IssueStatus.ESCALATED;
        issue.setAssignedCsr(csr);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue.setInQueue(false);
        Issue saved = issueRepository.save(issue);

        // Log reassignment activity
        if (isReassignment) {
            activityService.logActivity(issueId, "REASSIGNED", 
                "Manager reassigned escalated issue to " + csr.getFirstName() + " " + csr.getLastName(), 
                csr.getId());
        }

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

    @Transactional(readOnly = true)
    public DetailedIssueDto getDetailedIssue(Long issueId, String userEmail) {
        Issue issue = getIssueById(issueId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Check access permission
        checkIssueAccess(issue, user);

        DetailedIssueDto dto = new DetailedIssueDto();
        dto.setId(issue.getId());
        dto.setIssueTitle(issue.getIssueTitle());
        dto.setIssueDescription(issue.getIssueDescription());
        dto.setIssueType(issue.getIssueType().name());
        dto.setPriority(issue.getPriority().name());
        dto.setStatus(issue.getStatus().name());
        dto.setCustomerId(issue.getCustomer().getId());
        dto.setCustomerName(issue.getCustomer().getFirstName() + " " + issue.getCustomer().getLastName());
        dto.setCustomerEmail(issue.getCustomer().getEmail());

        if (issue.getAssignedCsr() != null) {
            dto.setAssignedCsrId(issue.getAssignedCsr().getId());
            dto.setAssignedCsrName(issue.getAssignedCsr().getFirstName() + " " + issue.getAssignedCsr().getLastName());
            dto.setAssignedCsrEmail(issue.getAssignedCsr().getEmail());
        }

        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        dto.setComments(commentService.getCommentsByIssueId(issueId));
        dto.setActivities(activityService.getActivitiesByIssueId(issueId));
        dto.setCommentCount(commentService.getCommentCount(issueId));
        dto.setSolution(issue.getSolution());
        dto.setManagerNotes(issue.getManagerNotes());

        return dto;
    }

    private void checkIssueAccess(Issue issue, User user) {
        switch (user.getRole()) {
            case CUSTOMER:
                if (!issue.getCustomer().getId().equals(user.getId())) {
                    throw new BadRequestException("You can only view your own issues");
                }
                break;
            case CSR:
                if (issue.getAssignedCsr() == null || !issue.getAssignedCsr().getId().equals(user.getId())) {
                    throw new BadRequestException("You can only view issues assigned to you");
                }
                break;
            case MANAGER:
                // Managers can view all issues
                break;
        }
    }

    public DetailedIssueDto addSolution(Long issueId, String solution, String csrEmail) {
        Issue issue = getIssueById(issueId);
        User csr = userRepository.findByEmail(csrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CSR not found"));

        // Only assigned CSR can add solution
        if (issue.getAssignedCsr() == null || !issue.getAssignedCsr().getId().equals(csr.getId())) {
            throw new BadRequestException("You can only add solution to issues assigned to you");
        }

        issue.setSolution(solution);
        issueRepository.save(issue);

        // Log activity
        activityService.logActivity(issueId, "SOLUTION_ADDED", "CSR provided a solution", csr.getId());

        // Send email to customer about the solution
        User customer = issue.getCustomer();
        emailService.sendSolutionNotification(
                customer.getEmail(),
                customer.getFirstName() + " " + customer.getLastName(),
                issue.getId(),
                issue.getIssueTitle(),
                solution,
                csr.getFirstName() + " " + csr.getLastName());

        return getDetailedIssue(issueId, csrEmail);
    }

    public DetailedIssueDto addManagerNotes(Long issueId, String managerNotes, String managerEmail) {
        Issue issue = getIssueById(issueId);
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        // Only manager can add notes
        if (manager.getRole() != Role.MANAGER) {
            throw new BadRequestException("Only managers can add notes");
        }

        // Manager notes can be added to escalated issues
        if (issue.getStatus() != IssueStatus.ESCALATED) {
            throw new BadRequestException("Manager notes can only be added to escalated issues");
        }

        issue.setManagerNotes(managerNotes);
        issueRepository.save(issue);

        // Log activity
        activityService.logActivity(issueId, "MANAGER_INPUT", "Manager provided input on escalated issue", manager.getId());

        // Send email to customer about manager's input
        User customer = issue.getCustomer();
        emailService.sendManagerInputNotification(
                customer.getEmail(),
                customer.getFirstName() + " " + customer.getLastName(),
                issue.getId(),
                issue.getIssueTitle(),
                managerNotes);

        return getDetailedIssue(issueId, managerEmail);
    }
}
