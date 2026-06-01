package com.resolveai.crm.controller;

import com.resolveai.crm.dto.*;
import com.resolveai.crm.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    // Customer: create issue
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<IssueResponse>> createIssue(
            @Valid @RequestBody IssueRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Issue created",
                issueService.createIssue(request, userDetails.getUsername())));
    }

    // Customer: get own issues
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getMyIssues(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(issueService.getMyIssues(userDetails.getUsername())));
    }

    // Manager: get all issues
    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getAllIssues() {
        return ResponseEntity.ok(ApiResponse.ok(issueService.getAllIssues()));
    }

    // Manager: assign issue to CSR
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<IssueResponse>> assignIssue(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Issue assigned", issueService.assignIssue(id, request)));
    }

    // Manager: send issue to common queue
    @PutMapping("/{id}/queue")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<IssueResponse>> sendToQueue(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Issue sent to queue", issueService.sendToQueue(id)));
    }

    // CSR: view queue
    @GetMapping("/queue")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getQueueIssues() {
        return ResponseEntity.ok(ApiResponse.ok(issueService.getQueueIssues()));
    }

    // CSR: view assigned issues
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getAssignedIssues(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(issueService.getAssignedIssues(userDetails.getUsername())));
    }

    // CSR: pull from queue
    @PutMapping("/{id}/pull")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<IssueResponse>> pullFromQueue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Issue pulled from queue",
                issueService.pullFromQueue(id, userDetails.getUsername())));
    }

    // CSR: update status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<IssueResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                issueService.updateStatus(id, request, userDetails.getUsername())));
    }

    // CSR: escalate issue
    @PutMapping("/{id}/escalate")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<IssueResponse>> escalateIssue(
            @PathVariable Long id,
            @Valid @RequestBody EscalationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Issue escalated",
                issueService.escalateIssue(id, request, userDetails.getUsername())));
    }

    // Manager: view escalated issues
    @GetMapping("/escalated")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getEscalatedIssues() {
        return ResponseEntity.ok(ApiResponse.ok(issueService.getEscalatedIssues()));
    }

    // Get detailed issue view with comments and activities
    @GetMapping("/{id}/detail")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CSR', 'MANAGER')")
    public ResponseEntity<ApiResponse<DetailedIssueDto>> getIssueDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Issue details retrieved",
                issueService.getDetailedIssue(id, userDetails.getUsername())));
    }

    // CSR: add/update solution
    @PostMapping("/{id}/solution")
    @PreAuthorize("hasRole('CSR')")
    public ResponseEntity<ApiResponse<DetailedIssueDto>> addSolution(
            @PathVariable Long id,
            @Valid @RequestBody SolutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Solution added",
                issueService.addSolution(id, request.getSolution(), userDetails.getUsername())));
    }

    // Manager: add/update notes on escalated issue
    @PostMapping("/{id}/manager-notes")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DetailedIssueDto>> addManagerNotes(
            @PathVariable Long id,
            @Valid @RequestBody ManagerNotesRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Manager notes added",
                issueService.addManagerNotes(id, request.getManagerNotes(), userDetails.getUsername())));
    }
}
