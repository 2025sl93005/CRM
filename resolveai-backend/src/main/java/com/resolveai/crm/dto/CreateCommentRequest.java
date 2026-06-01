package com.resolveai.crm.dto;

public class CreateCommentRequest {
    private Long issueId;
    private String message;

    // Constructors
    public CreateCommentRequest() {}

    public CreateCommentRequest(Long issueId, String message) {
        this.issueId = issueId;
        this.message = message;
    }

    // Getters and Setters
    public Long getIssueId() {
        return issueId;
    }

    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
