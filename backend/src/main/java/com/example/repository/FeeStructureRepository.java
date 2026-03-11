package com.example.repository;

import com.example.model.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeStructureRepository 
    extends JpaRepository<FeeStructure, Long> {
}