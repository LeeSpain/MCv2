
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { 
  Activity, ShieldCheck, Truck, Users, 
  ArrowRight, Database, Zap, Layout,
  Heart, Terminal, Smartphone, Info, X,
  Cpu, GitMerge, BrainCircuit, ScanLine
} from 'lucide-react';

const SystemArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 p-8 flex justify-between items-center shrink-0 border-b border-slate-800">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
               <Cpu className="w-8 h-8" />
            </div>
            <div>
               <h2 className="text-3xl font-bold text-white tracking-tight">System Intelligence</h2>
               <p className="text-sm text-slate-400 font-medium uppercase tracking-widest mt-1">Autonomous Operations Architecture</p>
            </div>
         </div>
         <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
         
         {/* 1. THE AI LIFECYCLE (Visual Flow) */}
         <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><BrainCircuit className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-slate-900">The Agent Lifecycle</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[80px] -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Step 1 */}
                  <div className="flex flex-col gap-3 group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 01</div>
                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 group-hover:border-purple-300 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-slate-600">
                           <ScanLine className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Continuous Scan</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                           Agents run on cron schedules (e.g., every 5 min). They scan the database state for specific triggers (e.g., <code className="bg-slate-200 px-1 rounded">Stock &lt; 5</code>).
                        </p>
                     </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center text-slate-300">
                     <ArrowRight className="w-6 h-6" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col gap-3 group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 02</div>
                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 group-hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-slate-600">
                           <GitMerge className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Reasoning Engine</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                           The AI evaluates the trigger against business rules. It calculates a <strong>Risk Score</strong> to determine autonomy level.
                        </p>
                     </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center text-slate-300">
                     <ArrowRight className="w-6 h-6" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col gap-3 group">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</div>
                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 group-hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-slate-600">
                           <Zap className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Execution</h4>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px]">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="font-bold text-slate-700">Low Risk:</span> Auto-Fix
                           </div>
                           <div className="flex items-center gap-2 text-[10px]">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="font-bold text-slate-700">High Risk:</span> Draft for Human
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. AI VS HUMAN ROLES */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Users className="w-5 h-5" /></div>
               <h3 className="text-xl font-bold text-slate-900">Symbiotic Operations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* AI Role */}
               <div className="bg-slate-900 text-slate-300 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-8 -mt-8"></div>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Cpu className="w-5 h-5 text-purple-400" /> The Neural Layer (AI)
                  </h4>
                  <p className="text-sm opacity-80 mb-6 leading-relaxed">
                     Handles the high-volume, repetitive, and time-sensitive monitoring tasks that humans often miss.
                  </p>
                  <ul className="space-y-4">
                     {[
                        "24/7 Database Surveillance",
                        "Instant SLA Breach Detection",
                        "Drafting Routine Emails",
                        "Stock Allocation Math",
                        "Generating Daily Reports"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Human Role */}
               <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-8 -mt-8"></div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5 text-blue-600" /> The Strategic Layer (Human)
                  </h4>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                     Focuses on high-value decisions, physical interaction, and empathy-driven care.
                  </p>
                  <ul className="space-y-4">
                     {[
                        "Approving High-Cost Orders",
                        "Physical Installation & Repair",
                        "Patient Care & Empathy",
                        "Exception Handling (Blockers)",
                        "Strategic Relationship Management"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </section>

         {/* 3. TECHNICAL FOUNDATION */}
         <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Layout className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-slate-900">Unified Data Architecture</h3>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                     <h4 className="font-bold text-slate-900 mb-3">Single Source of Truth</h4>
                     <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        Unlike traditional fragmented systems (CRM vs ERP vs WMS), MobileCare uses a <strong>Unified State Machine</strong>. 
                        Every asset, job, and patient exists in a single graph.
                     </p>
                     <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">PostgreSQL</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">Event Sourcing</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">Real-time Websockets</span>
                     </div>
                  </div>
                  <div className="flex-1 w-full">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm font-mono text-[10px] text-slate-500">
                        <div className="flex justify-between border-b border-slate-100 pb-2 mb-2">
                           <span>EVENT_STREAM</span>
                           <span className="text-green-600">● LIVE</span>
                        </div>
                        <div className="space-y-2">
                           <div className="flex gap-2"><span className="text-slate-300">10:00:01</span> <span className="text-blue-600">ORDER_CREATED</span> <span className="text-slate-400">#C123</span></div>
                           <div className="flex gap-2"><span className="text-slate-300">10:00:02</span> <span className="text-purple-600">AI_STOCK_ALLOCATED</span> <span className="text-slate-400">#D555 &rarr; #C123</span></div>
                           <div className="flex gap-2"><span className="text-slate-300">10:00:03</span> <span className="text-purple-600">AI_JOB_CREATED</span> <span className="text-slate-400">Install @ Client</span></div>
                           <div className="flex gap-2"><span className="text-slate-300">14:20:00</span> <span className="text-amber-600">INSTALLER_COMPLETED</span> <span className="text-slate-400">Photo Verified</span></div>
                           <div className="flex gap-2"><span className="text-slate-300">14:20:01</span> <span className="text-green-600">ASSET_ACTIVE</span> <span className="text-slate-400">Billing Started</span></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-slate-200 flex justify-end shrink-0">
         <button 
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
         >
            Back to Simulation
         </button>
      </div>
    </div>
  </div>
);

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const handlePortalEnter = (userId: string, path: string) => {
    // 1. Switch User Role
    store.setUser(userId);
    // 2. Navigate
    navigate(path);
  };

  const portals = [
    {
      title: "Executive View",
      role: "CEO & Board",
      description: "Strategic oversight, financial metrics, and risk index reporting.",
      path: "/ceo-dashboard",
      userId: "u1",
      icon: Activity,
      color: "bg-slate-900 text-white",
      ring: "group-hover:ring-slate-400"
    },
    {
      title: "System Admin",
      role: "Admin & Configuration",
      description: "Full system control, AI agent configuration, and security settings.",
      path: "/dashboard", // Changed from '/' to '/dashboard'
      userId: "u2",
      icon: Terminal,
      color: "bg-slate-800 text-white",
      ring: "group-hover:ring-slate-600"
    },
    {
      title: "Operations Manager",
      role: "Logistics & Stock",
      description: "Logistics command center, exception handling, and stock control.",
      path: "/ops-dashboard",
      userId: "u3",
      icon: Database,
      color: "bg-blue-600 text-white",
      ring: "group-hover:ring-blue-400"
    },
    {
      title: "Care Lead (Desktop)",
      role: "Care Organization",
      description: "Care planning, patient oversight, and new order approvals.",
      path: "/care-dashboard",
      userId: "u4",
      icon: Heart,
      color: "bg-rose-600 text-white",
      ring: "group-hover:ring-rose-400"
    },
    {
      title: "Care Nurse (Mobile)",
      role: "Field Nurse",
      description: "Patient visits, daily tasks, and quick reporting view.",
      path: "/care-dashboard",
      userId: "u5",
      icon: Smartphone, // Indicates Mobile View
      color: "bg-rose-400 text-white",
      ring: "group-hover:ring-rose-300"
    },
    {
      title: "Field Installer (Mobile)",
      role: "Field Technician",
      description: "Route optimization, installation jobs, and photo proof.",
      path: "/installer-dashboard",
      userId: "u6",
      icon: Truck,
      color: "bg-emerald-600 text-white",
      ring: "group-hover:ring-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Modal */}
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white pt-24 pb-48 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-brand-400 mb-6 shadow-lg">
              <Zap className="w-3 h-3" /> MobileCare Ops Platform v2.4
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Orchestrating Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Logistics at Scale.</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Select a persona below to enter their specific dashboard environment.
           </p>
           
           <div className="flex justify-center">
              <button 
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-bold text-white transition-all shadow-lg hover:shadow-brand-500/20"
              >
                <Info className="w-4 h-4 text-brand-400" />
                How the System Works
              </button>
           </div>
        </div>
      </div>

      {/* PORTAL GRID - 6 DASHBOARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((p, i) => (
               <div 
                  key={i}
                  onClick={() => handlePortalEnter(p.userId, p.path)}
                  className={`relative group cursor-pointer bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ring-2 ring-transparent ${p.ring}`}
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${p.color}`}>
                        <p.icon className="w-7 h-7" />
                     </div>
                     <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {p.role}
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 min-h-[40px]">
                     {p.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-bold text-slate-900 group-hover:gap-2 transition-all">
                     Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* FEATURE EXPLANATION */}
      <div className="bg-white py-24 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">System Architecture</h2>
               <p className="text-slate-500 mt-2">How MobileCare integrates the value chain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                     <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Access</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Tailored experiences for every stakeholder: from the Board Room (CEO) to the Warehouse (Ops) to the Patient's Living Room (Nurse/Installer).
                  </p>
               </div>
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Chain of Custody</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Every asset is tracked from Warehouse → Installer → Client → Return. Strict state machine logic prevents "lost" devices and ensures billing accuracy.
                  </p>
               </div>
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                     <Layout className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">AI Orchestration</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Autonomous agents ('Stock Controller', 'Returns Recovery') continuously scan data to detect SLA breaches and flag exceptions.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white">MC</div>
               <span className="font-bold text-white">MobileCare Ops</span>
            </div>
            <div className="text-sm">
               &copy; {new Date().getFullYear()} MobileCare B.V. Internal Operations System.
            </div>
         </div>
      </footer>

    </div>
  );
};
