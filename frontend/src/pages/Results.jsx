import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

/**
 * Results Component
 * Professional recruitment safety report.
 * Handles SAFE, SUSPICIOUS, HIGH RISK / LIKELY SCAM, and INVALID INPUT states.
 * No AI dashboard look, no giant circular graphics, zero emojis.
 */
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  let result = location.state?.result;
  let jobInfo = location.state?.jobInfo;

  // Fallback: restore latest check from localStorage if page is refreshed
  if (!result) {
    try {
      const history = JSON.parse(localStorage.getItem("jobguard_history") || "[]");
      if (history.length > 0) {
        const latest = history[0];
        result = {
          is_valid: latest.is_valid !== undefined ? latest.is_valid : true,
          status: latest.status || latest.verdict,
          score: latest.score,
          verdict: latest.verdict,
          reason: latest.reason,
          message: latest.message,
          warnings: latest.warnings || [],
          positive_signals: latest.positive_signals || [],
        };
        jobInfo = {
          title: latest.title,
          company: latest.company,
          location: latest.location || "Remote",
          salary: latest.salary || "Competitive",
          source: latest.source || "Recent Check",
          date: latest.date,
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  // If still no result, display a clean empty prompt
  if (!result) {
    return (
      <div className="report-page-container">
        <div className="report-wrapper">
          <div className="report-card text-center py-40">
            <h2 className="report-section-title mb-10">No Safety Report Found</h2>
            <p className="report-desc mb-20">
              You haven't submitted a job for verification yet. Please enter a job posting to generate your report.
            </p>
            <Link to="/check" className="btn-primary-nav inline-block">
              Check a Job Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { score, verdict, warnings, positive_signals, is_valid, reason, message } = result;

  // Evaluate risk level category
  const getRiskDetails = () => {
    // 1. Validation failure state
    if (is_valid === false || result.status === "INVALID INPUT" || verdict === "Invalid Job Posting") {
      return {
        statusLabel: "INVALID INPUT",
        badgeClass: "badge-status-invalid",
        recommendation: message || "Please enter a real job description, recruiter message, or job offer so we can analyze it.",
      };
    }

    // 2. Safe / Low risk state
    if (score <= 30 || verdict === "Safe / Low Risk" || verdict === "Safe" || verdict === "Likely Genuine") {
      return {
        statusLabel: "SAFE / LOW RISK",
        badgeClass: "badge-status-safe",
        recommendation: "This posting displays standard recruitment characteristics with no high-risk markers. Standard due diligence is still recommended.",
      };
    }

    // 3. Suspicious state
    if (score <= 60 || verdict === "Suspicious") {
      return {
        statusLabel: "SUSPICIOUS",
        badgeClass: "badge-status-warning",
        recommendation: "Proceed with caution. Several atypical recruitment patterns were detected. Verify the recruiter's identity through official corporate channels before sharing personal documents.",
      };
    }

    // 4. High risk / likely scam state
    return {
      statusLabel: "HIGH RISK / LIKELY SCAM",
      badgeClass: "badge-status-danger",
      recommendation: "Do not apply until the employer can be independently verified. Never pay upfront fees, wire money, or provide one-time passwords (OTPs).",
    };
  };

  const risk = getRiskDetails();
  const isInvalid = is_valid === false || result.status === "INVALID INPUT" || verdict === "Invalid Job Posting";

  return (
    <div className="report-page-container">
      <div className="report-wrapper">
        
        {/* Top Report Header Bar */}
        <div className="report-header-row">
          <div>
            <span className="section-label">SAFETY EVALUATION</span>
            <h1 className="report-main-heading">Job Safety Result</h1>
          </div>
          <button
            type="button"
            className="btn-secondary-link"
            onClick={() => navigate("/check")}
          >
            ← Check another job
          </button>
        </div>

        {/* 1. Job Metadata Summary Strip */}
        <div className="report-card report-meta-card">
          <div className="report-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Job Title</span>
              <span className="meta-value">
                {isInvalid ? "Unrecognized Input" : (jobInfo?.title || "Job Posting")}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Company</span>
              <span className="meta-value">
                {isInvalid ? "Not Applicable" : (jobInfo?.company || "Not specified")}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date Checked</span>
              <span className="meta-value">{jobInfo?.date || "Today"}</span>
            </div>
            {jobInfo?.location && jobInfo.location !== "Not specified" && !isInvalid && (
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{jobInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Primary Risk Score Card */}
        <div className="report-card report-score-card">
          <div className="score-summary-flex">
            <div className="score-digits-box">
              <span className="score-caption">
                {isInvalid ? "Verification Status" : "Risk Score"}
              </span>
              <div className="score-big-number">
                {isInvalid ? (
                  <span className="score-current">Invalid Job Posting</span>
                ) : (
                  <>
                    <span className="score-current">{score}</span>
                    <span className="score-total"> / 100</span>
                  </>
                )}
              </div>
            </div>

            <div className="score-verdict-box">
              <span className="verdict-label">Status</span>
              <span className={`status-badge-lg ${risk.badgeClass}`}>
                {risk.statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Why this job was flagged */}
        <div className="report-card">
          <h3 className="report-section-title">
            {isInvalid ? "Validation Details" : "Why this job was flagged"}
          </h3>
          <p className="report-desc mb-16">
            {isInvalid
              ? "The submitted content was checked against standard job criteria:"
              : "Signals that triggered security alerts during verification:"}
          </p>

          {isInvalid ? (
            <ul className="flagged-list">
              <li className="flagged-item">
                <span className="flagged-bullet" />
                <div className="flagged-content">
                  <strong className="flagged-title">Invalid Job Posting</strong>
                  <p className="flagged-reason">
                    {reason || "This does not appear to contain enough job-related information to perform a reliable safety check."}
                  </p>
                </div>
              </li>
            </ul>
          ) : warnings && warnings.length > 0 ? (
            <ul className="flagged-list">
              {warnings.map((w, idx) => (
                <li key={idx} className="flagged-item">
                  <span className="flagged-bullet" />
                  <div className="flagged-content">
                    <strong className="flagged-title">{w.title}</strong>
                    {w.reason && <p className="flagged-reason">{w.reason}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="clean-notice-box">
              <span className="clean-bullet" />
              <p className="clean-notice-text">
                No upfront payment requests, confidential code solicitations, or high-pressure recruitment tactics were detected.
              </p>
            </div>
          )}
        </div>

        {/* 4. Positive signals (Only relevant if valid job) */}
        {!isInvalid && (
          <div className="report-card">
            <h3 className="report-section-title">Positive signals</h3>
            <p className="report-desc mb-16">
              Legitimate employment attributes observed in the listing:
            </p>

            <ul className="positive-list">
              {positive_signals && positive_signals.length > 0 ? (
                positive_signals.map((sig, idx) => (
                  <li key={idx} className="positive-item">
                    <span className="positive-bullet" />
                    <span className="positive-text">{sig}</span>
                  </li>
                ))
              ) : (
                <li className="positive-item">
                  <span className="positive-bullet" />
                  <span className="positive-text">Basic employment text submitted</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 5. Recommendation */}
        <div className="report-card report-recommendation-card">
          <h3 className="report-section-title">Recommendation</h3>
          <p className="recommendation-text">
            {risk.recommendation}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="report-bottom-actions">
          <button
            type="button"
            className="btn-submit-main max-w-280"
            onClick={() => navigate("/check")}
          >
            Check Another Job
          </button>
          <button
            type="button"
            className="btn-secondary-link"
            onClick={() => navigate("/history")}
          >
            View Verification History →
          </button>
        </div>

      </div>
    </div>
  );
}
