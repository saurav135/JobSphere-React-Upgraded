package com.jobsphere.service;

import com.jobsphere.dto.ProfileRequest;
import com.jobsphere.model.JobApplication;
import com.jobsphere.model.User;
import com.jobsphere.repository.JobApplicationRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository users;
    private final JobApplicationRepository applications;

    public ProfileService(
            UserRepository users,
            JobApplicationRepository applications
    ) {
        this.users = users;
        this.applications = applications;
    }

    public User getProfile(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    public User updateProfile(
            String email,
            ProfileRequest request
    ) {
        User user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        user.setName(request.name());
        user.setPhone(request.phone());
        user.setSkills(request.skills());

        return users.save(user);
    }

    public User getCandidateResume(
            Long candidateId,
            String recruiterEmail
    ) {
        JobApplication application =
                applications
                        .findByCandidateIdAndJobRecruiterEmailIgnoreCase(
                                candidateId,
                                recruiterEmail
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Candidate has not applied to your jobs"
                                )
                        );

        User candidate = application.getCandidate();

        if (candidate.getResumeData() == null) {
            throw new IllegalArgumentException(
                    "Candidate has not uploaded a resume"
            );
        }

        return candidate;
    }
}