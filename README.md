# VaultIQ — AI Banking Intelligence Platform

> Full-stack AI platform for financial institutions — fraud detection, credit underwriting, AML screening, regulatory compliance, risk stress testing, document intelligence, and automated report generation.

**Live Gateway:** https://vaultiq-frontend-934314486311.us-central1.run.app/

---

## What Is VaultIQ?

VaultIQ is an AI-powered banking operating system that brings together multiple intelligence modules under one platform. It replaces hours of manual analyst work with real-time AI decisions — scoring transactions for fraud in milliseconds, underwriting loan applications instantly, screening customers against AML/KYC watchlists, and drafting regulatory filings like SARs and CTRs in seconds.

Each module is powered by a LangGraph agent pipeline backed by Groq's LLaMA 3.3 70B model, with XGBoost ML models for fraud and credit scoring.

---

## Screenshots

> Fraud Intel · Credit Scoring · Compliance · Risk · AML · Report Studio · Loan Monitor · Doc AI

---

## Modules

| Module | What It Does |
|--------|-------------|
| **Fraud Intel** | Real-time transaction risk scoring. Inputs: amount, hour, frequency, distance, origin. Outputs: fraud score 0–100, APPROVE/REVIEW/BLOCK decision, behavioral explanation |
| **Credit** | AI loan underwriting. Scores applications using XGBoost + LangGraph. Returns approval decision, suggested credit limit, risk explanation |
| **Compliance** | RAG-based regulatory assistant. Answers questions on BSA, AML, KYC, OFAC, GLBA, FCRA, TILA, CRA. Also screens transactions for compliance flags |
| **Risk** | Portfolio stress testing across 4 scenarios — mild recession, severe recession, interest rate shock, cyber attack. Computes NPA ratio, Tier 1 capital, liquidity, LTD ratio |
| **Loan Monitor** | Real-time portfolio health analysis. Enter portfolio metrics + individual watch-list loans. Returns health score, early warning indicators, per-loan MONITOR/WATCH/RESTRUCTURE decisions |
| **AML Intel** | NLP transaction narrative analysis — extracts entities, detects AML typologies (structuring, layering, smurfing). Customer screening against OFAC/PEP/sanctions with risk score |
| **Report Studio** | AI-generated banking reports: SAR, CTR, Risk Assessment, Credit Portfolio Summary, Compliance Audit, Board Executive Summary |
| **Doc AI** | Upload PDF/DOCX/TXT → instant AI summary + conversational Q&A on the document content |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 8 |
| **Styling** | CSS variables + inline styles — custom light/ice design system |
| **Fonts** | Space Grotesk (display) · Outfit (body) · DM Mono (data) |
| **Routing** | React Router v7 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Frontend Deploy** | Firebase Hosting |
| **API Gateway** | Node.js + Express |
| **Gateway Deploy** | Google Cloud Run |
| **AI Services** | Python + FastAPI + Uvicorn |
| **LLM** | Groq — llama-3.3-70b-versatile |
| **Agent Orchestration** | LangGraph (multi-step agent pipelines) |
| **ML Models** | XGBoost + scikit-learn (fraud scoring, credit scoring) |
| **Vector DB** | ChromaDB (document embeddings for Doc AI) |
| **PDF Parsing** | pdfplumber + python-docx |
| **AI Deploy** | Google Cloud Run |

---

## Project Structure

```
ai-banking-platform/
│
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx                    # Router + auth guard (PrivateRoute)
│   │   ├── index.css                  # Design tokens, fonts, dot-grid texture
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # KPI overview, live alerts, trend charts
│   │   │   ├── Fraud.jsx              # Transaction risk scoring
│   │   │   ├── Credit.jsx             # Loan underwriting
│   │   │   ├── Compliance.jsx         # Regulatory Q&A + transaction check
│   │   │   ├── Risk.jsx               # Portfolio stress testing
│   │   │   ├── LoanMonitor.jsx        # Loan portfolio health
│   │   │   ├── AML.jsx                # Narrative NLP + customer screening
│   │   │   ├── Reports.jsx            # Report Studio (SAR, CTR, etc.)
│   │   │   ├── Documents.jsx          # Doc upload + AI Q&A
│   │   │   ├── Login.jsx              # Auth (localStorage → Firebase later)
│   │   │   └── Settings.jsx           # Profile, preferences, session
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx        # Icon-only nav (68px), tooltip labels
│   │   │   │   └── Topbar.jsx         # Frosted glass header, live clock
│   │   │   ├── ui/
│   │   │   │   ├── PageLayout.jsx     # Wraps Topbar + page content
│   │   │   │   └── FormCard.jsx
│   │   │   └── cards/
│   │   │       ├── MetricCard.jsx
│   │   │       ├── AlertCard.jsx
│   │   │       └── ModuleCard.jsx
│   │   └── services/
│   │       └── api.js                 # All API calls — maps frontend → backend fields
│   ├── .env                           # VITE_API_URL
│   └── Dockerfile
│
├── backend/
│   ├── api-gateway/                   # Express proxy — routes frontend → AI services
│   │   ├── src/
│   │   │   ├── index.js               # Route registration + health check
│   │   │   └── routes/
│   │   │       ├── fraud.js
│   │   │       ├── credit.js
│   │   │       ├── compliance.js
│   │   │       ├── risk.js
│   │   │       ├── docs.js
│   │   │       ├── reports.js
│   │   │       ├── aml.js
│   │   │       └── loans.js
│   │   └── Dockerfile
│   │
│   └── ai-services/                   # FastAPI — all AI logic
│       ├── run.py                     # Unified entry point (all routes, port 8080)
│       ├── shared/
│       │   └── llm.py                 # get_llm() → Groq ChatGroq instance
│       ├── fraud/
│       │   ├── agent.py               # LangGraph: score_transaction → explain_decision
│       │   ├── model.py               # XGBoost model loader
│       │   └── main.py
│       ├── credit/
│       │   ├── agent.py               # LangGraph: score → limit → explain
│       │   ├── model.py
│       │   └── main.py
│       ├── compliance/
│       │   ├── rag_chain.py           # Transaction compliance checker
│       │   └── main.py
│       ├── risk/
│       │   ├── agent.py               # LangGraph: analyze → stress → recommend
│       │   ├── model.py               # Ratio calculators, stress test functions
│       │   └── main.py
│       ├── docs/
│       │   └── main.py                # PDF/DOCX extract, ChromaDB, RAG Q&A
│       ├── requirements.txt
│       ├── .env                       # GROQ_API_KEY
│       └── Dockerfile
│
└── README.md
```

---

## API Reference

### Gateway base URL
```
https://vaultiq-gateway-934314486311.us-central1.run.app/api
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/fraud/analyze` | Score a transaction for fraud |
| `POST` | `/fraud/batch` | Batch-score multiple transactions |
| `POST` | `/credit/evaluate` | Evaluate a loan application |
| `POST` | `/compliance/query` | Ask a regulatory question |
| `POST` | `/compliance/check-transaction` | Screen transaction for compliance |
| `POST` | `/risk/analyze` | Run portfolio stress test |
| `POST` | `/docs/upload` | Upload document (multipart) |
| `POST` | `/docs/ask` | Q&A on uploaded document |
| `GET`  | `/health` | Gateway + AI service health check |

> **Note:** `/reports`, `/aml`, `/loans` routes are handled client-side via the deployed `/compliance/query` endpoint — no separate service needed.

---

## Local Setup

### Prerequisites
- Node.js 20+, Python 3.11+
- [Groq API key](https://console.groq.com) (free)

### 1 — AI Services
```bash
cd backend/ai-services

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env
echo "GROQ_API_KEY=your_key_here" > .env

python run.py                   # → http://localhost:8080
```

### 2 — API Gateway
```bash
cd backend/api-gateway
npm install
npm start                       # → http://localhost:3001
```

### 3 — Frontend
```bash
cd frontend
npm install

# For local backend:
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

npm run dev                     # → http://localhost:5173
```

---

## Deployment

### Backend — Google Cloud Run

```bash
# AI Services
gcloud run deploy vaultiq-ai \
  --source ./backend/ai-services \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi --cpu 2 --timeout 300 \
  --set-env-vars "GROQ_API_KEY=your_key"

# API Gateway
gcloud run deploy vaultiq-gateway \
  --source ./backend/api-gateway \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi --cpu 1 \
  --set-env-vars "AI_URL=https://YOUR_AI_SERVICE_URL"
```

### Frontend — Firebase Hosting

```bash
cd frontend

# Set production API URL
echo "VITE_API_URL=https://vaultiq-gateway-934314486311.us-central1.run.app/api" > .env.production

npm run build
firebase deploy --only hosting
```

---

## Auth

Currently uses `localStorage` for session persistence (any email + password works). **Firebase Authentication** is the planned replacement — swap the `localStorage` calls in `Login.jsx` and `App.jsx` with the Firebase SDK when ready.

---

## Known Limitations

- **Doc AI on Cloud Run** — `doc_cache` is in-memory. After a cold start, re-upload is needed. Fallback: Q&A uses the document summary as context automatically.
- **Cold starts** — First request after inactivity may take 10–20s on Cloud Run.
- **Scanned PDFs** — Text extraction requires a searchable PDF. Use [ilovepdf.com](https://ilovepdf.com) to OCR first.
- **Report/AML/Loan routes** — These call the existing compliance endpoint rather than dedicated routes, so they work without redeployment.

---

## Roadmap

- [ ] Firebase Authentication (replace localStorage)
- [ ] Persistent document storage (Cloud Storage + Firestore)
- [ ] Streaming LLM responses
- [ ] Batch fraud processing dashboard
- [ ] Real transaction data connectors (Plaid, open banking)
- [ ] Role-based access control (analyst / manager / admin)
- [ ] Mobile app

---

Built with FastAPI · React · LLaMA 3.3 70B · LangGraph · XGBoost · ChromaDB · Google Cloud
