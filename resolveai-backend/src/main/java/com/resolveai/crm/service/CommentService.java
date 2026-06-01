package com.resolveai.crm.service;

import com.resolveai.crm.dto.CommentDto;
import com.resolveai.crm.entity.IssueComment;
import com.resolveai.crm.entity.Issue;
import com.resolveai.crm.entity.User;
import com.resolveai.crm.exception.ResourceNotFoundException;
import com.resolveai.crm.repository.IssueCommentRepository;
import com.resolveai.crm.repository.IssueRepository;
import com.resolveai.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private IssueCommentRepository commentRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Transactional
    public CommentDto addComment(Long issueId, Long userId, String message) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        IssueComment comment = new IssueComment(issue, user, message);
        IssueComment savedComment = commentRepository.save(comment);

        // Log activity
        activityService.logActivity(issueId, "COMMENT_ADDED", 
                user.getFirstName() + " " + user.getLastName() + " added a comment", userId);

        return convertToDto(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByIssueId(Long issueId) {
        List<IssueComment> comments = commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getCommentCount(Long issueId) {
        return commentRepository.countByIssueId(issueId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        IssueComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        // Check if user is the comment author or manager
        if (!comment.getUser().getId().equals(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (!user.getRole().name().equals("MANAGER")) {
                throw new IllegalArgumentException("You can only delete your own comments");
            }
        }

        commentRepository.delete(comment);
    }

    private CommentDto convertToDto(IssueComment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getIssue().getId(),
                comment.getUser().getId(),
                comment.getUser().getFirstName() + " " + comment.getUser().getLastName(),
                comment.getUser().getEmail(),
                comment.getUser().getRole().name(),
                comment.getMessage(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
