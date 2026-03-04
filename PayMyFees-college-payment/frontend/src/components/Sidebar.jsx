import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
const [isActive, setisActive] = useState("")
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setisActive(path);
  };
  return (
    <div>
      <aside className="sidebar">
        <h2>
          Menu Bar
        </h2>
        <nav>
          <ul>
            <li onClick={() =>handleNavigation("/student")
            } className={`btnhover ${isActive === "/student" ? "active" : ""}`}>
              📊 Dashboard
            </li>
            <li
              onClick={() =>handleNavigation("/student/fee-summary")
            }
              className={`btnhover ${isActive === "/student/fee-summary" ? "active" : ""}`} >
              🧾 Fee Summary
            </li>
            <li
              onClick={() => handleNavigation("/student/pay-fees")}
              className={`btnhover ${isActive === "/student/pay-fees" ? "active" : ""}`} 
            >
              💳 Pay Fees
            </li>
            <li
              onClick={() => handleNavigation("/student/payment-history")}
              className={`btnhover ${isActive === "/student/payment-history" ? "active" : ""}`} 
            >
              📅 Payment History
            </li>
            <li
              onClick={() => handleNavigation("/student/receipts")}
              className={`btnhover ${isActive === "/student/receipts" ? "active" : ""}`}
            >
              📄 Receipts
            </li>
            <li
              onClick={() => handleNavigation("/student/profile")}
              className={`btnhover ${isActive === "/student/profile" ? "active" : ""}`}
            >
              👤 Profile
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
