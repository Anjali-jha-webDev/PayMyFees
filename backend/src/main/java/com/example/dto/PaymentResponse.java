package com.example.dto;

public class PaymentResponse {
    private String transactionId;
    private String receiptId;
    private String status;
    private double amount;
    private int    installmentNumber;
    private String paymentMethod;
    private String paymentDate;
    private String message;

    public PaymentResponse() {}

    public PaymentResponse(String transactionId, String receiptId, String status,
                           double amount, int installmentNumber,
                           String paymentMethod, String paymentDate, String message) {
        this.transactionId     = transactionId;
        this.receiptId         = receiptId;
        this.status            = status;
        this.amount            = amount;
        this.installmentNumber = installmentNumber;
        this.paymentMethod     = paymentMethod;
        this.paymentDate       = paymentDate;
        this.message           = message;
    }

    public String getTransactionId()    { return transactionId;     }
    public String getReceiptId()        { return receiptId;         }
    public String getStatus()           { return status;            }
    public double getAmount()           { return amount;            }
    public int    getInstallmentNumber(){ return installmentNumber; }
    public String getPaymentMethod()    { return paymentMethod;     }
    public String getPaymentDate()      { return paymentDate;       }
    public String getMessage()          { return message;           }

    public void setTransactionId(String v)    { this.transactionId     = v; }
    public void setReceiptId(String v)        { this.receiptId         = v; }
    public void setStatus(String v)           { this.status            = v; }
    public void setAmount(double v)           { this.amount            = v; }
    public void setInstallmentNumber(int v)   { this.installmentNumber = v; }
    public void setPaymentMethod(String v)    { this.paymentMethod     = v; }
    public void setPaymentDate(String v)      { this.paymentDate       = v; }
    public void setMessage(String v)          { this.message           = v; }
}