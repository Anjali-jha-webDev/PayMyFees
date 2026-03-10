import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // active tab
  const [activeTab, setActiveTab] = useState("overview");

  // data states
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);

  // fee form state
  const [feeForm, setFeeForm] = useState({
    course: "",
    semester: "",
    amount: "",
  });

  // edit fee state
  const [editFeeId, setEditFeeId] = useState(null);

  // loading state
  const [loading, setLoading] = useState(false);

  // ── FETCH DATA ON LOAD ──────────────────────
  useEffect(() => {
    fetchStudents();
    fetchPayments();
    fetchFees();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await adminApi.get("/students");
      setStudents(res.data);
    } catch {
      toast.error("Failed to load students");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await adminApi.get("/payments");
      setPayments(res.data);
    } catch {
      toast.error("Failed to load payments");
    }
  };

  const fetchFees = async () => {
    try {
      const res = await adminApi.get("/fees");
      setFees(res.data);
    } catch {
      toast.error("Failed to load fees");
    }
  };

  // ── STATS ───────────────────────────────────
  const totalStudents = students.length;
  const totalPayments = payments.length;
  const pendingPayments = payments.filter(
    (p) => p.status === "PENDING"
  ).length;
  const totalCollected = payments
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.amount, 0);

  // ── PAYMENT ACTIONS ─────────────────────────
  const handleApprove = async (id) => {
    try {
      await adminApi.put(`/payments/approve/${id}`);
      toast.success("Payment Approved");
      fetchPayments();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminApi.put(`/payments/reject/${id}`);
      toast.warning("Payment Rejected");
      fetchPayments();
    } catch {
      toast.error("Failed to reject");
    }
  };

  // ── FEE ACTIONS ──────────────────────────────
  const handleFeeSubmit = async (e) => {
    e.preventDefault();

    if (!feeForm.course || !feeForm.semester || !feeForm.amount) {
      toast.error("Please fill all fee fields");
      return;
    }

    setLoading(true);
    try {
      if (editFeeId) {
        await adminApi.put(`/fees/${editFeeId}`, feeForm);
        toast.success("Fee Updated");
        setEditFeeId(null);
      } else {
        await adminApi.post("/fees", feeForm);
        toast.success("Fee Added");
      }
      setFeeForm({ course: "", semester: "", amount: "" });
      fetchFees();
    } catch {
      toast.error("Failed to save fee");
    }
    setLoading(false);
  };

  const handleEditFee = (fee) => {
    setEditFeeId(fee.id);
    setFeeForm({
      course: fee.course,
      semester: fee.semester,
      amount: fee.amount,
    });
    setActiveTab("fees");
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm("Delete this fee?")) return;
    try {
      await adminApi.delete(`/fees/${id}`);
      toast.success("Fee Deleted");
      fetchFees();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── LOGOUT ───────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // ── STATUS BADGE COLOR ───────────────────────
  const statusColor = (status) => {
    if (status === "APPROVED") return "badge badge-green";
    if (status === "REJECTED") return "badge badge-red";
    return "badge badge-yellow";
  };

  // ────────────────────────────────────────────
  return (
    <div className="admin-layout">

      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="nav-brand">🏫 College Admin Panel</div>
        <div className="nav-right">
          <span className="nav-user">👤 {user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* TABS */}
      <div className="admin-tabs">
        {["overview", "students", "payments", "fees"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview" && "📊 Overview"}
            {tab === "students" && "🎓 Students"}
            {tab === "payments" && "💳 Payments"}
            {tab === "fees" && "📋 Fee Structure"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        <div className="tab-panel">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div>
              <h2 className="section-title">Dashboard Overview</h2>

              {/* STATS CARDS */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Students</p>
                    <h3 className="stat-number">{totalStudents}</h3>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-icon">💳</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Payments</p>
                    <h3 className="stat-number">{totalPayments}</h3>
                  </div>
                </div>

                <div className="stat-card yellow">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <p className="stat-label">Pending Payments</p>
                    <h3 className="stat-number">{pendingPayments}</h3>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Collected</p>
                    <h3 className="stat-number">₹{totalCollected}</h3>
                  </div>
                </div>
              </div>

              {/* RECENT PAYMENTS */}
              <h3 className="section-subtitle">Recent Payments</h3>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 5).map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.student?.username}</td>
                        <td>₹{p.amount}</td>
                        <td>
                          <span className={statusColor(p.status)}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No payments yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STUDENTS TAB ── */}
          {activeTab === "students" && (
            <div>
              <h2 className="section-title">All Students</h2>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => {
                      const studentPayments = payments.filter(
                        (p) => p.student?.id === s.id
                      );
                      const latestStatus =
                        studentPayments.length > 0
                          ? studentPayments[studentPayments.length - 1].status
                          : "NO PAYMENT";
                      return (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td>{s.username}</td>
                          <td>{s.email}</td>
                          <td>
                            <span className={statusColor(latestStatus)}>
                              {latestStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No students registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PAYMENTS TAB ── */}
          {activeTab === "payments" && (
            <div>
              <h2 className="section-title">All Payments</h2>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.student?.username}</td>
                        <td>₹{p.amount}</td>
                        <td>
                          <span className={statusColor(p.status)}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="action-btns">
                          {p.status === "PENDING" && (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() => handleApprove(p.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(p.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {p.status !== "PENDING" && (
                            <span className="action-done">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="no-data">
                          No payments yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── FEE STRUCTURE TAB ── */}
          {activeTab === "fees" && (
            <div>
              <h2 className="section-title">Fee Structure</h2>

              {/* FEE FORM */}
              <div className="fee-form-card">
                <h3>{editFeeId ? "✏️ Edit Fee" : "➕ Add New Fee"}</h3>
                <form className="fee-form" onSubmit={handleFeeSubmit}>
                  <input
                    type="text"
                    placeholder="Course (e.g. B.Tech)"
                    value={feeForm.course}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, course: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Semester (e.g. Sem 1)"
                    value={feeForm.semester}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, semester: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={feeForm.amount}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, amount: e.target.value })
                    }
                  />
                  <div className="fee-form-btns">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? "Saving..." : editFeeId ? "Update Fee" : "Add Fee"}
                    </button>
                    {editFeeId && (
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setEditFeeId(null);
                          setFeeForm({ course: "", semester: "", amount: "" });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* FEE TABLE */}
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Semester</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f, i) => (
                      <tr key={f.id}>
                        <td>{i + 1}</td>
                        <td>{f.course}</td>
                        <td>{f.semester}</td>
                        <td>₹{f.amount}</td>
                        <td className="action-btns">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditFee(f)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteFee(f.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {fees.length === 0 && (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No fees added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;