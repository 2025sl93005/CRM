package com.resolveai.crm.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ReportDto {
    private Map<String, Long> issueStatusSummary;
    private List<CsrPerformanceDto> csrPerformance;
    private double overallAvgRating;
    private long totalIssues;
    private long totalResolved;
    private long totalEscalated;
    private long totalFeedbacks;
}
