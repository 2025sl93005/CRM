package com.resolveai.crm.service;

import com.resolveai.crm.dto.CsrPerformanceDto;
import com.resolveai.crm.dto.ReportDto;
import com.resolveai.crm.entity.IssueStatus;
import com.resolveai.crm.entity.Role;
import com.resolveai.crm.entity.User;
import com.resolveai.crm.repository.EscalationRepository;
import com.resolveai.crm.repository.FeedbackRepository;
import com.resolveai.crm.repository.IssueRepository;
import com.resolveai.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final FeedbackRepository feedbackRepository;
    private final EscalationRepository escalationRepository;

    public List<CsrPerformanceDto> getCsrPerformance() {
        List<User> csrs = userRepository.findAllByRole(Role.CSR);

        return csrs.stream().map(csr -> {
            long total = issueRepository.countByAssignedCsr(csr);
            long resolved = issueRepository.countByAssignedCsrAndStatus(csr, IssueStatus.RESOLVED);
            long pending = issueRepository.countByAssignedCsrAndStatus(csr, IssueStatus.IN_PROGRESS)
                    + issueRepository.countByAssignedCsrAndStatus(csr, IssueStatus.ACCEPTED)
                    + issueRepository.countByAssignedCsrAndStatus(csr, IssueStatus.OPEN);
            long escalations = escalationRepository.countByEscalatedBy(csr);

            double avgRating = 0.0;
            Double r = feedbackRepository.avgRatingByCsr(csr);
            if (r != null) avgRating = r;

            double avgResolution = issueRepository.findByAssignedCsr(csr).stream()
                    .filter(i -> i.getResolvedAt() != null && i.getCreatedAt() != null)
                    .mapToLong(i -> Duration.between(i.getCreatedAt(), i.getResolvedAt()).toHours())
                    .average()
                    .orElse(0.0);

            return CsrPerformanceDto.builder()
                    .csrId(csr.getId())
                    .csrName(csr.getFirstName() + " " + csr.getLastName())
                    .csrEmail(csr.getEmail())
                    .totalIssues(total)
                    .resolvedIssues(resolved)
                    .pendingIssues(pending)
                    .escalationCount(escalations)
                    .avgResolutionTimeHours(avgResolution)
                    .avgFeedbackRating(avgRating)
                    .build();
        }).collect(Collectors.toList());
    }

    public ReportDto getReport() {
        Map<String, Long> statusSummary = new LinkedHashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            statusSummary.put(status.name(), issueRepository.countByStatus(status));
        }

        Double overallRating = feedbackRepository.overallAvgRating();

        return ReportDto.builder()
                .issueStatusSummary(statusSummary)
                .csrPerformance(getCsrPerformance())
                .overallAvgRating(overallRating != null ? overallRating : 0.0)
                .totalIssues(issueRepository.count())
                .totalResolved(issueRepository.countByStatus(IssueStatus.RESOLVED))
                .totalEscalated(issueRepository.countByStatus(IssueStatus.ESCALATED))
                .totalFeedbacks(feedbackRepository.count())
                .build();
    }
}
