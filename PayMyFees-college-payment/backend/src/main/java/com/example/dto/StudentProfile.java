package com.example.dto;

public class StudentProfile {
    private String studentId;
    private String name;
    private String email;
    private String enrollmentYear;
    private String program;
    private String phone;
    private String address;

    public StudentProfile() {}

    public StudentProfile(String studentId, String name, String email, String enrollmentYear, String program, String phone, String address) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.enrollmentYear = enrollmentYear;
        this.program = program;
        this.phone = phone;
        this.address = address;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnrollmentYear() {
        return enrollmentYear;
    }

    public void setEnrollmentYear(String enrollmentYear) {
        this.enrollmentYear = enrollmentYear;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
