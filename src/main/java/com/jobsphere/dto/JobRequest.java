package com.jobsphere.dto;

import jakarta.validation.constraints.NotBlank;

public record JobRequest(
        @NotBlank String title,
        @NotBlank String company,
        @NotBlank String location,
        @NotBlank String description,
        String skills,
        String employmentType,
        String salaryRange
) {}
