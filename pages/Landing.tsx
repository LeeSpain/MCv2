import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
// Add missing import for Badge
import { Badge } from '../components/ui';
import { 
  Activity, ArrowRight, Database, Heart, Terminal, 
  Smartphone, Truck, Globe, X, Workflow,
  ChevronLeft, ChevronRight, Play, Pause, Shield, Box, 
  RefreshCw, Users, Cpu, Layout as LayoutIcon,
  Sparkles, Layers, GitBranch, CheckCircle2, Clock,
  Radio, Scan, Network, Server, Lock, Eye, Zap,
  Stethoscope, Settings, MapPin,
  Bot, User, Building2, Package,
  AlertTriangle, Bell, FileText, MessageSquare, 
  Power, Gauge, TrendingUp, CheckCircle,
  ShieldCheck, Fingerprint, Award
} from 'lucide-react';

// --- SLIDE DATA FOR PRESENTATION ---
const SLIDE_DATA = [
  { id: 1, type: 'title', title: 'MobileCare', subtitle: 'Intelligent Healthcare Orchestration', accent: 'The Future is Autonomous' },
  { id: 2, type: 'problem', title: 'The Challenge', stats: [
    { value: '2.1B', label: 'People over 60 by 2050' },
    { value: '340%', label: 'Increase in demand' },
    { value: '67%', label: 'Tracking failures' }
  ], content: 'Traditional logistics cannot scale with aging populations. Manual tracking creates blind spots, compliance gaps, and operational chaos.' },
  { id: 3, type: 'solution', title: 'Our Answer', content: 'An AI-orchestrated platform that treats every device as a living entity in a unified ledger — tracked, governed, and optimized in real-time.', features: ['Autonomous AI Agents', 'Real-time Asset Tracking', 'Predictive Logistics'] },
  { id: 4, type: 'agents', title: 'Specialist AI Agents', agents: [
    { name: 'Stock Controller', desc: 'Inventory allocation & optimization', color: '#3b82f6' },
    { name: 'Logistics Orchestrator', desc: 'Route planning & job scheduling', color: '#10b981' },
    { name: 'Returns Recovery', desc: 'Dormant device reclamation', color: '#f59e0b' },
    { name: 'Compliance Monitor', desc: 'SLA tracking & exception handling', color: '#ef4444' }
  ]},
  { id: 5, type: 'metrics', title: 'Impact at Scale', metrics: [
    { value: '12', label: 'Active Regions', icon: Globe },
    { value: '5,000+', label: 'Clinical Nodes', icon: Network },
    { value: '22%', label: 'Asset Recovery Boost', icon: RefreshCw },
    { value: '90%', label: 'Error Reduction', icon: CheckCircle2 }
  ]},
  { id: 6, type: 'closing', title: 'Operational Excellence', subtitle: 'Healthcare logistics, reimagined.', cta: 'Experience the Platform' }
];

// --- PROCESS FLOW DATA ---
const PROCESS_PHASES = [
  {
    id: 'intake',
    name: 'Care Intake',
    color: '#ec4899',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    icon: Stethoscope,
    description: 'Clinical assessment and care planning',
    steps: [
      { id: 1, title: 'Patient Referral', desc: 'Care organization receives new patient referral requiring telecare equipment.', actor: 'human', role: 'Care Company' },
      { id: 2, title: 'Clinical Assessment', desc: 'Field nurse visits patient home, evaluates mobility and specific care needs.', actor: 'human', role: 'Field Nurse' },
      { id: 3, title: 'AI Needs Analysis', desc: 'System analyzes assessment data and recommends optimal equipment manifest.', actor: 'ai', role: 'Intake AI' },
      { id: 4, title: 'Care Plan Approval', desc: 'Lead nurse reviews recommendations and formally activates the plan.', actor: 'human', role: 'Lead Nurse' },
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    icon: Settings,
    description: 'Order processing and stock allocation',
    steps: [
      { id: 5, title: 'Order Submission', desc: 'Equipment order is formally submitted to MobileCare operations.', actor: 'human', role: 'Lead Nurse' },
      { id: 6, title: 'Order Approval', desc: 'Operations manager reviews order for compliance and approves fulfillment.', actor: 'human', role: 'Ops Manager' },
      { id: 7, title: 'Stock Allocation', desc: 'Stock Controller AI automatically reserves specific serial numbers in the ledger.', actor: 'ai', role: 'Stock AI' },
      { id: 8, title: 'Exception Handling', desc: 'AI detects and escalates stock shortages or allocation conflicts.', actor: 'ai', role: 'Compliance AI' },
    ]
  },
  {
    id: 'field',
    name: 'Field Execution',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: Truck,
    description: 'Scheduling, delivery and installation',
    steps: [
      { id: 9, title: 'Job Scheduling', desc: 'Logistics AI optimizes routes and assigns technicians based on capacity.', actor: 'ai', role: 'Logistics AI' },
      { id: 10, title: 'Appointment Confirmation', desc: 'Care company validates appointment details with the patient.', actor: 'human', role: 'Care Company' },
      { id: 11, title: 'Field Installation', desc: 'Technician arrives on-site and captures photo proof of setup.', actor: 'human', role: 'Field Tech' },
      { id: 12, title: 'Device Activation', desc: 'System verifies connectivity and updates device status in real-time.', actor: 'ai', role: 'System' },
    ]
  },
  {
    id: 'monitoring',
    name: 'Active Service',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: Radio,
    description: 'Ongoing monitoring and lifecycle management',
    steps: [
      { id: 13, title: 'Continuous Monitoring', desc: '24/7 AI monitoring of device health and SLA compliance.', actor: 'ai', role: 'Compliance AI' },
      { id: 14, title: 'Exception Alerts', desc: 'AI creates prioritized exception queue for any detected anomalies.', actor: 'ai', role: 'Compliance AI' },
      { id: 15, title: 'Service Changes', desc: 'Care team triggers plan reviews when patient needs evolve.', actor: 'human', role: 'Lead Nurse' },
      { id: 16, title: 'Returns Recovery', desc: 'Returns AI identifies dormant devices and automates collection.', actor: 'ai', role: 'Returns AI' },
    ]
  }
];

// --- AI AGENTS DATA ---
const AI_AGENTS = [
  { 
    category: 'Brain',
    categoryIcon: Cpu,
    categoryColor: '#8b5cf6',
    agents: [
      { name: 'Orchestrator Brain', code: 'ORCHESTRATOR', mode: 'AUTO EXECUTE', desc: 'Master coordinator overseeing all platform activities.', icon: Cpu }
    ]
  },
  { 
    category: 'Inventory',
    categoryIcon: Package,
    categoryColor: '#3b82f6',
    agents: [
      { name: 'Stock Controller', code: 'STOCK_CONTROLLER', mode: 'AUTO EXECUTE', desc: 'Manages levels and allocates equipment to orders.', icon: Database },
      { name: 'Shortage Watch', code: 'STOCK_SHORTAGE_WATCH', mode: 'AUTO EXECUTE', desc: 'Alerts before stockouts occur.', icon: AlertTriangle }
    ]
  },
  { 
    category: 'Logistics',
    categoryIcon: Truck,
    categoryColor: '#10b981',
    agents: [
      { name: 'Logistics AI', code: 'INSTALL_LOGISTICS', mode: 'AUTO EXECUTE', desc: 'Optimizes routes and field schedules.', icon: MapPin },
      { name: 'Returns Recovery', code: 'RETURNS_RECOVERY', mode: 'AUTO EXECUTE', desc: 'Automates dormant device reclamation.', icon: RefreshCw }
    ]
  }
];

// --- MODALS ---

const PresentationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (playing) {
      timer = setInterval(() => {
        if (current < SLIDE_DATA.length - 1) setCurrent(c => c + 1);
        else setPlaying(false);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [playing, current]);

  const slide = SLIDE_DATA[current];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-500 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg">MC</div>
          <span className="text-white/60 font-bold text-xs md:text-sm">Strategic Overview</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4 md:py-8">
        <div key={current} className="w-full max-w-5xl mx-auto">
          {slide.type === 'title' && (
            <div className="text-center space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] md:text-xs font-medium text-cyan-400 tracking-widest uppercase">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> {(slide as any).accent}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight leading-tight">{slide.title}</h1>
              <p className="text-lg md:text-2xl text-white/60 font-light">{slide.subtitle}</p>
            </div>
          )}
          {slide.type === 'problem' && (
            <div className="space-y-6 md:space-y-10">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(slide as any).stats.map((s: any, i: number) => (
                  <div key={i} className="text-center p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl md:text-5xl font-black text-cyan-400 mb-1">{s.value}</div>
                    <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-base md:text-lg text-white/70 text-center max-w-3xl mx-auto">{(slide as any).content}</p>
            </div>
          )}
          {slide.type === 'closing' && (
            <div className="text-center space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight">{slide.title}</h1>
              <p className="text-lg md:text-xl text-white/60 font-light">{slide.subtitle}</p>
              <button onClick={onClose} className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm md:text-base font-bold hover:shadow-lg transition-all">
                {(slide as any).cta} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* Add other slide types as needed with similar responsive logic */}
        </div>
      </div>
      <div className="relative z-10 p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          {SLIDE_DATA.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setPlaying(!playing)} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-white shadow-lg transition-all">{playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</button>
          <button onClick={() => setCurrent(c => Math.min(SLIDE_DATA.length - 1, c + 1))} disabled={current === SLIDE_DATA.length - 1} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

const ArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="flex-none p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Layers className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">System Architecture</h2>
              <p className="text-slate-500 text-xs md:text-sm">Unified Ledger & AI Orchestration</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4"><Database className="w-5 h-5 text-blue-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unified Ledger</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Single source of truth for every device state, custody transfer, and clinical event across the entire network.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4"><Cpu className="w-5 h-5 text-violet-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Orchestration Layer</h3>
              <p className="text-sm text-slate-500 leading-relaxed">A fleet of specialized AI agents that monitor system triggers and execute operational logic with precision.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4"><ShieldCheck className="w-5 h-5 text-emerald-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Governance Guard</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Immutable audit logs and configurable autonomy levels ensure 100% human oversight and compliance.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Platform Integration Flow</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <div className="text-center w-32 md:w-40">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4"><Building2 className="w-8 h-8 md:w-10 md:h-10 text-brand-400" /></div>
                  <div className="text-sm font-bold">Care Partners</div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/20 rotate-90 md:rotate-0" />
                <div className="text-center w-32 md:w-40">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/20"><Cpu className="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
                  <div className="text-sm font-bold">AI Core</div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/20 rotate-90 md:rotate-0" />
                <div className="text-center w-32 md:w-40">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4"><Truck className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" /></div>
                  <div className="text-sm font-bold">Field Execution</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activePhase, setActivePhase] = useState(0);
  const currentPhase = PROCESS_PHASES[activePhase];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="flex-none p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Workflow className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Operational Flow</h2>
              <p className="text-slate-500 text-xs md:text-sm">End-to-End Lifecycle</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-none overflow-x-auto no-scrollbar bg-slate-50 border-b border-slate-100">
          <div className="flex px-4 md:px-6 py-3 min-w-max gap-2 md:gap-4">
            {PROCESS_PHASES.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activePhase === i ? 'bg-white shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
                style={{ color: activePhase === i ? phase.color : undefined }}
              >
                {React.createElement(phase.icon, { className: 'w-4 h-4' })}
                {phase.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 rounded-2xl p-5 md:p-6 border-2" style={{ background: currentPhase.bgColor, borderColor: currentPhase.borderColor }}>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 rounded-lg" style={{ background: `${currentPhase.color}20` }}>
                  {React.createElement(currentPhase.icon, { className: 'w-6 h-6', style: { color: currentPhase.color } })}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{currentPhase.name}</h3>
              </div>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">{currentPhase.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {currentPhase.steps.map((step) => (
                <div key={step.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">{step.id}</span>
                    <Badge color={step.actor === 'ai' ? 'blue' : 'green'}>{step.role}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-none p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <button
            onClick={() => setActivePhase(p => Math.max(0, p - 1))}
            disabled={activePhase === 0}
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
          >
            Previous Phase
          </button>
          <div className="flex gap-1">
            {PROCESS_PHASES.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i === activePhase ? 'bg-brand-500' : 'bg-slate-200'}`} />))}
          </div>
          <button
            onClick={() => setActivePhase(p => Math.min(PROCESS_PHASES.length - 1, p + 1))}
            disabled={activePhase === PROCESS_PHASES.length - 1}
            className="px-4 py-2 rounded-lg text-sm font-bold text-brand-600 hover:bg-white disabled:opacity-30 transition-all"
          >
            Next Phase
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PORTAL CARD ---
const PortalCard: React.FC<{
  portal: { title: string; role: string; desc: string; path: string; userId: string; icon: React.ElementType; color: string; };
  onClick: () => void;
}> = ({ portal, onClick }) => {
  const Icon = portal.icon;
  
  return (
    <div onClick={onClick} className="group bg-white rounded-2xl p-6 border-2 border-slate-100 cursor-pointer transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10 active:scale-[0.98]">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${portal.color}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{portal.role}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{portal.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{portal.desc}</p>
      <div className="flex items-center gap-2 text-sm font-bold text-brand-600 group-hover:gap-3 transition-all">
        <span>Enter Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

// --- LANDING PAGE ---
export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

  const handlePortalEnter = (userId: string, path: string) => { 
    store.setUser(userId); 
    navigate(path); 
  };

  const portals = [
    { title: "Executive Command", role: "CEO & Board", desc: "Strategic oversight with real-time utilization metrics and system-wide performance indicators.", path: "/dashboard", userId: "u1", icon: Activity, color: "bg-slate-800" },
    { title: "System Administration", role: "Admin & Config", desc: "Full platform control including AI agent configuration and autonomy levels.", path: "/dashboard", userId: "u2", icon: Terminal, color: "bg-zinc-800" },
    { title: "Operations Hub", role: "Logistics & Stock", desc: "Command center for inventory allocation and field technician coordination.", path: "/ops-dashboard", userId: "u3", icon: Database, color: "bg-blue-600" },
    { title: "Care Lead Console", role: "Care Organization", desc: "Patient assessments, care plan approvals, and equipment orders.", path: "/care-dashboard", userId: "u4", icon: Heart, color: "bg-rose-600" },
    { title: "Nurse Mobile", role: "Field Nurse", desc: "Mobile interface for patient visits and quick clinical assessments.", path: "/care-dashboard", userId: "u5", icon: Smartphone, color: "bg-pink-600" },
    { title: "Field Technician", role: "Installer", desc: "Job management with installation workflows and proof capture.", path: "/installer-dashboard", userId: "u6", icon: Truck, color: "bg-emerald-600" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-500 selection:text-white">
      {/* Modals */}
      {showArchitecture && <ArchitectureModal onClose={() => setShowArchitecture(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}
      {showPresentation && <PresentationModal onClose={() => setShowPresentation(false)} />}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="relative z-10 h-20 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-brand-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-brand-500/20">MC</div>
            <div>
              <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight">MOBILECARE</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Operations Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Operational</span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 mb-8 animate-in slide-in-from-top-4 duration-500">
              <Zap className="w-4 h-4 text-brand-600" />
              <span className="text-[10px] md:text-xs font-bold text-brand-700 uppercase tracking-widest">v2.4 Intelligent Logistics</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6 animate-in slide-in-from-top-6 duration-700">
              Healthcare Logistics
              <br />
              <span className="text-brand-600">Orchestrated by AI</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in duration-1000">
              Complete equipment accountability. AI agents monitor, orchestrate, and optimize your entire care supply chain.
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <button onClick={() => setShowPresentation(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                <Play className="w-4 h-4" /> Watch Overview
              </button>
              <button onClick={() => setShowArchitecture(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all active:scale-95">
                <Layers className="w-4 h-4" /> Architecture
              </button>
              <button onClick={() => setShowProcess(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all active:scale-95">
                <Workflow className="w-4 h-4" /> Process Flow
              </button>
            </div>
          </div>

          {/* Portal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {portals.map((portal, i) => (
              <PortalCard key={i} portal={portal} onClick={() => handlePortalEnter(portal.userId, portal.path)} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">MC</div>
            MobileCare Ops v2.4
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> GDPR Ready</span>
            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> SOC 2 Certified</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;