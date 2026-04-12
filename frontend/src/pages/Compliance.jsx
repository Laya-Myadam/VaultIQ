import { useState } from "react";
import { FileCheck, Loader2, Send, MessageSquare } from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import { card, Field, Input, Select, Button, SectionTitle } from "../components/ui/FormCard";
import { api } from "../services/api";

const statusCfg = {
  compliant:       { bg: '#f0fdf4', color: '#15803d', label: 'Compliant' },
  requires_action: { bg: '#fffbeb', color: '#d97706', label: 'Action Required' },
  not_found:       { bg: '#f8fafc', color: '#64748b', label: 'Not Found' },
};

const severityCfg = {
  high:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  none:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

export default function Compliance() {
  const [question, setQuestion] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [txn, setTxn] = useState({ amount: "", type: "digital", is_foreign: false });
  const [txnResult, setTxnResult] = useState(null);
  const [txnLoading, setTxnLoading] = useState(false);

  const handleQuery = async () => {
    if (!question.trim()) return;
    setQueryLoading(true); setQueryResult(null);
    try { const d = await api.compliance.query(question); setQueryResult(d); }
    finally { setQueryLoading(false); }
  };

  const handleTxn = async () => {
    setTxnLoading(true); setTxnResult(null);
    try {
      const d = await api.compliance.checkTransaction({ amount: parseFloat(txn.amount), type: txn.type, is_foreign: txn.is_foreign });
      setTxnResult(d);
    } finally { setTxnLoading(false); }
  };

  return (
    <PageLayout title="Compliance RAG" subtitle="Ask regulatory questions or check transaction compliance using LangChain + ChromaDB">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={card}>
          <SectionTitle>Ask a Compliance Question</SectionTitle>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <MessageSquare size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
                placeholder="e.g. What are the SAR filing requirements?"
                style={{
                  width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                  border: '1.5px solid #e8edf2', fontSize: 13, fontWeight: 500, color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', background: '#fafafa'
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e8edf2'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              onClick={handleQuery}
              disabled={queryLoading}
              style={{
                padding: '11px 20px', borderRadius: 10, border: 'none',
                background: queryLoading ? '#a5b4fc' : '#6366f1',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
              }}
            >
              {queryLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
              Ask
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {["What are the SAR filing requirements?", "When must a CTR be filed?", "What is OFAC screening?", "Explain KYC under CIP"].map(q => (
              <button key={q} onClick={() => setQuestion(q)} style={{
                fontSize: 11, fontWeight: 500, color: '#6366f1', background: '#eef2ff',
                border: 'none', borderRadius: 99, padding: '4px 12px', cursor: 'pointer'
              }}>{q}</button>
            ))}
          </div>

          {queryResult && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: statusCfg[queryResult.status]?.bg || '#f8fafc', color: statusCfg[queryResult.status]?.color || '#64748b' }}>
                  {statusCfg[queryResult.status]?.label || 'Unknown'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: '#eef2ff', color: '#6366f1' }}>LLaMA 3.3 70B via Groq</span>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '18px 20px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{queryResult.answer}</p>
              </div>
            </div>
          )}
        </div>

        <div style={card}>
          <SectionTitle>Check Transaction Compliance</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <Field label="Amount ($)">
              <Input type="number" value={txn.amount} onChange={e => setTxn(t => ({ ...t, amount: e.target.value }))} placeholder="e.g. 15000" />
            </Field>
            <Field label="Transaction Type">
              <Select value={txn.type} onChange={e => setTxn(t => ({ ...t, type: e.target.value }))}>
                <option value="digital">Digital</option>
                <option value="cash">Cash</option>
              </Select>
            </Field>
            <Field label="Foreign Transaction">
              <Select value={txn.is_foreign} onChange={e => setTxn(t => ({ ...t, is_foreign: e.target.value === 'true' }))}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </Select>
            </Field>
            <button
              onClick={handleTxn}
              disabled={txnLoading}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: txnLoading ? '#a5b4fc' : '#6366f1',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)', marginBottom: 16
              }}
            >
              {txnLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileCheck size={14} />}
              Check
            </button>
          </div>

          {txnResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {txnResult.flags.map((flag, i) => {
                const c = severityCfg[flag.severity] || severityCfg.none;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, background: c.bg, border: `1px solid ${c.border}` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 3 }}>{flag.rule}</p>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{flag.detail}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: '#fff', color: c.color, border: `1px solid ${c.border}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{flag.severity}</span>
                  </div>
                );
              })}
              {txnResult.compliance_guidance && (
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '18px 20px', border: '1px solid #f1f5f9', marginTop: 4 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Regulatory Guidance</p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85 }}>{txnResult.compliance_guidance}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}