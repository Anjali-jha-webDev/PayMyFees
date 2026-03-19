package com.example.dto;

public class LoginResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Long courseId;
    private String courseName;

    public LoginResponse(Long id, String username, String email, String role, Long courseId, String courseName) {
        this.id         = id;
        this.username   = username;
        this.email      = email;
        this.role       = role;
        this.courseId   = courseId;
        this.courseName = courseName;
    }

    public Long getId()           { return id; }
    public String getUsername()   { return username; }
    public String getEmail()      { return email; }
    public String getRole()       { return role; }
    public Long getCourseId()     { return courseId; }
    public String getCourseName() { return courseName; }
}