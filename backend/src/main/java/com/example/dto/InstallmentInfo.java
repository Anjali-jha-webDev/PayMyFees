package com.example.dto;

public class InstallmentInfo {
    private int number;       // 1, 2, or 3
    private double amount;
    private String status;    // "PAID" or "UNPAID"
    private boolean payable;  // true = student can pay this right now

    public InstallmentInfo() {}

    public InstallmentInfo(int number, double amount, String status, boolean payable) {
        this.number  = number;
        this.amount  = amount;
        this.status  = status;
        this.payable = payable;
    }

    public int     getNumber()  { return number;  }
    public double  getAmount()  { return amount;  }
    public String  getStatus()  { return status;  }
    public boolean isPayable()  { return payable; }

    public void setNumber(int number)    { this.number  = number;  }
    public void setAmount(double amount) { this.amount  = amount;  }
    public void setStatus(String status) { this.status  = status;  }
    public void setPayable(boolean p)    { this.payable = p;       }
}