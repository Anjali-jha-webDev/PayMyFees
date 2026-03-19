package com.example.controller;

import com.example.dto.*;
import com.example.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeeController {

    @Autowired private FeeService feeService;

    @GetMapping("/summary/{username}")
    public FeeSummary getFees(@PathVariable String username) {
        return feeService.getByUsername(username);
    }

    @GetMapping("/history/{username}")
    public List<PaymentTransaction> getPaymentHistory(@PathVariable String username) {
        return feeService.getPaymentHistory(username);
    }

    @GetMapping("/receipts/{username}")
    public List<Receipt> getReceipts(@PathVariable String username) {
        return feeService.getReceipts(username);
    }

    @GetMapping("/profile/{username}")
    public StudentProfile getStudentProfile(@PathVariable String username) {
        return feeService.getStudentProfile(username);
    }

    // ── NEW: Submit a payment ───────────────────────────────────────────────
    @PostMapping("/pay")
    public PaymentResponse submitPayment(@RequestBody PaymentRequest request) {
        return feeService.submitPayment(request);
    }

    // ── NEW: Update student profile ─────────────────────────────────────────
    @PutMapping("/profile/{username}")
    public StudentProfile updateStudentProfile(
            @PathVariable String username,
            @RequestBody StudentProfile updatedProfile) {
        return feeService.updateStudentProfile(username, updatedProfile);
    }
}