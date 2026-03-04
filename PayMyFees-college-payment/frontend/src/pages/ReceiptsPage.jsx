import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await API.get(`/fees/receipts/${user.username}`);
        setReceipts(response.data);
      } catch (err) {
        setError("Failed to load receipts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user.username) {
      fetchReceipts();
    }
  }, [user.username]);

  const handleDownloadReceipt = (receipt) => {
    alert(`Downloading receipt ${receipt.receiptId}...`);
  };

  const handlePrintReceipt = (receipt) => {
    alert(`Printing receipt ${receipt.receiptId}...`);
  };

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
        <h1>Receipts</h1>
        <section className="receipts-section">
          {receipts && receipts.length > 0 ? (
            <div className="receipts-grid">
              {receipts.map((receipt, index) => (
                <div key={index} className="receipt-card">
                  <div className="receipt-header">
                    <h3>Receipt #{receipt.receiptId}</h3>
                    <span className={`status ${receipt.status?.toLowerCase()}`}>
                      {receipt.status}
                    </span>
                  </div>
                  <div className="receipt-details">
                    <p>
                      <strong>Date:</strong> {receipt.date}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{receipt.amount?.toLocaleString()}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {receipt.paymentMethod}
                    </p>
                    <div className="fees-included">
                      <strong>Fees Included:</strong>
                      <ul>
                        {receipt.feesIncluded?.map((fee, i) => (
                          <li key={i}>{fee}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="receipt-actions">
                    <button
                      onClick={() => handleDownloadReceipt(receipt)}
                      className="btn-secondary"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handlePrintReceipt(receipt)}
                      className="btn-secondary"
                    >
                      Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No receipts found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReceiptsPage;
