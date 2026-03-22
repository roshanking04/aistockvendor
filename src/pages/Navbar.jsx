import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import VendorDashboard from "./pages/VendorDashboard";

import { AppBar, Toolbar, Button, Typography, Box, Container } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function App() {
  const [role, setRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    const checkRole = () => {
      setRole(localStorage.getItem("userRole"));
    };
    window.addEventListener("storage", checkRole);
    return () => window.removeEventListener("storage", checkRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <Box sx={{ minHeight: "100vh", bgcolor: "#339977" }}>
        
        {/* SIMPLE CLEAN NAVBAR */}
        <AppBar position="sticky" sx={{ bgcolor: "#c52020", color: "#333", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              
              {/* LOGO */}
              <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}>
                <ShoppingCartIcon sx={{ color: "#764ba2" }} />
                <Typography variant="h6" sx={{ fontWeight: "800", color: "#2c3e50", letterSpacing: "0.5px" }}>
                  InvoStore
                </Typography>
              </Box>

              {/* NAV LINKS (SIMPLE TEXT) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button component={Link} to="/" sx={{ color: "#555", fontWeight: 600 }}>Products</Button>

                {role === "VENDOR" && (
                  <>
                    <Button component={Link} to="/dashboard" sx={{ color: "#555", fontWeight: 600 }}>Dashboard</Button>
                    <Button component={Link} to="/add" sx={{ color: "#555", fontWeight: 600 }}>Add Product</Button>
                  </>
                )}

                {role && (
                  <Button component={Link} to="/billing" sx={{ color: "#555", fontWeight: 600 }}>Billing</Button>
                )}

                {/* ANIMATED BUTTON SECTION */}
                <Box sx={{ ml: 3 }}>
                  {!role ? (
                    <Button
                      variant="contained"
                      component={Link}
                      to="/login"
                      className="save-btn" // Using your CSS animation
                      sx={{ borderRadius: "8px", px: 4 }}
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleLogout}
                      className="save-btn" // Using your CSS animation
                      sx={{ 
                        borderRadius: "8px", 
                        px: 3,
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" }
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </Box>
              </Box>

            </Toolbar>
          </Container>
        </AppBar>

        {/* CONTENT AREA */}
        <Container maxWidth="xl" sx={{ mt: 5 }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={role === "VENDOR" ? <VendorDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/add" element={role === "VENDOR" ? <AddProduct /> : <Navigate to="/login" replace />} />
            <Route path="/billing" element={role ? <Billing /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;