package com.example.dto;

public class PaymentTransaction {
    private String transactionId;
    private String date;
    private double amount;
    private String status;
    private String paymentMethod;

    public PaymentTransaction() {}

    public PaymentTransaction(String transactionId, String date, double amount, String status, String paymentMethod) {
        this.transactionId = transactionId;
        this.date = date;
        this.amount = amount;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
