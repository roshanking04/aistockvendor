import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-body">
        <Topbar />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
