package com.resolveai.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ManagerNotesRequest {

    @NotBlank(message = "Notes cannot be empty")
    private String managerNotes;
}
