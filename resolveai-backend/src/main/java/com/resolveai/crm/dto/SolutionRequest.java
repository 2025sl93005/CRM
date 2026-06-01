package com.resolveai.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SolutionRequest {

    @NotBlank(message = "Solution cannot be empty")
    private String solution;
}
