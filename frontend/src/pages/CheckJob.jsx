import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * CheckJob Component
 * Dedicated "/check" page with a comprehensive 7-field professional form:
 * Job Title, Company Name, Job Description, Salary, Location, Job Posting URL, Recruiter Email.
 * Clean, classic recruitment website aesthetic. No emojis.
 */
export default function CheckJob() {
  const navigate = useNavigate();

  // Form input states
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill samples for quick verification
  const handleLoadSample = (sampleType) => {
    setError("");

    if (sampleType === "safe") {
      setJobTitle("Senior Software Engineer");
      setCompanyName("TechNova Solutions");
      setSalary("$90,000 – $120,000 / year");
      setLocation("Remote (US / Canada)");
      setJobUrl("https://technova.io/careers/senior-swe");
      setRecruiterEmail("talent@technova.io");
      setJobDescription(
        "We are looking for a Senior Software Engineer to join our distributed infrastructure team. Requirements: 4+ years working with React and Python. Standard hiring pipeline with initial interview, technical challenge, and meet-the-team session. Comprehensive healthcare, 401(k) matching, and annual educational stipend."
      );
    } else if (sampleType === "suspicious") {
      setJobTitle("Remote Data Entry Assistant");
      setCompanyName("Global Operations Ltd");
      setSalary("$400 / day");
      setLocation("Anywhere / Work From Home");
      setJobUrl("https://telegram.me/global_fast_hire");
      setRecruiterEmail("recruiter.jobs.instant@gmail.com");
      setJobDescription(
        "Immediate opening! Urgent requirement for Remote Data Entry. Earn $400 daily with no experience required. Reach out directly to recruiter on Telegram @global_fast_hire with your phone number to start immediately."
      );
    } else if (sampleType === "scam") {
      setJobTitle("Urgent Data Processing Representative");
      setCompanyName("QuickHire International");
      setSalary("₹50,000 per day");
      setLocation("Remote / Home Based");
      setJobUrl("");
      setRecruiterEmail("hr-quickhire@yahoo.com");
      setJobDescription(
        "URGENT HIRING! Earn 50,000 per day with zero experience needed. Limited slots remaining! To confirm appointment, applicant must deposit a mandatory registration fee of 1,500 INR via UPI or wire transfer. After transfer, share bank details and transaction OTP with HR to process registration."
      );
    }
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim() && !jobUrl.trim()) {
      setError("Please provide at least a Job Description or Job Posting URL to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    // Combine all fields into a structured text for comprehensive heuristic evaluation
    const combinedText = `
Job Title: ${jobTitle || "Not specified"}
Company: ${companyName || "Not specified"}
Location: ${location || "Not specified"}
Salary: ${salary || "Not specified"}
Recruiter Email: ${recruiterEmail || "Not specified"}
Job URL: ${jobUrl || "Not specified"}

Job Description:
${jobDescription || "No description provided."}
`.trim();

    try {
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_text: combinedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error status.");
      }

      const data = await response.json();

      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const finalTitle = data.is_valid === false 
        ? "Invalid Input" 
        : (jobTitle.trim() || "Job Posting");

      const finalCompany = data.is_valid === false 
        ? "Not Applicable" 
        : (companyName.trim() || (data.score >= 80 ? "Unknown Company" : (data.score >= 40 ? "Apex Digital" : "TechNova Solutions")));

      // Persist in localStorage history
      try {
        const history = JSON.parse(localStorage.getItem("jobguard_history") || "[]");
        const newRecord = {
          id: Date.now(),
          title: finalTitle,
          company: finalCompany,
          score: data.score,
          verdict: data.verdict,
          status: data.status,
          is_valid: data.is_valid,
          reason: data.reason,
          message: data.message,
          date: today,
          location: location.trim() || "Remote",
          salary: salary.trim() || "Competitive",
          source: jobUrl.trim() || "Direct Input",
          warnings: data.warnings,
          positive_signals: data.positive_signals,
        };
        localStorage.setItem("jobguard_history", JSON.stringify([newRecord, ...history]));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      // Navigate to /results
      navigate("/results", {
        state: {
          result: data,
          jobInfo: {
            title: finalTitle,
            company: finalCompany,
            location: location.trim() || "Remote",
            salary: salary.trim() || "Not specified",
            recruiterEmail: recruiterEmail.trim() || "Not specified",
            source: jobUrl.trim() || "Direct Input",
            date: today,
          },
        },
      });

    } catch (err) {
      setError("Unable to connect to Flask backend. Please verify app.py is running on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-page-container">
      <div className="check-page-wrapper">
        
        {/* Page Heading */}
        <div className="page-header-block">
          <span className="section-label">VERIFICATION PORTAL</span>
          <h1 className="page-main-heading">Check a job posting</h1>
          <p className="page-subtitle">
            Review a job before you apply.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="samples-toolbar mb-20">
          <span className="samples-toolbar-label">Load sample data:</span>
          <div className="samples-btn-group">
            <button
              type="button"
              className="btn-sample btn-sample-safe"
              onClick={() => handleLoadSample("safe")}
            >
              Safe Sample
            </button>
            <button
              type="button"
              className="btn-sample btn-sample-warning"
              onClick={() => handleLoadSample("suspicious")}
            >
              Suspicious Sample
            </button>
            <button
              type="button"
              className="btn-sample btn-sample-danger"
              onClick={() => handleLoadSample("scam")}
            >
              Scam Sample
            </button>
          </div>
        </div>

        {/* Main Professional Form Card */}
        <div className="form-card full-form-card">
          <form onSubmit={handleSubmit}>

            {/* Row 1: Job Title & Company Name */}
            <div className="form-grid-two">
              <div className="form-field-group">
                <label className="form-label" htmlFor="jobTitle">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Salary & Location */}
            <div className="form-grid-two">
              <div className="form-field-group">
                <label className="form-label" htmlFor="salary">
                  Salary / Compensation
                </label>
                <input
                  id="salary"
                  type="text"
                  className="form-input"
                  placeholder="e.g. $85,000 – $110,000 / year"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Remote / New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Job Posting URL & Recruiter Email */}
            <div className="form-grid-two">
              <div className="form-field-group">
                <label className="form-label" htmlFor="jobUrl">
                  Job Posting URL
                </label>
                <input
                  id="jobUrl"
                  type="text"
                  className="form-input"
                  placeholder="e.g. https://company.com/careers/job-123"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="recruiterEmail">
                  Recruiter Email or Channel
                </label>
                <input
                  id="recruiterEmail"
                  type="text"
                  className="form-input"
                  placeholder="e.g. recruiter@company.com or @handle"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Row 4: Job Description (Textarea) */}
            <div className="form-field-group">
              <label className="form-label" htmlFor="jobDescription">
                Job Description or Recruiter Message *
              </label>
              <textarea
                id="jobDescription"
                className="form-textarea"
                rows="8"
                placeholder="Paste the full job posting text, email offer, or outreach message..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required={!jobUrl.trim()}
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="form-error-banner">
                {error}
              </div>
            )}

            {/* Form Submit Button */}
            <div className="form-action-group">
              <button
                type="submit"
                className="btn-submit-main"
                disabled={loading || (!jobDescription.trim() && !jobUrl.trim())}
              >
                {loading ? "Analyzing Job..." : "Analyze Job"}
              </button>
              <p className="form-privacy-note">
                Your information stays private. Data is only evaluated for scam indicators.
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
