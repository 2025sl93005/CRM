package com.resolveai.crm.dto;

import java.time.LocalDateTime;

public class ActivityDto {
    private Long id;
    private Long issueId;
    private String actionType;
    private String actionDescription;
    private Long createdById;
    private String createdByName;
    private String createdByEmail;
    private String createdByRole;
    private LocalDateTime createdAt;

    // Constructors
    public ActivityDto() {}

    public ActivityDto(Long id, Long issueId, String actionType, String actionDescription,
                       Long createdById, String createdByName, String createdByEmail, 
                       String createdByRole, LocalDateTime createdAt) {
        this.id = id;
        this.issueId = issueId;
        this.actionType = actionType;
        this.actionDescription = actionDescription;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.createdByEmail = createdByEmail;
        this.createdByRole = createdByRole;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIssueId() {
        return issueId;
    }

    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionDescription() {
        return actionDescription;
    }

    public void setActionDescription(String actionDescription) {
        this.actionDescription = actionDescription;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public String getCreatedByRole() {
        return createdByRole;
    }

    public void setCreatedByRole(String createdByRole) {
        this.createdByRole = createdByRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
