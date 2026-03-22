import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token.length < 3) {
    return <Navigate to="/login" replace />;
  }
  return children;
}