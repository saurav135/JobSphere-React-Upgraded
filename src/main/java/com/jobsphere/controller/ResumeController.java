package com.jobsphere.controller;

import com.jobsphere.model.User;
import com.jobsphere.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        User user = resumeService.uploadResume(
                authentication.getName(),
                file
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Resume uploaded successfully",
                        "fileName", user.getResumeFileName()
                )
        );
    }

    @GetMapping
    public ResponseEntity<?> getResume(
            Authentication authentication
    ) {
        User user = resumeService.getUser(
                authentication.getName()
        );

        if (user.getResumeData() == null) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(
                    user.getResumeContentType()
            );
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_PDF;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                user.getResumeFileName() +
                                "\""
                )
                .body(user.getResumeData());
    }
}