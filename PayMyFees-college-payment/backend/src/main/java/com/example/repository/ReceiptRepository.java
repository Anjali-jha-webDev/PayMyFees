package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Receipt;
import com.example.model.User;
import java.util.List;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByUser(User user);
}
