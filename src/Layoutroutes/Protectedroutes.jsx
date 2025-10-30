import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch → redirect to unauthorized page or home
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return children;
}

export default ProtectedRoute;

