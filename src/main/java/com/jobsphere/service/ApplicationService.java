package com.jobsphere.service;

import com.jobsphere.dto.ApplicationRequest;
import com.jobsphere.model.ApplicationStatus;
import com.jobsphere.model.Job;
import com.jobsphere.model.JobApplication;
import com.jobsphere.model.User;
import com.jobsphere.repository.JobApplicationRepository;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository applications;
    private final JobRepository jobs;
    private final UserRepository users;

    public ApplicationService(
            JobApplicationRepository applications,
            JobRepository jobs,
            UserRepository users
    ) {
        this.applications = applications;
        this.jobs = jobs;
        this.users = users;
    }

    public JobApplication apply(
            Long jobId,
            ApplicationRequest request,
            String email
    ) {
        User candidate = findUser(email);

        if (applications.existsByCandidateIdAndJobId(candidate.getId(), jobId)) {
            throw new IllegalArgumentException("You have already applied for this job");
        }

        Job job = jobs.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.isActive()) {
            throw new IllegalArgumentException("This job is no longer active");
        }

        JobApplication application = new JobApplication();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setResumeUrl(
                request == null ? "" : request.resumeUrl()
        );
        application.setCoverLetter(
                request == null ? "" : request.coverLetter()
        );

        return applications.save(application);
    }

    public List<JobApplication> candidateApplications(String email) {
        return applications.findByCandidateOrderByAppliedAtDesc(findUser(email));
    }

    public List<JobApplication> recruiterApplications(String email) {
        return applications.findByJobRecruiterOrderByAppliedAtDesc(findUser(email));
    }

    public JobApplication updateStatus(
            Long id,
            ApplicationStatus status,
            String email
    ) {
        JobApplication application = applications.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!application.getJob().getRecruiter().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("This application is not for your job");
        }

        application.setStatus(status);
        return applications.save(application);
    }

    private User findUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
