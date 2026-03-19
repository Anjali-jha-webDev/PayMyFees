package com.example.service;

import com.example.model.*;
import com.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    @Autowired private UserRepository      userRepository;
    @Autowired private PaymentRepository   paymentRepository;
    @Autowired private CourseRepository    courseRepository;
    @Autowired private CourseFeeRepository courseFeeRepository;

    // ── STUDENTS ──────────────────────────────────────────────────────────
    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    public User assignCourse(Long studentId, Long courseId) {
        User user = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        user.setCourse(course);
        return userRepository.save(user);
    }

    // ── PAYMENTS ──────────────────────────────────────────────────────────
    public List<Payment> getAllPayments()                    { return paymentRepository.findAll(); }
    public List<Payment> getPaymentsByStatus(String status) { return paymentRepository.findByStatus(status); }

    public Payment approvePayment(Long id) {
        Payment p = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        p.setStatus("APPROVED");
        return paymentRepository.save(p);
    }

    public Payment rejectPayment(Long id) {
        Payment p = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        p.setStatus("REJECTED");
        return paymentRepository.save(p);
    }

    // ── COURSES ───────────────────────────────────────────────────────────
    public List<Course> getAllCourses() { return courseRepository.findAll(); }

    public Course addCourse(Course course) {
        if (course.getName() == null || course.getName().trim().isEmpty())
            throw new RuntimeException("Course name cannot be empty");

        if (courseRepository.findByName(course.getName().trim()) != null)
            throw new RuntimeException("A course named '" + course.getName().trim() + "' already exists");

        course.setName(course.getName().trim());
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updated) {
        if (updated.getName() == null || updated.getName().trim().isEmpty())
            throw new RuntimeException("Course name cannot be empty");

        Course c = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        Course existing = courseRepository.findByName(updated.getName().trim());
        if (existing != null && !existing.getId().equals(id))
            throw new RuntimeException("A course named '" + updated.getName().trim() + "' already exists");

        c.setName(updated.getName().trim());
        c.setDuration(updated.getDuration());
        return courseRepository.save(c);
    }

    public void deleteCourse(Long id) { courseRepository.deleteById(id); }

    // ── COURSE FEES ───────────────────────────────────────────────────────
    public List<CourseFee> getFeesForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        return courseFeeRepository.findByCourse(course);
    }

    public CourseFee addFeeToCoruse(Long courseId, CourseFee fee) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (fee.getFeeLabel() == null || fee.getFeeLabel().trim().isEmpty())
            throw new RuntimeException("Fee label cannot be empty");

        if (fee.getAmount() == null || fee.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new RuntimeException("Fee amount must be greater than zero");

        fee.setFeeLabel(fee.getFeeLabel().trim());
        fee.setCourse(course);
        return courseFeeRepository.save(fee);
    }

    public void deleteCourseFee(Long feeId) { courseFeeRepository.deleteById(feeId); }
}