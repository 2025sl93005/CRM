package com.resolveai.crm.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DetailedIssueDto {
    private Long id;
    private String issueTitle;
    private String issueDescription;
    private String issueType;
    private String priority;
    private String status;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long assignedCsrId;
    private String assignedCsrName;
    private String assignedCsrEmail;
    private Long managerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDto> comments;
    private List<ActivityDto> activities;
    private long commentCount;
    private String solution;
    private String managerNotes;

    // Constructors
    public DetailedIssueDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssueTitle() {
        return issueTitle;
    }

    public void setIssueTitle(String issueTitle) {
        this.issueTitle = issueTitle;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getAssignedCsrId() {
        return assignedCsrId;
    }

    public void setAssignedCsrId(Long assignedCsrId) {
        this.assignedCsrId = assignedCsrId;
    }

    public String getAssignedCsrName() {
        return assignedCsrName;
    }

    public void setAssignedCsrName(String assignedCsrName) {
        this.assignedCsrName = assignedCsrName;
    }

    public String getAssignedCsrEmail() {
        return assignedCsrEmail;
    }

    public void setAssignedCsrEmail(String assignedCsrEmail) {
        this.assignedCsrEmail = assignedCsrEmail;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CommentDto> getComments() {
        return comments;
    }

    public void setComments(List<CommentDto> comments) {
        this.comments = comments;
    }

    public List<ActivityDto> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivityDto> activities) {
        this.activities = activities;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(long commentCount) {
        this.commentCount = commentCount;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getManagerNotes() {
        return managerNotes;
    }

    public void setManagerNotes(String managerNotes) {
        this.managerNotes = managerNotes;
    }
}
