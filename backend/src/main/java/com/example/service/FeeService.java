package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import com.example.dto.*;
import com.example.model.*;
import com.example.repository.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeeService {

    @Autowired private UserRepository             userRepository;
    @Autowired private PaymentRepository          paymentRepository;
    @Autowired private ReceiptRepository          receiptRepository;
    @Autowired private StudentProfileRepository   studentProfileRepository;
    @Autowired private CourseFeeRepository        courseFeeRepository;

    // ── FEE SUMMARY + INSTALLMENTS ─────────────────────────────────────────
    public FeeSummary getByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return new FeeSummary();

        // Total from course fees
        List<CourseFee> courseFees = new ArrayList<>();
        if (user.getCourse() != null) {
            courseFees = courseFeeRepository.findByCourse(user.getCourse());
        }

        double total = courseFees.stream()
            .mapToDouble(f -> f.getAmount().doubleValue())
            .sum();

        // Sum of paid payments only
        List<Payment> payments = paymentRepository
            .findByUser(user, Sort.by(Sort.Direction.DESC, "paymentDate"));

        double paid = payments.stream()
            .filter(p -> "PAID".equals(p.getStatus()))
            .mapToDouble(p -> p.getAmount().doubleValue())
            .sum();

        double remaining = Math.max(0, total - paid);

        // ── BUILD 3 INSTALLMENTS ───────────────────────────────────────────
        // inst1 = inst2 = floor(total/3), inst3 = total - inst1 - inst2 (handles rounding)
        double inst1Amount = Math.floor((total / 3) * 100) / 100.0;
        double inst2Amount = inst1Amount;
        double inst3Amount = Math.round((total - inst1Amount - inst2Amount) * 100.0) / 100.0;

        // Determine which installments are paid from the total paid amount
        boolean inst1Paid = paid >= inst1Amount - 0.01;
        boolean inst2Paid = paid >= inst1Amount + inst2Amount - 0.01;
        boolean inst3Paid = paid >= total - 0.01;

        List<InstallmentInfo> installments = Arrays.asList(
            new InstallmentInfo(1, inst1Amount, inst1Paid ? "PAID" : "UNPAID", !inst1Paid),
            new InstallmentInfo(2, inst2Amount, inst2Paid ? "PAID" : "UNPAID", inst1Paid && !inst2Paid),
            new InstallmentInfo(3, inst3Amount, inst3Paid ? "PAID" : "UNPAID", inst2Paid && !inst3Paid)
        );

        // Fee breakdown for FeeSummaryPage
        List<FeeBreakdown> breakdown = courseFees.stream()
            .map(f -> new FeeBreakdown(
                f.getFeeLabel(),
                f.getAmount().doubleValue(),
                f.getDueDate() != null ? f.getDueDate().toString() : "—"
            ))
            .collect(Collectors.toList());

        FeeSummary summary = new FeeSummary();
        summary.setTotal(total);
        summary.setPaid(paid);
        summary.setRemaining(remaining);
        summary.setInstallments(installments);
        summary.setBreakdown(breakdown);
        summary.setCourseName(user.getCourse() != null ? user.getCourse().getName() : "");
        summary.setDeadlineReminder(
            user.getCourse() != null
                ? "Enrolled in " + user.getCourse().getName() + ". Pay fees before the due date."
                : "No course assigned yet. Contact admin."
        );
        return summary;
    }

    // ── SUBMIT PAYMENT (DIRECT PAID — no approval) ─────────────────────────
    public PaymentResponse submitPayment(PaymentRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) throw new RuntimeException("User not found");

        // Guard: don't allow double-payment of same installment
        FeeSummary current = getByUsername(request.getUsername());
        List<InstallmentInfo> insts = current.getInstallments();
        int instNum = request.getInstallmentNumber();

        if (instNum < 1 || instNum > 3)
            throw new RuntimeException("Invalid installment number");

        InstallmentInfo target = insts.get(instNum - 1);
        if ("PAID".equals(target.getStatus()))
            throw new RuntimeException("Installment " + instNum + " is already paid");

        if (!target.isPayable())
            throw new RuntimeException("Please pay previous installments first");

        // Generate IDs
        String timestamp     = String.valueOf(System.currentTimeMillis());
        String transactionId = "T" + timestamp;
        String receiptId     = "R" + timestamp;

        // Save Payment — status PAID directly
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(LocalDate.now());
        payment.setAmount(BigDecimal.valueOf(target.getAmount()));
        payment.setStatus("PAID");
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setInstallmentNumber(instNum);
        paymentRepository.save(payment);

        // Save Receipt — PAID directly
        com.example.model.Receipt receipt = new com.example.model.Receipt();
        receipt.setUser(user);
        receipt.setReceiptId(receiptId);
        receipt.setReceiptDate(LocalDate.now());
        receipt.setAmount(BigDecimal.valueOf(target.getAmount()));
        receipt.setPaymentMethod(request.getPaymentMethod());
        receipt.setStatus("PAID");
        receiptRepository.save(receipt);

        return new PaymentResponse(
            transactionId,
            receiptId,
            "PAID",
            target.getAmount(),
            instNum,
            request.getPaymentMethod(),
            LocalDate.now().toString(),
            "Installment " + instNum + " paid successfully!"
        );
    }

    // ── PAYMENT HISTORY ────────────────────────────────────────────────────
    public List<PaymentTransaction> getPaymentHistory(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return new ArrayList<>();
        return paymentRepository
            .findByUser(user, Sort.by(Sort.Direction.DESC, "paymentDate"))
            .stream()
            .map(p -> new PaymentTransaction(
                p.getTransactionId(),
                p.getPaymentDate().toString(),
                p.getAmount().doubleValue(),
                p.getStatus(),
                p.getPaymentMethod()
            ))
            .collect(Collectors.toList());
    }

    // ── RECEIPTS ───────────────────────────────────────────────────────────
    public List<com.example.dto.Receipt> getReceipts(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return new ArrayList<>();
        return receiptRepository.findByUser(user).stream()
            .map(r -> {
                com.example.dto.Receipt dto = new com.example.dto.Receipt();
                dto.setReceiptId(r.getReceiptId());
                dto.setDate(r.getReceiptDate().toString());
                dto.setAmount(r.getAmount().doubleValue());
                dto.setPaymentMethod(r.getPaymentMethod());
                dto.setStatus(r.getStatus());
                dto.setFeesIncluded(new ArrayList<>());
                return dto;
            })
            .collect(Collectors.toList());
    }

    // ── STUDENT PROFILE (GET) ──────────────────────────────────────────────
    public com.example.dto.StudentProfile getStudentProfile(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return null;
        Optional<com.example.model.StudentProfile> profile = studentProfileRepository.findByUser(user);
        if (profile.isPresent()) {
            com.example.model.StudentProfile p = profile.get();
            return new com.example.dto.StudentProfile(
                p.getStudentId(), user.getUsername(), user.getEmail(),
                p.getEnrollmentYear(), p.getProgram(), p.getPhone(), p.getAddress()
            );
        }
        return null;
    }

    // ── UPDATE STUDENT PROFILE ─────────────────────────────────────────────
    public com.example.dto.StudentProfile updateStudentProfile(
            String username, com.example.dto.StudentProfile updatedProfile) {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        if (updatedProfile.getEmail() != null) {
            user.setEmail(updatedProfile.getEmail());
            userRepository.save(user);
        }

        com.example.model.StudentProfile p = studentProfileRepository
            .findByUser(user)
            .orElseGet(() -> {
                com.example.model.StudentProfile np = new com.example.model.StudentProfile();
                np.setUser(user);
                np.setStudentId("STU" + System.currentTimeMillis());
                return np;
            });

        if (updatedProfile.getPhone()          != null) p.setPhone(updatedProfile.getPhone());
        if (updatedProfile.getAddress()        != null) p.setAddress(updatedProfile.getAddress());
        if (updatedProfile.getEnrollmentYear() != null) p.setEnrollmentYear(updatedProfile.getEnrollmentYear());
        if (updatedProfile.getProgram()        != null) p.setProgram(updatedProfile.getProgram());
        studentProfileRepository.save(p);

        return new com.example.dto.StudentProfile(
            p.getStudentId(), user.getUsername(), user.getEmail(),
            p.getEnrollmentYear(), p.getProgram(), p.getPhone(), p.getAddress()
        );
    }
}
