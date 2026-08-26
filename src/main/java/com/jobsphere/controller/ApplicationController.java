package com.jobsphere.controller;

import com.jobsphere.service.ApplicationService;
import com.jobsphere.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applications;
    private final InterviewService interviews;

    public ApplicationController(
            ApplicationService applications,
            InterviewService interviews
    ) {
        this.applications = applications;
        this.interviews = interviews;
    }

    @GetMapping("/my")
    public ResponseEntity<?> myApplications(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                applications.candidateApplications(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}/interview")
    public ResponseEntity<?> getInterview(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviews.getCandidateInterview(
                        id,
                        authentication.getName()
                )
        );
    }
}