import React, { useState, useEffect } from "react";
import API from "../services/api";

const PaymentHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user.username) return;
    API.get(`/fees/history/${user.username}`)
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load payment history"))
      .finally(() => setLoading(false));
  }, [user.username]);

  const badgeClass = (s) => {
    if (s === "PAID" || s === "APPROVED") return "badge badge-green";
    if (s === "PARTIAL")                  return "badge badge-yellow";
    if (s === "REJECTED")                 return "badge badge-red";
    return "badge badge-yellow";
  };

  const totalPaid    = history.filter(p => p.status === "PAID" || p.status === "APPROVED").reduce((s, p) => s + p.amount, 0);
  const totalPartial = history.filter(p => p.status === "PARTIAL").reduce((s, p) => s + p.amount, 0);

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"14px", color:"#64748b" }}>
      <div className="loading-spinner" />Loading...
    </div>
  );

  return (
    <>
      <h2 className="section-title">Payment History</h2>

      {error && (
        <div className="student-error">
          <i className="bx bxs-error" style={{ marginRight:"6px" }}></i>{error}
        </div>
      )}

      {history.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon"><i className="bx bxs-clipboard"></i></div>
            <div><p className="stat-label">Total Transactions</p><h3 className="stat-number">{history.length}</h3></div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><i className="bx bxs-check-circle"></i></div>
            <div><p className="stat-label">Total Paid</p><h3 className="stat-number">₹{totalPaid.toLocaleString()}</h3></div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><i className="bx bxs-time-five"></i></div>
            <div><p className="stat-label">Partial Payments</p><h3 className="stat-number">₹{totalPartial.toLocaleString()}</h3></div>
          </div>
        </div>
      )}

      <h3 className="section-subtitle">All Transactions</h3>
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr><th>#</th><th>Transaction ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
          </thead>
          <tbody>
            {history.map((t, i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td style={{ fontFamily:"monospace", fontSize:"13px" }}>{t.transactionId}</td>
                <td style={{ color:"#64748b" }}>{t.date}</td>
                <td style={{ fontWeight:600 }}>₹{t.amount?.toLocaleString()}</td>
                <td>{t.paymentMethod}</td>
                <td><span className={badgeClass(t.status)}>{t.status}</span></td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td colSpan="6" className="no-data">No payment history found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PaymentHistoryPage;