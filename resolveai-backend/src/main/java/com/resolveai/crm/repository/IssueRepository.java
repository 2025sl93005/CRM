package com.resolveai.crm.repository;

import com.resolveai.crm.entity.Issue;
import com.resolveai.crm.entity.IssueStatus;
import com.resolveai.crm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByCustomer(User customer);

    List<Issue> findByAssignedCsr(User csr);

    List<Issue> findByInQueueTrueAndAssignedCsrIsNull();

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByAssignedCsrAndStatus(User csr, IssueStatus status);

    long countByAssignedCsr(User csr);

    long countByAssignedCsrAndStatus(User csr, IssueStatus status);

    @Query("SELECT i FROM Issue i WHERE i.status = 'ESCALATED'")
    List<Issue> findEscalatedIssues();

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status")
    long countByStatus(@Param("status") IssueStatus status);
}
