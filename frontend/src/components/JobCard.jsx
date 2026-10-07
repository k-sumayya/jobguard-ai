import React from "react";

/**
 * JobCard Component
 * Reusable classic recruitment card for job check records.
 * No emojis, clean typography, semantic status badges.
 */
export default function JobCard({
  title,
  company,
  date,
  score,
  verdict,
  onClick,
}) {
  // Determine badge styling based on verdict/risk level
  const getStatusBadge = () => {
    if (verdict === "Invalid Job Posting" || verdict === "INVALID INPUT" || verdict === "Invalid Input") {
      return {
        label: "Invalid Input",
        className: "badge-status-invalid",
      };
    }
    if (verdict === "Likely Genuine" || verdict === "Safe" || verdict === "Safe / Low Risk" || (score !== null && score !== undefined && score <= 30)) {
      return {
        label: "Safe",
        className: "badge-status-safe",
      };
    }
    if (verdict === "Suspicious" || (score !== null && score !== undefined && score > 30 && score <= 60)) {
      return {
        label: "Suspicious",
        className: "badge-status-warning",
      };
    }
    return {
      label: "High Risk",
      className: "badge-status-danger",
    };
  };

  const status = getStatusBadge();

  return (
    <div
      className="job-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick();
        }
      }}
    >
      <div className="job-card-info">
        <h4 className="job-card-title">{title || "Job Posting"}</h4>
        <div className="job-card-meta">
          <span className="job-card-company">{company || "Unspecified Employer"}</span>
          {date && <span className="job-card-dot">•</span>}
          {date && <span className="job-card-date">{date}</span>}
        </div>
      </div>

      <div className="job-card-scoring">
        <div className="job-card-score-box">
          <span className="job-score-label">Risk Score</span>
          <span className="job-score-number">
            {score !== null && score !== undefined ? `${score} / 100` : "N/A"}
          </span>
        </div>
        <span className={`status-badge ${status.className}`}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
