package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which student made this payment
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private Double amount;

    // PENDING / APPROVED / REJECTED
    private String status;

    private LocalDateTime paymentDate;

    public Payment() {}

    // Getters
    public Long getId() { return id; }
    public User getStudent() { return student; }
    public Double getAmount() { return amount; }
    public String getStatus() { return status; }
    public LocalDateTime getPaymentDate() { return paymentDate; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudent(User student) { this.student = student; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setStatus(String status) { this.status = status; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
}