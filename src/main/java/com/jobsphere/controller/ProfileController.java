package com.jobsphere.controller;

import com.jobsphere.dto.ProfileRequest;
import com.jobsphere.model.User;
import com.jobsphere.service.ProfileService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                profileService.getProfile(
                        authentication.getName()
                )
        );
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                profileService.updateProfile(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/resume/{candidateId}")
    public ResponseEntity<?> getCandidateResume(
            @PathVariable Long candidateId,
            Authentication authentication
    ) {
        User candidate = profileService.getCandidateResume(
                candidateId,
                authentication.getName()
        );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                candidate.getResumeContentType()
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                candidate.getResumeFileName() +
                                "\""
                )
                .body(candidate.getResumeData());
    }
}