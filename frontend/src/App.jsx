import { createBrowserRouter, Outlet } from "react-router-dom";

import RegisterPage      from "./components/RegisterPage";
import AdminDashboard    from "./pages/AdminDashboard";
import ProtectedRoute    from "./components/ProtectedRoute";
import StudentLayout     from "./components/StudentLayout";

import StudentDashboard  from "./pages/StudentDashboard";
import FeeSummaryPage    from "./pages/FeeSummaryPage";
import PayFeesPage       from "./pages/PayFeesPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import ReceiptsPage      from "./pages/ReceiptsPage";
import ProfilePage       from "./pages/ProfilePage";

// This wrapper just protects the whole student section once
const StudentRoot = () => (
  <ProtectedRoute allowedRole="STUDENT">
    {/* StudentLayout renders navbar + sidebar + <Outlet> — never unmounts */}
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
  },

  // ── All student pages share ONE mounted layout ──────────────
  {
    path: "/student",
    element: <StudentRoot />,
    children: [
      { index: true,              element: <StudentDashboard />   },
      { path: "fee-summary",      element: <FeeSummaryPage />     },
      { path: "pay-fees",         element: <PayFeesPage />        },
      { path: "payment-history",  element: <PaymentHistoryPage /> },
      { path: "receipts",         element: <ReceiptsPage />       },
      { path: "profile",          element: <ProfilePage />        },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: (
      <div style={{ textAlign: "center", padding: "4rem", fontFamily: "Segoe UI" }}>
        <h1 style={{ fontSize: "48px" }}>404</h1>
        <p style={{ color: "#64748b" }}>Page not found.</p>
        <a href="/" style={{ color: "#4f46e5" }}>Go back to Login</a>
      </div>
    ),
  },
]);