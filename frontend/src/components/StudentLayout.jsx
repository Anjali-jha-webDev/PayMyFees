import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import "./Student.css";
import { FeeProvider, useFees } from "./FeeContext";

// ── Notification Bell — reads alerts from context ───────────────────────────
const NotificationBell = () => {
  const { alerts } = useFees();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const overdueCount  = alerts.filter(a => a.type === "overdue").length;
  const dueSoonCount  = alerts.filter(a => a.type === "due-soon").length;
  const totalCount    = alerts.length;

  const badgeColor = overdueCount > 0 ? "#ef4444" : "#f59e0b";

  const formatDays = (daysLeft) => {
    if (daysLeft < 0)  return `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} overdue`;
    if (daysLeft === 0) return "Due today";
    return `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  };

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:"relative", background: totalCount > 0 ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.07)", border: totalCount > 0 ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"999px", padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", color: totalCount > 0 ? "#fbbf24" : "#94a3b8", transition:"all 0.2s ease" }}
        title="Notifications"
      >
        <i className={`bx ${open ? "bxs-bell" : totalCount > 0 ? "bxs-bell-ring" : "bxs-bell"}`}
          style={{ fontSize:"18px" }}></i>

        {/* Badge */}
        {totalCount > 0 && (
          <span style={{ background:badgeColor, color:"white", fontSize:"11px", fontWeight:700, minWidth:"18px", height:"18px", borderRadius:"999px", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px" }}>
            {totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, width:"320px", background:"white", borderRadius:"14px", boxShadow:"0 8px 32px rgba(0,0,0,0.18)", zIndex:500, overflow:"hidden", animation:"notifSlide 0.18s ease" }}>

          {/* Header */}
          <div style={{ padding:"14px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:"14px", fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:"8px" }}>
              <i className="bx bxs-bell" style={{ fontSize:"16px", color:"#4f46e5" }}></i>
              Fee Alerts
            </span>
            <span style={{ fontSize:"12px", color:"#94a3b8" }}>
              {totalCount === 0 ? "All clear" : `${totalCount} alert${totalCount !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Alert items */}
          <div style={{ maxHeight:"280px", overflowY:"auto" }}>
            {totalCount === 0 ? (
              <div style={{ padding:"28px 16px", textAlign:"center" }}>
                <i className="bx bxs-check-shield" style={{ fontSize:"32px", color:"#22c55e", display:"block", marginBottom:"8px" }}></i>
                <p style={{ fontSize:"14px", color:"#64748b", margin:0 }}>No upcoming due dates</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} style={{ padding:"12px 16px", borderBottom:"1px solid #f8fafc", display:"flex", gap:"12px", alignItems:"flex-start", background: alert.type === "overdue" ? "#fff5f5" : "#fffbeb" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background: alert.type === "overdue" ? "#fee2e2" : "#fef9c3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={`bx ${alert.type === "overdue" ? "bxs-error" : "bxs-time-five"}`}
                      style={{ fontSize:"16px", color: alert.type === "overdue" ? "#ef4444" : "#f59e0b" }}></i>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:"13px", fontWeight:600, color:"#1e293b", margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {alert.label}
                    </p>
                    <p style={{ fontSize:"12px", color: alert.type === "overdue" ? "#dc2626" : "#ca8a04", margin:0, display:"flex", alignItems:"center", gap:"4px" }}>
                      <i className={`bx ${alert.type === "overdue" ? "bx-calendar-x" : "bx-calendar-event"}`} style={{ fontSize:"13px" }}></i>
                      {formatDays(alert.daysLeft)} &nbsp;·&nbsp; {alert.dueDate}
                    </p>
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:700, padding:"3px 8px", borderRadius:"20px", flexShrink:0, background: alert.type === "overdue" ? "#fee2e2" : "#fef9c3", color: alert.type === "overdue" ? "#dc2626" : "#ca8a04" }}>
                    {alert.type === "overdue" ? "OVERDUE" : "SOON"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {totalCount > 0 && (
            <div style={{ padding:"10px 16px", background:"#f8fafc", borderTop:"1px solid #f1f5f9", fontSize:"12px", color:"#64748b", display:"flex", alignItems:"center", gap:"6px" }}>
              <i className="bx bx-info-circle" style={{ fontSize:"14px" }}></i>
              Go to Pay Fees to clear outstanding instalments
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes notifSlide {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Alert banner — shown at top of any student page ─────────────────────────
export const AlertBanner = () => {
  const { alerts } = useFees();
  const navigate   = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (alerts.length === 0 || dismissed) return null;

  const overdue  = alerts.filter(a => a.type === "overdue");
  const dueSoon  = alerts.filter(a => a.type === "due-soon");
  const isRed    = overdue.length > 0;

  const msg = overdue.length > 0
    ? `${overdue.length} fee${overdue.length !== 1 ? "s are" : " is"} overdue — pay now to avoid penalties.`
    : `${dueSoon.length} fee${dueSoon.length !== 1 ? "s are" : " is"} due within 7 days.`;

  return (
    <div style={{ background: isRed ? "#fef2f2" : "#fffbeb", border: `1px solid ${isRed ? "#fca5a5" : "#fde68a"}`, borderLeft: `4px solid ${isRed ? "#ef4444" : "#f59e0b"}`, borderRadius:"10px", padding:"12px 16px", marginBottom:"22px", display:"flex", alignItems:"center", gap:"12px" }}>
      <i className={`bx ${isRed ? "bxs-error" : "bxs-time-five"}`}
        style={{ fontSize:"20px", color: isRed ? "#ef4444" : "#f59e0b", flexShrink:0 }}></i>
      <p style={{ flex:1, margin:0, fontSize:"14px", fontWeight:500, color: isRed ? "#7f1d1d" : "#713f12" }}>
        {msg}
      </p>
      <button
        onClick={() => navigate("/student/pay-fees")}
        style={{ background: isRed ? "#ef4444" : "#f59e0b", color:"white", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}
      >
        <i className="bx bxs-credit-card" style={{ fontSize:"15px" }}></i>
        Pay Now
      </button>
      <button
        onClick={() => setDismissed(true)}
        style={{ background:"none", border:"none", cursor:"pointer", color: isRed ? "#ef4444" : "#f59e0b", fontSize:"18px", flexShrink:0, display:"flex", alignItems:"center" }}
      >
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
};

// ── Main layout ─────────────────────────────────────────────────────────────
const StudentLayoutInner = ({ children }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const user       = JSON.parse(localStorage.getItem("user")) || {};
  const contentRef = useRef(null);

  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    if (contentRef.current) contentRef.current.scrollTo({ top:0, behavior:"smooth" });
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const navItems = [
    { path:"/student",                 icon:"bx bxs-dashboard",    label:"Dashboard"       },
    { path:"/student/fee-summary",     icon:"bx bxs-receipt",       label:"Fee Summary"     },
    { path:"/student/pay-fees",        icon:"bx bxs-credit-card",   label:"Pay Fees"        },
    { path:"/student/payment-history", icon:"bx bxs-time-five",     label:"Payment History" },
    { path:"/student/receipts",        icon:"bx bxs-file-pdf",      label:"Receipts"        },
    { path:"/student/profile",         icon:"bx bxs-user-circle",   label:"Profile"         },
  ];

  return (
    <div className="student-layout">
      <nav className="student-navbar">

        {/* Hamburger — mobile only */}
        {isMobile && (
          <button className="navbar-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Open menu">
            <i className={`bx ${sidebarOpen ? "bx-x" : "bx-menu"}`}></i>
          </button>
        )}

        <div className="student-nav-brand">
          <i className="bx bxs-graduation nav-brand-icon"></i>
          Student Portal
        </div>

        <div className="student-nav-right">
          {/* Notification bell */}
          <NotificationBell />

          <div className="nav-user-chip">
            <i className="bx bxs-user-circle"></i>
            <span>{user.username}</span>
          </div>
          <button className="student-logout-btn" onClick={handleLogout}>
            <i className="bx bx-log-out"></i>
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </nav>

      <div className="student-body">

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`student-sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {!isMobile && (
            <>
              <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? "Collapse" : "Expand"}>
                <i className={`bx ${sidebarOpen ? "bx-chevrons-left" : "bx-chevrons-right"}`}></i>
              </button>
              <div className="sidebar-divider" />
            </>
          )}

          {sidebarOpen && <div className="sidebar-section-title">Main Menu</div>}

          {navItems.map((item) => (
            <div key={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={!sidebarOpen ? item.label : ""}
            >
              <i className={`${item.icon} nav-icon`}></i>
              {sidebarOpen && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {isActive(item.path) && <span className="active-dot"></span>}
                </>
              )}
            </div>
          ))}
        </aside>

        <main className="student-content" ref={contentRef}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Wrap with FeeProvider so NotificationBell can call useFees()
const StudentLayout = ({ children }) => (
  <FeeProvider>
    <StudentLayoutInner>{children}</StudentLayoutInner>
  </FeeProvider>
);

export default StudentLayout;