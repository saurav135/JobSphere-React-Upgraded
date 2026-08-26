package com.jobsphere.repository;

import com.jobsphere.model.Job;
import com.jobsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrueOrderByPostedAtDesc();

    List<Job> findByActiveTrueAndTitleContainingIgnoreCaseOrderByPostedAtDesc(
            String keyword
    );

    List<Job> findByActiveTrueAndTitleContainingIgnoreCaseOrActiveTrueAndCompanyContainingIgnoreCaseOrActiveTrueAndSkillsContainingIgnoreCaseOrderByPostedAtDesc(
            String title,
            String company,
            String skills
    );

    List<Job> findByRecruiterOrderByPostedAtDesc(User recruiter);
}