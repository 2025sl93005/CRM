package com.resolveai.crm.repository;

import com.resolveai.crm.entity.IssueComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueCommentRepository extends JpaRepository<IssueComment, Long> {
    List<IssueComment> findByIssueIdOrderByCreatedAtDesc(Long issueId);
    List<IssueComment> findByIssueIdOrderByCreatedAtAsc(Long issueId);
    long countByIssueId(Long issueId);
}
