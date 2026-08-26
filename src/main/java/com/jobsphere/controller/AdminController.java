package com.jobsphere.controller;

import com.jobsphere.model.ApplicationStatus;
import com.jobsphere.model.Role;
import com.jobsphere.repository.JobApplicationRepository;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository users;
    private final JobRepository jobs;
    private final JobApplicationRepository applications;

    public AdminController(
            UserRepository users,
            JobRepository jobs,
            JobApplicationRepository applications
    ) {
        this.users = users;
        this.jobs = jobs;
        this.applications = applications;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {

        return ResponseEntity.ok(
                Map.ofEntries(
                        Map.entry("users", users.count()),

                        Map.entry(
                                "candidates",
                                users.countByRole(Role.CANDIDATE)
                        ),

                        Map.entry(
                                "recruiters",
                                users.countByRole(Role.RECRUITER)
                        ),

                        Map.entry(
                                "admins",
                                users.countByRole(Role.ADMIN)
                        ),

                        Map.entry("jobs", jobs.count()),

                        Map.entry(
                                "applications",
                                applications.count()
                        ),

                        Map.entry(
                                "applied",
                                applications.countByStatus(
                                        ApplicationStatus.APPLIED
                                )
                        ),

                        Map.entry(
                                "shortlisted",
                                applications.countByStatus(
                                        ApplicationStatus.SHORTLISTED
                                )
                        ),

                        Map.entry(
                                "interview",
                                applications.countByStatus(
                                        ApplicationStatus.INTERVIEW
                                )
                        ),

                        Map.entry(
                                "selected",
                                applications.countByStatus(
                                        ApplicationStatus.SELECTED
                                )
                        ),

                        Map.entry(
                                "rejected",
                                applications.countByStatus(
                                        ApplicationStatus.REJECTED
                                )
                        )
                )
        );
    }
}