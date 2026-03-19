import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useFees } from "../components/FeeContext";
import { AlertBanner } from "../components/StudentLayout";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { feeSummary, feeLoading } = useFees();

  const [user, setUser]                     = React.useState({ name: "", id: "" });
  const [paymentHistory, setPaymentHistory] = React.useState([]);

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const parsed = JSON.parse(stored);
    setUser({ name: parsed.username || "", id: parsed.id || "" });
    API.get(`/fees/history/${parsed.username}`)
      .then(res => setPaymentHistory(res.data))
      .catch(() => {});
  }, []);

  const badgeClass = (s) => {
    if (s === "PAID" || s === "APPROVED") return "badge badge-green";
    if (s === "PARTIAL")                  return "badge badge-yellow";
    if (s === "REJECTED")                 return "badge badge-red";
    return "badge badge-yellow";
  };

  if (feeLoading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"14px", color:"#64748b" }}>
      <div className="loading-spinner" />
      Loading your dashboard...
    </div>
  );

  const fees = feeSummary || { total:0, paid:0, remaining:0, breakdown:[], deadlineReminder:"" };

  return (
    <>
      <h2 className="section-title">Welcome back, {user.name}</h2>

      {/* Due date alert banner */}
      <AlertBanner />

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card blue" style={{ cursor:"pointer" }} onClick={() => navigate("/student/fee-summary")}>
          <div className="stat-icon"><i className="bx bxs-rupee"></i></div>
          <div><p className="stat-label">Total Fees</p><h3 className="stat-number">₹{fees.total?.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card green" style={{ cursor:"pointer" }} onClick={() => navigate("/student/fee-summary")}>
          <div className="stat-icon"><i className="bx bxs-check-circle"></i></div>
          <div><p className="stat-label">Amount Paid</p><h3 className="stat-number">₹{fees.paid?.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card red" style={{ cursor:"pointer" }} onClick={() => navigate("/student/pay-fees")}>
          <div className="stat-icon"><i className="bx bxs-time"></i></div>
          <div><p className="stat-label">Remaining</p><h3 className="stat-number">₹{fees.remaining?.toLocaleString()}</h3></div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
        <div className="content-card">
          <h3>Fee Breakdown</h3>
          {fees.breakdown?.length > 0 ? (
            <>
              {fees.breakdown.map((item, idx) => (
                <div className="fee-list-item" key={idx}>
                  <span className="fee-list-label">{item.label}</span>
                  <span className="fee-list-amount">₹{item.amount?.toLocaleString()}</span>
                </div>
              ))}
              <button className="btn-primary" onClick={() => navigate("/student/fee-summary")}>View Full Summary</button>
            </>
          ) : (
            <p style={{ color:"#94a3b8", fontSize:"14px" }}>No fee data found.</p>
          )}
        </div>

        <div className="content-card">
          <h3>Recent Payments</h3>
          {paymentHistory?.length > 0 ? (
            <>
              <table className="student-table">
                <thead><tr><th>Trans. ID</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {paymentHistory.slice(0,4).map((p,i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:"monospace", fontSize:"13px" }}>{p.transactionId}</td>
                      <td>₹{p.amount?.toLocaleString()}</td>
                      <td><span className={badgeClass(p.status)}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-primary" onClick={() => navigate("/student/payment-history")}>View All</button>
            </>
          ) : (
            <p style={{ color:"#94a3b8", fontSize:"14px" }}>No payment history found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;