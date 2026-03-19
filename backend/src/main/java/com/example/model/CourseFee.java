package com.example.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "course_fees")
public class CourseFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private String feeLabel;
    private BigDecimal amount;
    private LocalDate dueDate;

    public CourseFee() {}

    public Long getId()           { return id; }
    public Course getCourse()     { return course; }
    public String getFeeLabel()   { return feeLabel; }
    public BigDecimal getAmount() { return amount; }
    public LocalDate getDueDate() { return dueDate; }

    public void setId(Long id)               { this.id = id; }
    public void setCourse(Course course)     { this.course = course; }
    public void setFeeLabel(String label)    { this.feeLabel = label; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setDueDate(LocalDate date)   { this.dueDate = date; }
}