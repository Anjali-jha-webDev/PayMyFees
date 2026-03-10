package com.example.dto;

import java.util.List;

public class Receipt {
    private String receiptId;
    private String date;
    private double amount;
    private String paymentMethod;
    private List<String> feesIncluded;
    private String status;

    public Receipt() {}

    public Receipt(String receiptId, String date, double amount, String paymentMethod, List<String> feesIncluded, String status) {
        this.receiptId = receiptId;
        this.date = date;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.feesIncluded = feesIncluded;
        this.status = status;
    }

    public String getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(String receiptId) {
        this.receiptId = receiptId;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<String> getFeesIncluded() {
        return feesIncluded;
    }

    public void setFeesIncluded(List<String> feesIncluded) {
        this.feesIncluded = feesIncluded;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
