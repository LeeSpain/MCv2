import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { 
  Activity, ArrowRight, Database, Heart, Terminal, 
  Smartphone, Truck, Globe, X, Workflow,
  ChevronLeft, ChevronRight, Play, Pause, Shield, Box, 
  RefreshCw, Users, Cpu, Layout as LayoutIcon,
  Sparkles, Layers, GitBranch, CheckCircle2, Clock,
  Radio, Scan, Network, Server, Lock, Eye, Zap,
  Stethoscope, Settings, MapPin,
  Bot, User, Building2, ArrowDown, Package,
  AlertTriangle, Bell, FileText, MessageSquare, 
  Power, Gauge, TrendingUp, CheckCircle, Search,
  ShieldCheck, Cloud, Fingerprint, Award
} from 'lucide-react';

// --- SLIDE DATA FOR PRESENTATION ---
const SLIDE_DATA = [
  { id: 1, type: 'title', title: 'MobileCare', subtitle: 'Intelligent Healthcare Orchestration', accent: 'The Future is Autonomous' },
  { id: 2, type: 'problem', title: 'The Challenge', stats: [
    { value: '2.1B', label: 'People over 60 by 2050' },
    { value: '340%', label: 'Increase in home care demand' },
    { value: '67%', label: 'Device tracking failures' }
  ], content: 'Traditional logistics cannot scale with aging populations. Manual tracking creates blind spots, compliance gaps, and operational chaos.' },
  { id: 3, type: 'solution', title: 'Our Answer', content: 'An AI-orchestrated platform that treats every device as a living entity in a unified ledger — tracked, governed, and optimized in real-time.', features: ['Autonomous AI Agents', 'Real-time Asset Tracking', 'Predictive Logistics'] },
  { id: 4, type: 'agents', title: 'Specialist AI Agents', agents: [
    { name: 'Stock Controller', desc: 'Inventory allocation & optimization', color: '#3b82f6' },
    { name: 'Logistics Orchestrator', desc: 'Route planning & job scheduling', color: '#10b981' },
    { name: 'Returns Recovery', desc: 'Dormant device reclamation', color: '#f59e0b' },
    { name: 'Compliance Monitor', desc: 'SLA tracking & exception handling', color: '#ef4444' }
  ]},
  { id: 5, type: 'personas', title: 'Role-Based Experiences', personas: [
    { role: 'CEO', desc: 'Strategic metrics & blockers' },
    { role: 'Ops Manager', desc: 'Logistics command center' },
    { role: 'Care Lead', desc: 'Clinical pathway oversight' },
    { role: 'Field Tech', desc: 'Mobile-first job execution' }
  ]},
  { id: 6, type: 'metrics', title: 'Impact at Scale', metrics: [
    { value: '12', label: 'Active Regions', icon: Globe },
    { value: '5,000+', label: 'Clinical Nodes', icon: Network },
    { value: '22%', label: 'Asset Recovery Boost', icon: RefreshCw },
    { value: '90%', label: 'Order Error Reduction', icon: CheckCircle2 }
  ]},
  { id: 7, type: 'tech', title: 'Technology Stack', stack: [
    { layer: 'Frontend', tech: 'React 18 • TypeScript • Tailwind', icon: LayoutIcon },
    { layer: 'Orchestration', tech: 'AI Agents • Event Stream • RBAC', icon: Cpu },
    { layer: 'Data', tech: 'PostgreSQL • Redis • Immutable Logs', icon: Database }
  ]},
  { id: 8, type: 'roadmap', title: '2025 Roadmap', items: [
    { q: 'Q1', item: 'Predictive Maintenance AI' },
    { q: 'Q2', item: 'Automated Procurement' },
    { q: 'Q3', item: 'EU Logistics Expansion' },
    { q: 'Q4', item: 'Voice-Enabled Field Tools' }
  ]},
  { id: 9, type: 'closing', title: 'Operational Excellence', subtitle: 'Healthcare logistics, reimagined.', cta: 'Experience the Platform' }
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
      { id: 1, title: 'Patient Referral', desc: 'Care organization receives new patient referral requiring telecare equipment', actor: 'human', role: 'Care Company' },
      { id: 2, title: 'Clinical Assessment', desc: 'Field nurse visits patient, evaluates mobility, cognitive state, living conditions, and specific care needs', actor: 'human', role: 'Field Nurse' },
      { id: 3, title: 'AI Needs Analysis', desc: 'System analyzes assessment data, identifies risk factors, and recommends equipment manifest with confidence scores', actor: 'ai', role: 'Intake AI' },
      { id: 4, title: 'Care Plan Approval', desc: 'Lead nurse reviews AI recommendations, adjusts product selection if needed, and activates the care plan', actor: 'human', role: 'Lead Nurse' },
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
      { id: 5, title: 'Order Submission', desc: 'Equipment order is submitted to MobileCare operations with full product manifest and delivery requirements', actor: 'human', role: 'Lead Nurse' },
      { id: 6, title: 'Order Approval', desc: 'Operations manager reviews order for compliance, validates care company credentials, and approves for fulfillment', actor: 'human', role: 'Ops Manager' },
      { id: 7, title: 'Stock Allocation', desc: 'Stock Controller AI automatically allocates available inventory from nearest depot, reserving specific serial numbers', actor: 'ai', role: 'Stock Controller AI' },
      { id: 8, title: 'Exception Handling', desc: 'If stock shortages occur, AI creates exceptions and notifies warehouse team for immediate resolution', actor: 'ai', role: 'Compliance AI' },
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
      { id: 9, title: 'Job Scheduling', desc: 'Logistics AI creates installation jobs, optimizes routes, and assigns to field technicians based on location and skills', actor: 'ai', role: 'Logistics AI' },
      { id: 10, title: 'Schedule Confirmation', desc: 'Care company confirms appointment times with patient/family and validates access instructions', actor: 'human', role: 'Care Company' },
      { id: 11, title: 'Field Installation', desc: 'Technician arrives on-site, installs and configures equipment, captures photo proof of installation', actor: 'human', role: 'Field Technician' },
      { id: 12, title: 'Device Activation', desc: 'Equipment is commissioned, connectivity verified, and device status changes to INSTALLED_ACTIVE in the ledger', actor: 'ai', role: 'System' },
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
      { id: 13, title: 'Continuous Monitoring', desc: '24/7 AI monitoring of device health, connectivity status, and SLA compliance across entire fleet', actor: 'ai', role: 'Compliance AI' },
      { id: 14, title: 'Exception Alerts', desc: 'AI detects anomalies (offline devices, SLA breaches, maintenance needs) and creates prioritized exception queue', actor: 'ai', role: 'Compliance AI' },
      { id: 15, title: 'Service Changes', desc: 'When patient needs change or service ends, system triggers care plan review and equipment adjustments', actor: 'human', role: 'Lead Nurse' },
      { id: 16, title: 'Returns Recovery', desc: 'Returns Recovery AI identifies dormant devices, schedules collection jobs, and manages refurbishment pipeline', actor: 'ai', role: 'Returns AI' },
    ]
  }
];

// --- AI AGENTS DATA ---
const AI_AGENTS = [
  { 
    category: 'Brain',
    categoryIcon: Cpu,
    categoryColor: '#8b5cf6',
    categoryDesc: 'Central Intelligence',
    agents: [
      { name: 'Orchestrator Brain', code: 'ORCHESTRATOR', mode: 'AUTO EXECUTE', desc: 'Master coordinator that oversees all agent activities and ensures smooth operations', icon: Cpu }
    ]
  },
  { 
    category: 'Inventory',
    categoryIcon: Package,
    categoryColor: '#3b82f6',
    categoryDesc: 'Stock Management',
    agents: [
      { name: 'Stock Controller', code: 'STOCK_CONTROLLER', mode: 'AUTO EXECUTE', desc: 'Manages inventory levels and allocates equipment to orders', icon: Database },
      { name: 'Auto Allocation', code: 'AUTO_ALLOCATION', mode: 'AUTO EXECUTE', desc: 'Automatically assigns stock and creates installation jobs', icon: GitBranch },
      { name: 'Shortage Watch', code: 'STOCK_SHORTAGE_WATCH', mode: 'AUTO EXECUTE', desc: 'Monitors inventory and alerts before stockouts occur', icon: AlertTriangle }
    ]
  },
  { 
    category: 'Logistics',
    categoryIcon: Truck,
    categoryColor: '#10b981',
    categoryDesc: 'Field Operations',
    agents: [
      { name: 'Install Logistics', code: 'INSTALL_LOGISTICS', mode: 'AUTO EXECUTE', desc: 'Optimizes routes and schedules for field technicians', icon: MapPin },
      { name: 'Confirmation Reminders', code: 'CONFIRMATION_REMINDERS', mode: 'AUTO EXECUTE', desc: 'Automatically follows up on pending confirmations', icon: Bell },
      { name: 'Status Confirmation', code: 'STATUS_CONFIRMATION', mode: 'AUTO EXECUTE', desc: 'Validates and updates job completion status', icon: CheckCircle }
    ]
  },
  { 
    category: 'Recovery',
    categoryIcon: RefreshCw,
    categoryColor: '#f59e0b',
    categoryDesc: 'Asset Reclamation',
    agents: [
      { name: 'Returns Recovery', code: 'RETURNS_RECOVERY', mode: 'AUTO EXECUTE', desc: 'Identifies dormant devices and manages collection workflow', icon: RefreshCw }
    ]
  },
  { 
    category: 'Oversight',
    categoryIcon: Eye,
    categoryColor: '#ef4444',
    categoryDesc: 'Compliance & Reporting',
    agents: [
      { name: 'Compliance Audit', code: 'COMPLIANCE_AUDIT', mode: 'OBSERVE ONLY', desc: 'Monitors SLA compliance and flags policy violations', icon: Shield },
      { name: 'Comms Agent', code: 'COMMS_AGENT', mode: 'AUTO EXECUTE', desc: 'Handles automated communications with stakeholders', icon: MessageSquare },
      { name: 'Reporting Agent', code: 'REPORTING_AGENT', mode: 'AUTO EXECUTE', desc: 'Generates performance reports and analytics', icon: FileText }
    ]
  }
];

// --- PRESENTATION MODAL ---
const PresentationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (playing) {
      timer = setInterval(() => {
        if (current < SLIDE_DATA.length - 1) setCurrent(c => c + 1);
        else setPlaying(false);
      }, 6000);
    }
    return () => clearInterval(timer);
  }, [playing, current]);

  const slide = SLIDE_DATA[current];

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-cyan-400 tracking-widest uppercase">
              <Sparkles className="w-4 h-4" /> {(slide as any).accent}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">{slide.title}</h1>
            <p className="text-xl md:text-2xl text-white/60 font-light">{slide.subtitle}</p>
          </div>
        );
      case 'problem':
        return (
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {(slide as any).stats.map((s: any, i: number) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">{s.value}</div>
                  <div className="text-sm text-white/50 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-lg text-white/70 text-center max-w-3xl mx-auto">{(slide as any).content}</p>
          </div>
        );
      case 'solution':
        return (
          <div className="max-w-4xl mx-auto space-y-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{slide.title}</h2>
            <p className="text-lg md:text-xl text-white/70">{(slide as any).content}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {(slide as any).features.map((f: string, i: number) => (
                <div key={i} className="px-5 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium text-sm">{f}</div>
              ))}
            </div>
          </div>
        );
      case 'agents':
        return (
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              {(slide as any).agents.map((a: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${a.color}20`, border: `1px solid ${a.color}50` }}>
                    <Cpu className="w-6 h-6" style={{ color: a.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{a.name}</h3>
                  <p className="text-white/50 text-sm">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personas':
        return (
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="grid grid-cols-4 gap-4">
              {(slide as any).personas.map((p: any, i: number) => (
                <div key={i} className="text-center p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-3 flex items-center justify-center text-xl font-black text-white/80">{p.role.charAt(0)}</div>
                  <h4 className="text-base font-bold text-white mb-1">{p.role}</h4>
                  <p className="text-xs text-white/40">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="grid grid-cols-4 gap-4">
              {(slide as any).metrics.map((m: any, i: number) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                    <Icon className="w-7 h-7 text-cyan-400 mx-auto mb-3" />
                    <div className="text-3xl font-black text-white mb-1">{m.value}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="space-y-3">
              {(slide as any).stack.map((s: any, i: number) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center"><Icon className="w-6 h-6 text-cyan-400" /></div>
                    <div><h4 className="text-lg font-bold text-white">{s.layer}</h4><p className="text-white/50 text-sm">{s.tech}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'roadmap':
        return (
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">{slide.title}</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500" />
              <div className="space-y-4">
                {(slide as any).items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-5 pl-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-black text-white z-10">{item.q}</div>
                    <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10"><p className="text-white">{item.item}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'closing':
        return (
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">{slide.title}</h1>
            <p className="text-xl text-white/60 font-light">{slide.subtitle}</p>
            <button onClick={onClose} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-lg transition-all">
              {(slide as any).cta} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[150px]" />
      </div>
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg">MC</div>
          <span className="text-white/60 font-bold text-sm">Strategic Overview</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div key={current} className="w-full">{renderSlide()}</div>
      </div>
      <div className="relative z-10 p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {SLIDE_DATA.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setPlaying(!playing)} className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-white shadow-lg transition-all">{playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</button>
          <button onClick={() => setCurrent(c => Math.min(SLIDE_DATA.length - 1, c + 1))} disabled={current === SLIDE_DATA.length - 1} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="text-white/40 text-xs font-medium">{current + 1} / {SLIDE_DATA.length}</div>
      </div>
    </div>
  );
};

// --- ARCHITECTURE MODAL (INVESTOR-FRIENDLY) ---
const ArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const totalAgents = AI_AGENTS.reduce((acc, cat) => acc + cat.agents.length, 0);
  const autoExecuteAgents = AI_AGENTS.reduce((acc, cat) => acc + cat.agents.filter(a => a.mode === 'AUTO EXECUTE').length, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex-none p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">How MobileCare Works</h2>
                <p className="text-slate-500 text-sm">AI-powered healthcare logistics made simple</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700">OPERATIONAL</span>
              </div>
              <div className="hidden md:block px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">v2.4.0</div>
              <button onClick={onClose} className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          
          {/* Section 1: Simple Flow */}
          <div className="p-6 border-b border-slate-100">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">The Simple Picture</h3>
              <p className="text-sm text-slate-500">One platform connecting everyone in the care chain</p>
            </div>
            
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Care Organizations */}
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Building2 className="w-10 h-10 md:w-12 md:h-12 text-rose-500" />
                </div>
                <div className="text-sm font-bold text-slate-900">Care Organizations</div>
                <div className="text-xs text-slate-500">Submit orders</div>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-slate-300" />
                <span className="text-[10px] text-slate-400 mt-1">Orders</span>
              </div>

              {/* MobileCare Platform */}
              <div className="text-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-brand-500/30 relative">
                  <Cpu className="w-14 h-14 md:w-16 md:h-16 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-base font-black text-slate-900">MobileCare</div>
                <div className="text-xs text-slate-500">AI orchestrates everything</div>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-slate-300" />
                <span className="text-[10px] text-slate-400 mt-1">Jobs</span>
              </div>

              {/* Field Teams */}
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Truck className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
                </div>
                <div className="text-sm font-bold text-slate-900">Field Teams</div>
                <div className="text-xs text-slate-500">Install & service</div>
              </div>
            </div>
          </div>

          {/* Section 2: What Makes It Special */}
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">What Makes MobileCare Different</h3>
              <p className="text-sm text-slate-500">Four capabilities that transform healthcare logistics</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Complete Visibility</div>
                <div className="text-xs text-slate-500">Every device tracked 100% of the time</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">AI Automation</div>
                <div className="text-xs text-slate-500">{totalAgents} specialist agents work 24/7</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Smart Workflows</div>
                <div className="text-xs text-slate-500">Right info to right people</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Real-time Intelligence</div>
                <div className="text-xs text-slate-500">Always know what's happening</div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Agent Fleet */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Meet the AI Team</h3>
                <p className="text-sm text-slate-500">{totalAgents} specialist agents that never sleep</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">{autoExecuteAgents} Auto Execute</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">1 Observe Only</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_AGENTS.map((category, catIndex) => {
                const CatIcon = category.categoryIcon;
                const isExpanded = activeCategory === catIndex;
                
                return (
                  <div 
                    key={category.category}
                    className={`rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isExpanded 
                        ? 'bg-white shadow-lg' 
                        : 'bg-white hover:shadow-md'
                    }`}
                    style={{ borderColor: isExpanded ? category.categoryColor : '#e2e8f0' }}
                    onClick={() => setActiveCategory(isExpanded ? null : catIndex)}
                  >
                    {/* Category Header */}
                    <div className="p-4 flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${category.categoryColor}15` }}
                      >
                        <CatIcon className="w-6 h-6" style={{ color: category.categoryColor }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{category.category}</div>
                        <div className="text-xs text-slate-500">{category.agents.length} agent{category.agents.length > 1 ? 's' : ''}</div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>

                    {/* Expanded Agents */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                        {category.agents.map((agent) => {
                          const AgentIcon = agent.icon;
                          return (
                            <div key={agent.code} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <AgentIcon className="w-4 h-4 text-slate-600" />
                                  <span className="text-sm font-bold text-slate-900">{agent.name}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  agent.mode === 'AUTO EXECUTE' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {agent.mode}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{agent.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Safety & Control */}
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Safety & Control</h3>
              <p className="text-sm text-slate-500">You're always in control — AI works within boundaries you set</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* Kill Switch */}
              <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <Power className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Kill Switch</div>
                    <div className="text-xs text-red-600 font-medium">Emergency Control</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">One-click emergency stop. Instantly halts all AI automation if ever needed.</p>
              </div>

              {/* Autonomy Levels */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Autonomy Levels</div>
                    <div className="text-xs text-violet-600 font-medium">Adjustable Control</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">Set each agent to Observe, Draft, or Auto-Execute based on your comfort level.</p>
              </div>

              {/* Audit Trail */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Full Audit Trail</div>
                    <div className="text-xs text-blue-600 font-medium">Complete Transparency</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">Every action logged. Know exactly what happened, when, and why.</p>
              </div>
            </div>
          </div>

          {/* Section 5: Trust & Security */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">Enterprise-Grade Security</h3>
                <p className="text-sm text-white/60">Built for healthcare compliance from day one</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm font-bold">SOC 2 Type II</div>
                  <div className="text-xs text-white/50">Certified</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-bold">GDPR</div>
                  <div className="text-xs text-white/50">Compliant</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Fingerprint className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <div className="text-sm font-bold">AES-256</div>
                  <div className="text-xs text-white/50">Encryption</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-sm font-bold">99.9%</div>
                  <div className="text-xs text-white/50">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PROCESS FLOW MODAL ---
const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activePhase, setActivePhase] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const currentPhase = PROCESS_PHASES[activePhase];
  const totalSteps = PROCESS_PHASES.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = PROCESS_PHASES.slice(0, activePhase).reduce((acc, p) => acc + p.steps.length, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex-none p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Operational Flow</h2>
              <p className="text-slate-500 text-sm">Complete journey from patient referral to AI-monitored care</p>
            </div>
          </div>
          <button onClick={onClose} className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Navigation */}
        <div className="flex-none px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {PROCESS_PHASES.map((phase, i) => {
                const Icon = phase.icon;
                const isActive = activePhase === i;
                const isPast = i < activePhase;
                return (
                  <React.Fragment key={phase.id}>
                    <button
                      onClick={() => { setActivePhase(i); setActiveStep(null); }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-white shadow-md border-2' 
                          : isPast 
                            ? 'bg-white/50 border-2 border-transparent hover:bg-white' 
                            : 'bg-transparent border-2 border-transparent hover:bg-white/50'
                      }`}
                      style={{ borderColor: isActive ? phase.color : 'transparent' }}
                    >
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: isActive || isPast ? `${phase.color}15` : '#f1f5f9' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive || isPast ? phase.color : '#94a3b8' }} />
                      </div>
                      <div className="text-left hidden md:block">
                        <div className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{phase.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{phase.steps.length} Steps</div>
                      </div>
                    </button>
                    {i < PROCESS_PHASES.length - 1 && (
                      <div className="hidden md:flex items-center px-2">
                        <ArrowRight className={`w-4 h-4 ${i < activePhase ? 'text-slate-400' : 'text-slate-200'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Progress</div>
                <div className="text-sm font-bold text-slate-700">{completedSteps + (activeStep !== null ? activeStep + 1 : 0)} / {totalSteps} steps</div>
              </div>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${((completedSteps + (activeStep !== null ? activeStep + 1 : currentPhase.steps.length)) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Phase Header */}
            <div 
              className="rounded-2xl p-6 mb-6"
              style={{ background: currentPhase.bgColor, border: `1px solid ${currentPhase.borderColor}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `${currentPhase.color}20` }}
                  >
                    {React.createElement(currentPhase.icon, { className: 'w-7 h-7', style: { color: currentPhase.color } })}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: currentPhase.color }}>Phase {activePhase + 1} of {PROCESS_PHASES.length}</div>
                    <h3 className="text-2xl font-black text-slate-900">{currentPhase.name}</h3>
                    <p className="text-slate-600 mt-1">{currentPhase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-slate-600">AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600">Human</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPhase.steps.map((step, i) => {
                const isActive = activeStep === i;
                const isAI = step.actor === 'ai';
                
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(isActive ? null : i)}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      isActive ? 'bg-white shadow-lg scale-[1.02]' : 'bg-white hover:shadow-md hover:scale-[1.01]'
                    }`}
                    style={{ borderColor: isActive ? currentPhase.color : '#e2e8f0' }}
                  >
                    <div 
                      className="absolute -top-3 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md"
                      style={{ background: currentPhase.color }}
                    >
                      {step.id}
                    </div>
                    <div className="absolute -top-2 right-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        isAI ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {step.role}
                      </div>
                    </div>
                    <div className="pt-3">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 pr-20">{step.title}</h4>
                      <p className={`text-sm leading-relaxed transition-all duration-300 ${isActive ? 'text-slate-700' : 'text-slate-500 line-clamp-2'}`}>
                        {step.desc}
                      </p>
                      {isActive && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isAI ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                            <span className="text-xs text-slate-500">{isAI ? 'Automated Process' : 'Manual Action Required'}</span>
                          </div>
                          <div className="text-xs font-medium" style={{ color: currentPhase.color }}>
                            Step {i + 1} of {currentPhase.steps.length}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Summary */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 mb-1">AI Orchestration in This Phase</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {activePhase === 0 && "AI analyzes clinical assessment data to identify risk factors and recommend appropriate equipment. Confidence scores help nurses make informed decisions."}
                    {activePhase === 1 && "Stock Controller AI automatically allocates inventory from the nearest depot, while Compliance AI monitors for exceptions and escalates stock shortages immediately."}
                    {activePhase === 2 && "Logistics AI optimizes route planning for field technicians, minimizing travel time while ensuring timely installations. The system automatically tracks device activation."}
                    {activePhase === 3 && "Compliance AI provides 24/7 monitoring of device health and SLA performance. Returns Recovery AI identifies dormant equipment and automates the collection workflow."}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {currentPhase.steps.filter(s => s.actor === 'ai').map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-blue-700 border border-blue-200">
                        {s.role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex-none p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button
            onClick={() => { setActivePhase(Math.max(0, activePhase - 1)); setActiveStep(null); }}
            disabled={activePhase === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Phase
          </button>
          <div className="flex items-center gap-2">
            {PROCESS_PHASES.map((phase, i) => (
              <button
                key={i}
                onClick={() => { setActivePhase(i); setActiveStep(null); }}
                className={`w-3 h-3 rounded-full transition-all ${i === activePhase ? 'scale-125' : 'hover:scale-110'}`}
                style={{ background: i === activePhase ? phase.color : i < activePhase ? `${phase.color}50` : '#cbd5e1' }}
              />
            ))}
          </div>
          <button
            onClick={() => { setActivePhase(Math.min(PROCESS_PHASES.length - 1, activePhase + 1)); setActiveStep(null); }}
            disabled={activePhase === PROCESS_PHASES.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-brand-500 transition-all shadow-sm"
          >
            Next Phase <ChevronRight className="w-4 h-4" />
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
    <div onClick={onClick} className="group bg-white rounded-2xl p-6 border-2 border-slate-100 cursor-pointer transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10">
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

// --- MAIN LANDING PAGE ---
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
    { title: "Executive Command", role: "CEO & Board", desc: "Strategic oversight with real-time utilization metrics, blocker escalation, and system-wide performance indicators for executive decision making.", path: "/dashboard", userId: "u1", icon: Activity, color: "bg-slate-800" },
    { title: "System Administration", role: "Admin & Config", desc: "Full platform control including AI agent configuration, autonomy levels, kill switch management, and security audit controls.", path: "/dashboard", userId: "u2", icon: Terminal, color: "bg-zinc-800" },
    { title: "Operations Hub", role: "Logistics & Stock", desc: "Command center for inventory allocation, exception triage, job scheduling, and end-to-end supply chain orchestration.", path: "/ops-dashboard", userId: "u3", icon: Database, color: "bg-blue-600" },
    { title: "Care Lead Console", role: "Care Organization", desc: "Clinical pathway management including patient assessments, care plan approvals, equipment orders, and compliance monitoring.", path: "/care-dashboard", userId: "u4", icon: Heart, color: "bg-rose-600" },
    { title: "Nurse Mobile", role: "Field Nurse", desc: "Mobile-first interface for patient visits, daily task management, quick assessments, and incident reporting from the field.", path: "/care-dashboard", userId: "u5", icon: Smartphone, color: "bg-pink-600" },
    { title: "Field Technician", role: "Installer", desc: "Route-optimized job management with installation workflows, proof capture, device commissioning, and real-time status updates.", path: "/installer-dashboard", userId: "u6", icon: Truck, color: "bg-emerald-600" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modals */}
      {showArchitecture && <ArchitectureModal onClose={() => setShowArchitecture(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}
      {showPresentation && <PresentationModal onClose={() => setShowPresentation(false)} />}

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] -ml-48 -mb-48" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-brand-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-brand-500/30">MC</div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">MOBILECARE</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 mb-8">
            <Zap className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">AI-Powered Logistics Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Healthcare Logistics
            <br />
            <span className="text-brand-600">Orchestrated by AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every device accountable, 100% of the time. AI agents monitor, orchestrate, and optimize 
            your entire equipment lifecycle — from order to installation to recovery.
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setShowPresentation(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-105">
              <Play className="w-4 h-4" /> Watch Overview
            </button>
            <button onClick={() => setShowArchitecture(true)} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all hover:border-slate-300">
              <Layers className="w-4 h-4" /> Architecture
            </button>
            <button onClick={() => setShowProcess(true)} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all hover:border-slate-300">
              <Workflow className="w-4 h-4" /> Process Flow
            </button>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Select Your Portal</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Each environment is tailored for specific operational roles with relevant data, actions, and workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((portal, i) => (
              <PortalCard key={i} portal={portal} onClick={() => handlePortalEnter(portal.userId, portal.path)} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-xs">MC</div>
            <div>
              <span className="text-sm font-bold text-slate-900">MobileCare</span>
              <span className="text-slate-400 text-sm ml-2">© 2025</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Server className="w-4 h-4" /> v2.4.0</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> SOC 2 Compliant</span>
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> GDPR Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};