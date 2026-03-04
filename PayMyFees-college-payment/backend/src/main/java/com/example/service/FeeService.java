package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import com.example.dto.*;
import com.example.model.*;
import com.example.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public FeeSummary getByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return new FeeSummary();
        }

        // Fetch all fees for this user
        List<Fee> fees = feeRepository.findByUser(user);
        
        // Calculate totals
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal paid = BigDecimal.ZERO;
        
        for (Fee fee : fees) {
            total = total.add(fee.getAmount());
            if ("PAID".equals(fee.getStatus())) {
                paid = paid.add(fee.getAmount());
            }
        }

        BigDecimal outstanding = total.subtract(paid);

        // Convert to DTO
        List<FeeBreakdown> breakdown = fees.stream()
                .map(f -> new FeeBreakdown(f.getLabel(), f.getAmount().doubleValue(), 
                        f.getDueDate().toString()))
                .collect(Collectors.toList());

        FeeSummary summary = new FeeSummary();
        summary.setTotal(total.doubleValue());
        summary.setPaid(paid.doubleValue());
        summary.setOutstanding(outstanding.doubleValue());
        summary.setBreakdown(breakdown);
        summary.setDeadlineReminder("Your educational fees are due by the specified deadline. Please make timely payments.");

        return summary;
    }

    public List<PaymentTransaction> getPaymentHistory(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return new ArrayList<>();
        }

        // Fetch payments from database, sorted by date (newest first)
        List<Payment> payments = paymentRepository.findByUser(user, Sort.by(Sort.Direction.DESC, "paymentDate"));

        return payments.stream()
                .map(p -> new PaymentTransaction(
                        p.getTransactionId(),
                        p.getPaymentDate().toString(),
                        p.getAmount().doubleValue(),
                        p.getStatus(),
                        p.getPaymentMethod()
                ))
                .collect(Collectors.toList());
    }

    public List<com.example.dto.Receipt> getReceipts(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return new ArrayList<>();
        }

        // Fetch receipts from database
        List<com.example.model.Receipt> receiptEntities = receiptRepository.findByUser(user);

        return receiptEntities.stream()
                .map(r -> {
                    com.example.dto.Receipt receipt = new com.example.dto.Receipt();
                    receipt.setReceiptId(r.getReceiptId());
                    receipt.setDate(r.getReceiptDate().toString());
                    receipt.setAmount(r.getAmount().doubleValue());
                    receipt.setPaymentMethod(r.getPaymentMethod());
                    receipt.setStatus(r.getStatus());
                    receipt.setFeesIncluded(new ArrayList<>()); // Can be expanded based on requirements
                    return receipt;
                })
                .collect(Collectors.toList());
    }

    public com.example.dto.StudentProfile getStudentProfile(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return null;
        }

        Optional<com.example.model.StudentProfile> profile = studentProfileRepository.findByUser(user);

        if (profile.isPresent()) {
            com.example.model.StudentProfile p = profile.get();
            return new com.example.dto.StudentProfile(
                    p.getStudentId(),
                    p.getUser().getUsername(),
                    p.getUser().getEmail(),
                    p.getEnrollmentYear(),
                    p.getProgram(),
                    p.getPhone(),
                    p.getAddress()
            );
        }

        return null;
    }

    public FeeSummary getByusername(String username) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}

