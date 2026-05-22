# Quentin Moses — Builder & Operator

Senior marketing and growth executive in insurance, insurtech, and Medicare distribution.  
I build tools to work smarter. Here's what's running:

---

## Job Intel
AI-powered job search command center built with vanilla JS + Node.js.

**What it does:**
- Pulls roles from JSearch and LinkedIn APIs and scores them against a custom fit model
- Tracks applications, pipeline, and recruiter outreach in one interface
- Generates tailored resume and cover letter drafts per role
- Daily briefing powered by Claude (Anthropic)
- Scoring models: Balanced · Tight · Broad · Competency Match

**Stack:** Node.js · Vanilla JS · REST APIs · Claude API · Gmail API

---

## SMB Pipeline Controller
Signal-efficient prospecting engine for independent operators and small teams.

**The problem it solves:**
Enterprise prospecting tools (Apollo, Clearbit, ZoomInfo, etc.) give you a limited
number of free API calls per month. Small teams and independent operators can't afford
all the subscriptions — so burning those calls on the wrong prospects is costly.

**How it works:**
- Uses Google Maps API to geotarget businesses by location and category
- Scores prospects using a weighted model built on public signals: foot traffic,
  social media activity, LinkedIn headcount, and job board postings (hiring = expansion signal)
- Recommends which premium signals to run (email lookup, contact verification,
  phone validation, etc.) based on each prospect's score and business type — so you
  never burn an API call on a prospect that won't convert
- Only escalates to paid data sources when the prospect clears the scoring threshold
- Recommends 3 outreach products matched to business type and industry
- Automates outreach sequences by business type — a salon gets Instagram → call → email,
  a law office gets email → call → LinkedIn message
- Sequences are timed using benchmark data: best day of week and time of day per
  business category to maximize open and response rates
- Connects to your email and social accounts for execution

**Built for:** NY Life insurance portfolio distribution — adaptable to any SMB vertical

**Stack:** React · Google Maps API · LinkedIn · Social APIs · Weighted scoring model

---

📧 quentindmoses@gmail.com
🔗 [linkedin.com/in/quentindmoses](https://linkedin.com/in/quentindmoses)
