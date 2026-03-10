package com.example.dto;

public class FeeBreakdown {
    private String label;
    private double amount;
    private String dueDate;

    public FeeBreakdown() {}

    public FeeBreakdown(String label, double amount, String dueDate) {
        this.label = label;
        this.amount = amount;
        this.dueDate = dueDate;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
