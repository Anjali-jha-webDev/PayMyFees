package com.example.repository;

import com.example.model.Payment;
import com.example.model.User;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // get all payments of one student
    List<Payment> findByUserId(Long userId);

    // get all payments by status
    List<Payment> findByStatus(String status);

    List<Payment> findByUser(User user, Sort by);
}