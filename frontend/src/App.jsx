import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Fraud from "./pages/Fraud";
import Credit from "./pages/Credit";
import Compliance from "./pages/Compliance";
import Risk from "./pages/Risk";
import Documents from "./pages/Documents";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fraud" element={<Fraud />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </BrowserRouter>
  );
}