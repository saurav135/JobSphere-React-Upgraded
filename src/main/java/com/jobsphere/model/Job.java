package com.jobsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, length = 5000)
    private String description;

    private String skills;
    private String employmentType;
    private String salaryRange;
    private boolean active = true;
    private LocalDateTime postedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    @PrePersist
    public void beforeInsert() {
        postedAt = LocalDateTime.now();
    }

    public Job() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getSkills() { return skills; }
    public String getEmploymentType() { return employmentType; }
    public String getSalaryRange() { return salaryRange; }
    public boolean isActive() { return active; }
    public LocalDateTime getPostedAt() { return postedAt; }
    public User getRecruiter() { return recruiter; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }
    public void setActive(boolean active) { this.active = active; }
    public void setRecruiter(User recruiter) { this.recruiter = recruiter; }
}
