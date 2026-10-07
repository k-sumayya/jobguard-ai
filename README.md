# JobGuard AI – AI Fake Job Detector

> **A classic, professional web application with multi-page React Router navigation and clean, beginner-friendly code.**

JobGuard AI helps job seekers verify whether a job description, email, or recruiter message is genuine or a fraudulent scam before applying or sharing personal data.

---

## 🌟 Architecture & Page Structure

```text
jobguard-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Floating navbar with active route links & mobile menu
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Classic SaaS landing page (hero, visual job card, why, what we check)
│   │   │   ├── CheckJob.jsx      # Dedicated job verification form (/check) with 1-click samples
│   │   │   ├── Results.jsx       # Dedicated safety report page (/results) with circular meter & advice
│   │   │   ├── HowItWorks.jsx    # 4-step process & in-depth fraud signals guide (/how-it-works)
│   │   │   └── History.jsx       # Client-side localStorage audit dashboard (/history)
│   │   ├── App.jsx               # React Router routes & global site footer
│   │   ├── App.css               # Clean, soft, classic pure CSS stylesheet
│   │   └── main.jsx              # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py                    # Single Flask file: POST /analyze endpoint & detection logic
│   └── requirements.txt          # Flask & flask-cors
│
├── start.sh                      # Full-stack launcher script
└── README.md
```

---

## 🧭 Routes & User Flow

1. **Home (`/`)**:
   - Classic SaaS landing hero: *"Find the right job. Avoid the wrong one."*
   - Interactive job card visual with Safety Score.
   - **Why JobGuard?** (3 cards: Company, Recruiter, Payment Safety).
   - **How It Works** (3 steps: 01 Paste, 02 Analyze, 03 Decide).
   - **What We Check** (6 cards: Company, Salary, Recruiter, Payment, Description, Links).
   - Primary CTA navigating to `/check`.

2. **Check a Job (`/check`)**:
   - Clean, dedicated scanner page: *"Check a job before you apply."*
   - Inputs: Job Title (optional), Company (optional), Description (required), URL (optional).
   - 1-click test samples: **Safe Job**, **Suspicious Job**, **Scam Job**.
   - Submits to Flask `POST /analyze`, saves the record into browser `localStorage`, and navigates directly to `/results`.

3. **Results (`/results`)**:
   - Dedicated Safety Report view (no form clutter).
   - Job metadata banner: Title, Company, Source, Date checked.
   - Large animated SVG circular progress meter with score (e.g., `82 / 100`) and colored verdict badge.
   - **Why we flagged this job**: Red warning cards explaining *what* was detected and *why* it matters.
   - **Positive Signals**: Legitimate hiring indicators.
   - **Risk Breakdown**: Pure CSS progress bars (Company, Salary, Recruiter, Payment, Description).
   - **Before You Apply**: Actionable safety recommendations checklist.
   - Action buttons to check another job or view history.

4. **How It Works (`/how-it-works`)**:
   - In-depth security methodology guide: *"How JobGuard protects you"*.
   - 4-step verification walkthrough (01 Paste, 02 Analyze, 03 Understand, 04 Decide).
   - Deep dive on 6 critical fraud signals: Upfront Fees, OTP Requests, Unrealistic Pay, Unverified Domains, Urgency Tactics, and Masked Companies.

5. **History (`/history`)**:
   - Client-side audit log stored in `localStorage` (`jobguard_history`).
   - Cards display Job Title, Company, Score, Verdict, Date, and Source.
   - Click any past record to immediately re-open its full safety report.
   - "Clear History" button to reset records.

---

## ⚙️ How the Detection Engine Works

The backend (`app.py`) analyzes the submitted job text using transparent rule-based heuristics:

| Indicator Detected | Score Added | Warning Flagged |
| :--- | :---: | :--- |
| **Registration / Application Fee** | `+30` | Real employers never charge fees for interviews, training, or equipment deposits. |
| **Upfront Payment / Wire Transfer** | `+30` | Asking for money transfers before starting work is a classic advance-fee scam. |
| **OTP / Sensitive Code Request** | `+30` | Recruiters never need one-time passwords. |
| **Bank Account / Card Details Upfront** | `+20` | Banking details are only collected during formal HR onboarding, not during screening. |
| **Urgent Hiring Pressure** | `+10` | High-pressure urgency tactics used to rush candidates into acting without thinking. |
| **High Pay with No Experience** | `+10` | Claims of high earnings with zero skills or experience. |
| **Unrealistically High Salary** | `+20` | Drastically inflated compensation promised for basic tasks. |
| **Suspicious Recruiter Channels** | `+15` | Public webmail (@gmail.com) or Telegram/WhatsApp handles instead of company domains. |

### Score & Verdict Thresholds

- **0 – 30**: 🟢 **Likely Genuine**
- **31 – 60**: 🟡 **Suspicious**
- **61 – 80**: 🟠 **High Risk**
- **81 – 100**: 🔴 **Likely Fake**

---

## 🚀 Running the Project

```bash
./start.sh
```
- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:5001`
