import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const FeeSummaryPage = () => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await API.get(`/fees/${user.username}`);
        setFees(response.data);
      } catch (err) {
        setError("Failed to load fees data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user.username) {
      fetchFees();
    }
  }, [user.username]);

  if (loading)
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <Sidebar/>
      <div className="page-container">
        <h1>Fee Summary</h1>
        {fees && (
          <>
            <section className="summary-cards">
              <div className="card">
                <h3>Total Fees</h3>
                <p>₹{fees.total?.toLocaleString() || 0}</p>
              </div>
              <div className="card">
                <h3>Amount Paid</h3>
                <p>₹{fees.paid?.toLocaleString() || 0}</p>
              </div>
              <div className="card">
                <h3>Outstanding Balance</h3>
                <p>₹{fees.outstanding?.toLocaleString() || 0}</p>
              </div>
            </section>

            {fees.deadlineReminder && (
              <section className="reminder">
                <span>⚠️ Reminder: {fees.deadlineReminder}</span>
              </section>
            )}

            {fees.breakdown && (
              <section className="fee-breakdown">
                <h2>Fee Breakdown</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Fee Type</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.breakdown.map((item, index) => (
                      <tr key={index}>
                          <td>{item.label}</td>
                          <td>₹{item.amount?.toLocaleString()}</td>
                          <td>{item.dueDate}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeeSummaryPage;
