import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();  // ← reads the real current URL

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <aside className="sidebar">
        <h2>Menu Bar</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/student")}
              className={`btnhover ${isActive("/student") ? "active" : ""}`}>
              📊 Dashboard
            </li>
            <li onClick={() => navigate("/student/fee-summary")}
              className={`btnhover ${isActive("/student/fee-summary") ? "active" : ""}`}>
              🧾 Fee Summary
            </li>
            <li onClick={() => navigate("/student/pay-fees")}
              className={`btnhover ${isActive("/student/pay-fees") ? "active" : ""}`}>
              💳 Pay Fees
            </li>
            <li onClick={() => navigate("/student/payment-history")}
              className={`btnhover ${isActive("/student/payment-history") ? "active" : ""}`}>
              📅 Payment History
            </li>
            <li onClick={() => navigate("/student/receipts")}
              className={`btnhover ${isActive("/student/receipts") ? "active" : ""}`}>
              📄 Receipts
            </li>
            <li onClick={() => navigate("/student/profile")}
              className={`btnhover ${isActive("/student/profile") ? "active" : ""}`}>
              👤 Profile
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
