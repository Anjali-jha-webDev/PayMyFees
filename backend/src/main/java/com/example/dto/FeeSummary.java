package com.example.dto;

import java.util.List;

public class FeeSummary {
    private double total;
    private double paid;
    private double outstanding;
    private List<FeeBreakdown> breakdown;
    private String deadlineReminder;

    public FeeSummary() {}

    public FeeSummary(double total, double paid, double outstanding, List<FeeBreakdown> breakdown, String deadlineReminder) {
        this.total = total;
        this.paid = paid;
        this.outstanding = outstanding;
        this.breakdown = breakdown;
        this.deadlineReminder = deadlineReminder;
    }

    public double getTotal(){
        return total;
    }

    public void setTotal(double t){
        total = t;
    }

    public double getPaid(){
        return paid;
    }

    public void setPaid(double p){
        paid = p;
    }

    public double getOutstanding(){
        return outstanding;
    }

    public void setOutstanding(double o){
        outstanding = o;
    }

    public List<FeeBreakdown> getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(List<FeeBreakdown> breakdown) {
        this.breakdown = breakdown;
    }

    public String getDeadlineReminder() {
        return deadlineReminder;
    }

    public void setDeadlineReminder(String deadlineReminder) {
        this.deadlineReminder = deadlineReminder;
    }
}
