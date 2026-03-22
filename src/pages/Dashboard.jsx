import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { getDashboardStats, getRevenueChart, getStoredUser } from "../services/api";
import "./Dashboard.css";

const MOCK_REVENUE = [
  { month: "Oct", revenue: 42000, gst: 7560 },
  { month: "Nov", revenue: 58000, gst: 10440 },
  { month: "Dec", revenue: 75000, gst: 13500 },
  { month: "Jan", revenue: 61000, gst: 10980 },
  { month: "Feb", revenue: 89000, gst: 16020 },
  { month: "Mar", revenue: 95000, gst: 17100 },
];

// Mock candlestick data (OHLC style daily sales)
const CANDLE_DATA = [
  { day:"Mon", open:12000, close:18000, high:21000, low:10000, vol:340 },
  { day:"Tue", open:18000, close:14000, high:22000, low:12000, vol:210 },
  { day:"Wed", open:14000, close:22000, high:24000, low:13000, vol:480 },
  { day:"Thu", open:22000, close:19000, high:25000, low:17000, vol:290 },
  { day:"Fri", open:19000, close:27000, high:30000, low:18000, vol:620 },
  { day:"Sat", open:27000, close:31000, high:34000, low:25000, vol:710 },
  { day:"Sun", open:31000, close:28000, high:33000, low:26000, vol:390 },
];

const fmt     = (n) => n != null ? "₹" + Number(n).toLocaleString("en-IN") : "₹0";
const fmtK    = (n) => n >= 100000 ? "₹" + (n/100000).toFixed(1) + "L" : n >= 1000 ? "₹" + (n/1000).toFixed(0) + "k" : "₹" + n;

// ── Animated Counter ──
function AnimCounter({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    let start = 0;
    const step = num / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(num); clearInterval(t); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  const formatted = typeof value === "string" && value.includes("₹")
    ? "₹" + Number(display).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : Math.round(display).toLocaleString("en-IN");
  return <span>{prefix}{formatted}{suffix}</span>;
}

// ── Custom Candlestick ──
function CandlestickChart({ data }) {
  const W = 560, H = 200, PAD_L = 40, PAD_R = 20, PAD_T = 16, PAD_B = 32;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const allVals = data.flatMap(d => [d.high, d.low]);
  const minVal  = Math.min(...allVals) * 0.97;
  const maxVal  = Math.max(...allVals) * 1.03;
  const range   = maxVal - minVal;

  const yScale  = v => PAD_T + chartH - ((v - minVal) / range) * chartH;
  const candleW = Math.floor(chartW / data.length * 0.5);
  const xPos    = i => PAD_L + (i + 0.5) * (chartW / data.length);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD_T + chartH * t,
    val: maxVal - t * range,
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      {/* Grid */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={PAD_L} x2={W - PAD_R} y1={g.y} y2={g.y}
            stroke="#f0f0f0" strokeWidth={1} strokeDasharray="4 4" />
          <text x={PAD_L - 6} y={g.y + 4} fontSize={9} fill="#bbb" textAnchor="end">
            {fmtK(Math.round(g.val))}
          </text>
        </g>
      ))}

      {/* Candles */}
      {data.map((d, i) => {
        const x      = xPos(i);
        const bull   = d.close >= d.open;
        const color  = bull ? "#22c55e" : "#ef4444";
        const bodyT  = yScale(Math.max(d.open, d.close));
        const bodyH  = Math.max(2, Math.abs(yScale(d.open) - yScale(d.close)));
        const wickT  = yScale(d.high);
        const wickB  = yScale(d.low);

        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} x2={x} y1={wickT} y2={wickB}
              stroke={color} strokeWidth={1.5} />
            {/* Body */}
            <motion.rect
              x={x - candleW / 2} y={bodyT}
              width={candleW} height={bodyH}
              fill={color} rx={2}
              initial={{ scaleY: 0, originY: bodyT + bodyH }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            />
            {/* X label */}
            <text x={x} y={H - 6} fontSize={10} fill="#aaa" textAnchor="middle">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Custom Tooltip ──
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="db-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span>₹{Number(p.value).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats,       setStats]       = useState(null);
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE);
  const [range,       setRange]       = useState("daily");
  const [loading,     setLoading]     = useState(true);
  const [chartTab,    setChartTab]    = useState("area"); // "area" | "candle"
  const user = getStoredUser();

  useEffect(() => {
    setLoading(true);
    getDashboardStats(range)
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    getRevenueChart()
      .then(d => { if (Array.isArray(d) && d.length > 0) setRevenueData(d); })
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Today's Revenue",  value: fmt(stats?.todayProfit),   icon: "💰", change: "+12.4%",      up: true,  color: "#f59e0b" },
    { label: "Today's Loss",     value: fmt(stats?.todayLoss),     icon: "📉", change: "-3.1%",       up: false, color: "#ec4899" },
    { label: "Total Stock",      value: stats?.stockIn ?? 0,       icon: "📦", change: "In Store",    up: true,  color: "#3b82f6" },
    { label: "Items Sold",       value: stats?.stockOut ?? 0,      icon: "🚚", change: "This Month",  up: true,  color: "#8b5cf6" },
    { label: "Total Products",   value: stats?.totalProducts ?? 0, icon: "🏷️", change: "Active",      up: true,  color: "#10b981" },
    { label: "Low Stock Alerts", value: stats?.lowStock ?? 0,      icon: "⚠️", change: "Need restock",up: false, color: "#f97316" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Sparkline mini-data per stat
  const sparks = [
    [30,45,38,60,55,70,65,80],
    [80,70,60,75,55,65,50,40],
    [50,55,60,58,65,70,68,75],
    [20,35,28,45,40,55,50,65],
    [40,42,45,48,50,52,55,60],
    [10,15,12,18,14,20,16,22],
  ];

  return (
    <div className="db-root">

      {/* ── HEADER ── */}
      <header className="db-topbar">
        <div>
          <div className="db-greeting-badge">
            <span className="db-greeting-dot" />
            {greeting}
          </div>
          <h1 className="db-title">
            {user?.fullName || "Admin"} <span className="db-wave">👋</span>
          </h1>
          <p className="db-sub">Here's your store performance overview</p>
        </div>
        <div className="db-range-tabs">
          {["daily","monthly","yearly"].map(r => (
            <button key={r}
              className={`db-range-btn${range === r ? " active" : ""}`}
              onClick={() => setRange(r)}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* ── STAT CARDS ── */}
      <div className="db-stats-grid">
        {statCards.map((card, i) => (
          <motion.div key={i} className="db-stat-card"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
            style={{ "--card-color": card.color }}
          >
            {/* Top accent bar */}
            <div className="db-stat-accent" />

            <div className="db-stat-top">
              <div className="db-stat-icon-wrap" style={{ background: card.color + "18" }}>
                <span className="db-stat-icon">{card.icon}</span>
              </div>
              <span className={`db-stat-change${card.up ? " up" : " down"}`}>
                {card.up ? "↑" : "↓"} {card.change}
              </span>
            </div>

            <div className="db-stat-value">
              {loading
                ? <span className="db-shimmer" />
                : <AnimCounter value={card.value} />
              }
            </div>
            <div className="db-stat-label">{card.label}</div>

            {/* Mini sparkline */}
            <svg className="db-sparkline" viewBox="0 0 80 24" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`sg${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={card.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              {(() => {
                const d = sparks[i];
                const mn = Math.min(...d), mx = Math.max(...d);
                const pts = d.map((v, j) => `${j*(80/7)},${24 - ((v-mn)/(mx-mn))*20}`).join(" ");
                const area = `M0,24 L${d.map((v,j) => `${j*(80/7)},${24-((v-mn)/(mx-mn))*20}`).join(" L")} L${80},24 Z`;
                return (
                  <>
                    <path d={area} fill={`url(#sg${i})`} />
                    <polyline points={pts} fill="none" stroke={card.color} strokeWidth={1.5} />
                  </>
                );
              })()}
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── MAIN CHART ── */}
      <motion.div className="db-chart-card wide"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>

        <div className="db-chart-header">
          <div>
            <h3 className="db-chart-title">Revenue Analytics</h3>
            <p className="db-chart-sub">
              {chartTab === "area" ? "6-month revenue & GST trend" : "Daily candlestick · Open / High / Low / Close"}
            </p>
          </div>
          <div className="db-chart-tabs">
            <button className={`db-chart-tab${chartTab === "area" ? " active" : ""}`}
              onClick={() => setChartTab("area")}>
              📈 Area
            </button>
            <button className={`db-chart-tab${chartTab === "candle" ? " active" : ""}`}
              onClick={() => setChartTab("candle")}>
              🕯 Candles
            </button>
          </div>
        </div>

        {/* Area Chart */}
        {chartTab === "area" && (
          <motion.div key="area"
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.3 }}>
            <div className="db-chart-legend">
              <span className="db-legend-pill gold">
                <span className="db-legend-dot gold" style={{background:'#6366f1',boxShadow:'0 0 8px rgba(99,102,241,0.5)'}} /> Revenue
              </span>
              <span className="db-legend-pill green">
                <span className="db-legend-dot green" style={{background:'#f59e0b',boxShadow:'0 0 8px rgba(245,158,11,0.5)'}} /> GST
              </span>
              <span className="db-legend-stat">
                Peak: ₹{Math.max(...revenueData.map(d=>d.revenue)).toLocaleString("en-IN")}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData} margin={{ top:10, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:12, fill:"#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false}
                  tickFormatter={v => "₹"+(v/1000)+"k"} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue"
                  stroke="#f5c842" strokeWidth={3} fill="url(#gradGold)" dot={false}
                  activeDot={{ r:5, fill:"#f5c842", stroke:"#fff", strokeWidth:2 }} />
                <Area type="monotone" dataKey="gst" name="GST"
                  stroke="#22c55e" strokeWidth={2} fill="url(#gradGreen)" dot={false}
                  activeDot={{ r:4, fill:"#22c55e", stroke:"#fff", strokeWidth:2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Candlestick Chart */}
        {chartTab === "candle" && (
          <motion.div key="candle"
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.3 }}>
            <div className="db-candle-legend">
              <span className="db-candle-bull">▲ Bullish (Close &gt; Open)</span>
              <span className="db-candle-bear">▼ Bearish (Close &lt; Open)</span>
              <span className="db-candle-info">Wick = High/Low range</span>
            </div>
            <div style={{ padding:"8px 0" }}>
              <CandlestickChart data={CANDLE_DATA} />
            </div>
            {/* Volume bars */}
            <div className="db-vol-label">Volume (orders)</div>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={CANDLE_DATA} margin={{ top:0, right:20, left:40, bottom:0 }} barSize={18}>
                <XAxis dataKey="day" hide />
                <Tooltip formatter={v=>[v+" orders","Volume"]} />
                <Bar dataKey="vol" radius={[3,3,0,0]}>
                  {CANDLE_DATA.map((d,i) => (
                    <Cell key={i} fill={d.close >= d.open ? "#22c55e" : "#ef4444"} opacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </motion.div>

      {/* ── BOTTOM ROW ── */}
      <div className="db-bottom-row">

        {/* Recent activity */}
        <motion.div className="db-chart-card"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}>
          <div className="db-chart-header">
            <h3 className="db-chart-title">Weekly Sales Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CANDLE_DATA} barSize={20} margin={{ top:8, right:8, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:"#aaa" }} axisLine={false} tickLine={false}
                tickFormatter={v => fmtK(v)} />
              <Tooltip formatter={v => ["₹"+v.toLocaleString("en-IN"), "Revenue"]} />
              <Bar dataKey="close" radius={[6,6,0,0]}>
                {CANDLE_DATA.map((d,i) => (
                  <Cell key={i}
                    fill={d.close >= d.open ? "#f5c842" : "#e8e8e8"}
                    stroke={d.close >= d.open ? "#e6a800" : "#ddd"}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick stats */}
        <motion.div className="db-chart-card db-quick-stats"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
          <div className="db-chart-header">
            <h3 className="db-chart-title">Quick Stats</h3>
          </div>
          <div className="db-qs-list">
            {[
              { label:"Best Day",    value:"Saturday",  icon:"🏆", sub:"Highest revenue" },
              { label:"Avg Daily",   value: fmtK(Math.round(revenueData.reduce((s,d)=>s+d.revenue,0)/revenueData.length)), icon:"📊", sub:"Per month avg" },
              { label:"GST Collected", value: fmtK(revenueData.reduce((s,d)=>s+(d.gst||0),0)), icon:"🧾", sub:"Total collected" },
              { label:"Growth",      value:"+14.2%",    icon:"📈", sub:"vs last period" },
            ].map((s,i) => (
              <motion.div key={i} className="db-qs-row"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.55 + i*0.07 }}>
                <div className="db-qs-icon">{s.icon}</div>
                <div className="db-qs-info">
                  <div className="db-qs-label">{s.label}</div>
                  <div className="db-qs-sub">{s.sub}</div>
                </div>
                <div className="db-qs-value">{s.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
