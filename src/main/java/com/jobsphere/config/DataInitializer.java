package com.jobsphere.config;

import com.jobsphere.model.Job;
import com.jobsphere.model.Role;
import com.jobsphere.model.User;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository users,
            JobRepository jobs,
            PasswordEncoder encoder
    ) {
        return args -> {

            // Create Admin user if not already present
            if (!users.existsByEmailIgnoreCase("admin@jobsphere.com")) {
                users.save(
                        new User(
                                "JobSphere Admin",
                                "admin@jobsphere.com",
                                encoder.encode("Admin@123"),
                                Role.ADMIN,
                                "",
                                ""
                        )
                );
            }

            // Create sample jobs only if database has no jobs
            if (jobs.count() == 0) {

                Job job1 = new Job();
                job1.setTitle("Java Developer");
                job1.setCompany("Tech Solutions India");
                job1.setLocation("Bangalore, India");
                job1.setDescription(
                        "We are looking for a Java Developer to build and maintain backend applications using Java and Spring Boot."
                );
                job1.setSkills("Java, Spring Boot, REST API, MySQL");
                job1.setEmploymentType("Full-time");
                job1.setSalaryRange("₹6 - ₹10 LPA");
                job1.setActive(true);

                Job job2 = new Job();
                job2.setTitle("Spring Boot Developer");
                job2.setCompany("InnovateSoft Technologies");
                job2.setLocation("Hyderabad, India");
                job2.setDescription(
                        "Join our development team to create scalable REST APIs and enterprise applications using Spring Boot."
                );
                job2.setSkills("Java, Spring Boot, Hibernate, MySQL");
                job2.setEmploymentType("Full-time");
                job2.setSalaryRange("₹7 - ₹12 LPA");
                job2.setActive(true);

                Job job3 = new Job();
                job3.setTitle("Full Stack Java Developer");
                job3.setCompany("DigitalWorks Pvt Ltd");
                job3.setLocation("Pune, India");
                job3.setDescription(
                        "Develop modern web applications using Java, Spring Boot, React and MySQL."
                );
                job3.setSkills("Java, Spring Boot, React, MySQL");
                job3.setEmploymentType("Full-time");
                job3.setSalaryRange("₹8 - ₹14 LPA");
                job3.setActive(true);

                Job job4 = new Job();
                job4.setTitle("Backend Developer");
                job4.setCompany("CloudTech India");
                job4.setLocation("Noida, India");
                job4.setDescription(
                        "Work on backend services, REST APIs and database-driven applications."
                );
                job4.setSkills("Java, Spring Boot, REST API, SQL");
                job4.setEmploymentType("Full-time");
                job4.setSalaryRange("₹6 - ₹11 LPA");
                job4.setActive(true);

                Job job5 = new Job();
                job5.setTitle("Java Software Engineer");
                job5.setCompany("NextGen Software");
                job5.setLocation("Mumbai, India");
                job5.setDescription(
                        "Design, develop and maintain Java-based software applications."
                );
                job5.setSkills("Java, OOP, Spring Boot, MySQL");
                job5.setEmploymentType("Full-time");
                job5.setSalaryRange("₹7 - ₹13 LPA");
                job5.setActive(true);

                jobs.save(job1);
                jobs.save(job2);
                jobs.save(job3);
                jobs.save(job4);
                jobs.save(job5);
            }
        };
    }
}