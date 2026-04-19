const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${err}`);
  }
  return res.json();
}

async function postForm(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Fraud ─────────────────────────────────────────────────────────────────
// Maps frontend field names → exactly what fraud/agent.py expects
export async function analyzeFraud(payload) {
  return post('/fraud/analyze', {
    amount:             payload.amount,
    hour:               payload.hour_of_day,
    frequency_24h:      payload.transactions_last_24h,
    avg_amount_7d:      payload.avg_amount_last_7d,
    distance_from_home: payload.distance_from_home_km,
    is_foreign:         payload.is_foreign === 1 || payload.is_foreign === true,
    same_city:          payload.is_same_city === 1 || payload.is_same_city === true,
  });
}

// ─── Credit ────────────────────────────────────────────────────────────────
// Maps frontend field names → exactly what credit/agent.py expects
export async function scoreCredit(payload) {
  return post('/credit/evaluate', {
    age:              payload.age,
    income:           payload.annual_income,
    loan_amount:      payload.loan_amount,
    credit_score:     payload.credit_score,
    employment_years: payload.employment_years,
    existing_loans:   payload.existing_loans,
    missed_payments:  payload.missed_payments,
    debt_to_income:   payload.debt_to_income,
  });
}

// ─── Compliance ────────────────────────────────────────────────────────────
export async function askCompliance(question) {
  return post('/compliance/query', { question });
}

export async function checkCompliance(payload) {
  return post('/compliance/check-transaction', {
    amount:           payload.amount,
    transaction_type: payload.transaction_type,
    is_foreign:       payload.is_foreign === 'true' || payload.is_foreign === true,
  });
}

// ─── Risk ──────────────────────────────────────────────────────────────────
// Portfolio dataclass uses 'deposits' not 'total_deposits'
export async function analyzeRisk(payload) {
  return post('/risk/analyze', {
    total_assets:          payload.total_assets,
    loan_portfolio:        payload.loan_portfolio,
    npa_amount:            payload.npa_amount,
    tier1_capital:         payload.tier1_capital,
    total_capital:         payload.total_capital,
    cash_reserves:         payload.cash_reserves,
    investment_securities: payload.investment_securities,
    deposits:              payload.total_deposits,
  });
}

// ─── Reports ───────────────────────────────────────────────────────────────
// Routes through the deployed compliance/query endpoint — no new backend needed
const REPORT_LABELS = {
  sar:              'Suspicious Activity Report (SAR) — FinCEN Filing',
  ctr:              'Currency Transaction Report (CTR) — FinCEN Filing',
  risk_assessment:  'Portfolio Risk Assessment Report',
  credit_portfolio: 'Credit Portfolio Summary Report',
  compliance_audit: 'Compliance Audit Report',
  board_summary:    'Board Executive Summary',
};

export async function generateReport({ report_type, context }) {
  const label = REPORT_LABELS[report_type] || report_type.toUpperCase();
  const ctx = Object.entries(context)
    .filter(([, v]) => v)
    .map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${v}`)
    .join('\n');
  const question = `You are a senior banking analyst. Write a complete, professional ${label} using the data below. Include all standard sections (Executive Summary, Key Details, Risk Analysis, Required Actions, Regulatory References). Use formal banking language.\n\nDATA:\n${ctx}`;
  const data = await post('/compliance/query', { question });
  return { report_type, label, content: data.answer };
}

// ─── AML ───────────────────────────────────────────────────────────────────
function tryParseJSON(text, fallback) {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : fallback;
  } catch { return fallback; }
}

export async function analyzeNarrative({ narrative }) {
  const question = `You are an AML specialist AI. Analyze this transaction narrative and return a JSON object ONLY (no extra text) with fields: risk_level ("HIGH"/"MEDIUM"/"LOW"), risk_score (0-100 integer), entities (array of {type, value} where type is PERSON/AMOUNT/LOCATION/DATE/ORGANIZATION), red_flags (array of suspicious indicator strings), patterns (array of AML typology names like structuring/layering/smurfing), recommendation (string with action + reasoning).\n\nNARRATIVE: ${narrative}`;
  const data = await post('/compliance/query', { question });
  return tryParseJSON(data.answer, {
    risk_level: 'MEDIUM', risk_score: 50,
    entities: [], red_flags: [], patterns: [],
    recommendation: data.answer,
  });
}

export async function screenCustomer(payload) {
  const ctx = Object.entries(payload).filter(([, v]) => v).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ');
  const question = `You are a KYC/AML compliance officer AI. Screen this customer and return a JSON object ONLY (no extra text) with fields: risk_level ("HIGH"/"MEDIUM"/"LOW"), checks (array of {name, passed: boolean} for these checks: "OFAC Sanctions List", "PEP Screening", "Adverse Media", "High-Risk Country", "Occupation Risk", "Account Behavior"), risk_factors (array of strings), recommendation (string with due diligence actions).\n\nCUSTOMER: ${ctx}`;
  const data = await post('/compliance/query', { question });
  return tryParseJSON(data.answer, {
    risk_level: 'LOW', checks: [], risk_factors: [], recommendation: data.answer,
  });
}

// ─── Loans ─────────────────────────────────────────────────────────────────
export async function monitorLoans({ portfolio, loans }) {
  const portStr = Object.entries(portfolio).filter(([, v]) => v).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ') || 'not provided';
  const loansStr = loans.map(l => `${l.borrower} (${l.loan_type}, $${l.outstanding}K, ${l.days_past_due || 0} DPD, collateral $${l.collateral_value || 0}K)`).join('; ') || 'none';
  const question = `You are a credit risk officer AI. Analyze this loan portfolio and return a JSON object ONLY (no extra text) with fields: health_score (0-100 integer), rating ("EXCELLENT"/"GOOD"/"FAIR"/"POOR"/"CRITICAL"), ewi_count (integer), early_warnings (array of {indicator: string, severity: "HIGH"/"MEDIUM"}), loan_analysis (array of {borrower, action: "MONITOR"/"WATCH"/"RESTRUCTURE"/"WRITE-OFF", note}), recommendations (array of 4-5 strings), summary (2-3 sentence string).\n\nPORTFOLIO: ${portStr}\nLOANS: ${loansStr}`;
  const data = await post('/compliance/query', { question });
  return tryParseJSON(data.answer, {
    health_score: 70, rating: 'FAIR', ewi_count: 0,
    early_warnings: [], loan_analysis: [], recommendations: [], summary: data.answer,
  });
}

// ─── Documents ─────────────────────────────────────────────────────────────
export async function summarizeDocument(file) {
  const fd = new FormData();
  fd.append('file', file);
  return postForm('/docs/upload', fd);
}

export async function askDocument(docId, question) {
  const fd = new FormData();
  fd.append('doc_id', docId);
  fd.append('question', question);
  return postForm('/docs/ask', fd);
}