import { useState, useRef } from "react";
import { Upload, FileText, Send, Loader2, X, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageLayout from "../components/ui/PageLayout";
import { card } from "../components/ui/FormCard";
import { api } from "../services/api";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [docResult, setDocResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [qa, setQa] = useState([]);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => { if (!f) return; setFile(f); setDocResult(null); setQa([]); };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try { const d = await api.docs.upload(file); setDocResult(d); }
    finally { setUploading(false); }
  };

  const handleAsk = async () => {
    if (!question.trim() || !docResult?.doc_id) return;
    const q = question;
    setQuestion(""); setAsking(true);
    setQa(p => [...p, { role: "user", content: q }]);
    try {
      const d = await api.docs.ask(docResult.doc_id, q);
      setQa(p => [...p, { role: "ai", content: d.answer }]);
    } finally { setAsking(false); }
  };

  const examples = [
    "What is the interest rate on this loan?",
    "Are there any prepayment penalties?",
    "What happens if the borrower defaults?",
    "Summarize key obligations of each party",
  ];

  return (
    <PageLayout title="Document Intelligence" subtitle="Upload any banking document — get an AI summary and ask questions in plain English">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: drag ? '#eef2ff' : '#fff', borderRadius: 16, padding: '36px 24px',
              border: `2px dashed ${drag ? '#6366f1' : '#e2e8f0'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
            }}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" style={{ display: 'none' }} accept=".pdf,.docx,.doc,.txt" onChange={e => handleFile(e.target.files[0])} />
            <div style={{ width: 52, height: 52, borderRadius: 14, background: drag ? '#eef2ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: `1.5px solid ${drag ? '#6366f1' : '#e2e8f0'}` }}>
              <Upload size={22} color={drag ? '#6366f1' : '#94a3b8'} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: drag ? '#6366f1' : '#374151', marginBottom: 5 }}>
              {drag ? 'Drop it here' : 'Drop your document or click to browse'}
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Supports PDF, DOCX, TXT · Any banking document</p>
          </div>

          {file && (
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} color="#6366f1" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => { setFile(null); setDocResult(null); setQa([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={15} color="#94a3b8" />
              </button>
            </div>
          )}

          {file && !docResult && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                background: uploading ? '#a5b4fc' : '#6366f1', color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
              }}
            >
              {uploading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing document...</> : '→ Analyze Document'}
            </button>
          )}

          {docResult?.summary && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <FileText size={14} color="#6366f1" />
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Document Summary</p>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>{docResult.char_count?.toLocaleString()} chars</span>
              </div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.85 }}>
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6, marginTop: 14 }}>{children}</p>,
                    h2: ({children}) => <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6, marginTop: 14 }}>{children}</p>,
                    strong: ({children}) => <span style={{ fontWeight: 700, color: '#0f172a' }}>{children}</span>,
                    p: ({children}) => <p style={{ marginBottom: 10, lineHeight: 1.8, color: '#374151' }}>{children}</p>,
                    li: ({children}) => <li style={{ marginBottom: 4, color: '#374151' }}>{children}</li>,
                    ul: ({children}) => <ul style={{ paddingLeft: 18, marginBottom: 10 }}>{children}</ul>,
                  }}
                >
                  {docResult.summary}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', height: 680 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Ask Questions About the Document</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{docResult ? '✓ Document loaded — ask anything' : 'Upload a document first to enable Q&A'}</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {qa.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Try asking</p>
                {examples.map(q => (
                  <button key={q} onClick={() => setQuestion(q)} disabled={!docResult} style={{
                    textAlign: 'left', fontSize: 12, fontWeight: 500, color: docResult ? '#6366f1' : '#94a3b8',
                    background: docResult ? '#f5f3ff' : '#f8fafc',
                    border: `1px solid ${docResult ? '#e0e7ff' : '#f1f5f9'}`,
                    borderRadius: 8, padding: '10px 14px', cursor: docResult ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <MessageSquare size={12} />
                    {q}
                  </button>
                ))}
              </div>
            )}

            {qa.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  fontSize: 13, lineHeight: 1.7,
                  background: msg.role === 'user' ? '#6366f1' : '#f8fafc',
                  color: msg.role === 'user' ? '#fff' : '#374151',
                  border: msg.role === 'ai' ? '1px solid #f1f5f9' : 'none',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {asking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Loader2 size={13} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder={docResult ? "Ask anything about this document..." : "Upload a document first"}
              disabled={!docResult}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: '1.5px solid #e8edf2', fontSize: 13, fontWeight: 500,
                color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif',
                background: docResult ? '#fff' : '#f8fafc', opacity: docResult ? 1 : 0.6
              }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e8edf2'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleAsk}
              disabled={!docResult || asking || !question.trim()}
              style={{
                width: 42, height: 42, borderRadius: 10, border: 'none',
                background: (!docResult || asking || !question.trim()) ? '#e2e8f0' : '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: (!docResult || asking || !question.trim()) ? 'not-allowed' : 'pointer',
                boxShadow: (!docResult || asking || !question.trim()) ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Send size={15} color={(!docResult || asking || !question.trim()) ? '#94a3b8' : '#fff'} />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}