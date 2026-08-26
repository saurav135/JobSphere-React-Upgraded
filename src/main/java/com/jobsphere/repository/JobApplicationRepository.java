package com.jobsphere.repository;

import com.jobsphere.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateOrderByAppliedAtDesc(
            User candidate
    );

    List<JobApplication> findByJobRecruiterOrderByAppliedAtDesc(
            User recruiter
    );

    boolean existsByCandidateIdAndJobId(
            Long candidateId,
            Long jobId
    );

    long countByStatus(ApplicationStatus status);

    Optional<JobApplication> findByCandidateIdAndJobRecruiterEmailIgnoreCase(
            Long candidateId,
            String recruiterEmail
    );
}