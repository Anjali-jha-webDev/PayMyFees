package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.StudentProfile;
import com.example.model.User;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
}
