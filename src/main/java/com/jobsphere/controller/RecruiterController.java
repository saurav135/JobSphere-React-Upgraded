package com.jobsphere.controller;

import com.jobsphere.dto.JobRequest;
import com.jobsphere.model.ApplicationStatus;
import com.jobsphere.service.ApplicationService;
import com.jobsphere.service.InterviewService;
import com.jobsphere.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final JobService jobs;
    private final ApplicationService applications;
    private final InterviewService interviewService;

    public RecruiterController(
            JobService jobs,
            ApplicationService applications,
            InterviewService interviewService
    ) {
        this.jobs = jobs;
        this.applications = applications;
        this.interviewService = interviewService;
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                jobs.create(request, authentication.getName())
        );
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                jobs.update(id, request, authentication.getName())
        );
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> closeJob(
            @PathVariable Long id,
            Authentication authentication
    ) {
        jobs.close(id, authentication.getName());
        return ResponseEntity.ok()
                .body(java.util.Map.of("message", "Job closed"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> myJobs(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                jobs.recruiterJobs(authentication.getName())
        );
    }

    @GetMapping("/applications")
    public ResponseEntity<?> applications(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                applications.recruiterApplications(
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                applications.updateStatus(
                        id,
                        status,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/applications/{id}/interview")
    public ResponseEntity<?> scheduleInterview(
            @PathVariable Long id,
            @RequestParam String interviewDate,
            @RequestParam(required = false) String meetingLink,
            @RequestParam(required = false) String notes,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.scheduleInterview(
                        id,
                        java.time.LocalDateTime.parse(interviewDate),
                        meetingLink,
                        notes,
                        authentication.getName()
                )
        );
    }
}