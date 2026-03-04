import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const PayFeeePage = () => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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

  const handleSelectFee = (item) => {
    const isSelected = selectedFees.find((f) => f.label === item.label);
    if (isSelected) {
      setSelectedFees(selectedFees.filter((f) => f.label !== item.label));
    } else {
      setSelectedFees([...selectedFees, item]);
    }
  };

  useEffect(() => {
    const total = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
    setTotalAmount(total);
  }, [selectedFees]);

  const handlePayment = () => {
    if (selectedFees.length === 0) {
      alert("Please select at least one fee to pay");
      return;
    }
    alert(
      `Payment of ₹${totalAmount} initiated for: ${selectedFees.map((f) => f.label).join(", ")}`,
    );
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
      <Sidebar/>
      <div className="page-container">
        <h1>Pay Fees</h1>
        {fees && fees.breakdown && (
          <>
            <section className="pay-fees-container">
              <div className="fees-selection">
                <h2>Select Fees to Pay</h2>
                {fees.breakdown.map((item, index) => (
                  <div key={index} className="fee-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFees.some(
                          (f) => f.label === item.label,
                        )}
                        onChange={() => handleSelectFee(item)}
                      />
                      <span>{item.label}</span>
                    </label>
                    <span className="amount">
                      ₹{item.amount?.toLocaleString()}
                    </span>
                    <span className="due-date">Due: {item.dueDate}</span>
                  </div>
                ))}
              </div>

              <div className="payment-summary">
                <h2>Payment Summary</h2>
                <div className="summary-item">
                  <span>Selected Fees: {selectedFees.length}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount Due:</span>
                  <span className="amount">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <button onClick={handlePayment} className="pay-button">
                  Proceed to Payment
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default PayFeeePage;
