import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Sidebar     from './components/layout/Sidebar';
import Dashboard   from './pages/Dashboard';
import Fraud       from './pages/Fraud';
import Credit      from './pages/Credit';
import Compliance  from './pages/Compliance';
import Risk        from './pages/Risk';
import Documents   from './pages/Documents';
import Login       from './pages/Login';
import Reports     from './pages/Reports';
import AML         from './pages/AML';
import LoanMonitor from './pages/LoanMonitor';
import Settings    from './pages/Settings';

function isAuthed() {
  try {
    const raw = localStorage.getItem('vaultiq_auth');
    return raw ? !!JSON.parse(raw).email : false;
  } catch { return false; }
}

function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/fraud"      element={<Fraud />} />
          <Route path="/credit"     element={<Credit />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/risk"       element={<Risk />} />
          <Route path="/documents"  element={<Documents />} />
          <Route path="/reports"    element={<Reports />} />
          <Route path="/aml"        element={<AML />} />
          <Route path="/loans"      element={<LoanMonitor />} />
          <Route path="/settings"   element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute><AppShell /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
