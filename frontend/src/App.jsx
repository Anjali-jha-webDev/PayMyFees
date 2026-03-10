import { createBrowserRouter } from "react-router-dom";

import RegisterPage from "./components/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FeeSummaryPage from "./pages/FeeSummaryPage";
import PayFeesPage from "./pages/PayFeesPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import ProfilePage from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
  },

  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/fee-summary",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <FeeSummaryPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/pay-fees",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <PayFeesPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/payment-history",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <PaymentHistoryPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/receipts",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <ReceiptsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/profile",
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <ProfilePage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);