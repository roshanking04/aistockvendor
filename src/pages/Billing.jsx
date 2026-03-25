import React, { useEffect, useState, useRef } from "react";
import CartDrawer from "../components/CartDrawer";
import { getAllProducts, generateBillAPI } from "../services/api";
import "./Billing.css";

const API = "http://localhost:3869";

const CATEGORIES = [
  { id: "all",         label: "All Products",    icon: "◈", color: "#6366f1" },
  { id: "battery",     label: "Battery",         icon: "🔋", color: "#f59e0b" },
  { id: "bike",        label: "Bike Parts",      icon: "🏍️", color: "#ef4444" },
  { id: "scrap",       label: "Scrap",           icon: "♻️", color: "#10b981" },
  { id: "electronics", label: "Electronics",     icon: "⚡", color: "#3b82f6" },
  { id: "motor",       label: "Motor & Engine",  icon: "⚙️", color: "#8b5cf6" },
  { id: "charger",     label: "Charger",         icon: "🔌", color: "#ec4899" },
  { id: "other",       label: "Other",           icon: "📦", color: "#6b7280" },
];

function BillTemplate({ cart, customer, subTotal, discount, gst, total, billData }) {
  const now    = new Date();
  const date   = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const time   = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const billNo = billData?.id ? `INV-${String(billData.id).padStart(6,"0")}` : "INV-" + Date.now().toString().slice(-6);

  return (
    <div style={{ fontFamily:"'Courier New',Courier,monospace", fontSize:13, color:"#000", background:"#fff", padding:24, maxWidth:600, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:6 }}>
          <div style={{ width:42,height:42,background:"#f5c842",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#000" }}>AI</div>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:20,fontWeight:900,letterSpacing:1 }}>STOCK<span style={{ color:"#e6a800" }}>VENDOR</span></div>
            <div style={{ fontSize:10,color:"#666" }}>Smart Billing · Zero Hassle</div>
          </div>
        </div>
        <div style={{ fontSize:10,color:"#555" }}>📞 6383752697 · ✉ lionevehicle@gmail.com · 📍 Coimbatore, TN</div>
      </div>
      <hr style={{ border:"none",borderTop:"1px dashed #999",margin:"10px 0" }} />
      <div style={{ display:"flex",justifyContent:"space-between",margin:"8px 0" }}>
        {[["Bill No",billNo],["Date",date],["Time",time]].map(([l,v]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:0.5,color:"#888" }}>{l}</div>
            <div style={{ fontSize:12,fontWeight:700 }}>{v}</div>
          </div>
        ))}
      </div>
      {(customer?.name || customer?.phone) && (
        <>
          <hr style={{ border:"none",borderTop:"1px dashed #999",margin:"10px 0" }} />
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:1,color:"#888",marginBottom:4 }}>Bill To</div>
            {customer.name  && <div style={{ fontSize:14,fontWeight:700 }}>{customer.name}</div>}
            {customer.phone && <div style={{ fontSize:11,color:"#555",marginTop:2 }}>📞 {customer.phone}</div>}
          </div>
        </>
      )}
      <hr style={{ border:"none",borderTop:"1px dashed #999",margin:"10px 0" }} />
      <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:8 }}>
        <thead>
          <tr style={{ background:"#f5c842" }}>
            {[["Item","left","40%"],["Qty","center","15%"],["Price","right","20%"],["Amount","right","25%"]].map(([h,a,w]) => (
              <th key={h} style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",padding:"6px 4px",textAlign:a,width:w }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cart.map((item,i) => (
            <tr key={i} style={{ background:i%2===0?"#f9f9f9":"#fff" }}>
              <td style={{ padding:"5px 4px",fontSize:12,textAlign:"left" }}>{item.name}</td>
              <td style={{ padding:"5px 4px",fontSize:12,textAlign:"center" }}>{item.quantity}</td>
              <td style={{ padding:"5px 4px",fontSize:12,textAlign:"right" }}>₹{Number(item.price).toFixed(2)}</td>
              <td style={{ padding:"5px 4px",fontSize:12,textAlign:"right",fontWeight:700 }}>₹{(item.price*item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ border:"none",borderTop:"1px dashed #999",margin:"10px 0" }} />
      <div style={{ marginBottom:8 }}>
        {[["Subtotal",`₹${Number(subTotal).toFixed(2)}`,"#000"],...(discount>0?[["Discount",`− ₹${Number(discount).toFixed(2)}`,"#22c55e"]]:[]),["GST (18%)",`₹${Number(gst).toFixed(2)}`,"#000"]].map(([l,v,c]) => (
          <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12,color:c }}>
            <span>{l}</span><span>{v}</span>
          </div>
        ))}
        <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0 4px",fontSize:17,fontWeight:900,borderTop:"2px solid #000",marginTop:6 }}>
          <span>GRAND TOTAL</span><span>₹{Number(total).toFixed(2)}</span>
        </div>
      </div>
      <hr style={{ border:"none",borderTop:"1px dashed #999",margin:"10px 0" }} />
      <div style={{ textAlign:"center",marginTop:10 }}>
        <div style={{ fontSize:13,fontWeight:700 }}>🙏 Thank you for your purchase!</div>
        <div style={{ fontSize:10,color:"#888",marginTop:3 }}>Goods once sold will not be returned · GST @ 18% included</div>
      </div>
    </div>
  );
}

export default function Billing() {
  const [products,    setProducts]    = useState([]);
  const [cart,        setCart]        = useState([]);
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("all");
  const [dropOpen,    setDropOpen]    = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [openDrawer,  setOpenDrawer]  = useState(false);
  const [customer,    setCustomer]    = useState({ name: "", phone: "" });
  const [discount,    setDiscount]    = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [billData,    setBillData]    = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generating,  setGenerating]  = useState(false);
  const printRef  = useRef(null);
  const dropRef   = useRef(null);

  useEffect(() => {
    getAllProducts()
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Failed to load products."); setLoading(false); });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!search.trim()) { setSuggestions([]); return; }
    const s = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0,5).map(p => p.name);
    setSuggestions([...new Set(s)]);
  }, [search, products]);

  const updateQty = (product, delta) => {
    const exist = cart.find(p => p.id === product.id);
    if (!exist && delta > 0) setCart([...cart, { ...product, quantity: 1 }]);
    else if (exist) {
      const newQty = exist.quantity + delta;
      if (newQty <= 0) setCart(cart.filter(p => p.id !== product.id));
      else setCart(cart.map(p => p.id === product.id ? { ...p, quantity: newQty } : p));
    }
  };

  const subTotal  = billData?.subTotal  ?? cart.reduce((s,i) => s + i.price * i.quantity, 0);
  const gstAmount = billData?.gstAmount ?? (subTotal - discount) * 0.18;
  const total     = billData?.grandTotal ?? (subTotal - discount + gstAmount);
  const totalQty  = cart.reduce((s,i) => s + i.quantity, 0);

  const activeCat = CATEGORIES.find(c => c.id === category);

  // Filter: search + category
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "all" ||
      p.category?.toLowerCase() === category ||
      p.name.toLowerCase().includes(category.toLowerCase()) ||
      p.description?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  const generateBill = async () => {
    if (cart.length === 0) { alert("Cart is empty!"); return; }
    setGenerating(true);
    try {
      const result = await generateBillAPI(cart, customer, discount);
      setBillData(result);
      setOpenDrawer(false);
      setGenerating(false);
      setTimeout(() => {
        const html = printRef.current?.innerHTML;
        if (!html) return;
        const win = window.open("","_blank","width=700,height=900");
        win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}@page{size:A4;margin:15mm 12mm;}</style></head><body>${html}</body></html>`);
        win.document.close(); win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
      }, 300);
    } catch { setGenerating(false); alert("Failed to generate bill."); }
  };

  const exportCSV = () => {
    if (cart.length === 0) { alert("Cart is empty!"); return; }
    const billNo = billData?.id ? `INV-${String(billData.id).padStart(6,"0")}` : "PREVIEW";
    const rows = [
      ["STOCKVENDOR Invoice"], ["Bill No", billNo],
      ["Date", new Date().toLocaleDateString("en-IN")],
      ["Customer", customer.name||"—"], ["Phone", customer.phone||"—"], [],
      ["Item","Qty","Price (Rs)","Amount (Rs)"],
      ...cart.map(i => [i.name, i.quantity, Number(i.price).toFixed(2), (i.price*i.quantity).toFixed(2)]),
      [], ["Subtotal","","",Number(subTotal).toFixed(2)],
      ...(discount>0?[["Discount","","",`-${Number(discount).toFixed(2)}`]]:[]),
      ["GST 18%","","",Number(gstAmount).toFixed(2)],
      ["GRAND TOTAL","","",Number(total).toFixed(2)],
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`Invoice_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const billProps = { cart, customer, subTotal, discount, gst: gstAmount, total, billData };

  return (
    <div className="bl-root">

      {/* ── TOP BAR ── */}
      <div className="bl-topbar">

        {/* Search with suggestions */}
        <div className="bl-search-outer" ref={dropRef}>
          <div className="bl-search-wrap">
            <span className="bl-search-icon">🔍</span>
            <input className="bl-search" placeholder="Search products..."
              value={search} autoComplete="off"
              onChange={e => { setSearch(e.target.value); }}
            />
            {search && (
              <button className="bl-search-clear" onClick={() => { setSearch(""); setSuggestions([]); }}>✕</button>
            )}
          </div>
          {/* Suggestions dropdown */}
          {suggestions.length > 0 && search && (
            <div className="bl-suggestions">
              {suggestions.map((s,i) => (
                <div key={i} className="bl-suggestion-item"
                  onClick={() => { setSearch(s); setSuggestions([]); }}>
                  🔍 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category dropdown */}
        <div className="bl-cat-wrap" ref={dropRef}>
          <button
            className={`bl-cat-btn${dropOpen ? " open" : ""}`}
            onClick={() => setDropOpen(!dropOpen)}
            style={{ "--cat-color": activeCat.color }}
          >
            <span>{activeCat.icon}</span>
            <span className="bl-cat-label">{activeCat.label}</span>
            <span className={`bl-cat-arrow${dropOpen ? " up" : ""}`}>▾</span>
          </button>

          {dropOpen && (
            <div className="bl-cat-dropdown">
              <div className="bl-cat-dropdown-head">Filter by Category</div>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`bl-cat-option${category === cat.id ? " active" : ""}`}
                  onClick={() => { setCategory(cat.id); setDropOpen(false); }}
                  style={{ "--cat-color": cat.color }}
                >
                  <span className="bl-cat-opt-icon">{cat.icon}</span>
                  <span className="bl-cat-opt-label">{cat.label}</span>
                  {category === cat.id && <span className="bl-cat-check">✓</span>}
                  <span className="bl-cat-count">
                    {cat.id === "all" ? products.length
                      : products.filter(p =>
                          p.category?.toLowerCase() === cat.id ||
                          p.name.toLowerCase().includes(cat.id) ||
                          p.description?.toLowerCase().includes(cat.id)
                        ).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bl-topbar-right">
          <span className="bl-product-count">{filtered.length} products</span>
          {cart.length > 0 && (
            <>
              <button className="bl-action-btn bl-csv-btn" onClick={exportCSV}>📊 CSV</button>
              <button className="bl-action-btn bl-preview-btn-top" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "✕ Close" : "👁 Preview"}
              </button>
            </>
          )}
          {totalQty > 0 && (
            <button className="bl-cart-topbtn" onClick={() => setOpenDrawer(true)}>
              🛒 Cart ({totalQty})
            </button>
          )}
        </div>
      </div>

      {/* ── ACTIVE FILTER CHIPS ── */}
      {(category !== "all" || search) && (
        <div className="bl-filter-chips">
          {category !== "all" && (
            <span className="bl-chip" style={{ "--cat-color": activeCat.color }}>
              {activeCat.icon} {activeCat.label}
              <button onClick={() => setCategory("all")}>✕</button>
            </span>
          )}
          {search && (
            <span className="bl-chip bl-chip-search">
              🔍 "{search}"
              <button onClick={() => setSearch("")}>✕</button>
            </span>
          )}
          <button className="bl-clear-all" onClick={() => { setCategory("all"); setSearch(""); }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── BILL PREVIEW ── */}
      {showPreview && cart.length > 0 && (
        <div className="bl-preview-panel">
          <div className="bl-preview-bar">
            <span className="bl-preview-title">📄 Bill Preview</span>
            <div className="bl-preview-btns">
              <button className="bl-pb-btn bl-pb-print" onClick={() => {
                const win = window.open("","_blank","width=700,height=900");
                win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}@page{size:A4;margin:15mm 12mm;}</style></head><body>${printRef.current?.innerHTML}</body></html>`);
                win.document.close(); win.focus();
                setTimeout(() => { win.print(); win.close(); }, 400);
              }}>🖨 Print</button>
              <button className="bl-pb-btn bl-pb-csv" onClick={exportCSV}>📊 CSV</button>
              <button className="bl-pb-btn bl-pb-close" onClick={() => setShowPreview(false)}>✕</button>
            </div>
          </div>
          <div className="bl-preview-body"><BillTemplate {...billProps} /></div>
        </div>
      )}

      {/* Hidden print ref */}
      <div ref={printRef} style={{ display:"none" }}><BillTemplate {...billProps} /></div>

      {/* ── LOADING / ERROR / EMPTY ── */}
      {loading && (
        <div className="bl-loading">
          {[...Array(8)].map((_,i) => <div key={i} className="bl-skeleton" style={{ animationDelay:`${i*0.08}s` }} />)}
        </div>
      )}
      {error && <div className="bl-error">⚠️ {error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="bl-empty">
          <div className="bl-empty-icon">📦</div>
          <h3>No products found</h3>
          <p>{search || category !== "all" ? "Try a different search or category" : "Add products first"}</p>
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      {!loading && filtered.length > 0 && (
        <div className="bl-grid">
          {filtered.map(product => {
            const qty = cart.find(i => i.id === product.id)?.quantity || 0;
            return (
              <div key={product.id} className={`bl-card${qty > 0 ? " in-cart" : ""}`}>
                <div className="bl-img-wrap">
                  <div className="bl-img-top-bar" />
                  <div className="bl-img-shine" />
                  <img
                    src={product.image
                      ? `${API}/uploads/${product.image}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=300&background=f5c842&color=0f0f0f&bold=true`
                    }
                    alt={product.name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=300&background=f0f0f0&color=888&bold=true`;
                    }}
                  />
                  {qty > 0 && <div className="bl-in-cart-badge">{qty} in cart</div>}
                  {product.category && (
                    <div className="bl-cat-badge">
                      {CATEGORIES.find(c => c.id === product.category)?.icon || "📦"} {product.category}
                    </div>
                  )}
                </div>
                <div className="bl-info">
                  <div className="bl-name">{product.name}</div>
                  <div className="bl-price">₹{Number(product.price).toLocaleString("en-IN")}</div>
                  <div className="bl-controls">
                    <button className="bl-qty-btn minus" onClick={() => updateQty(product,-1)} disabled={qty===0}>−</button>
                    <span className={`bl-qty-num${qty > 0 ? " active" : ""}`}>{qty}</span>
                    <button className="bl-qty-btn plus" onClick={() => updateQty(product,1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating cart */}
      <button className={`bl-floating-cart${totalQty > 0 ? " visible" : ""}`} onClick={() => setOpenDrawer(true)}>
        🛒 {totalQty > 0 && <span className="bl-cart-badge">{totalQty}</span>}
      </button>

      <CartDrawer
        open={openDrawer} onClose={() => setOpenDrawer(false)}
        cart={cart} customer={customer} setCustomer={setCustomer}
        subTotal={subTotal} discount={discount} setDiscount={setDiscount}
        gstAmount={gstAmount} total={total}
        generateBill={generating ? null : generateBill}
        generating={generating}
      />
    </div>
  );
}
