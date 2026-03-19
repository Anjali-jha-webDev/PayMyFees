package com.example.dto;

import java.util.List;

public class FeeSummary {
    private double total;
    private double paid;
    private double remaining;
    private String courseName;
    private String deadlineReminder;
    private List<InstallmentInfo> installments;  // 3 installment slots
    private List<FeeBreakdown> breakdown;         // kept for FeeSummaryPage

    public FeeSummary() {}

    public double              getTotal()            { return total;            }
    public double              getPaid()             { return paid;             }
    public double              getRemaining()        { return remaining;        }
    public String              getCourseName()       { return courseName;       }
    public String              getDeadlineReminder() { return deadlineReminder; }
    public List<InstallmentInfo> getInstallments()   { return installments;     }
    public List<FeeBreakdown>  getBreakdown()        { return breakdown;        }

    public void setTotal(double total)                          { this.total            = total;            }
    public void setPaid(double paid)                            { this.paid             = paid;             }
    public void setRemaining(double remaining)                  { this.remaining        = remaining;        }
    public void setCourseName(String courseName)                { this.courseName       = courseName;       }
    public void setDeadlineReminder(String deadlineReminder)    { this.deadlineReminder = deadlineReminder; }
    public void setInstallments(List<InstallmentInfo> list)     { this.installments     = list;             }
    public void setBreakdown(List<FeeBreakdown> breakdown)      { this.breakdown        = breakdown;        }

    // Backwards-compat: outstanding = remaining
    public double getOutstanding() { return remaining; }
    public void setOutstanding(double o) { this.remaining = o; }
}