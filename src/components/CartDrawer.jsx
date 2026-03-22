import React from "react";
import {
  Drawer, Box, Typography,
  TextField, Divider, Button, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CartDrawer({
  open,
  onClose,
  cart,
  customer,
  setCustomer,
  subTotal,
  discount,
  setDiscount,
  gstAmount,
  total,
  generateBill
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{
        width: 350,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}>

        {/* Header */}
        <Box sx={{
          p: 2,
          bgcolor: "warning.main",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}>
          <Typography variant="h6" color="white" fontWeight="bold">
            🛒 Billing
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Middle */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>

          {/* Customer */}
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            Customer Details
          </Typography>
          <TextField
            label="Customer Name"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <TextField
            label="Mobile Number"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />

          <Divider />

          {/* Items */}
          <Typography variant="subtitle2" fontWeight="bold" mt={2} mb={1}>
            Items ({cart.length})
          </Typography>

          {cart.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" mt={3}>
              No items added yet
            </Typography>
          ) : (
            cart.map(item => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                sx={{ bgcolor: "#fff8e1", p: 1, borderRadius: 1 }}
              >
                <Box>
                  <Typography fontSize={14} fontWeight="bold">{item.name}</Typography>
                  <Typography fontSize={12} color="text.secondary">
                    ₹{item.price} × {item.quantity}
                  </Typography>
                </Box>
                <Typography fontWeight="bold" color="warning.main">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))
          )}

          <Divider sx={{ my: 2 }} />

          {/* Totals */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>₹{Number(subTotal).toFixed(2)}</Typography>
          </Box>

          <TextField
            label="Discount (₹)"
            type="number"
            size="small"
            fullWidth
            sx={{ mb: 1 }}
            value={discount}
            inputProps={{ min: 0 }}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">GST (18%)</Typography>
            <Typography>₹{Number(gstAmount).toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between"
            sx={{ bgcolor: "#fff8e1", p: 1.5, borderRadius: 1 }}>
            <Typography fontWeight="bold" fontSize="1.1rem">Total</Typography>
            <Typography fontWeight="bold" fontSize="1.1rem" color="warning.main">
              ₹{Number(total).toFixed(2)}
            </Typography>
          </Box>

        </Box>

        {/* ✅ Buttons fixed at bottom — always visible */}
        <Box sx={{
          p: 2,
          borderTop: "1px solid #eee",
          bgcolor: "#fff",
          flexShrink: 0
        }}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            size="large"
            sx={{ mb: 1, color: "#fff", fontWeight: "bold" }}
            onClick={generateBill}
            disabled={cart.length === 0}
          >
            🧾 Generate & Print Bill
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </Box>

      </Box>
    </Drawer>
  );
}

export default CartDrawer;