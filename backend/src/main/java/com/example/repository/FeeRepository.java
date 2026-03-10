package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Fee;
import com.example.model.User;
import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByUser(User user);
}
