package com.resolveai.crm.controller;

import com.resolveai.crm.dto.ApiResponse;
import com.resolveai.crm.dto.ActivityDto;
import com.resolveai.crm.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/issue/{issueId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CSR', 'MANAGER')")
    public ResponseEntity<ApiResponse> getActivitiesByIssueId(@PathVariable Long issueId) {
        List<ActivityDto> activities = activityService.getActivitiesByIssueId(issueId);
        return ResponseEntity.ok(new ApiResponse(true, "Activities retrieved successfully", activities));
    }
}
