// AuthService.java
package com.demo.personalfinancetracker.auth.service;

import com.demo.personalfinancetracker.auth.dto.LoginRequest;
import com.demo.personalfinancetracker.auth.dto.RegisterRequest;
import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public String register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = new User(registerRequest.getEmail(), encodedPassword);
        userRepository.save(user);

        return "User registered successfully";
    }

    public String login(LoginRequest loginRequest) {
        System.out.println("Attempting login for email: " + loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    System.out.println("User not found with email: " + loginRequest.getEmail());
                    return new RuntimeException("Invalid email or password");
                });

        boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        System.out.println("Password matches: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("Password mismatch for user: " + loginRequest.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        System.out.println("Login successful for user: " + loginRequest.getEmail());

        return token;
    }
}
