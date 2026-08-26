package com.jobsphere.config;

import com.jobsphere.model.Role;
import com.jobsphere.model.User;
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
            PasswordEncoder encoder
    ) {
        return args -> {
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
        };
    }
}
