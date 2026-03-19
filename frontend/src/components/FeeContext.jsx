import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import API from "../services/api";

const FeeContext = createContext(null);

// ── Alert logic ────────────────────────────────────────────────────────────
// Returns array of { label, dueDate, daysLeft, type: "overdue"|"due-soon" }
function computeAlerts(feeSummary) {
  if (!feeSummary || feeSummary.remaining <= 0.01) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alerts = [];

  (feeSummary.breakdown || []).forEach((item) => {
    if (!item.dueDate || item.dueDate === "—") return;

    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      alerts.push({ label: item.label, dueDate: item.dueDate, daysLeft, type: "overdue" });
    } else if (daysLeft <= 7) {
      alerts.push({ label: item.label, dueDate: item.dueDate, daysLeft, type: "due-soon" });
    }
  });

  // Sort: overdue first, then soonest
  return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
}

export const FeeProvider = ({ children }) => {
  const [feeSummary, setFeeSummary] = useState(null);
  const [feeLoading, setFeeLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const refreshFees = useCallback(async () => {
    if (!user.username) return;
    try {
      setFeeLoading(true);
      const res = await API.get(`/fees/summary/${user.username}`);
      setFeeSummary(res.data);
    } catch (err) {
      console.error("Failed to refresh fees", err);
    } finally {
      setFeeLoading(false);
    }
  }, [user.username]);

  useEffect(() => { refreshFees(); }, [refreshFees]);

  // Alerts derived from feeSummary — recomputed only when feeSummary changes
  const alerts = useMemo(() => computeAlerts(feeSummary), [feeSummary]);

  return (
    <FeeContext.Provider value={{ feeSummary, feeLoading, refreshFees, alerts }}>
      {children}
    </FeeContext.Provider>
  );
};

export const useFees = () => useContext(FeeContext);