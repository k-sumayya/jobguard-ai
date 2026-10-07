import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * History Component
 * Professional recruitment/admin table of previously analyzed jobs.
 * Columns: Job, Company, Date, Risk Score, Status, Action.
 * No emojis, clean borders, semantic status badges.
 */
export default function History() {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);

  // Default seed entries if none exist yet
  const defaultEntries = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechNova",
      date: "Oct 7, 2026",
      score: 18,
      verdict: "Safe",
      warnings: [],
      positive_signals: [
        "Company information found",
        "Professional job description",
      ],
    },
    {
      id: 2,
      title: "Data Entry Operator",
      company: "Global Careers",
      date: "Oct 6, 2026",
      score: 92,
      verdict: "High Risk",
      warnings: [
        {
          title: "Upfront payment requested",
          reason: "Applicant asked to pay registration deposit for job materials.",
        },
        {
          title: "Urgent hiring language",
          reason: "High-pressure urgency tactics used to rush the candidate.",
        },
      ],
      positive_signals: [],
    },
    {
      id: 3,
      title: "Customer Support Associate",
      company: "Apex Digital Services",
      date: "Oct 5, 2026",
      score: 48,
      verdict: "Suspicious",
      warnings: [
        {
          title: "Suspicious recruiter contact",
          reason: "Recruiter instructed candidate to message a private Telegram account.",
        },
      ],
      positive_signals: [
        "Standard customer support duties outlined",
      ],
    },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobguard_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistoryList(parsed);
          return;
        }
      }
      setHistoryList(defaultEntries);
      localStorage.setItem("jobguard_history", JSON.stringify(defaultEntries));
    } catch (e) {
      setHistoryList(defaultEntries);
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your job verification history?")) {
      localStorage.removeItem("jobguard_history");
      setHistoryList([]);
    }
  };

  const handleViewReport = (item) => {
    navigate("/results", {
      state: {
        result: {
          is_valid: item.is_valid !== undefined ? item.is_valid : true,
          status: item.status || item.verdict,
          score: item.score,
          verdict: item.verdict,
          reason: item.reason,
          message: item.message,
          warnings: item.warnings || [],
          positive_signals: item.positive_signals || [],
        },
        jobInfo: {
          title: item.title,
          company: item.company,
          date: item.date,
          location: item.location || "Remote",
          source: item.source || "Historical Record",
        },
      },
    });
  };

  // Status badge selector
  const getStatusBadge = (score, verdict) => {
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

  return (
    <div className="history-page-container">
      <div className="history-wrapper">
        
        {/* Header Bar */}
        <div className="history-header-row">
          <div>
            <span className="section-label">AUDIT LOG</span>
            <h1 className="history-main-heading">Job Verification History</h1>
            <p className="history-subtitle">
              All job postings evaluated in this browser session.
            </p>
          </div>

          <div className="history-actions-group">
            <Link to="/check" className="btn-primary-nav">
              Check a Job
            </Link>
            {historyList.length > 0 && (
              <button
                type="button"
                className="btn-secondary-link"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Recruitment Table Card */}
        {historyList.length > 0 ? (
          <div className="table-card">
            <div className="table-responsive">
              <table className="recruitment-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Date</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item, idx) => {
                    const status = getStatusBadge(item.score, item.verdict);
                    return (
                      <tr
                        key={item.id || idx}
                        onClick={() => handleViewReport(item)}
                        className="table-row-clickable"
                      >
                        <td className="col-job-title">
                          <strong>{item.title}</strong>
                        </td>
                        <td className="col-company">
                          {item.company}
                        </td>
                        <td className="col-date">
                          {item.date}
                        </td>
                        <td className="col-score">
                          <span className="table-score-number">
                            {item.score !== null && item.score !== undefined ? item.score : "N/A"}
                          </span>
                          {item.score !== null && item.score !== undefined && (
                            <span className="table-score-denom"> / 100</span>
                          )}
                        </td>
                        <td className="col-status">
                          <span className={`status-badge ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="col-action text-right">
                          <button
                            type="button"
                            className="btn-table-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReport(item);
                            }}
                          >
                            View Report →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-card text-center py-40">
            <h3 className="report-section-title mb-6">No History Records</h3>
            <p className="report-desc mb-20">
              You haven't checked any job postings yet. Analyze a job to start your audit history.
            </p>
            <Link to="/check" className="btn-primary-nav inline-block">
              Check a Job Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
