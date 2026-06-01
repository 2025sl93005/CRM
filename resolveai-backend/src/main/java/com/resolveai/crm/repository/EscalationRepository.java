package com.resolveai.crm.repository;

import com.resolveai.crm.entity.Escalation;
import com.resolveai.crm.entity.Issue;
import com.resolveai.crm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EscalationRepository extends JpaRepository<Escalation, Long> {

    List<Escalation> findByIssue(Issue issue);

    List<Escalation> findByEscalatedBy(User user);

    long countByEscalatedBy(User user);
}
