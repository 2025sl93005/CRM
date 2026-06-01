package com.resolveai.crm.controller;

import com.resolveai.crm.dto.ApiResponse;
import com.resolveai.crm.dto.CommentDto;
import com.resolveai.crm.dto.CreateCommentRequest;
import com.resolveai.crm.service.CommentService;
import com.resolveai.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CSR', 'MANAGER')")
    public ResponseEntity<ApiResponse> addComment(
            @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        // Extract userId from authentication (you might need to adjust this based on your authentication setup)
        Long userId = extractUserIdFromAuth(authentication);
        
        CommentDto comment = commentService.addComment(request.getIssueId(), userId, request.getMessage());
        
        return ResponseEntity.ok(new ApiResponse(true, "Comment added successfully", comment));
    }

    @GetMapping("/issue/{issueId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CSR', 'MANAGER')")
    public ResponseEntity<ApiResponse> getCommentsByIssueId(@PathVariable Long issueId) {
        List<CommentDto> comments = commentService.getCommentsByIssueId(issueId);
        return ResponseEntity.ok(new ApiResponse(true, "Comments retrieved successfully", comments));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CSR', 'MANAGER')")
    public ResponseEntity<ApiResponse> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        Long userId = extractUserIdFromAuth(authentication);
        commentService.deleteComment(commentId, userId);
        
        return ResponseEntity.ok(new ApiResponse(true, "Comment deleted successfully", null));
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .map(user -> user.getId())
                .orElse(null);
    }
}
