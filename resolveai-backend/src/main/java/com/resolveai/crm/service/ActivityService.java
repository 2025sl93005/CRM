package com.resolveai.crm.service;

import com.resolveai.crm.dto.ActivityDto;
import com.resolveai.crm.entity.IssueActivity;
import com.resolveai.crm.entity.Issue;
import com.resolveai.crm.entity.User;
import com.resolveai.crm.exception.ResourceNotFoundException;
import com.resolveai.crm.repository.IssueActivityRepository;
import com.resolveai.crm.repository.IssueRepository;
import com.resolveai.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    @Autowired
    private IssueActivityRepository activityRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void logActivity(Long issueId, String actionType, String actionDescription, Long createdById) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        User createdBy = null;
        if (createdById != null) {
            createdBy = userRepository.findById(createdById)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + createdById));
        }

        IssueActivity activity = new IssueActivity(issue, actionType, actionDescription, createdBy);
        activityRepository.save(activity);
    }

    @Transactional
    public void logActivity(Long issueId, String actionType, String actionDescription) {
        logActivity(issueId, actionType, actionDescription, null);
    }

    @Transactional(readOnly = true)
    public List<ActivityDto> getActivitiesByIssueId(Long issueId) {
        List<IssueActivity> activities = activityRepository.findByIssueIdOrderByCreatedAtAsc(issueId);
        return activities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getActivityCount(Long issueId) {
        return activityRepository.countByIssueId(issueId);
    }

    private ActivityDto convertToDto(IssueActivity activity) {
        String createdByName = null;
        String createdByEmail = null;
        String createdByRole = null;
        Long createdById = null;

        if (activity.getCreatedBy() != null) {
            createdById = activity.getCreatedBy().getId();
            createdByName = activity.getCreatedBy().getFirstName() + " " + activity.getCreatedBy().getLastName();
            createdByEmail = activity.getCreatedBy().getEmail();
            createdByRole = activity.getCreatedBy().getRole().name();
        }

        return new ActivityDto(
                activity.getId(),
                activity.getIssue().getId(),
                activity.getActionType(),
                activity.getActionDescription(),
                createdById,
                createdByName,
                createdByEmail,
                createdByRole,
                activity.getCreatedAt()
        );
    }
}
