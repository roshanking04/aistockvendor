import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon  from "@mui/icons-material/EditOutlined";
import SearchIcon        from "@mui/icons-material/Search";
import GridViewIcon      from "@mui/icons-material/GridView";
import ViewListIcon      from "@mui/icons-material/ViewList";
import AddIcon           from "@mui/icons-material/Add";
import { getAllProducts, deleteProduct as deleteAPI } from "../services/api";
import "./ProductList.css";

const API = "http://localhost:3869";

// ── Define your categories here — add/edit as needed ──
const CATEGORIES = [
  { id: "all",         label: "All Products",     icon: "◈", color: "#6366f1" },
  { id: "battery",     label: "Battery",          icon: "🔋", color: "#f59e0b" },
  { id: "bike",        label: "Bike Parts",       icon: "🏍️", color: "#ef4444" },
  { id: "scrap",       label: "Scrap",            icon: "♻️", color: "#10b981" },
  { id: "electronics", label: "Electronics",      icon: "⚡", color: "#3b82f6" },
  { id: "motor",       label: "Motor & Engine",   icon: "⚙️", color: "#8b5cf6" },
  { id: "charger",     label: "Charger",          icon: "🔌", color: "#ec4899" },
  { id: "other",       label: "Other",            icon: "📦", color: "#6b7280" },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [view,      setView]      = useState("grid");
  const [category,  setCategory]  = useState("all");
  const [dropOpen,  setDropOpen]  = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const dropRef = useRef(null);

  useEffect(() => {
    getAllProducts()
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (search.trim().length < 1) { setSuggestions([]); return; }
    const s = products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5)
      .map(p => p.name);
    setSuggestions([...new Set(s)]);
  }, [search, products]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      deleteAPI(id)
        .then(() => setProducts(p => p.filter(x => x.id !== id)))
        .catch(console.error);
    }
  };

  const activeCat = CATEGORIES.find(c => c.id === category);

  // Filter: search + category
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "all" ||
      (p.category?.toLowerCase() === category) ||
      p.name.toLowerCase().includes(category.toLowerCase()) ||
      (p.description?.toLowerCase().includes(category.toLowerCase()));
    return matchSearch && matchCat;
  });

  return (
    <div className="pl-page">

      {/* ── TOP BAR ── */}
      <div className="pl-topbar">
        <div className="pl-topbar-left">
          <h1 className="pl-page-title">
            Products
            <span className="pl-count-badge">{filtered.length}</span>
          </h1>
          <p className="pl-page-sub">Manage your entire inventory</p>
        </div>

        <div className="pl-topbar-right">

          {/* ── SEARCH with suggestions ── */}
          <div className="pl-search-outer" ref={dropRef}>
            <div className="pl-search-wrap">
              <SearchIcon className="pl-search-icon" />
              <input
                className="pl-search"
                placeholder="Search products..."
                value={search}
                autoComplete="off"
                onChange={e => { setSearch(e.target.value); setDropOpen(false); }}
                onFocus={() => suggestions.length > 0 && setDropOpen(false)}
              />
              {search && (
                <button className="pl-search-clear" onClick={() => { setSearch(""); setSuggestions([]); }}>✕</button>
              )}
            </div>

            {/* Search suggestions dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && search && (
                <motion.div
                  className="pl-suggestions"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="pl-suggestion-item"
                      onClick={() => { setSearch(s); setSuggestions([]); }}
                    >
                      <SearchIcon style={{ fontSize: 14, opacity: 0.4 }} />
                      {s}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── CATEGORY DROPDOWN ── */}
          <div className="pl-cat-wrap" ref={null}>
            <button
              className={`pl-cat-btn${dropOpen ? " open" : ""}`}
              onClick={() => setDropOpen(!dropOpen)}
              style={{ "--cat-color": activeCat.color }}
            >
              <span className="pl-cat-icon">{activeCat.icon}</span>
              <span className="pl-cat-label">{activeCat.label}</span>
              <span className={`pl-cat-arrow${dropOpen ? " up" : ""}`}>▾</span>
            </button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  className="pl-cat-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="pl-cat-dropdown-head">Filter by Category</div>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`pl-cat-option${category === cat.id ? " active" : ""}`}
                      onClick={() => { setCategory(cat.id); setDropOpen(false); }}
                      style={{ "--cat-color": cat.color }}
                    >
                      <span className="pl-cat-opt-icon">{cat.icon}</span>
                      <span className="pl-cat-opt-label">{cat.label}</span>
                      {category === cat.id && <span className="pl-cat-opt-check">✓</span>}
                      <span className="pl-cat-opt-count">
                        {cat.id === "all"
                          ? products.length
                          : products.filter(p =>
                              p.category?.toLowerCase() === cat.id ||
                              p.name.toLowerCase().includes(cat.id) ||
                              p.description?.toLowerCase().includes(cat.id)
                            ).length
                        }
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div className="pl-view-toggle">
            <button className={`pl-toggle-btn${view === "grid" ? " on" : ""}`} onClick={() => setView("grid")}>
              <GridViewIcon fontSize="small" />
            </button>
            <button className={`pl-toggle-btn${view === "list" ? " on" : ""}`} onClick={() => setView("list")}>
              <ViewListIcon fontSize="small" />
            </button>
          </div>

          <button className="pl-add-btn" onClick={() => navigate("/add")}>
            <AddIcon fontSize="small" /> Add Product
          </button>
        </div>
      </div>

      {/* ── ACTIVE FILTER CHIPS ── */}
      {(category !== "all" || search) && (
        <div className="pl-filter-chips">
          {category !== "all" && (
            <span className="pl-chip" style={{ "--cat-color": activeCat.color }}>
              {activeCat.icon} {activeCat.label}
              <button onClick={() => setCategory("all")}>✕</button>
            </span>
          )}
          {search && (
            <span className="pl-chip pl-chip-search">
              🔍 "{search}"
              <button onClick={() => setSearch("")}>✕</button>
            </span>
          )}
          <button className="pl-clear-all" onClick={() => { setCategory("all"); setSearch(""); }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── SKELETON ── */}
      {loading && (
        <div className="pl-skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="pl-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && filtered.length === 0 && (
        <div className="pl-empty">
          <div className="pl-empty-ring"><span>📦</span></div>
          <h2>No products found</h2>
          <p>{search || category !== "all" ? "Try a different search or category" : "Add your first product"}</p>
          <button className="pl-add-btn" onClick={() => navigate("/add")} style={{ marginTop: 16 }}>
            + Add First Product
          </button>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {!loading && view === "grid" && filtered.length > 0 && (
        <div className="pl-grid">
          <AnimatePresence>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                className="pl-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="pl-card-img-wrap">
                  <div className="pl-card-img-top-bar" />
                <img 
  src={product.image ? `${API}/uploads/${product.image}` : "https://placehold.co/60x60/f5f5f5/ccc?text=?"} 
  alt="" 
  className="pl-list-img"
  onError={(e) => { 
    e.target.onerror = null;
    e.target.src = "https://placehold.co/60x60/f5f5f5/ccc?text=?"; 
  }} 
/>
                  <div className="pl-card-img-shine" />
                  {product.stockQuantity <= 5 && (
                    <div className="pl-low-stock-badge">⚠️ Low Stock</div>
                  )}
                  <div className="pl-card-overlay">
                    <button className="pl-icon-btn edit" onClick={() => navigate(`/edit/${product.id}`)}>
                      <EditOutlinedIcon fontSize="small" />
                    </button>
                    <button className="pl-icon-btn del" onClick={() => handleDelete(product.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>
                <div className="pl-card-body">
                  <div className="pl-card-top">
                    <span className="pl-card-name">{product.name}</span>
                    <span className="pl-card-price">₹{product.price}</span>
                  </div>
                  <p className="pl-card-desc">{product.description || "No description provided."}</p>
                  <div className="pl-stock-row">
                    <span className="pl-stock-label">Stock</span>
                    <span className={`pl-stock-val${product.stockQuantity <= 5 ? " low" : ""}`}>
                      {product.stockQuantity} units
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {!loading && view === "list" && filtered.length > 0 && (
        <div className="pl-list">
          <div className="pl-list-header">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          <AnimatePresence>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                className="pl-list-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="pl-list-product">
                  <img src={`${API}/uploads/${product.image}`} alt="" className="pl-list-img"
                    onError={e => { e.target.src = "https://placehold.co/60x60/f5f5f5/ccc?text=?"; }} />
                  <span className="pl-list-name">{product.name}</span>
                </div>
                <span className="pl-list-price">₹{product.price}</span>
                <span className={`pl-list-stock${product.stockQuantity <= 5 ? " low" : ""}`}>
                  {product.stockQuantity}
                </span>
                <div className="pl-list-actions">
                  <button className="pl-list-btn edit" onClick={() => navigate(`/edit/${product.id}`)}>Edit</button>
                  <button className="pl-list-btn del" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
