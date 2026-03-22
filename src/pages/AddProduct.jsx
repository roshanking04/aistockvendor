import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveProduct } from "../services/api";
import "./AddProduct.css";

// ── Must match CATEGORIES in ProductList.jsx ──
const CATEGORIES = [
  { id: "battery",     label: "Battery",        icon: "🔋" },
  { id: "bike",        label: "Bike Parts",      icon: "🏍️" },
  { id: "scrap",       label: "Scrap",           icon: "♻️" },
  { id: "electronics", label: "Electronics",     icon: "⚡" },
  { id: "motor",       label: "Motor & Engine",  icon: "⚙️" },
  { id: "charger",     label: "Charger",         icon: "🔌" },
  { id: "other",       label: "Other",           icon: "📦" },
];

// ── SINGLE PRODUCT FORM ──
function SingleUpload() {
  const navigate = useNavigate();
  const [name,          setName]          = useState("");
  const [price,         setPrice]         = useState("");
  const [costPrice,     setCostPrice]     = useState("");
  const [description,   setDescription]   = useState("");
  const [stockQuantity, setStock]         = useState("100");
  const [category,      setCategory]      = useState("");
  const [image,         setImage]         = useState(null);
  const [preview,       setPreview]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [toast,         setToast]         = useState({ show: false, msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!name.trim()) return showToast("Product name is required", "error");
    if (!price)       return showToast("Selling price is required", "error");
    if (!stockQuantity || Number(stockQuantity) < 0)
                      return showToast("Enter a valid stock quantity", "error");
    if (!image)       return showToast("Please upload an image", "error");

    const formData = new FormData();
    formData.append("name",          name.trim());
    formData.append("price",         price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("description",   description);
    formData.append("image",         image);
    if (costPrice) formData.append("costPrice", costPrice);
    if (category)  formData.append("category",  category);

    setLoading(true);
    saveProduct(formData)
      .then(() => {
        setLoading(false);
        setSaved(true);
        showToast("Product added successfully!");
        setTimeout(() => navigate("/products"), 2000);
      })
      .catch(() => {
        setLoading(false);
        showToast("Server error. Try again.", "error");
      });
  };

  return (
    <div className="ap-grid-layout">
      {/* ── LEFT: FORM ── */}
      <div className="ap-card">

        <div className="ap-field">
          <label className="ap-label">Product Name *</label>
          <input className="ap-input" placeholder="e.g. Samsung Galaxy S24"
            value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="ap-price-row">
          <div className="ap-field">
            <label className="ap-label">Cost Price ₹ <span className="ap-optional">(optional)</span></label>
            <input className="ap-input" type="number" min="0" placeholder="0.00"
              value={costPrice} onChange={e => setCostPrice(e.target.value)} />
          </div>
          <div className="ap-field">
            <label className="ap-label">Selling Price ₹ *</label>
            <input className="ap-input highlight-price" type="number" min="0" placeholder="0.00"
              value={price} onChange={e => setPrice(e.target.value)} />
          </div>
        </div>

        {/* ── CATEGORY SELECTOR ── */}
        <div className="ap-field">
          <label className="ap-label">Category <span className="ap-optional">(for filter)</span></label>
          <div className="ap-cat-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`ap-cat-chip${category === cat.id ? " selected" : ""}`}
                onClick={() => setCategory(category === cat.id ? "" : cat.id)}
              >
                <span className="ap-cat-chip-icon">{cat.icon}</span>
                <span>{cat.label}</span>
                {category === cat.id && <span className="ap-cat-chip-check">✓</span>}
              </button>
            ))}
          </div>
          {category && (
            <p className="ap-cat-hint">
              Selected: <strong>{CATEGORIES.find(c => c.id === category)?.icon} {CATEGORIES.find(c => c.id === category)?.label}</strong>
              &nbsp;<button className="ap-cat-clear" onClick={() => setCategory("")}>clear</button>
            </p>
          )}
        </div>

        <div className="ap-field">
          <label className="ap-label">Stock Quantity *</label>
          <div className="ap-stock-row">
            <button type="button" className="ap-stock-btn minus"
              onClick={() => setStock(q => String(Math.max(0, Number(q) - 1)))}>−</button>
            <input className="ap-input ap-stock-input" type="number" min="0"
              value={stockQuantity} onChange={e => setStock(e.target.value)} />
            <button type="button" className="ap-stock-btn plus"
              onClick={() => setStock(q => String(Number(q) + 1))}>+</button>
          </div>
          <p className="ap-stock-hint">
            {Number(stockQuantity) <= 5
              ? "⚠️ Low stock warning will trigger at ≤5 units"
              : `${stockQuantity} units will be added to inventory`}
          </p>
        </div>

        <div className="ap-field">
          <label className="ap-label">Description <span className="ap-optional">(optional)</span></label>
          <textarea className="ap-input ap-textarea" rows={3}
            placeholder="Brief product description..."
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button
          className={`ap-submit-btn${loading ? " loading" : ""}${saved ? " success" : ""}`}
          onClick={handleSave} disabled={loading || saved}
        >
          {loading ? "Saving..." : saved ? "✓ Saved!" : "Confirm & Save Product"}
        </button>
      </div>

      {/* ── RIGHT: IMAGE DROP ZONE ── */}
      <div className="ap-image-section">
        <label className="ap-label">Product Image *</label>
        <div
          className={`ap-upload-box${preview ? " has-img" : ""}`}
          onClick={() => document.getElementById("singleFileInput").click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.currentTarget.classList.add("drag-over")}
          onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="ap-preview-img" />
          ) : (
            <div className="ap-upload-placeholder">
              <span className="upload-icon">📸</span>
              <p className="ap-drop-title">Drop image here</p>
              <p className="ap-drop-sub">or click to browse</p>
              <span className="ap-upload-hint">PNG, JPG up to 5MB</span>
            </div>
          )}
        </div>
        <input type="file" id="singleFileInput" hidden onChange={handleImage} accept="image/*" />
        {preview && (
          <button className="ap-clear-img" onClick={() => { setImage(null); setPreview(null); }}>
            ✕ Remove Image
          </button>
        )}
      </div>

      <div className={`ap-toast${toast.show ? " show" : ""}${toast.type === "error" ? " error" : ""}`}>
        {toast.msg}
      </div>
    </div>
  );
}

// ── BULK UPLOAD ──
function BulkUpload() {
  const [rows, setRows]       = useState([
    { name: "", price: "", costPrice: "", stockQuantity: "100", category: "", description: "", image: null, preview: null }
  ]);
  const [uploading, setUploading] = useState(false);
  const [results,   setResults]   = useState([]);
  const [toast,     setToast]     = useState({ show: false, msg: "", type: "" });
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3500);
  };

  const addRow    = () => setRows(r => [...r, { name: "", price: "", costPrice: "", stockQuantity: "100", category: "", description: "", image: null, preview: null }]);
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i, key, value) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: value } : row));

  const handleRowImage = (i, file) => {
    if (!file) return;
    updateRow(i, "image",   file);
    updateRow(i, "preview", URL.createObjectURL(file));
  };

  const handleBulkDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;
    setRows(prev => {
      const updated = [...prev];
      files.forEach((file, fi) => {
        if (updated[fi]) updated[fi] = { ...updated[fi], image: file, preview: URL.createObjectURL(file) };
        else updated.push({ name: "", price: "", costPrice: "", stockQuantity: "100", category: "", description: "", image: file, preview: URL.createObjectURL(file) });
      });
      return updated;
    });
  };

  const handleSubmitAll = async () => {
    const invalid = rows.findIndex(r => !r.name.trim() || !r.price || !r.image);
    if (invalid !== -1) { showToast(`Row ${invalid + 1}: name, price and image are required`, "error"); return; }

    setUploading(true);
    const res = [];

    for (let i = 0; i < rows.length; i++) {
      const row      = rows[i];
      const formData = new FormData();
      formData.append("name",          row.name.trim());
      formData.append("price",         row.price);
      formData.append("stockQuantity", row.stockQuantity || 100);
      formData.append("description",   row.description);
      formData.append("image",         row.image);
      if (row.costPrice) formData.append("costPrice", row.costPrice);
      if (row.category)  formData.append("category",  row.category);

      try {
        await saveProduct(formData);
        res.push({ name: row.name, status: "success" });
      } catch {
        res.push({ name: row.name, status: "error" });
      }
    }

    setUploading(false);
    setResults(res);
    const failed = res.filter(r => r.status === "error").length;
    if (failed === 0) { showToast(`All ${res.length} products uploaded!`); setTimeout(() => navigate("/products"), 2500); }
    else showToast(`${res.length - failed} uploaded, ${failed} failed`, "error");
  };

  return (
    <div className="bulk-root">
      {/* Drop zone */}
      <div className="bulk-drop-zone"
        onDrop={handleBulkDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.currentTarget.classList.add("drag-over")}
        onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
        onClick={() => document.getElementById("bulkImgInput").click()}>
        <span className="bulk-drop-icon">🖼️</span>
        <p className="bulk-drop-title">Drop multiple images here to auto-fill rows</p>
        <p className="bulk-drop-sub">or click to pick images · Each image = one product row</p>
        <input type="file" id="bulkImgInput" hidden multiple accept="image/*"
          onChange={e => {
            Array.from(e.target.files).forEach((file, fi) => {
              setRows(prev => {
                const updated = [...prev];
                if (updated[fi]) updated[fi] = { ...updated[fi], image: file, preview: URL.createObjectURL(file) };
                else updated.push({ name: "", price: "", costPrice: "", stockQuantity: "100", category: "", description: "", image: file, preview: URL.createObjectURL(file) });
                return [...updated];
              });
            });
          }} />
      </div>

      {/* Rows */}
      <div className="bulk-rows">
        {rows.map((row, i) => (
          <div key={i} className="bulk-row-card">
            <div className="bulk-row-num">#{i + 1}</div>

            {/* Thumbnail */}
            <div className={`bulk-img-thumb${row.preview ? " has-img" : ""}`}
              onClick={() => document.getElementById(`rowImg-${i}`).click()}>
              {row.preview ? <img src={row.preview} alt="" /> : <span>📸</span>}
              <input type="file" id={`rowImg-${i}`} hidden accept="image/*"
                onChange={e => handleRowImage(i, e.target.files[0])} />
            </div>

            {/* Fields */}
            <div className="bulk-row-fields">
              <input className="bulk-input" placeholder="Product name *"
                value={row.name} onChange={e => updateRow(i, "name", e.target.value)} />
              <input className="bulk-input" type="number" placeholder="Selling price ₹ *"
                value={row.price} onChange={e => updateRow(i, "price", e.target.value)} />
              <input className="bulk-input" type="number" placeholder="Cost price ₹ (opt)"
                value={row.costPrice} onChange={e => updateRow(i, "costPrice", e.target.value)} />
              <input className="bulk-input" type="number" placeholder="Stock qty"
                value={row.stockQuantity} onChange={e => updateRow(i, "stockQuantity", e.target.value)} />

              {/* ── CATEGORY SELECT IN BULK ROW ── */}
              <select className="bulk-input bulk-cat-select"
                value={row.category} onChange={e => updateRow(i, "category", e.target.value)}>
                <option value="">-- Category --</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>

              <input className="bulk-input bulk-desc" placeholder="Description (optional)"
                value={row.description} onChange={e => updateRow(i, "description", e.target.value)} />
            </div>

            {/* Status */}
            {results[i] && (
              <div className={`bulk-status ${results[i].status}`}>
                {results[i].status === "success" ? "✓" : "✗"}
              </div>
            )}

            {/* Remove */}
            {rows.length > 1 && (
              <button className="bulk-remove-btn" onClick={() => removeRow(i)} title="Remove">✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bulk-footer">
        <button className="bulk-add-row-btn" onClick={addRow}>+ Add Another Row</button>
        <div className="bulk-footer-right">
          <span className="bulk-count">{rows.length} product{rows.length > 1 ? "s" : ""}</span>
          <button
            className={`ap-submit-btn bulk-submit${uploading ? " loading" : ""}`}
            onClick={handleSubmitAll} disabled={uploading}>
            {uploading ? `Uploading ${results.length + 1}/${rows.length}...` : `Upload All ${rows.length} Products`}
          </button>
        </div>
      </div>

      <div className={`ap-toast${toast.show ? " show" : ""}${toast.type === "error" ? " error" : ""}`}>
        {toast.msg}
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function AddProduct() {
  const [mode, setMode] = useState("single");

  return (
    <div className="ap-root">
      <header className="ap-header">
        <div>
          <h1 className="ap-title">Add <span className="ap-accent">Products</span></h1>
          <p className="ap-sub">Single item or bulk upload multiple products at once</p>
        </div>
        <div className="ap-mode-toggle">
          <button className={`ap-mode-btn${mode === "single" ? " active" : ""}`} onClick={() => setMode("single")}>
            📦 Single Product
          </button>
          <button className={`ap-mode-btn${mode === "bulk" ? " active" : ""}`} onClick={() => setMode("bulk")}>
            🗂️ Bulk Upload
          </button>
        </div>
      </header>

      {mode === "single" ? <SingleUpload /> : <BulkUpload />}
    </div>
  );
}
