import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Topbar.css";

const TITLES = {
  "/dashboard": { title: "Dashboard",   sub: "Welcome back 👋"          },
  "/products":  { title: "Products",    sub: "Manage your inventory"    },
  "/add":       { title: "Add Product", sub: "List a new item"          },
  "/billing":   { title: "Billing",     sub: "Create & manage invoices" },
};

export default function Topbar() {
  const location = useLocation();
  const page     = TITLES[location.pathname] || { title: "Dashboard", sub: "" };
  const fullName = localStorage.getItem("fullName") || "Admin";
  const role     = localStorage.getItem("role")     || "ADMIN";
  const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const [time,     setTime]     = useState(new Date());
  const [notif,    setNotif]    = useState(3);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("http://localhost:3000/login");
  };

  return (
    <header className={`tb-root${mounted ? " tb-mounted" : ""}`}>
      {/* Animated top border line */}
      <div className="tb-glow-line" />

      {/* Left */}
      <div className="tb-left">
        <div className="tb-breadcrumb">
          <span className="tb-bc-dot" />
          vendor.io / {page.title}
        </div>
        <h2 className="tb-title">{page.title}</h2>
        <p className="tb-sub">{page.sub}</p>
      </div>

      {/* Right */}
      <div className="tb-right">

        {/* Live Clock */}
        <div className="tb-clock">
          <span className="tb-clock-time">
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="tb-clock-date">
            {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>

        <div className="tb-divider" />

        {/* Notifications */}
        <button className="tb-icon-btn" onClick={() => setNotif(0)} title="Notifications">
          <NotificationsNoneIcon fontSize="small" />
          {notif > 0 && <span className="tb-badge">{notif}</span>}
        </button>

        <div className="tb-divider" />

        {/* User */}
        <div className="tb-user">
          <div className="tb-avatar">
            <span>{initials}</span>
            <div className="tb-avatar-ring" />
          </div>
          <div className="tb-user-info">
            <span className="tb-user-name">{fullName}</span>
            <span className="tb-user-role">{role}</span>
          </div>
          <div className="tb-status-wrap">
            <div className="tb-status-dot" />
            <div className="tb-status-ping" />
          </div>
        </div>

        {/* Logout */}
        <button className="tb-icon-btn tb-logout" onClick={handleLogout} title="Logout">
          <LogoutIcon fontSize="small" />
        </button>

      </div>
    </header>
  );
}
