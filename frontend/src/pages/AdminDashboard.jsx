import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";
import API from "../services/api";
import { toast } from "react-toastify";
import "./AdminDashboard.css";
import "boxicons/css/boxicons.min.css";

const INST_LABEL = { 1: "1st", 2: "2nd", 3: "3rd" };

// ── Reusable search + filter bar ────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position:"relative", flex:1, minWidth:"200px" }}>
    <i className="bx bx-search" style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"16px", color:"#94a3b8" }}></i>
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width:"100%", padding:"9px 12px 9px 36px", border:"1.5px solid #e2e8f0", borderRadius:"8px", fontSize:"14px", outline:"none", boxSizing:"border-box", color:"#1e293b", background:"white", transition:"border 0.2s ease" }}
      onFocus={(e)  => e.target.style.borderColor = "#4f46e5"}
      onBlur={(e)   => e.target.style.borderColor = "#e2e8f0"}
    />
    {value && (
      <i className="bx bx-x" onClick={() => onChange("")}
        style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", fontSize:"16px", color:"#94a3b8", cursor:"pointer" }}></i>
    )}
  </div>
);

const FilterSelect = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    style={{ padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:"8px", fontSize:"14px", outline:"none", color: value ? "#1e293b" : "#94a3b8", background:"white", cursor:"pointer", minWidth:"140px" }}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const ResultCount = ({ filtered, total }) => (
  <span style={{ fontSize:"13px", color:"#94a3b8", alignSelf:"center" }}>
    {filtered === total ? `${total} total` : `${filtered} of ${total}`}
  </span>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents]   = useState([]);
  const [payments, setPayments]   = useState([]);
  const [courses, setCourses]     = useState([]);
  const [studentFees, setStudentFees] = useState({});

  // ── SEARCH / FILTER STATE ─────────────────────────────────────────────────
  const [studentSearch, setStudentSearch]       = useState("");
  const [studentCourseFilter, setStudentCourseFilter] = useState("");
  const [studentPayFilter, setStudentPayFilter] = useState("");   // "paid" | "unpaid" | ""

  const [paymentSearch, setPaymentSearch]         = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentCourseFilter, setPaymentCourseFilter] = useState("");
  const [paymentInstFilter, setPaymentInstFilter] = useState("");  // "1"|"2"|"3"|""

  // ── FORM STATE ────────────────────────────────────────────────────────────
  const [courseForm, setCourseForm]           = useState({ name: "", duration: "" });
  const [editCourseId, setEditCourseId]       = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseFees, setCourseFees]           = useState([]);
  const [feeItemForm, setFeeItemForm]         = useState({ feeLabel: "", amount: "", dueDate: "" });
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignCourseId, setAssignCourseId]   = useState("");

  // ── RESET PASSWORD MODAL ──────────────────────────────────────────────────
  const [resetModal, setResetModal]     = useState(null);
  const [newPassword, setNewPassword]   = useState("");
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [resetting, setResetting]       = useState(false);

  useEffect(() => { fetchStudents(); fetchPayments(); fetchCourses(); }, []);

  useEffect(() => {
    if (students.length === 0) return;
    students.forEach(async (s) => {
      try {
        const res = await API.get(`/fees/summary/${s.username}`);
        setStudentFees(prev => ({ ...prev, [s.username]: res.data }));
      } catch {}
    });
  }, [students]);

  const fetchStudents   = async () => { try { const r = await adminApi.get("/students"); setStudents(r.data); } catch { toast.error("Failed to load students"); } };
  const fetchPayments   = async () => { try { const r = await adminApi.get("/payments"); setPayments(r.data); } catch { toast.error("Failed to load payments"); } };
  const fetchCourses    = async () => { try { const r = await adminApi.get("/courses");  setCourses(r.data);  } catch { toast.error("Failed to load courses");  } };
  const fetchCourseFees = async (courseId) => { try { const r = await adminApi.get(`/courses/${courseId}/fees`); setCourseFees(r.data); } catch { toast.error("Failed"); } };

  // ── FILTERED STUDENTS ─────────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = studentSearch.toLowerCase();
      const matchesSearch = !q
        || s.username.toLowerCase().includes(q)
        || s.email.toLowerCase().includes(q);

      const matchesCourse = !studentCourseFilter
        || (s.course?.id?.toString() === studentCourseFilter);

      const sf = studentFees[s.username];
      const matchesPay = !studentPayFilter
        || (studentPayFilter === "paid"   && sf && sf.remaining <= 0.01)
        || (studentPayFilter === "unpaid" && sf && sf.remaining >  0.01)
        || (studentPayFilter === "none"   && !sf?.paid);

      return matchesSearch && matchesCourse && matchesPay;
    });
  }, [students, studentSearch, studentCourseFilter, studentPayFilter, studentFees]);

  // ── FILTERED PAYMENTS ─────────────────────────────────────────────────────
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const q = paymentSearch.toLowerCase();
      const matchesSearch = !q
        || p.user?.username?.toLowerCase().includes(q)
        || p.transactionId?.toLowerCase().includes(q);

      const matchesStatus = !paymentStatusFilter || p.status === paymentStatusFilter;
      const matchesCourse = !paymentCourseFilter || p.user?.course?.id?.toString() === paymentCourseFilter;
      const matchesInst   = !paymentInstFilter   || p.installmentNumber?.toString() === paymentInstFilter;

      return matchesSearch && matchesStatus && matchesCourse && matchesInst;
    });
  }, [payments, paymentSearch, paymentStatusFilter, paymentCourseFilter, paymentInstFilter]);

  // ── STATS ─────────────────────────────────────────────────────────────────
  const totalStudents  = students.length;
  const totalPayments  = payments.length;
  const totalCollected = payments.filter(p => p.status === "PAID").reduce((s, p) => s + Number(p.amount), 0);
  const fullyPaidCount = students.filter(s => { const sf = studentFees[s.username]; return sf && sf.remaining <= 0.01; }).length;

  // ── COURSE ACTIONS ────────────────────────────────────────────────────────
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.name) { toast.error("Course name is required"); return; }
    try {
      if (editCourseId) { await adminApi.put(`/courses/${editCourseId}`, courseForm); toast.success("Course Updated"); setEditCourseId(null); }
      else              { await adminApi.post("/courses", courseForm); toast.success("Course Added"); }
      setCourseForm({ name:"", duration:"" });
      fetchCourses();
    } catch (err) { toast.error(err.response?.data?.error || "Failed to save course"); }
  };

  const handleEditCourse    = (c) => { setEditCourseId(c.id); setCourseForm({ name: c.name, duration: c.duration || "" }); };
  const handleSelectCourse  = (id) => { setSelectedCourseId(id); fetchCourseFees(id); setFeeItemForm({ feeLabel:"", amount:"", dueDate:"" }); };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course? All its fees will be removed too.")) return;
    try { await adminApi.delete(`/courses/${id}`); toast.success("Deleted"); fetchCourses(); setSelectedCourseId(null); }
    catch { toast.error("Failed to delete"); }
  };

  const handleFeeItemSubmit = async (e) => {
    e.preventDefault();
    if (!feeItemForm.feeLabel || !feeItemForm.amount) { toast.error("Fill fee label and amount"); return; }
    try {
      await adminApi.post(`/courses/${selectedCourseId}/fees`, { feeLabel: feeItemForm.feeLabel, amount: parseFloat(feeItemForm.amount), dueDate: feeItemForm.dueDate || null });
      toast.success("Fee Added");
      setFeeItemForm({ feeLabel:"", amount:"", dueDate:"" });
      fetchCourseFees(selectedCourseId);
    } catch (err) { toast.error(err.response?.data?.error || "Failed to add fee"); }
  };

  const handleDeleteCourseFee = async (feeId) => {
    try { await adminApi.delete(`/course-fees/${feeId}`); toast.success("Fee Deleted"); fetchCourseFees(selectedCourseId); }
    catch { toast.error("Failed"); }
  };

  const handleAssignCourse = async () => {
    if (!assignStudentId || !assignCourseId) { toast.error("Select both student and course"); return; }
    try { await adminApi.put(`/students/${assignStudentId}/course/${assignCourseId}`); toast.success("Course Assigned!"); fetchStudents(); setAssignStudentId(""); setAssignCourseId(""); }
    catch { toast.error("Failed to assign"); }
  };

  const handleAdminReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setResetting(true);
    try {
      await API.put(`/api/auth/admin/reset-password/${resetModal.id}`, { newPassword });
      toast.success(`Password reset for ${resetModal.username}`);
      setResetModal(null); setNewPassword("");
    } catch (err) { toast.error(err.response?.data?.error || "Reset failed"); }
    finally { setResetting(false); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—";
  const fmtAmt  = (a) => `₹${Number(a).toLocaleString("en-IN")}`;

  // Shared filter bar style
  const filterBar = { display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center", marginBottom:"16px", padding:"14px 16px", background:"white", borderRadius:"12px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" };

  const InstallmentProgress = ({ username }) => {
    const sf = studentFees[username];
    if (!sf || !sf.installments) return <span style={{ color:"#94a3b8", fontSize:"13px" }}>Loading...</span>;
    return (
      <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
        {sf.installments.map((inst) => (
          <div key={inst.number} title={`${INST_LABEL[inst.number]} — ${inst.status}`}
            style={{ width:"28px", height:"28px", borderRadius:"50%", background: inst.status === "PAID" ? "#22c55e" : "#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, color: inst.status === "PAID" ? "white" : "#94a3b8" }}>
            {inst.number}
          </div>
        ))}
        <span style={{ fontSize:"12px", color:"#64748b", marginLeft:"4px" }}>
          {sf.installments.filter(i => i.status === "PAID").length}/3
        </span>
      </div>
    );
  };

  const tabIcons  = { overview:"bxs-bar-chart-alt-2", students:"bxs-graduation", payments:"bxs-credit-card", courses:"bxs-book" };
  const tabLabels = { overview:"Overview", students:"Students", payments:"Payments", courses:"Courses" };
  const courseOptions = courses.map(c => ({ value: c.id.toString(), label: c.name }));

  return (
    <div className="admin-layout">

      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="nav-brand">
          <i className="bx bxs-school" style={{ fontSize:"22px", marginRight:"8px", color:"#818cf8" }}></i>
          College Admin Panel
        </div>
        <div className="nav-right">
          <span className="nav-user"><i className="bx bxs-user-circle" style={{ fontSize:"16px", marginRight:"5px" }}></i>{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}><i className="bx bx-log-out" style={{ marginRight:"5px" }}></i>Logout</button>
        </div>
      </nav>

      {/* TABS */}
      <div className="admin-tabs">
        {["overview","students","payments","courses"].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`} onClick={() => setActiveTab(tab)}>
            <i className={`bx ${tabIcons[tab]}`} style={{ marginRight:"6px", fontSize:"15px", verticalAlign:"middle" }}></i>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <div className="tab-panel">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <h2 className="section-title">Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card blue"><div className="stat-icon"><i className="bx bxs-graduation"></i></div><div className="stat-info"><p className="stat-label">Total Students</p><h3 className="stat-number">{totalStudents}</h3></div></div>
                <div className="stat-card purple"><div className="stat-icon"><i className="bx bxs-credit-card"></i></div><div className="stat-info"><p className="stat-label">Total Payments</p><h3 className="stat-number">{totalPayments}</h3></div></div>
                <div className="stat-card green"><div className="stat-icon"><i className="bx bxs-check-circle"></i></div><div className="stat-info"><p className="stat-label">Fully Paid Students</p><h3 className="stat-number">{fullyPaidCount}</h3></div></div>
                <div className="stat-card yellow"><div className="stat-icon"><i className="bx bxs-rupee"></i></div><div className="stat-info"><p className="stat-label">Total Collected</p><h3 className="stat-number">{fmtAmt(totalCollected)}</h3></div></div>
              </div>
              <h3 className="section-subtitle">Recent Payments</h3>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Student</th><th>Course</th><th>Instalment</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
                  <tbody>
                    {payments.slice(0,6).map((p,i) => (
                      <tr key={p.id}>
                        <td>{i+1}</td><td style={{ fontWeight:500 }}>{p.user?.username}</td>
                        <td>{p.user?.course?.name ? <span className="badge badge-blue">{p.user.course.name}</span> : <span style={{ color:"#94a3b8" }}>—</span>}</td>
                        <td>{p.installmentNumber ? <span className="badge badge-yellow">{INST_LABEL[p.installmentNumber]} Inst.</span> : <span style={{ color:"#94a3b8" }}>—</span>}</td>
                        <td style={{ fontWeight:600 }}>{fmtAmt(p.amount)}</td><td>{p.paymentMethod||"—"}</td><td style={{ color:"#64748b" }}>{fmtDate(p.paymentDate)}</td>
                      </tr>
                    ))}
                    {payments.length === 0 && <tr><td colSpan="7" className="no-data">No payments yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STUDENTS ── */}
          {activeTab === "students" && (
            <div>
              <h2 className="section-title">All Students</h2>

              {/* Assign course */}
              <div className="fee-form-card">
                <h3><i className="bx bx-link-alt" style={{ marginRight:"6px", color:"#4f46e5" }}></i>Assign / Change Course</h3>
                <div className="fee-form">
                  <select value={assignStudentId} onChange={e => setAssignStudentId(e.target.value)}>
                    <option value="">-- Select Student --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.username} ({s.email})</option>)}
                  </select>
                  <select value={assignCourseId} onChange={e => setAssignCourseId(e.target.value)}>
                    <option value="">-- Select Course --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="fee-form-btns"><button className="btn-save" onClick={handleAssignCourse}>Assign</button></div>
                </div>
              </div>

              {/* ── STUDENT SEARCH + FILTERS ── */}
              <div style={filterBar}>
                <SearchBar value={studentSearch} onChange={setStudentSearch} placeholder="Search by name or email..." />
                <FilterSelect value={studentCourseFilter} onChange={setStudentCourseFilter}
                  options={courseOptions} placeholder="All Courses" />
                <FilterSelect value={studentPayFilter} onChange={setStudentPayFilter}
                  options={[{ value:"paid", label:"Fully Paid" }, { value:"unpaid", label:"Has Balance" }]}
                  placeholder="Payment Status" />
                {(studentSearch || studentCourseFilter || studentPayFilter) && (
                  <button onClick={() => { setStudentSearch(""); setStudentCourseFilter(""); setStudentPayFilter(""); }}
                    style={{ padding:"8px 14px", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:600, display:"flex", alignItems:"center", gap:"4px" }}>
                    <i className="bx bx-x"></i> Clear
                  </button>
                )}
                <ResultCount filtered={filteredStudents.length} total={students.length} />
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Username</th><th>Email</th><th>Course</th><th>Total</th><th>Paid</th><th>Remaining</th><th>Instalments</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s,i) => {
                      const sf = studentFees[s.username];
                      return (
                        <tr key={s.id}>
                          <td>{i+1}</td>
                          <td style={{ fontWeight:500 }}>{s.username}</td>
                          <td style={{ color:"#64748b", fontSize:"13px" }}>{s.email}</td>
                          <td>{s.course ? <span className="badge badge-blue">{s.course.name}</span> : <span style={{ color:"#94a3b8", fontSize:"13px" }}>Not assigned</span>}</td>
                          <td>{sf ? fmtAmt(sf.total)     : "—"}</td>
                          <td style={{ color:"#16a34a", fontWeight:600 }}>{sf ? fmtAmt(sf.paid) : "—"}</td>
                          <td style={{ color: sf && sf.remaining > 0 ? "#dc2626" : "#16a34a", fontWeight:600 }}>{sf ? fmtAmt(sf.remaining) : "—"}</td>
                          <td><InstallmentProgress username={s.username} /></td>
                          <td>
                            <button className="btn-edit" onClick={() => { setResetModal({ id:s.id, username:s.username }); setNewPassword(""); setShowResetPwd(false); }} title="Reset password">
                              <i className="bx bxs-lock-open" style={{ marginRight:"4px" }}></i>Reset Pwd
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStudents.length === 0 && (
                      <tr><td colSpan="9" className="no-data">
                        {students.length === 0 ? "No students registered yet" : "No students match your filters"}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {activeTab === "payments" && (
            <div>
              <h2 className="section-title">All Payments</h2>

              {/* ── PAYMENT SEARCH + FILTERS ── */}
              <div style={filterBar}>
                <SearchBar value={paymentSearch} onChange={setPaymentSearch} placeholder="Search by student or transaction ID..." />
                <FilterSelect value={paymentStatusFilter} onChange={setPaymentStatusFilter}
                  options={[{ value:"PAID", label:"Paid" }, { value:"PENDING", label:"Pending" }]}
                  placeholder="All Statuses" />
                <FilterSelect value={paymentCourseFilter} onChange={setPaymentCourseFilter}
                  options={courseOptions} placeholder="All Courses" />
                <FilterSelect value={paymentInstFilter} onChange={setPaymentInstFilter}
                  options={[{ value:"1", label:"1st Instalment" }, { value:"2", label:"2nd Instalment" }, { value:"3", label:"3rd Instalment" }]}
                  placeholder="All Instalments" />
                {(paymentSearch || paymentStatusFilter || paymentCourseFilter || paymentInstFilter) && (
                  <button onClick={() => { setPaymentSearch(""); setPaymentStatusFilter(""); setPaymentCourseFilter(""); setPaymentInstFilter(""); }}
                    style={{ padding:"8px 14px", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:600, display:"flex", alignItems:"center", gap:"4px" }}>
                    <i className="bx bx-x"></i> Clear
                  </button>
                )}
                <ResultCount filtered={filteredPayments.length} total={payments.length} />
              </div>

              {/* Summary pills (always reflect the full dataset, not the filtered one) */}
              <div style={{ display:"flex", gap:"12px", marginBottom:"16px", flexWrap:"wrap" }}>
                <div style={{ background:"#dcfce7", color:"#166534", borderRadius:"8px", padding:"8px 16px", fontSize:"14px", fontWeight:600, display:"flex", alignItems:"center", gap:"6px" }}>
                  <i className="bx bxs-check-circle"></i> Paid: {payments.filter(p => p.status === "PAID").length}
                </div>
                <div style={{ background:"#dbeafe", color:"#1e40af", borderRadius:"8px", padding:"8px 16px", fontSize:"14px", fontWeight:600, display:"flex", alignItems:"center", gap:"6px" }}>
                  <i className="bx bxs-rupee"></i> Total collected: {fmtAmt(totalCollected)}
                </div>
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Student</th><th>Course</th><th>Instalment</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Transaction ID</th></tr></thead>
                  <tbody>
                    {filteredPayments.map((p,i) => (
                      <tr key={p.id}>
                        <td>{i+1}</td>
                        <td style={{ fontWeight:500 }}>{p.user?.username}</td>
                        <td>{p.user?.course?.name ? <span className="badge badge-blue">{p.user.course.name}</span> : <span style={{ color:"#94a3b8" }}>—</span>}</td>
                        <td>{p.installmentNumber ? <span className="badge badge-yellow">{INST_LABEL[p.installmentNumber]} Inst.</span> : <span style={{ color:"#94a3b8" }}>—</span>}</td>
                        <td style={{ fontWeight:600 }}>{fmtAmt(p.amount)}</td>
                        <td>{p.paymentMethod||"—"}</td>
                        <td><span className={p.status === "PAID" ? "badge badge-green" : "badge badge-yellow"}>{p.status}</span></td>
                        <td style={{ color:"#64748b" }}>{fmtDate(p.paymentDate)}</td>
                        <td style={{ fontFamily:"monospace", fontSize:"12px", color:"#64748b" }}>{p.transactionId}</td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && (
                      <tr><td colSpan="9" className="no-data">
                        {payments.length === 0 ? "No payments yet" : "No payments match your filters"}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {activeTab === "courses" && (
            <div>
              <h2 className="section-title">Course Management</h2>
              <div className="fee-form-card">
                <h3><i className={`bx ${editCourseId ? "bxs-edit" : "bx-plus-circle"}`} style={{ marginRight:"6px", color:"#4f46e5" }}></i>{editCourseId ? "Edit Course" : "Add New Course"}</h3>
                <form className="fee-form" onSubmit={handleCourseSubmit}>
                  <input type="text" placeholder="Course Name (e.g. BCA, B.Tech)" value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} />
                  <input type="text" placeholder="Duration (e.g. 3 Years)"         value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} />
                  <div className="fee-form-btns">
                    <button type="submit" className="btn-save">{editCourseId ? "Update Course" : "Add Course"}</button>
                    {editCourseId && <button type="button" className="btn-cancel" onClick={() => { setEditCourseId(null); setCourseForm({ name:"", duration:"" }); }}>Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="table-wrapper" style={{ marginBottom:"24px" }}>
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Course Name</th><th>Duration</th><th>Actions</th></tr></thead>
                  <tbody>
                    {courses.map((c,i) => (
                      <tr key={c.id}>
                        <td>{i+1}</td><td style={{ fontWeight:600 }}>{c.name}</td><td>{c.duration||"—"}</td>
                        <td className="action-btns">
                          <button className="btn-edit"    onClick={() => handleEditCourse(c)}><i className="bx bxs-edit" style={{ marginRight:"4px" }}></i>Edit</button>
                          <button className="btn-delete"  onClick={() => handleDeleteCourse(c.id)}><i className="bx bxs-trash" style={{ marginRight:"4px" }}></i>Delete</button>
                          <button className="btn-approve" onClick={() => handleSelectCourse(c.id)}><i className={`bx ${selectedCourseId===c.id ? "bx-chevron-down" : "bxs-coin-stack"}`} style={{ marginRight:"4px" }}></i>{selectedCourseId===c.id ? "Managing Fees" : "Manage Fees"}</button>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && <tr><td colSpan="4" className="no-data">No courses added yet</td></tr>}
                  </tbody>
                </table>
              </div>
              {selectedCourseId && (
                <div className="fee-form-card">
                  <h3><i className="bx bxs-coin-stack" style={{ marginRight:"6px", color:"#4f46e5" }}></i>Fees for: <strong>{courses.find(c => c.id === selectedCourseId)?.name}</strong></h3>
                  <form className="fee-form" onSubmit={handleFeeItemSubmit} style={{ marginBottom:"20px" }}>
                    <input type="text"   placeholder="Fee Label" value={feeItemForm.feeLabel} onChange={e => setFeeItemForm({ ...feeItemForm, feeLabel: e.target.value })} />
                    <input type="number" placeholder="Amount (₹)" value={feeItemForm.amount}   onChange={e => setFeeItemForm({ ...feeItemForm, amount:   e.target.value })} />
                    <input type="date"                             value={feeItemForm.dueDate}  onChange={e => setFeeItemForm({ ...feeItemForm, dueDate:  e.target.value })} />
                    <div className="fee-form-btns"><button type="submit" className="btn-save">Add Fee</button></div>
                  </form>
                  <table className="admin-table">
                    <thead><tr><th>#</th><th>Fee Label</th><th>Amount</th><th>Due Date</th><th>Action</th></tr></thead>
                    <tbody>
                      {courseFees.map((f,i) => (
                        <tr key={f.id}><td>{i+1}</td><td>{f.feeLabel}</td><td>₹{f.amount}</td><td>{f.dueDate||"—"}</td>
                          <td><button className="btn-delete" onClick={() => handleDeleteCourseFee(f.id)}><i className="bx bxs-trash" style={{ marginRight:"4px" }}></i>Delete</button></td>
                        </tr>
                      ))}
                      {courseFees.length === 0 && <tr><td colSpan="5" className="no-data">No fees added yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── ADMIN RESET PASSWORD MODAL ── */}
      {resetModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"16px", padding:"32px 28px", width:"100%", maxWidth:"380px", boxShadow:"0 24px 60px rgba(0,0,0,0.3)", position:"relative" }}>
            <button onClick={() => setResetModal(null)} style={{ position:"absolute", top:"14px", right:"14px", background:"none", border:"none", cursor:"pointer", fontSize:"22px", color:"#94a3b8" }}>
              <i className="bx bx-x"></i>
            </button>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ width:"48px", height:"48px", background:"#fef9c3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
                <i className="bx bxs-lock-open" style={{ fontSize:"22px", color:"#ca8a04" }}></i>
              </div>
              <h3 style={{ fontSize:"17px", fontWeight:700, color:"#1e293b", margin:"0 0 4px" }}>Reset Password</h3>
              <p style={{ fontSize:"13px", color:"#64748b", margin:0 }}>Student: <strong>{resetModal.username}</strong></p>
            </div>
            <form onSubmit={handleAdminReset}>
              <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>New Password</label>
              <div style={{ position:"relative", marginBottom:"20px" }}>
                <input type={showResetPwd ? "text" : "password"} placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  style={{ width:"100%", padding:"11px 44px 11px 14px", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"14px", outline:"none", boxSizing:"border-box" }} />
                <i className={`bx ${showResetPwd ? "bx-show" : "bx-hide"}`} onClick={() => setShowResetPwd(p => !p)}
                  style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"18px", color:"#94a3b8", cursor:"pointer" }}></i>
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button type="submit" disabled={resetting}
                  style={{ flex:1, padding:"11px", background: resetting ? "#fbbf24" : "#f59e0b", color:"white", border:"none", borderRadius:"8px", fontWeight:700, fontSize:"14px", cursor: resetting ? "not-allowed" : "pointer" }}>
                  {resetting ? "Resetting..." : "Reset Password"}
                </button>
                <button type="button" onClick={() => setResetModal(null)}
                  style={{ padding:"11px 18px", background:"#f1f5f9", color:"#475569", border:"none", borderRadius:"8px", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;