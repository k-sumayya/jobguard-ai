import React from "react";
import { Link } from "react-router-dom";

/**
 * HowItWorks Component
 * Classic professional recruitment safety guide.
 * No emojis, no decorative illustrations, clear typography.
 */
export default function HowItWorks() {
  return (
    <div className="how-page-container">
      <div className="how-wrapper">
        
        {/* Header Block */}
        <div className="page-header-block text-center">
          <span className="section-label">SAFETY GUIDE</span>
          <h1 className="page-main-heading">
            How JobGuard <span className="highlight-accent">protects</span> candidates
          </h1>
          <p className="page-subtitle max-w-640 mx-auto">
            Our verification engine cross-references job postings and recruiter communications
            against known recruitment fraud vectors before you submit sensitive information.
          </p>
        </div>

        {/* 3 Steps Section */}
        <div className="how-cards-grid mb-40">
          <div className="how-card">
            <span className="how-step-number">01</span>
            <h3 className="how-card-title">Paste</h3>
            <p className="how-card-desc">
              Paste the job description, recruiter email, messaging transcript, or job posting URL into JobGuard.
            </p>
          </div>

          <div className="how-card">
            <span className="how-step-number">02</span>
            <h3 className="how-card-title">Check</h3>
            <p className="how-card-desc">
              Our automated heuristics scan for advance payment requests, confidential code solicitations, urgency, and salary benchmarks.
            </p>
          </div>

          <div className="how-card">
            <span className="how-step-number">03</span>
            <h3 className="how-card-title">Decide</h3>
            <p className="how-card-desc">
              Review a transparent risk score and itemized report to determine whether to apply or avoid the listing.
            </p>
          </div>
        </div>

        {/* In-depth Fraud Indicators Card */}
        <div className="form-card mb-40">
          <h2 className="report-section-title mb-6">What We Inspect</h2>
          <p className="report-desc mb-24">
            Key fraud patterns evaluated across every submission:
          </p>

          <div className="guide-topics-list">
            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Company Verification</h4>
              <p className="guide-topic-desc">
                Legitimate employers operate transparent corporate websites and registered entities. We flag listings that fail to name an authentic employer or use disposable company identities.
              </p>
            </div>

            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Salary Realism</h4>
              <p className="guide-topic-desc">
                Compensation far above industry standards for entry-level tasks (e.g. ₹50,000/day or $5,000/week for basic typing) is a primary bait mechanism used in advance-fee employment scams.
              </p>
            </div>

            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Recruiter Communication Channels</h4>
              <p className="guide-topic-desc">
                Authentic enterprise recruiters contact candidates through corporate domain email addresses. Solicitations conducted exclusively via personal Telegram or WhatsApp channels indicate high risk.
              </p>
            </div>

            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Upfront Fees & Payment Solicitations</h4>
              <p className="guide-topic-desc">
                Real employers will never charge candidates for application reviews, onboarding kits, training modules, or background checks. Any demand for UPI or wire transfers is an immediate fraud signal.
              </p>
            </div>

            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Job Description Quality</h4>
              <p className="guide-topic-desc">
                Authentic listings articulate clear responsibilities, prerequisites, and operational standards. Vague, copy-pasted descriptions with grammatical inconsistencies frequently point to phishing.
              </p>
            </div>

            <div className="guide-topic-item">
              <h4 className="guide-topic-title">Confidential Information Requests</h4>
              <p className="guide-topic-desc">
                Recruiters never need one-time passwords (OTPs), bank account logins, or credit card details during the interview phase. Disclosing OTPs gives scammers direct access to your accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/check" className="btn-submit-main max-w-280 inline-block">
            Check a Job Now →
          </Link>
        </div>

      </div>
    </div>
  );
}
