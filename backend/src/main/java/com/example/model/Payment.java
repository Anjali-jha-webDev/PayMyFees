package com.example.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String    transactionId;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String    status;         // PAID (direct — no more PENDING/APPROVED)
    private String    paymentMethod;
    private Integer   installmentNumber; // 1, 2, or 3 — null for legacy seed data

    public Payment() {}

    public Long       getId()                 { return id;                 }
    public User       getUser()               { return user;               }
    public String     getTransactionId()      { return transactionId;      }
    public LocalDate  getPaymentDate()        { return paymentDate;        }
    public BigDecimal getAmount()             { return amount;             }
    public String     getStatus()             { return status;             }
    public String     getPaymentMethod()      { return paymentMethod;      }
    public Integer    getInstallmentNumber()  { return installmentNumber;  }

    public void setId(Long id)                             { this.id                 = id;                 }
    public void setUser(User user)                         { this.user               = user;               }
    public void setTransactionId(String tid)               { this.transactionId      = tid;                }
    public void setPaymentDate(LocalDate date)             { this.paymentDate        = date;               }
    public void setAmount(BigDecimal amount)               { this.amount             = amount;             }
    public void setStatus(String status)                   { this.status             = status;             }
    public void setPaymentMethod(String method)            { this.paymentMethod      = method;             }
    public void setInstallmentNumber(Integer num)          { this.installmentNumber  = num;                }
}