package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterRequest;
import com.example.model.Course;
import com.example.model.StudentProfile;
import com.example.model.User;
import com.example.repository.CourseRepository;
import com.example.repository.StudentProfileRepository;
import com.example.repository.UserRepository;
import java.time.LocalDate;

@Service
public class AuthService {

    @Autowired private UserRepository           userRepository;
    @Autowired private CourseRepository         courseRepository;
    @Autowired private StudentProfileRepository studentProfileRepository;
    @Autowired private PasswordEncoder          passwordEncoder;

    public String register(RegisterRequest request) {
        // Validation is handled in AuthController — here we just save
        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("STUDENT");

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId()).orElse(null);
            user.setCourse(course);
        }

        userRepository.save(user);

        // Auto-create blank StudentProfile
        String year      = String.valueOf(LocalDate.now().getYear());
        String studentId = "STU" + year + String.format("%03d", user.getId());
        String program   = (user.getCourse() != null) ? user.getCourse().getName() : "";

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setStudentId(studentId);
        profile.setEnrollmentYear(year);
        profile.setProgram(program);
        profile.setPhone("");
        profile.setAddress("");
        studentProfileRepository.save(profile);

        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername().trim());
        if (user == null) return null;
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) return null;

        Long courseId     = user.getCourse() != null ? user.getCourse().getId()   : null;
        String courseName = user.getCourse() != null ? user.getCourse().getName() : null;

        return new LoginResponse(
            user.getId(), user.getUsername(), user.getEmail(),
            user.getRole(), courseId, courseName
        );
    }
}
