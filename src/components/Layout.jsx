import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-root">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="layout-body">
        {/* Sticky Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="layout-main">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}

export default Layout;
