package com.jobsphere.service;

import com.jobsphere.model.ApplicationStatus;
import com.jobsphere.model.Interview;
import com.jobsphere.model.JobApplication;
import com.jobsphere.model.User;
import com.jobsphere.repository.InterviewRepository;
import com.jobsphere.repository.JobApplicationRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InterviewService {

    private final InterviewRepository interviews;
    private final JobApplicationRepository applications;
    private final UserRepository users;

    public InterviewService(
            InterviewRepository interviews,
            JobApplicationRepository applications,
            UserRepository users
    ) {
        this.interviews = interviews;
        this.applications = applications;
        this.users = users;
    }

    public Interview scheduleInterview(
            Long applicationId,
            LocalDateTime interviewDate,
            String meetingLink,
            String notes,
            String recruiterEmail
    ) {
        User recruiter = users.findByEmailIgnoreCase(recruiterEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Recruiter not found"));

        JobApplication application = applications.findById(applicationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Application not found"));

        if (!application.getJob().getRecruiter().getId()
                .equals(recruiter.getId())) {
            throw new IllegalArgumentException(
                    "This application is not for your job"
            );
        }

        application.setStatus(ApplicationStatus.INTERVIEW);
        applications.save(application);

        Interview interview = interviews
                .findByApplication(application)
                .orElseGet(Interview::new);

        interview.setApplication(application);
        interview.setInterviewDate(interviewDate);
        interview.setMeetingLink(meetingLink);
        interview.setNotes(notes);

        return interviews.save(interview);
    }

    public Interview getCandidateInterview(
            Long applicationId,
            String candidateEmail
    ) {
        JobApplication application = applications.findById(applicationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Application not found"));

        if (!application.getCandidate().getEmail()
                .equalsIgnoreCase(candidateEmail)) {
            throw new IllegalArgumentException(
                    "This application is not yours"
            );
        }

        return interviews.findByApplication(application)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Interview not scheduled yet"
                        ));
    }
}