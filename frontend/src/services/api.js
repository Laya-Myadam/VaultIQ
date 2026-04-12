const BASE = import.meta.env.VITE_API_URL;

export const api = {
  fraud: {
    analyze: (data) => fetch(`${BASE}/fraud/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  },

  credit: {
    evaluate: (data) => fetch(`${BASE}/credit/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  },

  compliance: {
    query: (question) => fetch(`${BASE}/compliance/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    }).then(r => r.json()),

    checkTransaction: (data) => fetch(`${BASE}/compliance/check-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  },

  risk: {
    analyze: (data) => fetch(`${BASE}/risk/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  },

  docs: {
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${BASE}/docs/upload`, { method: "POST", body: form }).then(r => r.json());
  },
  ask: (doc_id, question) => {
    return fetch(`${BASE}/docs/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc_id, question })
    }).then(r => r.json());
  }
},

  health: () => fetch(`${BASE}/health`).then(r => r.json()),
};