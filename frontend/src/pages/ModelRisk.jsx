import { useState } from 'react';
import { Cpu, CheckCircle, AlertTriangle, XCircle, BarChart2 } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

const MODELS = [
  { name: 'Fraud XGBoost v2.1',  type: 'ML — XGBoost',    status: 'ACTIVE',   accuracy: 94.2, drift: 0.8,  last_validated: '2024-10-15', decisions_30d: 14820, overrides: 12,  risk: 'LOW' },
  { name: 'Credit XGBoost v1.8', type: 'ML — XGBoost',    status: 'ACTIVE',   accuracy: 91.7, drift: 1.4,  last_validated: '2024-09-28', decisions_30d: 3240,  overrides: 28,  risk: 'LOW' },
  { name: 'LangGraph AML Agent', type: 'LLM — LangGraph',  status: 'ACTIVE',   accuracy: null, drift: null, last_validated: '2024-11-01', decisions_30d: 8910,  overrides: 45,  risk: 'MEDIUM' },
  { name: 'RAG Compliance v3',   type: 'LLM — RAG',        status: 'ACTIVE',   accuracy: null, drift: null, last_validated: '2024-10-22', decisions_30d: 5680,  overrides: 8,   risk: 'LOW' },
  { name: 'Fraud XGBoost v1.9',  type: 'ML — XGBoost',    status: 'RETIRED',  accuracy: 88.4, drift: 6.2,  last_validated: '2024-06-10', decisions_30d: 0,     overrides: 0,   risk: 'HIGH' },
  { name: 'Credit Score v0.9',   type: 'ML — Logistic Reg',status: 'RETIRED',  accuracy: 82.1, drift: 9.8,  last_validated: '2024-03-15', decisions_30d: 0,     overrides: 0,   risk: 'HIGH' },
];

const AUDIT_LOG = [
  { ts: '2024-11-20 14:32', model: 'Fraud XGBoost v2.1',  action: 'BLOCK',    input: 'Amount: $4,800 · Foreign: Y · Freq: 12/24h', score: 91, outcome: 'Confirmed Fraud', override: false },
  { ts: '2024-11-20 11:18', model: 'Credit XGBoost v1.8', action: 'APPROVE',  input: 'Score: 724 · DTI: 28% · Income: $96K', score: 78, outcome: 'Loan Disbursed', override: false },
  { ts: '2024-11-20 09:45', model: 'Fraud XGBoost v2.1',  action: 'REVIEW',   input: 'Amount: $9,200 · Same City: N · Freq: 3/24h', score: 62, outcome: 'Analyst Cleared', override: true },
  { ts: '2024-11-19 16:21', model: 'LangGraph AML Agent', action: 'FLAG',     input: 'Structuring pattern · 14 transactions · $9,800 avg', score: 88, outcome: 'SAR Filed', override: false },
  { ts: '2024-11-19 13:05', model: 'Credit XGBoost v1.8', action: 'DECLINE',  input: 'Score: 591 · Missed: 3 · DTI: 52%', score: 24, outcome: 'Declined', override: false },
  { ts: '2024-11-19 10:44', model: 'Fraud XGBoost v2.1',  action: 'BLOCK',    input: 'Amount: $18,500 · Foreign: Y · Dist: 2,400mi', score: 97, outcome: 'True Positive', override: false },
];

const statusColor = s => s === 'ACTIVE' ? 'var(--green)' : s === 'RETIRED' ? 'var(--text3)' : 'var(--amber)';
const statusBg    = s => s === 'ACTIVE' ? 'var(--green-dim)' : s === 'RETIRED' ? 'var(--bg4)' : 'var(--amber-dim)';
const riskColor   = r => r === 'HIGH' ? 'var(--red)' : r === 'MEDIUM' ? 'var(--amber)' : 'var(--green)';
const actionColor = a => a === 'BLOCK' || a === 'DECLINE' || a === 'FLAG' ? 'var(--red)' : a === 'REVIEW' ? 'var(--amber)' : 'var(--green)';
const actionBg    = a => a === 'BLOCK' || a === 'DECLINE' || a === 'FLAG' ? 'var(--red-dim)' : a === 'REVIEW' ? 'var(--amber-dim)' : 'var(--green-dim)';

export default function ModelRisk() {
  const [tab, setTab] = useState('registry');

  const activeModels  = MODELS.filter(m => m.status === 'ACTIVE');
  const totalDecisions = activeModels.reduce((s, m) => s + m.decisions_30d, 0);
  const totalOverrides = activeModels.reduce((s, m) => s + m.overrides, 0);
  const overrideRate   = totalDecisions ? ((totalOverrides / totalDecisions) * 100).toFixed(2) : 0;

  return (
    <PageLayout title="Model Risk" subtitle="SR 11-7 governance · model registry · audit trail · drift monitoring">

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 1100, marginBottom: 16 }}>
        {[
          { l: 'Active Models',     v: activeModels.length,                          c: 'var(--cyan)' },
          { l: 'Decisions (30d)',   v: totalDecisions.toLocaleString(),              c: 'var(--text)' },
          { l: 'Override Rate',     v: `${overrideRate}%`,                           c: overrideRate > 1 ? 'var(--amber)' : 'var(--green)' },
          { l: 'High-Risk Models',  v: MODELS.filter(m => m.risk === 'HIGH').length, c: 'var(--red)' },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '14px 18px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c, fontFamily: 'var(--mono)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, maxWidth: 1100 }}>
        {[
          { id: 'registry', label: 'Model Registry' },
          { id: 'audit',    label: 'Audit Log' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12,
            background: tab === t.id ? 'var(--cyan)' : 'var(--bg2)',
            color: tab === t.id ? '#000' : 'var(--text3)',
            border: '1px solid var(--border)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'registry' && (
        <div style={{ maxWidth: 1100 }}>
          {MODELS.map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <Cpu size={16} color="var(--text3)" strokeWidth={1.75} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)', flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: statusBg(m.status), color: statusColor(m.status) }}>{m.status}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: m.risk === 'HIGH' ? 'var(--red-dim)' : m.risk === 'MEDIUM' ? 'var(--amber-dim)' : 'var(--green-dim)', color: riskColor(m.risk) }}>MODEL RISK: {m.risk}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                {[
                  { l: 'Type',             v: m.type },
                  { l: 'Accuracy',         v: m.accuracy != null ? `${m.accuracy}%` : 'N/A (LLM)' },
                  { l: 'Drift Score',      v: m.drift != null ? `${m.drift}%` : 'N/A' },
                  { l: 'Last Validated',   v: m.last_validated },
                  { l: 'Decisions (30d)',  v: m.decisions_30d.toLocaleString() },
                  { l: 'Overrides',        v: `${m.overrides} (${m.decisions_30d ? ((m.overrides / m.decisions_30d) * 100).toFixed(1) : 0}%)` },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {m.drift != null && m.drift > 5 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, padding: '7px 10px', background: 'var(--red-dim)', borderRadius: 7, border: '1px solid rgba(220,38,38,0.2)' }}>
                  <AlertTriangle size={11} color="var(--red)" />
                  <span style={{ fontSize: 11, color: 'var(--red)' }}>High drift detected — model revalidation recommended</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div style={{ maxWidth: 1100 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 180px 80px 1fr 60px 120px 60px', padding: '8px 16px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              {['Timestamp', 'Model', 'Action', 'Input Summary', 'Score', 'Outcome', 'Override'].map(h => (
                <span key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>
            {AUDIT_LOG.map((l, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 180px 80px 1fr 60px 120px 60px', padding: '10px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: i % 2 === 0 ? '#fff' : 'var(--bg3)' }}>
                <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{l.ts}</span>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>{l.model}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: actionBg(l.action), color: actionColor(l.action), textAlign: 'center' }}>{l.action}</span>
                <span style={{ fontSize: 10.5, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{l.input}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: l.score >= 70 ? 'var(--red)' : l.score >= 40 ? 'var(--amber)' : 'var(--green)', fontFamily: 'var(--mono)', textAlign: 'center' }}>{l.score}</span>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>{l.outcome}</span>
                <div style={{ textAlign: 'center' }}>
                  {l.override ? <CheckCircle size={12} color="var(--amber)" /> : <span style={{ fontSize: 10, color: 'var(--text3)' }}>—</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', fontSize: 11.5, color: 'var(--text3)' }}>
            Showing last 6 decisions across all models · SR 11-7 compliant audit trail · All decisions logged with input features, scores, and outcomes
          </div>
        </div>
      )}
    </PageLayout>
  );
}
