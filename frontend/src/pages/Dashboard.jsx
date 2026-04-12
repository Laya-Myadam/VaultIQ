import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MetricCard from "../components/cards/MetricCard";
import AlertCard from "../components/cards/AlertCard";
import FraudChart from "../components/charts/FraudChart";
import CreditChart from "../components/charts/CreditChart";
import ModuleCard from "../components/cards/ModuleCard";

const mockMetrics = {
  fraudBlocked: "$2.4M", fraudChange: "+12% today",
  creditApprovals: "1,847", creditChange: "+8.3% rate",
  complianceFlags: "34", compliancePending: "5 pending review",
  riskScore: "6.2 / 10", riskChange: "+0.4 this week",
};

const mockAlerts = [
  { id: 1, level: "critical", title: "High-value anomaly — Acct #XX4821", desc: "$18.6K transfer · Fraud score 94/100", time: "2m ago" },
  { id: 2, level: "warning", title: "AML pattern — 3 accounts linked", desc: "Circular transactions matching typology T-12", time: "14m ago" },
  { id: 3, level: "info", title: "Credit model drift detected", desc: "Accuracy dropped to 91.2% · Retraining recommended", time: "1h ago" },
];

const mockModules = [
  { name: "Fraud Detection", status: "active", accuracy: 94, stat: "2,341 txns scanned today", icon: "shield" },
  { name: "Credit Scoring", status: "warning", accuracy: 91, stat: "Drift alert triggered", icon: "credit-card" },
  { name: "Compliance RAG", status: "warning", accuracy: 78, stat: "5 unresolved flags", icon: "file-check" },
  { name: "Risk Management", status: "active", accuracy: 62, stat: "3 stress tests run today", icon: "activity" },
];

const card = {
  background: '#fff', borderRadius: 14, padding: '20px',
  border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.04)'
};

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f6f9', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>Overview</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 400 }}>Today · Live updates every second</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <MetricCard label="Fraud Blocked" value={mockMetrics.fraudBlocked} change={mockMetrics.fraudChange} changeType="danger" />
            <MetricCard label="Credit Approvals" value={mockMetrics.creditApprovals} change={mockMetrics.creditChange} changeType="success" />
            <MetricCard label="Compliance Flags" value={mockMetrics.complianceFlags} change={mockMetrics.compliancePending} changeType="warning" />
            <MetricCard label="Portfolio Risk" value={mockMetrics.riskScore} change={mockMetrics.riskChange} changeType="warning" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div style={card}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Fraud by Category</p>
              <FraudChart />
            </div>
            <div style={card}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Credit Decisions</p>
              <CreditChart />
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Live Alerts</p>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', cursor: 'pointer' }}>View all</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockAlerts.map(a => <AlertCard key={a.id} alert={a} />)}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>AI Modules</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {mockModules.map(m => <ModuleCard key={m.name} module={m} />)}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}