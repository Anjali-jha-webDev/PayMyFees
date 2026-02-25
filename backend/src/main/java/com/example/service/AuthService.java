package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.RegisterRequest;
import com.example.dto.LoginRequest;
import com.example.model.User;
import com.example.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String register(RegisterRequest request) {

        User user = new User();

        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPassword(request.password);
        user.setRole("STUDENT");

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // 🔥 LOGIN METHOD
    public User login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername());

        if (user == null) return null;

        if (!user.getPassword().equals(request.getPassword())) return null;

        return user;
    }
}