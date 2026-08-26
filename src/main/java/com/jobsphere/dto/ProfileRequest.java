package com.jobsphere.dto;

public record ProfileRequest(
        String name,
        String phone,
        String skills
) {
}