package com.resolveai.crm.controller;

import com.resolveai.crm.dto.*;
import com.resolveai.crm.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/analytics/csr-performance")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<CsrPerformanceDto>>> getCsrPerformance() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getCsrPerformance()));
    }

    @GetMapping("/reports")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ReportDto>> getReport() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getReport()));
    }
}
