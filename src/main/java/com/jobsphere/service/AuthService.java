package com.jobsphere.service;

import com.jobsphere.dto.LoginRequest;
import com.jobsphere.dto.RegisterRequest;
import com.jobsphere.model.Role;
import com.jobsphere.model.User;
import com.jobsphere.repository.UserRepository;
import com.jobsphere.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public Map<String, Object> register(RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Role role = "RECRUITER".equalsIgnoreCase(request.role())
                ? Role.RECRUITER
                : Role.CANDIDATE;

        User user = new User(
                request.name(),
                request.email().toLowerCase(),
                encoder.encode(request.password()),
                role,
                request.phone(),
                request.skills()
        );

        user = users.save(user);

        return Map.of(
                "message", "Registration successful",
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return Map.of(
                "token", jwt.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                ),
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }



}
