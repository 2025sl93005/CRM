package com.resolveai.crm.repository;

import com.resolveai.crm.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    List<EmailLog> findByIssueId(Long issueId);
}
