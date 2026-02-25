import { createBrowserRouter } from "react-router-dom";

import RegisterPage from "./components/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
    path: "/admin",
    element: (
      <ProtectedRoute allowedRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);