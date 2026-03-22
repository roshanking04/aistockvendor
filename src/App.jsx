import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Billing from "./pages/Billing";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const valid = token && token !== "null" && token !== "undefined" && token.length > 10;
  if (!valid) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products"  element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/add"       element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/billing"   element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="*"          element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
