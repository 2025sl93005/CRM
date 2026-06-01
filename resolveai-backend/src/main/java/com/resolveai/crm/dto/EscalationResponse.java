package com.resolveai.crm.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EscalationResponse {
    private Long id;
    private Long issueId;
    private String issueTitle;
    private Long escalatedById;
    private String escalatedByName;
    private String escalationReason;
    private LocalDateTime escalatedAt;
    private boolean resolved;
}
