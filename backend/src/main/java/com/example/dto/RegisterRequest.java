package com.example.dto;

public class RegisterRequest {
    public String username;
    public String email;
    public String password;
    public Long courseId;   // student picks course at registration

    public String getUsername() { return username; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public Long getCourseId()   { return courseId; }
}