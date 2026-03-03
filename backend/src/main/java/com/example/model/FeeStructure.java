package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fee_structure")
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String course;
    private String semester;
    private Double amount;

    public FeeStructure() {}

    // Getters
    public Long getId() { return id; }
    public String getCourse() { return course; }
    public String getSemester() { return semester; }
    public Double getAmount() { return amount; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setCourse(String course) { this.course = course; }
    public void setSemester(String semester) { this.semester = semester; }
    public void setAmount(Double amount) { this.amount = amount; }
}