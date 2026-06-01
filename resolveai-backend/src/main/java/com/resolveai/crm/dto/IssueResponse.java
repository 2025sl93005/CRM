package com.resolveai.crm.dto;

import com.resolveai.crm.entity.IssueStatus;
import com.resolveai.crm.entity.IssueType;
import com.resolveai.crm.entity.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class IssueResponse {
    private Long id;
    private String issueTitle;
    private String issueDescription;
    private IssueType issueType;
    private IssueStatus status;
    private Priority priority;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long assignedCsrId;
    private String assignedCsrName;
    private String escalationReason;
    private boolean inQueue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
