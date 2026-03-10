package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Payment;
import com.example.model.User;
import java.util.List;
import org.springframework.data.domain.Sort;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user, Sort sort);
    List<Payment> findByUser(User user);
}
