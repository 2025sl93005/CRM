package com.resolveai.crm.repository;

import com.resolveai.crm.entity.IssueActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueActivityRepository extends JpaRepository<IssueActivity, Long> {
    List<IssueActivity> findByIssueIdOrderByCreatedAtDesc(Long issueId);
    List<IssueActivity> findByIssueIdOrderByCreatedAtAsc(Long issueId);
    long countByIssueId(Long issueId);
}
