import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Navbar Component
 * Classic, clean recruitment portal navigation without emojis or decorative graphics.
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* Left: Brand Logomark & Title */}
        <Link to="/" onClick={closeMenu} className="navbar-brand">
          <div className="brand-badge">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">JobGuard</span>
            <span className="brand-subtitle">AI Fake Job Detector</span>
          </div>
        </Link>

        {/* Center/Right: Navigation Links */}
        <nav className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/check"
            className={`nav-link ${isActive("/check") ? "active" : ""}`}
          >
            Check a Job
          </Link>
          <Link
            to="/how-it-works"
            className={`nav-link ${isActive("/how-it-works") ? "active" : ""}`}
          >
            How It Works
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive("/history") ? "active" : ""}`}
          >
            History
          </Link>
        </nav>

        {/* Right: Primary Call to Action */}
        <div className="navbar-action">
          <Link to="/check" className="btn-primary-nav">
            Check a Job
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" onClick={closeMenu} className="mobile-nav-link">
            Home
          </Link>
          <Link to="/check" onClick={closeMenu} className="mobile-nav-link">
            Check a Job
          </Link>
          <Link to="/how-it-works" onClick={closeMenu} className="mobile-nav-link">
            How It Works
          </Link>
          <Link to="/history" onClick={closeMenu} className="mobile-nav-link">
            History
          </Link>
          <Link
            to="/check"
            onClick={closeMenu}
            className="mobile-nav-btn"
          >
            Check a Job
          </Link>
        </div>
      )}
    </header>
  );
}
