package com.example.repository;

import com.example.model.Course;
import com.example.model.CourseFee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseFeeRepository extends JpaRepository<CourseFee, Long> {
    List<CourseFee> findByCourse(Course course);
}