package com.example.dto;

public class PaymentRequest {
    private String  username;
    private String  paymentMethod;
    private double  totalAmount;
    private int     installmentNumber;  // which installment (1, 2, or 3)

    public PaymentRequest() {}

    public String  getUsername()          { return username;          }
    public String  getPaymentMethod()     { return paymentMethod;     }
    public double  getTotalAmount()       { return totalAmount;       }
    public int     getInstallmentNumber() { return installmentNumber; }

    public void setUsername(String username)              { this.username          = username;          }
    public void setPaymentMethod(String paymentMethod)    { this.paymentMethod     = paymentMethod;     }
    public void setTotalAmount(double totalAmount)        { this.totalAmount       = totalAmount;       }
    public void setInstallmentNumber(int num)             { this.installmentNumber = num;               }
}