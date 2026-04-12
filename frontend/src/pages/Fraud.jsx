import { useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import { card, Field, Input, Select, Button, EmptyState, SectionTitle } from "../components/ui/FormCard";
import { api } from "../services/api";

const defaultForm = {
  amount: "", hour: "", frequency_24h: "", avg_amount_7d: "",
  distance_from_home: "", is_foreign: 0, same_city: 1,
};

export default function Fraud() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.fraud.analyze({
        amount: parseFloat(form.amount), hour: parseInt(form.hour),
        frequency_24h: parseInt(form.frequency_24h),
        avg_amount_7d: parseFloat(form.avg_amount_7d),
        distance_from_home: parseFloat(form.distance_from_home),
        is_foreign: parseInt(form.is_foreign),
        same_city: parseInt(form.same_city),
      });
      setResult(data);
    } catch { setError("Failed to connect to fraud service."); }
    finally { setLoading(false); }
  };

  const pct = result ? (result.fraud_score * 100).toFixed(1) : 0;
  const scoreColor = result ? (result.fraud_score > 0.75 ? '#dc2626' : result.fraud_score > 0.4 ? '#d97706' : '#16a34a') : '#6366f1';
  const barColor   = result ? (result.fraud_score > 0.75 ? '#ef4444' : result.fraud_score > 0.4 ? '#f59e0b' : '#22c55e') : '#6366f1';
  const recCfg = {
    BLOCK:   { bg: '#fef2f2', color: '#dc2626' },
    REVIEW:  { bg: '#fffbeb', color: '#d97706' },
    APPROVE: { bg: '#f0fdf4', color: '#16a34a' },
  };
  const rec = result ? (recCfg[result.recommendation] || recCfg.APPROVE) : null;

  return (
    <PageLayout title="Fraud Detection" subtitle="Analyze a transaction using the AI-powered LangGraph fraud agent">
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 20, alignItems: 'start' }}>

        <div style={card}>
          <SectionTitle>Transaction Details</SectionTitle>
          <Field label="Amount ($)"><Input name="amount" type="number" value={form.amount} onChange={set} placeholder="e.g. 185000" /></Field>
          <Field label="Hour of Day (0–23)"><Input name="hour" type="number" value={form.hour} onChange={set} placeholder="e.g. 2" /></Field>
          <Field label="Transactions in last 24h"><Input name="frequency_24h" type="number" value={form.frequency_24h} onChange={set} placeholder="e.g. 18" /></Field>
          <Field label="Avg transaction amount — last 7 days ($)"><Input name="avg_amount_7d" type="number" value={form.avg_amount_7d} onChange={set} placeholder="e.g. 3000" /></Field>
          <Field label="Distance from home (km)"><Input name="distance_from_home" type="number" value={form.distance_from_home} onChange={set} placeholder="e.g. 450" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Foreign Transaction">
              <Select name="is_foreign" value={form.is_foreign} onChange={set}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </Select>
            </Field>
            <Field label="Same City">
              <Select name="same_city" value={form.same_city} onChange={set}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </Select>
            </Field>
          </div>
          <Button loading={loading} onClick={submit}>
            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : '→ Analyze Transaction'}
          </Button>
          {error && <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 10 }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!result && !loading && <div style={card}><EmptyState icon={ShieldAlert} text="Submit a transaction to see the AI fraud analysis" /></div>}
          {loading && (
            <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Running LangGraph fraud agent...</p>
            </div>
          )}
          {result && (
            <>
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>Fraud Probability</p>
                    <p style={{ fontSize: 52, fontWeight: 800, color: scoreColor, letterSpacing: '-2px', lineHeight: 1 }}>
                      {pct}<span style={{ fontSize: 22, fontWeight: 500, color: '#94a3b8' }}>%</span>
                    </p>
                  </div>
                  <div style={{ padding: '6px 16px', borderRadius: 99, background: rec.bg }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: rec.color, letterSpacing: '0.5px' }}>{result.recommendation}</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
                  {[
                    { label: 'ML Score', val: `${pct}%` },
                    { label: 'Decision', val: result.recommendation },
                    { label: 'Fraud', val: result.is_fraud ? 'Yes' : 'No' },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  {result.is_fraud ? <ShieldAlert size={16} color="#ef4444" /> : <ShieldCheck size={16} color="#22c55e" />}
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