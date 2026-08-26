package com.jobsphere.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;
    private String skills;

    // Resume information
    @Lob
    @Column(name = "resume_data", columnDefinition = "LONGBLOB")
    private byte[] resumeData;

    private String resumeFileName;
    private String resumeContentType;

    public User() {}

    public User(
            String name,
            String email,
            String password,
            Role role,
            String phone,
            String skills
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone = phone;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public String getSkills() {
        return skills;
    }

    @JsonIgnore
    public byte[] getResumeData() {
        return resumeData;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public String getResumeContentType() {
        return resumeContentType;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setResumeData(byte[] resumeData) {
        this.resumeData = resumeData;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public void setResumeContentType(String resumeContentType) {
        this.resumeContentType = resumeContentType;
    }
}