package com.resolveai.crm.dto;

import com.resolveai.crm.entity.IssueStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull
    private IssueStatus status;
}
