package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.FeeService;
import com.example.dto.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeeController {
   
    @Autowired
    public FeeService feeService;

    @GetMapping("/{username}")
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
}

