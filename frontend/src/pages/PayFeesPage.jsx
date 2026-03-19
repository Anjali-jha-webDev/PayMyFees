import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useFees } from "../components/FeeContext";

const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "Net Banking"];
const INSTALLMENT_LABELS = { 1: "1st Installment", 2: "2nd Installment", 3: "3rd Installment" };

const PayFeesPage = () => {
  const { feeSummary, feeLoading, refreshFees } = useFees();
  const [selectedInst, setSelectedInst]         = useState(null);
  const [paymentMethod, setPaymentMethod]        = useState("");
  const [submitting, setSubmitting]              = useState(false);
  const [lastPaid, setLastPaid]                  = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleSelectInst = (inst) => {
    if (!inst.payable || inst.status === "PAID") return;
    setSelectedInst(inst);
    setPaymentMethod("");
  };

  const handlePay = async () => {
    if (!selectedInst || !paymentMethod) { toast.warning("Select a payment method first."); return; }
    setSubmitting(true);
    try {
      const res = await API.post("/fees/pay", {
        username: user.username, paymentMethod, totalAmount: selectedInst.amount, installmentNumber: selectedInst.number,
      });
      setLastPaid(res.data);
      setSelectedInst(null);
      setPaymentMethod("");
      await refreshFees();
      toast.success(`${INSTALLMENT_LABELS[res.data.installmentNumber]} paid!`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (feeLoading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"14px", color:"#64748b" }}>
      <div className="loading-spinner" />Loading...
    </div>
  );

  if (!feeSummary) return null;
  const { total, paid, remaining, installments = [], courseName } = feeSummary;
  const allPaid = remaining <= 0.01;

  return (
    <>
      <h2 className="section-title">Pay Fees — {courseName}</h2>

      {/* ── BALANCE OVERVIEW ── */}
      <div className="stats-grid" style={{ marginBottom:"28px" }}>
        <div className="stat-card blue">
          <div className="stat-icon"><i className="bx bxs-rupee"></i></div>
          <div><p className="stat-label">Total Fees</p><h3 className="stat-number">₹{total.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><i className="bx bxs-check-circle"></i></div>
          <div><p className="stat-label">Amount Paid</p><h3 className="stat-number">₹{paid.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><i className="bx bxs-time"></i></div>
          <div><p className="stat-label">Remaining</p><h3 className="stat-number">₹{remaining.toLocaleString()}</h3></div>
        </div>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {lastPaid && (
        <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderLeft:"4px solid #22c55e", borderRadius:"12px", padding:"16px 20px", marginBottom:"24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontWeight:700, color:"#166534", margin:"0 0 4px", display:"flex", alignItems:"center", gap:"6px" }}>
              <i className="bx bxs-check-circle"></i> {lastPaid.message}
            </p>
            <p style={{ fontSize:"13px", color:"#15803d", margin:0 }}>
              Transaction: <strong style={{ fontFamily:"monospace" }}>{lastPaid.transactionId}</strong>
              &nbsp;·&nbsp;Receipt: <strong style={{ fontFamily:"monospace" }}>{lastPaid.receiptId}</strong>
              &nbsp;·&nbsp;₹{lastPaid.amount?.toLocaleString()} via {lastPaid.paymentMethod}
            </p>
          </div>
          <button onClick={() => setLastPaid(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#166534", fontSize:"18px" }}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      {allPaid ? (
        <div style={{ textAlign:"center", padding:"60px 20px", background:"white", borderRadius:"16px", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          <i className="bx bxs-party" style={{ fontSize:"52px", color:"#22c55e", display:"block", marginBottom:"12px" }}></i>
          <h3 style={{ color:"#166534", marginBottom:"8px" }}>All fees paid!</h3>
          <p style={{ color:"#64748b" }}>You have no outstanding balance. Check Receipts for your records.</p>
        </div>
      ) : (
        <>
          <h3 className="section-subtitle">Installment Plan</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", marginBottom:"28px" }}>
            {installments.map((inst) => {
              const isPaid     = inst.status === "PAID";
              const isPayable  = inst.payable;
              const isSelected = selectedInst?.number === inst.number;
              return (
                <div key={inst.number} onClick={() => handleSelectInst(inst)}
                  style={{ background: isPaid ? "#f0fdf4" : isSelected ? "#eef2ff" : "white", border: isPaid ? "2px solid #86efac" : isSelected ? "2px solid #6366f1" : isPayable ? "2px solid #e2e8f0" : "2px dashed #e2e8f0", borderRadius:"16px", padding:"24px 20px", cursor: isPayable && !isPaid ? "pointer" : "default", opacity: !isPaid && !isPayable ? 0.5 : 1, transition:"all 0.2s ease", boxShadow: isSelected ? "0 0 0 4px rgba(99,102,241,0.15)" : "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                    <span style={{ fontSize:"13px", fontWeight:700, color: isPaid ? "#166534" : isSelected ? "#4f46e5" : "#64748b", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                      {INSTALLMENT_LABELS[inst.number]}
                    </span>
                    {isPaid     && <span style={{ background:"#dcfce7", color:"#16a34a", fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"20px", display:"flex", alignItems:"center", gap:"4px" }}><i className="bx bxs-check-circle"></i>PAID</span>}
                    {!isPaid && !isPayable && <i className="bx bxs-lock" style={{ fontSize:"18px", color:"#94a3b8" }}></i>}
                    {isPayable && !isPaid && <span style={{ background: isSelected ? "#e0e7ff" : "#f1f5f9", color: isSelected ? "#4f46e5" : "#64748b", fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"20px" }}>{isSelected ? "SELECTED" : "DUE"}</span>}
                  </div>
                  <div style={{ fontSize:"28px", fontWeight:700, color: isPaid ? "#166534" : "#1e293b", marginBottom:"8px" }}>
                    ₹{inst.amount.toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 })}
                  </div>
                  <p style={{ fontSize:"13px", color:"#94a3b8", margin:0 }}>
                    {isPaid ? "Payment complete" : isPayable ? "Click to pay this now" : "Pay previous instalment first"}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedInst && (
            <div style={{ background:"white", borderRadius:"16px", padding:"28px", boxShadow:"0 2px 10px rgba(0,0,0,0.06)", maxWidth:"460px" }}>
              <h3 style={{ margin:"0 0 20px", fontSize:"16px", fontWeight:600, color:"#1e293b" }}>
                <i className="bx bxs-credit-card" style={{ marginRight:"8px", color:"#4f46e5" }}></i>
                Confirm Payment — {INSTALLMENT_LABELS[selectedInst.number]}
              </h3>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #f1f5f9", fontSize:"14px" }}>
                <span style={{ color:"#64748b" }}>Amount</span>
                <span style={{ fontWeight:700, color:"#1e293b" }}>₹{selectedInst.amount.toLocaleString(undefined, { minimumFractionDigits:2 })}</span>
              </div>
              <div style={{ margin:"20px 0 14px" }}>
                <label style={{ fontSize:"13px", fontWeight:600, color:"#475569", display:"block", marginBottom:"6px" }}>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={submitting}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:"8px", border:`1.5px solid ${paymentMethod ? "#4f46e5" : "#e2e8f0"}`, fontSize:"14px", color: paymentMethod ? "#1e293b" : "#94a3b8", background:"white", outline:"none", cursor:"pointer" }}>
                  <option value="">-- Select method --</option>
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={handlePay} disabled={!paymentMethod || submitting}
                  style={{ flex:1, padding:"12px", background: (!paymentMethod || submitting) ? "#c7d2fe" : "#4f46e5", color:"white", border:"none", borderRadius:"10px", cursor: (!paymentMethod || submitting) ? "not-allowed" : "pointer", fontWeight:700, fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                  {submitting
                    ? <><span style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"white", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Processing...</>
                    : <><i className="bx bxs-credit-card"></i>Pay ₹{selectedInst.amount.toLocaleString(undefined, { minimumFractionDigits:2 })}</>
                  }
                </button>
                <button onClick={() => { setSelectedInst(null); setPaymentMethod(""); }} disabled={submitting}
                  style={{ padding:"12px 18px", background:"#f1f5f9", color:"#475569", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:600, fontSize:"14px" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default PayFeesPage;
