package com.example.controller;

import com.example.model.*;
import com.example.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private AdminService adminService;

    // ── STUDENTS ──────────────────────────────
    @GetMapping("/students")
    public List<User> getAllStudents() { return adminService.getAllStudents(); }

    @PutMapping("/students/{studentId}/course/{courseId}")
    public User assignCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        return adminService.assignCourse(studentId, courseId);
    }

    // ── PAYMENTS ──────────────────────────────
    @GetMapping("/payments")
    public List<Payment> getAllPayments() { return adminService.getAllPayments(); }

    @GetMapping("/payments/status/{status}")
    public List<Payment> getByStatus(@PathVariable String status) { return adminService.getPaymentsByStatus(status); }

    @PutMapping("/payments/approve/{id}")
    public Payment approvePayment(@PathVariable Long id) { return adminService.approvePayment(id); }

    @PutMapping("/payments/reject/{id}")
    public Payment rejectPayment(@PathVariable Long id) { return adminService.rejectPayment(id); }

    // ── COURSES ───────────────────────────────
    @GetMapping("/courses")
    public List<Course> getAllCourses() { return adminService.getAllCourses(); }

    @PostMapping("/courses")
    public Course addCourse(@RequestBody Course course) { return adminService.addCourse(course); }

    @PutMapping("/courses/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course course) { return adminService.updateCourse(id, course); }

    @DeleteMapping("/courses/{id}")
    public String deleteCourse(@PathVariable Long id) { adminService.deleteCourse(id); return "Deleted"; }

    // ── COURSE FEES ───────────────────────────
    @GetMapping("/courses/{courseId}/fees")
    public List<CourseFee> getCourseFees(@PathVariable Long courseId) { return adminService.getFeesForCourse(courseId); }

    @PostMapping("/courses/{courseId}/fees")
    public CourseFee addCourseFee(@PathVariable Long courseId, @RequestBody CourseFee fee) { return adminService.addFeeToCoruse(courseId, fee); }

    @DeleteMapping("/course-fees/{feeId}")
    public String deleteCourseFee(@PathVariable Long feeId) { adminService.deleteCourseFee(feeId); return "Deleted"; }
}