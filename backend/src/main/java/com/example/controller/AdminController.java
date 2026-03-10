package com.example.controller;

import com.example.model.FeeStructure;
import com.example.model.Payment;
import com.example.model.User;
import com.example.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ── STUDENTS ──────────────────────────────

    // GET all students
    @GetMapping("/students")
    public List<User> getAllStudents() {
        return adminService.getAllStudents();
    }

    // ── PAYMENTS ──────────────────────────────

    // GET all payments
    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        return adminService.getAllPayments();
    }

    // GET payments by status
    @GetMapping("/payments/status/{status}")
    public List<Payment> getByStatus(@PathVariable String status) {
        return adminService.getPaymentsByStatus(status);
    }

    // PUT approve payment
    @PutMapping("/payments/approve/{id}")
    public Payment approvePayment(@PathVariable Long id) {
        return adminService.approvePayment(id);
    }

    // PUT reject payment
    @PutMapping("/payments/reject/{id}")
    public Payment rejectPayment(@PathVariable Long id) {
        return adminService.rejectPayment(id);
    }

    // ── FEE STRUCTURE ─────────────────────────

    // GET all fees
    @GetMapping("/fees")
    public List<FeeStructure> getAllFees() {
        return adminService.getAllFees();
    }

    // POST add new fee
    @PostMapping("/fees")
    public FeeStructure addFee(@RequestBody FeeStructure fee) {
        return adminService.addFee(fee);
    }

    // PUT update fee
    @PutMapping("/fees/{id}")
    public FeeStructure updateFee(
        @PathVariable Long id,
        @RequestBody FeeStructure fee) {
        return adminService.updateFee(id, fee);
    }

    // DELETE fee
    @DeleteMapping("/fees/{id}")
    public String deleteFee(@PathVariable Long id) {
        adminService.deleteFee(id);
        return "Fee deleted";
    }
}