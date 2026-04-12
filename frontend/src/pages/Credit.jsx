import { useState } from "react";
import { CreditCard, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import { card, Field, Input, Button, EmptyState, SectionTitle } from "../components/ui/FormCard";
import { api } from "../services/api";

const defaultForm = {
  age: "", income: "", loan_amount: "", credit_score: "",
  employment_years: "", existing_loans: "", missed_payments: "", debt_to_income: "",
};

const fields = [
  { label: "Age", name: "age", placeholder: "e.g. 35" },
  { label: "Annual Income ($)", name: "income", placeholder: "e.g. 75000" },
  { label: "Loan Amount Requested ($)", name: "loan_amount", placeholder: "e.g. 250000" },
  { label: "Credit Score", name: "credit_score", placeholder: "e.g. 720" },
  { label: "Employment Years", name: "employment_years", placeholder: "e.g. 5" },
  { label: "Existing Loans", name: "existing_loans", placeholder: "e.g. 1" },
  { label: "Missed Payments (last year)", name: "missed_payments", placeholder: "e.g. 0" },
  { label: "Debt-to-Income Ratio (0–1)", name: "debt_to_income", placeholder: "e.g. 0.28" },
];

const decisionCfg = {
  APPROVED: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: CheckCircle, iconColor: '#22c55e', label: 'Approved' },
  REJECTED: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: XCircle,     iconColor: '#ef4444', label: 'Rejected' },
  REVIEW:   { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: AlertCircle, iconColor: '#f59e0b', label: 'Under Review' },
};

export default function Credit() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.credit.evaluate({
        age: parseInt(form.age), income: parseFloat(form.income),
        loan_amount: parseFloat(form.loan_amount), credit_score: parseInt(form.credit_score),
        employment_years: parseInt(form.employment_years), existing_loans: parseInt(form.existing_loans),
        missed_payments: parseInt(form.missed_payments), debt_to_income: parseFloat(form.debt_to_income),
      });
      setResult(data);
    } catch { setError("Failed to connect to credit service."); }
    finally { setLoading(false); }
  };

  const cfg = result ? (decisionCfg[result.decision] || decisionCfg.REVIEW) : null;
  const Icon = cfg?.icon;

  return (
    <PageLayout title="Credit Scoring" subtitle="Evaluate a loan application using the AI-powered LangGraph credit agent">
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 20, alignItems: 'start' }}>

        <div style={card}>
          <SectionTitle>Loan Application</SectionTitle>
          {fields.map(f => (
            <Field key={f.name} label={f.label}>
              <Input name={f.name} type="number" value={form[f.name]} onChange={set} placeholder={f.placeholder} />
            </Field>
          ))}
          <Button loading={loading} onClick={submit}>
            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Evaluating...</> : '→ Evaluate Application'}
          </Button>
          {error && <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 10 }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!result && !loading && <div style={card}><EmptyState icon={CreditCard} text="Submit a loan application to see the AI credit decision" /></div>}
          {loading && (
            <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Running LangGraph credit agent...</p>
            </div>
          )}
          {result && cfg && (
            <>
              <div style={{ ...card, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Icon size={22} color={cfg.iconColor} />
                  <span style={{ fontSize: 18, fontWeight: 800, color: cfg.color, letterSpacing: '-0.3px' }}>{cfg.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Approval Score', val: `${(result.approval_score * 100).toFixed(1)}%` },
                    { label: 'Suggested Limit', val: `$${result.suggested_limit.toLocaleString()}` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '14px 16px' }}>
                      <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{item.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: cfg.color, letterSpacing: '-0.5px' }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>AI Explanation</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: '#eef2ff', color: '#6366f1', marginLeft: 'auto' }}>LLaMA 3.3 70B</span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8 }}>{result.explanation}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}