VaultIQ — AI Banking Intelligence Platform
Overview
VaultIQ is an AI-powered banking platform that unifies fraud detection, credit scoring, compliance monitoring, risk management, and document intelligence into a single dashboard. Built for financial institutions to replace fragmented tools with one explainable, auditable AI system.
Live Demo: https://vaultiq-frontend-934314486311.us-central1.run.app

Features

Fraud Detection — Real-time transaction analysis using XGBoost + LangGraph. Flags suspicious transactions and provides plain-English explanations via LLaMA 3.3 70B.
Credit Scoring — AI loan evaluation using behavioral and financial data. Returns decision (Approved/Rejected/Review), approval score, suggested credit limit, and LLM explanation.
Compliance RAG — Ask any US banking regulatory question (SAR, CTR, KYC, OFAC, BSA, GLBA). Powered by LangChain + ChromaDB over US banking regulation documents.
Risk Management — Portfolio stress testing across 4 scenarios: mild recession, severe recession, interest rate shock, and cyber attack. LangGraph agent generates recommendations.
Document Intelligence — Upload any banking document (PDF, DOCX, TXT) and get a plain-English summary. Ask questions about the document in a chat interface.


Tech Stack
LayerTechnologyFrontendReact + Vite + RechartsAPI GatewayNode.js + ExpressAI ServicesPython + FastAPIML ModelsXGBoost + scikit-learnAI AgentsLangGraphLLMLLaMA 3.3 70B via GroqRAGLangChain + ChromaDBEmbeddingssentence-transformers (all-MiniLM-L6-v2)DeploymentGCP Cloud RunStylingInline CSS + Inter font

Project Structure
ai-banking-platform/
├── frontend/                  # React dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Topbar
│   │   │   ├── cards/         # MetricCard, AlertCard, ModuleCard
│   │   │   ├── charts/        # FraudChart, CreditChart
│   │   │   └── ui/            # PageLayout, FormCard, shared components
│   │   ├── pages/             # Dashboard, Fraud, Credit, Compliance, Risk, Documents
│   │   └── services/          # api.js — all API calls
│   └── Dockerfile
│
├── backend/
│   ├── api-gateway/           # Node.js — routes frontend to AI services
│   │   └── src/routes/        # fraud.js, credit.js, compliance.js, risk.js, docs.js
│   │
│   └── ai-services/           # Python — all AI/ML logic
│       ├── fraud/             # XGBoost model + LangGraph agent
│       ├── credit/            # XGBoost model + LangGraph agent
│       ├── compliance/        # LangChain RAG over US banking regulations
│       ├── risk/              # Stress testing + LangGraph agent
│       ├── docs/              # Document upload, summarization, Q&A
│       ├── shared/            # llm.py (Groq config)
│       ├── run.py             # Single FastAPI entry point
│       └── requirements.txt

Local Setup
Prerequisites

Node.js 18+
Python 3.11+
Groq API key (free at console.groq.com)

1. Clone the repo
bashgit clone https://github.com/Laya-Myadam/VaultIQ.git
cd VaultIQ
2. Frontend
bashcd frontend
npm install
Create frontend/.env:
VITE_API_URL=http://localhost:3001/api
bashnpm run dev
3. API Gateway
bashcd backend/api-gateway
npm install
npm run dev
4. AI Services
bashcd backend/ai-services
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
Create backend/ai-services/.env:
GROQ_API_KEY=your_groq_api_key_here
bashpython run.py
Running URLs (local)
ServiceURLFrontendhttp://localhost:5173API Gatewayhttp://localhost:3001AI Serviceshttp://localhost:8080API Docshttp://localhost:8080/docs

GCP Deployment
Three Cloud Run services:
ServiceCommandFrontendgcloud run deploy vaultiq-frontend --source frontend/Gatewaygcloud run deploy vaultiq-gateway --source backend/api-gateway/AIgcloud run deploy vaultiq-ai --source backend/ai-services/ --set-env-vars GROQ_API_KEY=xxx --memory 4Gi --cpu 2

API Endpoints
MethodEndpointDescriptionPOST/api/fraud/analyzeAnalyze a transaction for fraudPOST/api/credit/evaluateEvaluate a loan applicationPOST/api/compliance/queryAsk a compliance questionPOST/api/compliance/check-transactionCheck transaction compliance flagsPOST/api/risk/analyzeRun portfolio stress testsPOST/api/docs/uploadUpload and summarize a documentPOST/api/docs/askAsk a question about an uploaded documentGET/api/healthHealth check for all services

Environment Variables
VariableLocationDescriptionGROQ_API_KEYbackend/ai-services/.envGroq API key for LLaMA 3.3VITE_API_URLfrontend/.envAPI gateway base URLAI_URLGateway env varAI services base URL (Cloud Run)PORTGateway env varGateway port (default 3001)

Models
Fraud Detection

Algorithm: XGBoost (scale_pos_weight=19 for class imbalance)
Features: amount, hour, frequency_24h, avg_amount_7d, distance_from_home, is_foreign, same_city
Threshold: 0.6 for fraud flag, 0.85 for block

Credit Scoring

Algorithm: XGBoost
Features: age, income, loan_amount, credit_score, employment_years, existing_loans, missed_payments, debt_to_income
Output: approval score, decision, suggested credit limit

Both models train on synthetic data on first run and cache as .pkl files.
