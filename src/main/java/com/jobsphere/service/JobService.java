package com.jobsphere.service;

import com.jobsphere.dto.JobRequest;
import com.jobsphere.model.Job;
import com.jobsphere.model.User;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobs;
    private final UserRepository users;

    public JobService(JobRepository jobs, UserRepository users) {
        this.jobs = jobs;
        this.users = users;
    }

    public List<Job> search(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return jobs.findByActiveTrueOrderByPostedAtDesc();
        }

        String search = keyword.trim();

        return jobs
                .findByActiveTrueAndTitleContainingIgnoreCaseOrActiveTrueAndCompanyContainingIgnoreCaseOrActiveTrueAndSkillsContainingIgnoreCaseOrderByPostedAtDesc(
                        search,
                        search,
                        search
                );
    }

    public Job create(JobRequest request, String email) {

        User recruiter = findUser(email);

        Job job = new Job();

        copy(request, job);

        job.setRecruiter(recruiter);

        return jobs.save(job);
    }

    public Job update(Long id, JobRequest request, String email) {

        Job job = findJob(id);

        if (!job.getRecruiter()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "You can update only your own jobs"
            );
        }

        copy(request, job);

        return jobs.save(job);
    }

    public void close(Long id, String email) {

        Job job = findJob(id);

        if (!job.getRecruiter()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "You can close only your own jobs"
            );
        }

        job.setActive(false);

        jobs.save(job);
    }

    public List<Job> recruiterJobs(String email) {

        return jobs.findByRecruiterOrderByPostedAtDesc(
                findUser(email)
        );
    }

    private User findUser(String email) {

        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Recruiter not found"
                        )
                );
    }

    private Job findJob(Long id) {

        return jobs.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Job not found"
                        )
                );
    }

    private void copy(JobRequest request, Job job) {

        job.setTitle(request.title());
        job.setCompany(request.company());
        job.setLocation(request.location());
        job.setDescription(request.description());
        job.setSkills(request.skills());
        job.setEmploymentType(request.employmentType());
        job.setSalaryRange(request.salaryRange());
    }
}