package com.resolveai.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EscalationRequest {

    @NotBlank
    private String escalationReason;
}
