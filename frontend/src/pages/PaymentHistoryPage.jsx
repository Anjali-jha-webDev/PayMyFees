import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const PaymentHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get(`/fees/history/${user.username}`);
        setHistory(response.data);
      } catch (err) {
        setError("Failed to load payment history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user.username) {
      fetchHistory();
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
      <Sidebar />
      <div className="page-container">
        <h1>Payment History</h1>
        <section className="payment-history-section">
          {history && history.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.date}</td>
                    <td>₹{transaction.amount?.toLocaleString()}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>
                      <span
                        className={`status ${transaction.status?.toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment history found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
