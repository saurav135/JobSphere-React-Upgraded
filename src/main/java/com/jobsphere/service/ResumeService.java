package com.jobsphere.service;

import com.jobsphere.model.User;
import com.jobsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private final UserRepository users;

    public ResumeService(UserRepository users) {
        this.users = users;
    }

    public User uploadResume(String email, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a resume");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Only PDF resumes are allowed"
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Resume size must be less than 5 MB"
            );
        }

        User user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        try {
            user.setResumeData(file.getBytes());
            user.setResumeFileName(file.getOriginalFilename());
            user.setResumeContentType(file.getContentType());

            return users.save(user);

        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Unable to upload resume"
            );
        }
    }

    public User getUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }
}