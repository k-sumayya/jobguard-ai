import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";

/**
 * Home Component
 * Soft, classic, premium recruitment portal homepage.
 * Clean whitespace, subtle alternating section shades, zero emojis or decorative graphics.
 */
export default function Home() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sample job offerings for quick testing
  const handleLoadSample = (sampleType) => {
    setError("");

    if (sampleType === "safe") {
      setJobDescription(
        "Senior Frontend Engineer at TechNova Solutions.\nRequirements: 3+ years experience with React and modern JavaScript. Conducts formal technical interviews with engineering team. Competitive salary range: $85,000 – $110,000/year with comprehensive healthcare, 401(k), and paid time off."
      );
      setJobUrl("https://technova.io/careers/senior-frontend");
    } else if (sampleType === "suspicious") {
      setJobDescription(
        "Urgent opening for Remote Data Assistant. High daily payout of $350-$500 per day with no previous experience needed. Contact recruiter directly on Telegram @career_fast_track with personal contact number to get started immediately."
      );
      setJobUrl("https://telegram.me/career_fast_track");
    } else if (sampleType === "scam") {
      setJobDescription(
        "URGENT HIRING! Earn 50,000 INR per day with zero experience required. Immediate slot confirmation! To secure your appointment, you must pay a mandatory registration fee of 1,500 INR via UPI or wire transfer. After payment, share the transaction OTP and your bank account details for direct deposit setup."
      );
      setJobUrl("");
    }
  };

  // Submit to backend API
  const handleCheckSafety = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim() && !jobUrl.trim()) {
      setError("Please paste a job description or provide a job URL to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_text: jobDescription.trim() || jobUrl.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Backend server error.");
      }

      const data = await response.json();

      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Infer title and company for record display
      let inferredTitle = "Job Posting";
      let inferredCompany = "Unspecified";

      if (data.is_valid === false) {
        inferredTitle = "Invalid Input";
        inferredCompany = "Not Applicable";
      } else {
        if (jobDescription.toLowerCase().includes("frontend")) inferredTitle = "Senior Frontend Engineer";
        else if (jobDescription.toLowerCase().includes("data")) inferredTitle = "Remote Data Assistant";
        else if (jobDescription.toLowerCase().includes("software")) inferredTitle = "Software Engineer";

        inferredCompany = data.score >= 80 ? "Unknown Company" : (data.score >= 40 ? "Apex Digital" : "TechNova Solutions");
      }

      // Save to localStorage audit history
      try {
        const history = JSON.parse(localStorage.getItem("jobguard_history") || "[]");
        const newRecord = {
          id: Date.now(),
          title: inferredTitle,
          company: inferredCompany,
          score: data.score,
          verdict: data.verdict,
          status: data.status,
          is_valid: data.is_valid,
          reason: data.reason,
          message: data.message,
          date: today,
          source: jobUrl.trim() || "Pasted Text",
          warnings: data.warnings,
          positive_signals: data.positive_signals,
        };
        localStorage.setItem("jobguard_history", JSON.stringify([newRecord, ...history]));
      } catch (err) {
        console.warn("Could not write to localStorage:", err);
      }

      // Route to Results page
      navigate("/results", {
        state: {
          result: data,
          jobInfo: {
            title: inferredTitle,
            company: inferredCompany,
            source: jobUrl.trim() || "Pasted Text",
            date: today,
          },
        },
      });

    } catch (err) {
      setError("Could not connect to backend server. Make sure app.py is running on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  // Recent demo checks
  const recentChecks = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      company: "TechNova Solutions",
      date: "Oct 7, 2026",
      score: 18,
      verdict: "Safe",
    },
    {
      id: 2,
      title: "Remote Data Assistant",
      company: "Global Career Group",
      date: "Oct 6, 2026",
      score: 92,
      verdict: "High Risk",
    },
    {
      id: 3,
      title: "Administrative Assistant",
      company: "Apex Digital Services",
      date: "Oct 5, 2026",
      score: 54,
      verdict: "Suspicious",
    },
  ];

  return (
    <div className="home-page-container">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          
          {/* Header Label, Title, Subtitle */}
          <div className="hero-header-block">
            <span className="section-label">JOB SAFETY CHECKER</span>
            <h1 className="hero-main-heading">
              Is this job <span className="highlight-accent">safe</span> to apply for?
            </h1>
            <p className="hero-subtitle">
              Check job postings for common scam signals before you apply.
            </p>
          </div>

          {/* Main White Checking Form Card */}
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Check a job posting</h2>
              <p className="form-card-subtitle">
                Paste the job description or recruiter message below.
              </p>
            </div>

            <form onSubmit={handleCheckSafety}>
              {/* Textarea */}
              <div className="form-field-group">
                <textarea
                  className="form-textarea"
                  rows="6"
                  placeholder="Paste job description, recruiter message, or job offer..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* URL Input */}
              <div className="form-field-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Job posting URL (optional)"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="form-error-banner">
                  {error}
                </div>
              )}

              {/* Primary Blue Button */}
              <button
                type="submit"
                className="btn-submit-main"
                disabled={loading || (!jobDescription.trim() && !jobUrl.trim())}
              >
                {loading ? "Analyzing Job Safety..." : "Check Job Safety →"}
              </button>

              {/* Security Privacy Reassurance */}
              <p className="form-privacy-note">
                Your information stays private.
              </p>
            </form>
          </div>

          {/* Sample Load Buttons */}
          <div className="samples-toolbar">
            <span className="samples-toolbar-label">Try an example:</span>
            <div className="samples-btn-group">
              <button
                type="button"
                className="btn-sample btn-sample-safe"
                onClick={() => handleLoadSample("safe")}
              >
                Safe Job
              </button>
              <button
                type="button"
                className="btn-sample btn-sample-warning"
                onClick={() => handleLoadSample("suspicious")}
              >
                Suspicious Job
              </button>
              <button
                type="button"
                className="btn-sample btn-sample-danger"
                onClick={() => handleLoadSample("scam")}
              >
                Scam Job
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (Subtle Off-white / Soft Light-Blue Alternate Section) */}
      <section className="section-band-alt">
        <div className="section-container how-it-works-section">
          <div className="section-header-block">
            <h2 className="section-title">How JobGuard works</h2>
            <p className="section-subtitle">
              Three simple steps to verify a job before you apply.
            </p>
          </div>

          <div className="how-cards-grid">
            <div className="how-card">
              <span className="how-step-number">01</span>
              <h3 className="how-card-title">Paste</h3>
              <p className="how-card-desc">
                Paste the job description or recruiter message.
              </p>
            </div>

            <div className="how-card">
              <span className="how-step-number">02</span>
              <h3 className="how-card-title">Check</h3>
              <p className="how-card-desc">
                We analyze common recruitment scam signals.
              </p>
            </div>

            <div className="how-card">
              <span className="how-step-number">03</span>
              <h3 className="how-card-title">Decide</h3>
              <p className="how-card-desc">
                Review the risk score before applying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE CHECK SECTION */}
      <section className="section-band-main">
        <div className="section-container what-we-check-section">
          <div className="section-header-block">
            <h2 className="section-title">What we check</h2>
            <p className="section-subtitle">
              Signals we inspect across every submission.
            </p>
          </div>

          <div className="check-signals-grid">
            {/* Card 1: Company */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
                </svg>
              </div>
              <h4 className="signal-card-title">Company</h4>
              <p className="signal-card-desc">
                Verify company information and legitimacy.
              </p>
            </div>

            {/* Card 2: Salary */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 6v2m0 8v2" />
                </svg>
              </div>
              <h4 className="signal-card-title">Salary</h4>
              <p className="signal-card-desc">
                Check whether compensation looks realistic.
              </p>
            </div>

            {/* Card 3: Recruiter */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h4 className="signal-card-title">Recruiter</h4>
              <p className="signal-card-desc">
                Check recruiter information and contact details.
              </p>
            </div>

            {/* Card 4: Payment */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h4 className="signal-card-title">Payment</h4>
              <p className="signal-card-desc">
                Detect upfront fees and payment requests.
              </p>
            </div>

            {/* Card 5: Job Description */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <h4 className="signal-card-title">Job Description</h4>
              <p className="signal-card-desc">
                Detect suspicious wording and unrealistic promises.
              </p>
            </div>

            {/* Card 6: Links */}
            <div className="signal-card">
              <div className="signal-card-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h4 className="signal-card-title">Links</h4>
              <p className="signal-card-desc">
                Check suspicious or potentially unsafe links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECENT CHECKS SECTION (Subtle Off-white / Soft Light-Blue Alternate Section) */}
      <section className="section-band-alt">
        <div className="section-container recent-checks-section">
          <div className="section-header-block">
            <h2 className="section-title">Recent verification records</h2>
            <p className="section-subtitle">
              Sample reports reviewed by JobGuard AI.
            </p>
          </div>

          <div className="recent-checks-list">
            {recentChecks.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                date={job.date}
                score={job.score}
                verdict={job.verdict}
                onClick={() => {
                  navigate("/results", {
                    state: {
                      result: {
                        score: job.score,
                        verdict: job.verdict,
                        warnings: job.score >= 50 ? [
                          {
                            title: "Suspicious Recruiter Contact",
                            reason: "Contact directed through unofficial messaging application.",
                          },
                          {
                            title: "Urgent Hiring Language",
                            reason: "Artificial time pressure applied during initial contact.",
                          }
                        ] : [],
                        positive_signals: job.score < 50 ? [
                          "Company information found",
                          "Professional job description",
                        ] : [],
                      },
                      jobInfo: {
                        title: job.title,
                        company: job.company,
                        date: job.date,
                        source: "Archived Record",
                      },
                    },
                  });
                }}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
