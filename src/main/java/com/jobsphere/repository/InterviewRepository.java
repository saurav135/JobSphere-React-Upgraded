package com.jobsphere.repository;

import com.jobsphere.model.Interview;
import com.jobsphere.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplication(JobApplication application);

    boolean existsByApplication(JobApplication application);
}