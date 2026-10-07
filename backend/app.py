"""
JobGuard AI - Job Safety Analysis Backend
==========================================
Analyzes job descriptions and recruiter messages for common scam indicators.
Includes pre-validation stage to reject meaningless/gibberish input before risk evaluation.
"""

import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ============================================================
# 1. KEYWORD DICTIONARIES FOR VALIDATION & SCAM DETECTION
# ============================================================

JOB_ROLE_KEYWORDS = {
    "engineer", "developer", "designer", "manager", "analyst", "assistant",
    "specialist", "associate", "representative", "consultant", "executive",
    "lead", "officer", "operator", "intern", "internship", "coordinator",
    "clerk", "administrator", "worker", "technician", "support", "sales",
    "marketing", "accountant", "writer", "driver", "data entry", "software",
    "frontend", "backend", "full stack", "fullstack", "hr", "recruiter",
    "staff", "typing", "typist", "telecaller", "telemarketing", "teacher",
    "nurse", "coder", "programmer", "architect"
}

JOB_CONTEXT_KEYWORDS = {
    "job", "jobs", "career", "careers", "position", "positions", "role",
    "roles", "vacancy", "vacancies", "opening", "openings", "hiring",
    "hire", "hired", "recruiting", "recruitment", "employment", "opportunity",
    "opportunities", "apply", "applying", "application", "candidate",
    "candidates", "applicant", "applicants", "posting", "offer", "job offer",
    "full-time", "part-time", "contract", "remote", "wfh", "work from home",
    "hybrid", "work", "working", "immediate joiner", "joining"
}

JOB_REQUIREMENTS_KEYWORDS = {
    "requirement", "requirements", "required", "qualification", "qualifications",
    "skills", "skill", "experience", "experienced", "responsibilities",
    "responsibility", "duties", "duty", "eligibility", "eligible", "knowledge",
    "proficient", "proficiency", "degree", "bachelor", "master", "diploma",
    "graduate", "fresher", "freshers", "no experience", "zero experience",
    "years of experience", "yrs exp", "years exp"
}

JOB_COMPENSATION_KEYWORDS = {
    "salary", "stipend", "compensation", "package", "payout", "pay",
    "earn", "earning", "earnings", "per month", "per day", "per year",
    "hourly", "lpa", "ctc", "inr", "₹", "rs", "rs.", "$", "usd", "eur",
    "benefits", "allowance", "bonus", "registration fee", "deposit", "fee"
}

JOB_COMPANY_PROCESS_KEYWORDS = {
    "company", "technologies", "solutions", "services", "corp", "corporation",
    "inc", "ltd", "limited", "pvt", "private limited", "llc", "enterprise",
    "careers page", "interview", "interviews", "resume", "cv", "hr", "recruiter",
    "contact", "email", "telegram", "whatsapp", "portal", "website"
}

KNOWN_SCAM_PHRASES = [
    "registration fee", "application fee", "security deposit", "pay fee",
    "pay ₹", "pay $", "earn money", "daily payout", "wire transfer",
    "send money", "otp", "verification code", "no experience required",
    "unrealistic salary", "per day", "per month working 2 hours"
]


# ============================================================
# 2. INPUT VALIDATION & RISK ANALYSIS FUNCTION
# ============================================================

def analyze_job(raw_text):
    """
    Validates whether input contains meaningful job-related content,
    and then analyzes it for employment fraud signals.
    """
    text = (raw_text or "").strip()
    lowered = text.lower()

    # --------------------------------------------------------
    # STAGE 1: VALIDATION (Check for meaningful job content)
    # --------------------------------------------------------
    
    # Check length
    if len(text) < 15:
        return {
            "is_valid": False,
            "status": "INVALID INPUT",
            "verdict": "Invalid Job Posting",
            "score": None,
            "reason": "This does not appear to contain enough job-related information to perform a reliable safety check.",
            "message": "Please enter a real job description, recruiter message, or job offer so we can analyze it.",
            "warnings": [{
                "title": "Insufficient Job Information",
                "reason": "The submitted text does not contain recognizable job details such as a role title, company, requirements, salary, or application instructions."
            }],
            "positive_signals": [],
            "recommendation": "Please enter a real job description, recruiter message, or job offer so we can analyze it."
        }

    # Word count check
    words = re.findall(r"[a-zA-Z0-9₹$@]+", lowered)
    if len(words) < 4:
        return {
            "is_valid": False,
            "status": "INVALID INPUT",
            "verdict": "Invalid Job Posting",
            "score": None,
            "reason": "This does not appear to contain enough job-related information to perform a reliable safety check.",
            "message": "Please enter a real job description, recruiter message, or job offer so we can analyze it.",
            "warnings": [{
                "title": "Too Few Words",
                "reason": "The input is too brief to extract meaningful hiring details."
            }],
            "positive_signals": [],
            "recommendation": "Please enter a real job description, recruiter message, or job offer so we can analyze it."
        }

    # Gibberish / random letter check (e.g. 'asdfgh', 'qwerty', consonant-only strings)
    letters_only = re.sub(r"[^a-zA-Z]", "", lowered)
    if letters_only:
        vowels = re.findall(r"[aeiou]", letters_only)
        if len(vowels) == 0 and len(letters_only) > 5:
            return {
                "is_valid": False,
                "status": "INVALID INPUT",
                "verdict": "Invalid Job Posting",
                "score": None,
                "reason": "This does not appear to contain enough job-related information to perform a reliable safety check.",
                "message": "Please enter a real job description, recruiter message, or job offer so we can analyze it.",
                "warnings": [{
                    "title": "Unrecognized Text Pattern",
                    "reason": "The text appears to be arbitrary characters rather than real words."
                }],
                "positive_signals": [],
                "recommendation": "Please enter a real job description, recruiter message, or job offer so we can analyze it."
            }

    # Check for job-related categories matched
    categories_matched = 0
    if any(k in lowered for k in JOB_ROLE_KEYWORDS):
        categories_matched += 1
    if any(k in lowered for k in JOB_CONTEXT_KEYWORDS):
        categories_matched += 1
    if any(k in lowered for k in JOB_REQUIREMENTS_KEYWORDS):
        categories_matched += 1
    if any(k in lowered for k in JOB_COMPENSATION_KEYWORDS):
        categories_matched += 1
    if any(k in lowered for k in JOB_COMPANY_PROCESS_KEYWORDS):
        categories_matched += 1

    has_known_scam_phrase = any(p in lowered for p in KNOWN_SCAM_PHRASES)

    # Must contain at least 2 distinct job attributes OR an explicit scam job offer phrase
    if categories_matched < 2 and not has_known_scam_phrase:
        return {
            "is_valid": False,
            "status": "INVALID INPUT",
            "verdict": "Invalid Job Posting",
            "score": None,
            "reason": "This does not appear to contain enough job-related information to perform a reliable safety check.",
            "message": "Please enter a real job description, recruiter message, or job offer so we can analyze it.",
            "warnings": [{
                "title": "No Job Keywords Detected",
                "reason": "The text does not mention standard job attributes like job title, qualifications, employer, or hiring details."
            }],
            "positive_signals": [],
            "recommendation": "Please enter a real job description, recruiter message, or job offer so we can analyze it."
        }

    # --------------------------------------------------------
    # STAGE 2: SCAM RISK ANALYSIS (For verified job postings)
    # --------------------------------------------------------
    score = 0
    warnings = []
    positive_signals = []

    # Rule 1: Registration or upfront fee demands (+35 points)
    fee_phrases = [
        "registration fee", "application fee", "security deposit", "training fee",
        "pay fee", "pay ₹", "pay $", "pay 2,000", "pay 2000", "pay 1,500", "pay 1500",
        "mandatory deposit", "fee to secure"
    ]
    if any(k in lowered for k in fee_phrases):
        score += 35
        warnings.append({
            "title": "Upfront Payment / Registration Fee Requested",
            "reason": "Legitimate employers never charge candidates for job application, placement, or equipment deposits."
        })
    elif any(k in lowered for k in ["wire transfer", "send money", "crypto", "upi transfer"]):
        score += 35
        warnings.append({
            "title": "Direct Money Transfer Requested",
            "reason": "Requiring candidates to transfer money before or during employment is a primary indicator of recruitment fraud."
        })

    # Rule 2: Confidential authentication code / OTP request (+35 points)
    if any(k in lowered for k in ["otp", "one time password", "one-time password", "verification code", "cvv"]):
        score += 35
        warnings.append({
            "title": "Confidential Code (OTP) Requested",
            "reason": "Recruiters never need one-time passwords or security credentials. Sharing OTPs gives scammers direct access to your accounts."
        })

    # Rule 3: Banking or card details requested upfront (+25 points)
    if any(k in lowered for k in ["bank details", "bank account", "credit card", "debit card", "atm pin"]):
        score += 25
        warnings.append({
            "title": "Bank Account Details Requested Upfront",
            "reason": "Banking details should only be collected during formal HR payroll onboarding, not during initial recruitment."
        })

    # Rule 4: Unrealistic compensation promises (+25 points)
    unrealistic_salary_phrases = [
        "80,000 per month working 2 hours", "80000 per month working 2 hours",
        "50000 per day", "50,000 per day", "10000 daily", "10,000 daily",
        "unrealistic salary", "unlimited income", "$500 per day", "$300-$500 per day"
    ]
    if any(k in lowered for k in unrealistic_salary_phrases):
        score += 25
        warnings.append({
            "title": "Unrealistically High Salary",
            "reason": "Compensation that is drastically higher than market rates for simple work is a classic bait-and-switch scam."
        })

    # Rule 5: High pay with zero experience (+15 points)
    if any(k in lowered for k in ["no experience", "no experience required", "no experience needed", "zero experience", "no skills required", "daily payout"]):
        score += 15
        warnings.append({
            "title": "High Pay for No Experience",
            "reason": "Promises of substantial income with zero qualifications are frequently used to lure job seekers into task scams."
        })

    # Rule 6: Urgent hiring pressure (+15 points)
    if any(k in lowered for k in ["urgent hiring", "urgent opening", "urgently", "immediately", "limited slots", "hurry", "spots filling fast"]):
        score += 15
        warnings.append({
            "title": "Urgent Hiring Language",
            "reason": "Scammers create artificial urgency to rush candidates into acting without verifying the employer."
        })

    # Rule 7: Unofficial communication channels (+20 points)
    if any(k in lowered for k in ["telegram", "whatsapp only", "contact on whatsapp", "@gmail.com", "@yahoo.com", "@hotmail.com"]):
        score += 20
        warnings.append({
            "title": "Suspicious Recruiter Contact Channel",
            "reason": "Legitimate enterprise recruiters use company domain emails, not personal WhatsApp or Telegram."
        })

    # Positive Signals Detection
    if not any(k in lowered for k in ["fee", "deposit", "wire transfer", "send money", "payment"]):
        positive_signals.append("No upfront payment or registration fee demands detected")

    if not any(k in lowered for k in ["otp", "verification code", "bank details", "bank account"]):
        positive_signals.append("No requests for OTPs or sensitive banking credentials")

    if any(k in lowered for k in ["requirements", "required", "experience", "responsibilities", "skills", "react", "python", "degree", "qualification"]):
        positive_signals.append("Clear job qualifications and experience requirements outlined")

    if any(k in lowered for k in ["careers page", "interview", "technical interview", "resume", "official website", "company"]):
        positive_signals.append("Professional corporate hiring and application process indicated")

    # Limit score to maximum 100
    if score > 100:
        score = 100

    # Minimum baseline check: Do NOT treat "no scam keywords found" as automatically SAFE.
    # If 0 scam keywords were found, check whether there are actually credible positive signals.
    if score == 0:
        if len(positive_signals) >= 3:
            # Genuine job posting with confirmed positive characteristics
            score = 15
        else:
            # Vague posting: no explicit scam words, but not enough verified details to be declared SAFE
            score = 45
            warnings.append({
                "title": "Limited Corporate Verification Details",
                "reason": "This listing does not provide enough verified corporate background or a formal application process."
            })

    # --------------------------------------------------------
    # STAGE 3: DETERMINE VERDICT & RECOMMENDATIONS
    # --------------------------------------------------------
    if score <= 30:
        status = "SAFE"
        verdict = "Safe / Low Risk"
        recommendation = "This posting displays standard recruitment characteristics with no high-risk markers. Standard due diligence is still recommended."
    elif score <= 60:
        status = "SUSPICIOUS"
        verdict = "Suspicious"
        recommendation = "Proceed with caution. Several atypical recruitment patterns were detected. Verify the recruiter's identity through official corporate channels before sharing personal documents."
    else:
        status = "HIGH RISK / LIKELY SCAM"
        verdict = "High Risk / Likely Scam"
        recommendation = "Do not apply until the employer can be independently verified. Never pay upfront fees, wire money, or provide one-time passwords (OTPs)."

    return {
        "is_valid": True,
        "status": status,
        "verdict": verdict,
        "score": score,
        "warnings": warnings,
        "positive_signals": positive_signals,
        "recommendation": recommendation
    }


# ============================================================
# 3. FLASK API ENDPOINTS
# ============================================================

@app.route("/analyze", methods=["POST"])
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json() or {}
    job_text = data.get("job_text", "")

    if not job_text.strip():
        return jsonify({
            "error": "Please provide a job description to analyze."
        }), 400

    result = analyze_job(job_text)
    return jsonify(result)


@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "JobGuard AI Backend"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
