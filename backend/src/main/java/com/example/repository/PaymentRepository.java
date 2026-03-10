package com.example.repository;

import com.example.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // get all payments of one student
    List<Payment> findByStudentId(Long studentId);

    // get all payments by status
    List<Payment> findByStatus(String status);
}