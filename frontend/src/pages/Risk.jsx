import { useState } from "react";
import { Activity, Loader2, CheckCircle, XCircle } from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import { card, Field, Input, Button, EmptyState, SectionTitle } from "../components/ui/FormCard";
import { api } from "../services/api";

const defaultForm = {
  total_assets: "", loan_portfolio: "", npa_amount: "", tier1_capital: "",
  total_capital: "", cash_reserves: "", investment_securities: "", deposits: "",
};

const fields = [
  { label: "Total Assets ($)", name: "total_assets", placeholder: "e.g. 5000000000" },
  { label: "Loan Portfolio ($)", name: "loan_portfolio", placeholder: "e.g. 3000000000" },
  { label: "NPA Amount ($)", name: "npa_amount", placeholder: "e.g. 210000000" },
  { label: "Tier 1 Capital ($)", name: "tier1_capital", placeholder: "e.g. 400000000" },
  { label: "Total Capital ($)", name: "total_capital", placeholder: "e.g. 500000000" },
  { label: "Cash Reserves ($)", name: "cash_reserves", placeholder: "e.g. 300000000" },
  { label: "Investment Securities ($)", name: "investment_securities", placeholder: "e.g. 800000000" },
  { label: "Total Deposits ($)", name: "deposits", placeholder: "e.g. 3800000000" },
];

const riskCfg = {
  "LOW RISK":      { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', bar: '#22c55e' },
  "MODERATE RISK": { bg: '#fffbeb', border: '#fde68a', color: '#d97706', bar: '#f59e0b' },
  "HIGH RISK":     { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c', bar: '#f97316' },
  "CRITICAL RISK": { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', bar: '#ef4444' },
};

export default function Risk() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)]));
      const data = await api.risk.analyze(payload);
      setResult(data);
    } catch { setError("Failed to connect to risk service."); }
    finally { setLoading(false); }
  };

  const cfg = result ? (riskCfg[result.risk_score.rating] || riskCfg["MODERATE RISK"]) : null;

  return (
    <PageLayout title="Risk Management" subtitle="Run portfolio stress tests and get AI risk recommendations using LangGraph">
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 20, alignItems: 'start' }}>

        <div style={card}>
          <SectionTitle>Portfolio Data</SectionTitle>
          {fields.map(f => (
            <Field key={f.name} label={f.label}>
              <Input name={f.name} type="number" value={form[f.name]} onChange={set} placeholder={f.placeholder} />
            </Field>
          ))}
          <Button loading={loading} onClick={submit}>
            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Running stress tests...</> : '→ Run Risk Analysis'}
          </Button>
          {error && <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 10 }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!result && !loading && <div style={card}><EmptyState icon={Activity} text="Enter portfolio data to run 4 AI stress test scenarios" /></div>}
          {loading && (
            <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
              <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Running 4 stress test scenarios...</p>
            </div>
          )}
          {result && cfg && (
            <>
              <div style={{ ...card, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Overall Risk Rating</p>
                    <p style={{ fontSize: 44, fontWeight: 800, color: cfg.color, letterSpacing: '-1.5px', lineHeight: 1 }}>
                      {result.risk_score.score}<span style={{ fontSize: 18, fontWeight: 500 }}>/100</span>
                    </p>
                  </div>
                  <div style={{ padding: '6px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.8)', border: `1px solid ${cfg.border}` }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color }}>{result.risk_score.rating}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Object.entries(result.ratios).slice(0, 3).map(([k, v]) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{k.replace(/_/g, ' ')}</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: cfg.color }}>{v}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <SectionTitle>Stress Test Scenarios</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.stress_tests.map(test => (
                    <div key={test.scenario} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, background: test.passed ? '#f0fdf4' : '#fef2f2', border: `1px solid ${test.passed ? '#bbf7d0' : '#fecaca'}` }}>
                      <div style={{ marginTop: 2 }}>
                        {test.passed ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 3, textTransform: 'capitalize' }}>{test.scenario.replace(/_/g, ' ')}</p>
                        <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{test.description}</p>
                        {test.regulatory_breaches?.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {test.regulatory_breaches.map((b, i) => (
                              <p key={i} style={{ fontSize: 11, color: '#dc2626', fontWeight: 500, marginTop: 3 }}>• {b}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <SectionTitle>Recommendations</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.4px', background: rec.priority === 'High' ? '#fef2f2' : rec.priority === 'Medium' ? '#fffbeb' : '#f0fdf4', color: rec.priority === 'High' ? '#dc2626' : rec.priority === 'Medium' ? '#d97706' : '#16a34a' }}>
                        {rec.priority}
                      </span>
                      <p style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{rec.action}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 18px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>AI Analysis</p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{result.explanation}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}