package com.jobsphere.controller;

import com.jobsphere.dto.ApplicationRequest;
import com.jobsphere.service.ApplicationService;
import com.jobsphere.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobs;
    private final ApplicationService applications;

    public JobController(
            JobService jobs,
            ApplicationService applications
    ) {
        this.jobs = jobs;
        this.applications = applications;
    }

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                jobs.search(keyword)
        );
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> apply(
            @PathVariable Long id,
            @RequestBody(required = false) ApplicationRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                applications.apply(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }
}