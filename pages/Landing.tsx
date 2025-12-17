import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { 
  Activity, ShieldCheck, Truck, Users, 
  ArrowRight, Database, Zap, Layout,
  Heart, Terminal, Smartphone, Info, X,
  Cpu, GitMerge, BrainCircuit, ScanLine,
  Clock, CheckCircle, AlertTriangle, FileText,
  Workflow, Network, Lock, Server,
  ClipboardList, Box, RefreshCw, Bot,
  Stethoscope, Map, Radio, AlertOctagon, User
} from 'lucide-react';

/* =========================
   SYSTEM ARCHITECTURE MODAL
   ========================= */

const SystemArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">

      <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">System Intelligence</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12">
        {/* content unchanged */}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 text-right">
        <button
          onClick={onClose}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

/* =========================
   PROCESS FLOW MODAL
   ========================= */

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">

      <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">End-to-End Operational Process</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">

        {/* STEP 4 — FIXED JSX */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <h5 className="text-sm font-bold text-white mb-2">Watchdog & SLA Monitor</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuously checks heartbeat. If device goes offline &gt; 24h or battery low,
            auto-creates support ticket for Care Team.
          </p>
        </div>

      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 text-right">
        <button
          onClick={onClose}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Close Process View
        </button>
      </div>
    </div>
  </div>
);

/* =========================
   LANDING PAGE
   ========================= */

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [showProcess, setShowProcess] = useState(false);

  const handlePortalEnter = (userId: string, path: string) => {
    store.setUser(userId);
    navigate(path);
  };

  const portals = [
    {
      title: "Executive View",
      role: "CEO & Board",
      path: "/ceo-dashboard",
      userId: "u1",
      icon: Activity
    },
    {
      title: "Operations Manager",
      role: "Logistics & Stock",
      path: "/ops-dashboard",
      userId: "u3",
      icon: Database
    },
    {
      title: "Care Nurse",
      role: "Field Nurse",
      path: "/care-dashboard",
      userId: "u5",
      icon: Smartphone
    },
    {
      title: "Field Installer",
      role: "Technician",
      path: "/installer-dashboard",
      userId: "u6",
      icon: Truck
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}

      <div className="bg-slate-900 text-white pt-24 pb-48 text-center">
        <h1 className="text-6xl font-extrabold mb-6">
          Orchestrating Healthcare Logistics
        </h1>
        <p className="text-slate-400 mb-10">
          Select a persona to enter their operational environment.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setShowInfo(true)} className="btn">
            <Info className="w-4 h-4" /> How the System Works
          </button>
          <button onClick={() => setShowProcess(true)} className="btn">
            <Workflow className="w-4 h-4" /> How the Process Works
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portals.map((p, i) => (
          <div
            key={i}
            onClick={() => handlePortalEnter(p.userId, p.path)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl"
          >
            <p.icon className="w-8 h-8 mb-4" />
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-sm text-slate-500">{p.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
