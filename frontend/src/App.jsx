import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CheckJob from "./pages/CheckJob";
import Results from "./pages/Results";
import HowItWorks from "./pages/HowItWorks";
import History from "./pages/History";
import "./App.css";

/**
 * JobGuard AI - Main App Component
 * Classic professional recruitment-portal structure.
 * Clean, readable, beginner-friendly code.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="portal-app-wrapper">
        
        {/* 1. Classic Job Website Header */}
        <Navbar />

        {/* 2. Routed Pages */}
        <main className="portal-main-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<CheckJob />} />
            <Route path="/results" element={<Results />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* 3. Professional Classic Job Portal Footer */}
        <footer className="portal-footer">
          <div className="portal-container footer-grid-container">
            
            {/* Brand Column */}
            <div className="footer-brand-col">
              <div className="footer-logo-row">
                <svg
                  className="footer-brand-icon"
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
                <span className="footer-brand-title">JobGuard</span>
              </div>
              <p className="footer-brand-subtitle">AI Fake Job Detector</p>
              <p className="footer-brand-desc">
                Empowering job seekers with automated scam detection and corporate verification before applying.
              </p>
            </div>

            {/* Product Column */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-list">
                <li><Link to="/check">Check a Job</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/history">History</Link></li>
              </ul>
            </div>

            {/* Safety Column */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Safety</h4>
              <ul className="footer-list">
                <li><Link to="/how-it-works">Scam Signals</Link></li>
                <li><Link to="/how-it-works">Safety Guide</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="portal-container footer-copyright-row">
            <p>© {new Date().getFullYear()} JobGuard AI. All rights reserved.</p>
            <p className="footer-disclaimer-txt">
              Disclaimer: JobGuard provides heuristic risk assessments based on common scam patterns.
              Always verify corporate identity through official corporate channels.
            </p>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
