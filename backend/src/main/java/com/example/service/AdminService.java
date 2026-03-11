package com.example.service;

import com.example.model.FeeStructure;
import com.example.model.Payment;
import com.example.model.User;
import com.example.repository.FeeStructureRepository;
import com.example.repository.PaymentRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    // ── STUDENTS ──────────────────────────────

    // get all students only (not admins)
    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    // ── PAYMENTS ──────────────────────────────

    // get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // get payments by status
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }

    // approve payment
    public Payment approvePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus("APPROVED");
        return paymentRepository.save(payment);
    }

    // reject payment
    public Payment rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus("REJECTED");
        return paymentRepository.save(payment);
    }

    // ── FEE STRUCTURE ─────────────────────────

    // get all fees
    public List<FeeStructure> getAllFees() {
        return feeStructureRepository.findAll();
    }

    // add new fee
    public FeeStructure addFee(FeeStructure fee) {
        return feeStructureRepository.save(fee);
    }

    // update fee
    public FeeStructure updateFee(Long id, FeeStructure updatedFee) {
        FeeStructure fee = feeStructureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Fee not found"));
        fee.setCourse(updatedFee.getCourse());
        fee.setSemester(updatedFee.getSemester());
        fee.setAmount(updatedFee.getAmount());
        return feeStructureRepository.save(fee);
    }

    // delete fee
    public void deleteFee(Long id) {
        feeStructureRepository.deleteById(id);
    }
}