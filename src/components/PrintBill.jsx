import React from "react";
import "./PrintBill.css";

export default function PrintBill({ cart, customer, subTotal, discount, gst, total, billData }) {
  const now    = new Date();
  const date   = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const time   = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const billNo = billData?.id ? `INV-${String(billData.id).padStart(6,"0")}` : "INV-" + Date.now().toString().slice(-6);

  return (
    <div className="pb-root" id="print-bill-area">
      {/* ── HEADER ── */}
      <div className="pb-header">
        <div className="pb-logo-row">
          <div className="pb-logo-box"> </div>
          <div>
            <div className="pb-logo">AI STOCK<span>VENDOR</span></div>
            <div className="pb-tagline">Smart Billing · Zero Hassle</div>
          </div>
        </div>
        <div className="pb-contact">
          📞 8309571670 &nbsp;·&nbsp; ✉ roshanrakesh14431@gmail.com &nbsp;·&nbsp; 📍 Mahabubabad, TN
        </div>
      </div>

      <div className="pb-line" />

      {/* ── BILL INFO ── */}
      <div className="pb-meta">
        <div className="pb-meta-block">
          <div className="pb-meta-label">Bill No</div>
          <div className="pb-meta-value">{billNo}</div>
        </div>
        <div className="pb-meta-block">
          <div className="pb-meta-label">Date</div>
          <div className="pb-meta-value">{date}</div>
        </div>
        <div className="pb-meta-block">
          <div className="pb-meta-label">Time</div>
          <div className="pb-meta-value">{time}</div>
        </div>
      </div>

      {/* ── CUSTOMER ── */}
      {(customer?.name || customer?.phone) && (
        <>
          <div className="pb-line" />
          <div className="pb-customer">
            <div className="pb-section-title">Bill To</div>
            {customer.name  && <div className="pb-cust-name">{customer.name}</div>}
            {customer.phone && <div className="pb-cust-phone">📞 {customer.phone}</div>}
          </div>
        </>
      )}

      <div className="pb-line" />

      {/* ── ITEMS TABLE ── */}
      <table className="pb-table">
        <thead>
          <tr className="pb-thead-row">
            <th className="pb-th" style={{textAlign:"left", width:"40%"}}>Item</th>
            <th className="pb-th" style={{textAlign:"center"}}>Qty</th>
            <th className="pb-th" style={{textAlign:"right"}}>Price</th>
            <th className="pb-th" style={{textAlign:"right"}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr key={i} className={`pb-row${i % 2 === 0 ? " even" : ""}`}>
              <td className="pb-td" style={{textAlign:"left"}}>{item.name}</td>
              <td className="pb-td" style={{textAlign:"center"}}>{item.quantity}</td>
              <td className="pb-td" style={{textAlign:"right"}}>₹{Number(item.price).toFixed(2)}</td>
              <td className="pb-td" style={{textAlign:"right", fontWeight:700}}>₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pb-line" />

      {/* ── TOTALS ── */}
      <div className="pb-totals">
        <div className="pb-total-row">
          <span>Subtotal</span>
          <span>₹{Number(subTotal).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="pb-total-row pb-discount">
            <span>Discount</span>
            <span>− ₹{Number(discount).toFixed(2)}</span>
          </div>
        )}
        <div className="pb-total-row">
          <span>GST (18%)</span>
          <span>₹{Number(gst).toFixed(2)}</span>
        </div>
        <div className="pb-grand">
          <span>GRAND TOTAL</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
      </div>

      <div className="pb-line" />

      {/* ── FOOTER ── */}
      <div className="pb-footer">
        <div className="pb-thanks">🙏 Thank you for your purchase!</div>
        <div className="pb-policy">Goods once sold will not be returned · GST included</div>
      </div>
    </div>
  );
}
