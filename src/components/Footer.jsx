import React from "react";
import PhoneIcon      from "@mui/icons-material/Phone";
import EmailIcon      from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon   from "@mui/icons-material/Facebook";
import InstagramIcon  from "@mui/icons-material/Instagram";
import TwitterIcon    from "@mui/icons-material/Twitter";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ft-root">
      {/* Animated top glow line */}
      <div className="ft-glow-line" />

      {/* Corner dots */}
      <div className="ft-corner ft-corner-tl" />
      <div className="ft-corner ft-corner-tr" />

      <div className="ft-grid">

        {/* Brand */}
        <div className="ft-brand">
          <div className="ft-logo-wrap">
            <div className="ft-logo-mark">AI</div>
            <h2 className="ft-logo">STOCK<span>VENDOR</span></h2>
          </div>
          <p className="ft-desc">
            Your trusted platform for smart inventory,
            real-time billing and business analytics.
          </p>
          <div className="ft-badge">
            <span className="ft-live-dot" />
            System Online
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="ft-heading">Quick Links</h4>
          <ul className="ft-links">
            {[
              { label: "Products",  href: "/products"  },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Add Product", href: "/add"     },
              { label: "Billing",   href: "/billing"   },
            ].map(l => (
              <li key={l.href}>
                <a href={l.href} className="ft-link">
                  <span className="ft-link-arrow">›</span> {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="ft-heading">Contact</h4>
          <div className="ft-contact-list">
            <a href="tel:8309571670" className="ft-contact-item">
              <div className="ft-contact-icon"><PhoneIcon fontSize="small" /></div>
              <span>8309571670</span>
            </a>
            <a href="mailto:lionevehicle@gmail.com" className="ft-contact-item">
              <div className="ft-contact-icon"><EmailIcon fontSize="small" /></div>
              <span>roshanrakesh14431@gmail.com</span>
            </a>
            <a href="https://maps.google.com/?q=Coimbatore" target="_blank" rel="noreferrer" className="ft-contact-item">
              <div className="ft-contact-icon"><LocationOnIcon fontSize="small" /></div>
              <span>mahabubabad, Tamil Nadu</span>
            </a>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="ft-heading">Follow Us</h4>
          <div className="ft-socials">
            <a href="#" className="ft-social-btn" title="Facebook"><FacebookIcon fontSize="small" /></a>
            <a href="#" className="ft-social-btn" title="Instagram"><InstagramIcon fontSize="small" /></a>
            <a href="#" className="ft-social-btn" title="Twitter"><TwitterIcon fontSize="small" /></a>
          </div>
          <a href="https://wa.me/918309571670" target="_blank" rel="noreferrer" className="ft-whatsapp">
            <span>💬</span> Chat on WhatsApp
          </a>
        </div>

      </div>

      <div className="ft-bottom">
        <span>© {new Date().getFullYear()} StockVendor · All rights reserved</span>
        <div className="ft-bottom-dots">
          <span className="ft-bd" />
          <span className="ft-bd" style={{ animationDelay: "0.5s" }} />
          <span className="ft-bd" style={{ animationDelay: "1s" }} />
        </div>
      </div>
    </footer>
  );
}
