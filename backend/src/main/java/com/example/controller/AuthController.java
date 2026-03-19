package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterRequest;
import com.example.model.Course;
import com.example.repository.CourseRepository;
import com.example.repository.UserRepository;
import com.example.service.AuthService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private AuthService     authService;
    @Autowired private UserRepository  userRepository;
    @Autowired private CourseRepository courseRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // ── VALIDATION ───────────────────────────────────────────────────
        if (request.getUsername() == null || request.getUsername().trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));

        if (request.getUsername().trim().length() < 3)
            return ResponseEntity.badRequest().body(Map.of("error", "Username must be at least 3 characters"));

        if (request.getEmail() == null || !request.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"))
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid email address"));

        if (request.getPassword() == null || request.getPassword().length() < 6)
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));

        if (request.getCourseId() == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a course"));

        // ── DUPLICATE USERNAME ────────────────────────────────────────────
        if (userRepository.findByUsername(request.getUsername().trim()) != null)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Username '" + request.getUsername() + "' is already taken"));

        String result = authService.register(request);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));

        if (request.getPassword() == null || request.getPassword().trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));

        LoginResponse response = authService.login(request);

        if (response == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password"));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        var user = userRepository.findByUsername(username);
        if (user == null)
            return ResponseEntity.notFound().build();

        Long courseId     = user.getCourse() != null ? user.getCourse().getId()   : null;
        String courseName = user.getCourse() != null ? user.getCourse().getName() : null;
        return ResponseEntity.ok(
            new LoginResponse(user.getId(), user.getUsername(), user.getEmail(),
                              user.getRole(), courseId, courseName)
        );
    }

    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}
