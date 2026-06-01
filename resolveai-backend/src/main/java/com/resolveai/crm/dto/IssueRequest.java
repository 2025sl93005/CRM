package com.resolveai.crm.dto;

import com.resolveai.crm.entity.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueRequest {

    @NotBlank
    private String issueTitle;

    @NotBlank
    private String issueDescription;

    @NotNull
    private IssueType issueType;
}
