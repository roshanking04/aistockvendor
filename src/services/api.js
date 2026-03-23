const API =process.env.REACT_APP_API_URL || "http://localhost:8080";

// Get token from localStorage
const getToken = () => localStorage.getItem("token") || "";

// Auth headers for JSON requests
const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
});

// Handle API response
const handleRes = async (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// ── AUTH ──
export const login = async (username, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const getStoredUser = () => ({
  token:    localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  role:     localStorage.getItem("role"),
  fullName: localStorage.getItem("fullName"),
});

export const isLoggedIn = () => {
  const t = localStorage.getItem("token");
  return !!(t && t !== "null" && t !== "undefined" && t.length > 10);
};

// ── PRODUCTS ──
export const getAllProducts = () =>
  fetch(`${API}/product/all`, { headers: authHeaders() }).then(handleRes);

export const saveProduct = (formData) =>
  fetch(`${API}/product/add`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: formData,
  }).then(handleRes);

export const updateProduct = (id, formData) =>
  fetch(`${API}/product/update/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: formData,
  }).then(handleRes);

export const deleteProduct = (id) =>
  fetch(`${API}/product/delete/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then(handleRes);

export const searchProducts = (name) =>
  fetch(`${API}/product/search?name=${encodeURIComponent(name)}`, {
    headers: authHeaders(),
  }).then(handleRes);

export const getLowStockProducts = () =>
  fetch(`${API}/product/low-stock`, { headers: authHeaders() }).then(handleRes);

// ── BILLING ──
export const generateBillAPI = (cart, customer = {}, discount = 0) => {
  const payload = {
    customerName:  customer?.name  || "",
    customerPhone: customer?.phone || "",
    discount:      Number(discount) || 0,
    items: cart.map(item => ({
      id:       item.id,
      name:     item.name,
      price:    item.price,
      quantity: item.quantity,
    })),
  };
  return fetch(`${API}/billing/generate-bill`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }).then(handleRes);
};

export const getAllBills = () =>
  fetch(`${API}/billing/all`, { headers: authHeaders() }).then(handleRes);

export const getBillById = (id) =>
  fetch(`${API}/billing/${id}`, { headers: authHeaders() }).then(handleRes);

// ── DASHBOARD ──
export const getDashboardStats = (range = "daily") =>
  fetch(`${API}/api/dashboard/stats?range=${range}`, {
    headers: authHeaders(),
  }).then(handleRes);

export const getRevenueChart = () =>
  fetch(`${API}/api/dashboard/chart/revenue`, {
    headers: authHeaders(),
  }).then(handleRes);

export const getDashboardLowStock = () =>
  fetch(`${API}/api/dashboard/low-stock`, {
    headers: authHeaders(),
  }).then(handleRes);
