package com.jobsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "job_id"})
)
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private String resumeUrl;

    @Column(length = 3000)
    private String coverLetter;

    private LocalDateTime appliedAt;

    @PrePersist
    public void beforeInsert() {
        appliedAt = LocalDateTime.now();
    }

    public JobApplication() {}

    public Long getId() { return id; }
    public User getCandidate() { return candidate; }
    public Job getJob() { return job; }
    public ApplicationStatus getStatus() { return status; }
    public String getResumeUrl() { return resumeUrl; }
    public String getCoverLetter() { return coverLetter; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    public void setCandidate(User candidate) { this.candidate = candidate; }
    public void setJob(Job job) { this.job = job; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
}
