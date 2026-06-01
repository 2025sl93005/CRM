package com.resolveai.crm.repository;

import com.resolveai.crm.entity.Feedback;
import com.resolveai.crm.entity.Issue;
import com.resolveai.crm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Optional<Feedback> findByIssue(Issue issue);

    boolean existsByIssue(Issue issue);

    List<Feedback> findByCustomer(User customer);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.issue.assignedCsr = :csr")
    Double avgRatingByCsr(@Param("csr") User csr);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double overallAvgRating();
}
