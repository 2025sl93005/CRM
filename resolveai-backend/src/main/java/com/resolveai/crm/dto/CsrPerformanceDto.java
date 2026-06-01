package com.resolveai.crm.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CsrPerformanceDto {
    private Long csrId;
    private String csrName;
    private String csrEmail;
    private long totalIssues;
    private long resolvedIssues;
    private long pendingIssues;
    private long escalationCount;
    private double avgResolutionTimeHours;
    private double avgFeedbackRating;
}
