import React from "react";
import { useFees } from "../components/FeeContext";
import { AlertBanner } from "../components/StudentLayout";

const FeeSummaryPage = () => {
  const { feeSummary: fees, feeLoading: loading } = useFees();

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"14px", color:"#64748b" }}>
      <div className="loading-spinner" />Loading...
    </div>
  );

  return (
    <>
      <h2 className="section-title">Fee Summary</h2>

      {/* Due date alert banner */}
      <AlertBanner />

      {fees && (
        <>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon"><i className="bx bxs-rupee"></i></div>
              <div><p className="stat-label">Total Fees</p><h3 className="stat-number">₹{fees.total?.toLocaleString() || 0}</h3></div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><i className="bx bxs-check-circle"></i></div>
              <div><p className="stat-label">Amount Paid</p><h3 className="stat-number">₹{fees.paid?.toLocaleString() || 0}</h3></div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon"><i className="bx bxs-time"></i></div>
              <div><p className="stat-label">Remaining Balance</p><h3 className="stat-number">₹{fees.remaining?.toLocaleString() || 0}</h3></div>
            </div>
          </div>

          {fees.installments?.length > 0 && (
            <>
              <h3 className="section-subtitle">Instalment Status</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"28px" }}>
                {fees.installments.map((inst) => (
                  <div key={inst.number} style={{ background: inst.status === "PAID" ? "#f0fdf4" : "white", border: inst.status === "PAID" ? "1.5px solid #86efac" : "1.5px solid #e2e8f0", borderRadius:"12px", padding:"18px 16px" }}>
                    <div style={{ fontSize:"12px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>
                      Instalment {inst.number}
                    </div>
                    <div style={{ fontSize:"22px", fontWeight:700, color: inst.status === "PAID" ? "#166534" : "#1e293b", marginBottom:"8px" }}>
                      ₹{inst.amount?.toLocaleString(undefined, { minimumFractionDigits:2 })}
                    </div>
                    <span style={{ background: inst.status === "PAID" ? "#dcfce7" : "#fef9c3", color: inst.status === "PAID" ? "#16a34a" : "#ca8a04", fontSize:"12px", fontWeight:700, padding:"3px 10px", borderRadius:"20px" }}>
                      {inst.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {fees.breakdown?.length > 0 && (
            <>
              <h3 className="section-subtitle">Fee Breakdown</h3>
              <div className="table-wrapper">
                <table className="student-table">
                  <thead><tr><th>#</th><th>Fee Type</th><th>Amount</th><th>Due Date</th></tr></thead>
                  <tbody>
                    {fees.breakdown.map((item, index) => {
                      // Highlight overdue / due-soon rows
                      const today = new Date(); today.setHours(0,0,0,0);
                      const due   = item.dueDate && item.dueDate !== "—" ? new Date(item.dueDate) : null;
                      if (due) due.setHours(0,0,0,0);
                      const daysLeft = due ? Math.ceil((due - today) / 86400000) : null;
                      const rowBg = daysLeft === null ? "" : daysLeft < 0 ? "#fff5f5" : daysLeft <= 7 ? "#fffbeb" : "";

                      return (
                        <tr key={index} style={{ background: rowBg }}>
                          <td style={{ color:"#94a3b8" }}>{index+1}</td>
                          <td style={{ fontWeight:500 }}>{item.label}</td>
                          <td>₹{item.amount?.toLocaleString()}</td>
                          <td>
                            <span style={{ display:"flex", alignItems:"center", gap:"6px", color: daysLeft !== null && daysLeft < 0 ? "#dc2626" : daysLeft !== null && daysLeft <= 7 ? "#ca8a04" : "#94a3b8" }}>
                              {daysLeft !== null && daysLeft < 0  && <i className="bx bxs-error"     style={{ fontSize:"14px" }}></i>}
                              {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && <i className="bx bxs-time-five" style={{ fontSize:"14px" }}></i>}
                              {item.dueDate}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default FeeSummaryPage;
