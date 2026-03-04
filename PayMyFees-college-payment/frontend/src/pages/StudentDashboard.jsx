import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import API from "../services/api";
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({ name: "", id: "" });
  const [fees, setFees] = React.useState({
    total: 0,
    paid: 0,
    outstanding: 0,
    breakdown: [],
    deadlineReminder: ""
  });
  const [paymentHistory, setPaymentHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ name: parsed.username || "", id: parsed.id || "" });
        
        // Fetch user data from server
        API.get(`/auth/user/${parsed.username}`)
          .then((res) => {
            if (res.data) {
              setUser({ name: res.data.username, id: res.data.id });
            }
          })
          .catch((err) => {
            console.warn("could not refresh user", err);
          });

        // Fetch fees data
        API.get(`/fees/${parsed.username}`)
          .then((res) => {
            setFees(res.data);
          })
          .catch((err) => {
            setError("Failed to load fees");
            console.error(err);
          });

        // Fetch payment history
        API.get(`/fees/history/${parsed.username}`)
          .then((res) => {
            setPaymentHistory(res.data);
          })
          .catch((err) => {
            console.warn("Failed to load payment history", err);
          });
      } catch (e) {
        console.error("failed to parse user from localStorage", e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="student-main">
        <header className="dashboard-header">
          <h1>PayMyFees</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/"; // simple redirect to login
              }}
            >
              Logout
            </button>
          </div>
        </header>
        {error && <section className="error-message">{error}</section>}
        {fees.deadlineReminder && (
          <section className="reminder">
            <span>⚠️ Reminder: {fees.deadlineReminder}</span>
          </section>
        )}
        <section className="summary-cards">
            <div className="card clickable" onClick={() => handleNavigation('/student/fee-summary')}>
            <h3>Total Fees</h3>
            <p>₹{fees.total?.toLocaleString()}</p>
          </div>
          <div className="card clickable" onClick={() => handleNavigation('/student/fee-summary')}>
            <h3>Amount Paid</h3>
            <p>₹{fees.paid?.toLocaleString()}</p>
          </div>
          <div className="card clickable" onClick={() => handleNavigation('/student/pay-fees')}>
            <h3>Outstanding Balance</h3>
            <p>₹{fees.outstanding?.toLocaleString()}</p>
          </div>
        </section>
        <section className="details">
          <div className="breakdown">
            <h3>Fee Breakdown</h3>
            <ul>
                {fees.breakdown && fees.breakdown.map((item, idx) => (
                <li key={idx}>
                  <span>{item.label}</span>
                  <span>₹{item.amount?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleNavigation('/student/fee-summary')} className="view-more">View Details</button>
          </div>
          <div className="payments">
            <h3>Recent Payment History</h3>
            {paymentHistory && paymentHistory.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Trans. ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.slice(0, 3).map((p) => (
                      <tr key={p.transactionId}>
                          <td>{p.transactionId}</td>
                          <td>{p.date}</td>
                          <td>₹{p.amount?.toLocaleString()}</td>
                          <td>{p.status}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => handleNavigation('/student/payment-history')} className="view-more">View All</button>
              </>
            ) : (
              <p>No payment history found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
