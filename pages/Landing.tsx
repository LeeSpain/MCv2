import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { 
  Activity, ShieldCheck, Truck, Users, 
  ArrowRight, Database, Zap, Heart, Terminal, 
  Smartphone, Info, Workflow, Network, CheckCircle, 
  Presentation, Globe, Maximize2, X, Cpu, ScanLine, 
  BrainCircuit, GitMerge, Server, AlertOctagon,
  ChevronLeft, ChevronRight, Play, Pause, MapPin, 
  ClipboardList, RefreshCw, Building2, Stethoscope,
  TrendingUp, ArrowDownRight, ArrowUpRight, Warehouse, Bot,
  Shield, Box, LayoutDashboard, Package
} from 'lucide-react';

// --- SLIDE DATA FOR STRATEGIC PRESENTATION ---
const SLIDE_DATA = [
  { id: 1, type: 'title', title: 'MobileCare Intelligent Control', subtitle: 'The Future of Operational Excellence', bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000' },
  { id: 2, type: 'contents', title: 'CONTENTS', items: ['01 Business Today', '02 Challenge & Decision', '03 Platform Essence', '04 Value Delivered', '05 Closing'], bg: 'https://images.unsplash.com/photo-1614732414444-af9613f3f1a3?auto=format&fit=crop&q=80&w=2000' },
  { id: 3, type: 'section', number: '01', title: 'Business Today', bg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000' },
  { id: 4, type: 'hero-text', title: 'MobileCare Stock Control Platform', subtitle: 'An AI-Driven Control Layer for MobileCare Operations', body: 'Bringing visibility, accountability, and intelligence to MobileCare’s growing device and care operations.', bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000' },
  { id: 5, type: 'business-model', title: 'A Strong Operational Business', items: [
      { label: 'Device & Service Management', desc: 'Manages healthcare devices across multiple clients and partners.', icon: Shield },
      { label: 'Proven & Growing', desc: 'Active expansion demands tighter operational control.', highlight: true, icon: TrendingUp },
      { label: 'Core Operations', desc: 'Stock, installations, returns, and ongoing clinical support.', icon: Zap }
    ], insight: 'The foundation is solid — the challenge is scale and control.', bg: 'https://images.unsplash.com/photo-1518433278981-2244f08e9a69?auto=format&fit=crop&q=80&w=2000' },
  { id: 6, type: 'section', number: '02', title: 'Challenge & Decision', bg: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=2000' },
  { id: 7, type: 'complexity', title: 'Growth Increases Complexity', subtitle: 'Operational friction grows faster than revenue if not actively controlled.', flow: [
      { label: 'Warehouses', icon: Warehouse }, { label: 'Nurses', icon: Stethoscope }, { label: 'Clients', icon: Users }, { label: 'Installers', icon: Truck }
    ], risks: ['Risk', 'Cost', 'Errors', 'Delays'], bg: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&q=80&w=2000' },
  { id: 8, type: 'strategy', title: 'Control the Business Before It Controls Us', subtitle: "MobileCare's strategic response to scaling challenges.", bullet: ['Single control platform instead of adding more staff.', 'Centralize visibility across device lifecycle.', 'Introduce intelligence to support daily decision-making.'], moves: [{ title: 'Defensive Move', desc: 'Reduce operational risk and prevent chaos.' }, { title: 'Offensive Move', desc: 'Enable sustainable, scalable growth.' }], bg: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=2000' },
  { id: 9, type: 'section', number: '03', title: 'Platform Essence', bg: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?auto=format&fit=crop&q=80&w=2000' },
  { id: 10, type: 'platform-orb', title: 'One Platform That Sees Everything', subtitle: 'A single, real-time operational pane connecting every aspect of the business.', principle: "Key Principle: If it's not visible in the platform, it doesn't exist operationally.", bg: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000' },
  { id: 11, type: 'ai-assistant', title: 'AI as an Operational Assistant', does: ['Monitors operations continuously & detects risks early.', 'Highlights overdue devices and missed actions.', 'Suggests next steps to the operations team.'], doesNot: ['Replace people or make clinical decisions.', 'Act without human oversight and control.'], footer: 'AI supports management — it does not override it.', bg: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=2000' },
  { id: 12, type: 'trust', title: 'Built for Trust and Oversight', items: [{ title: 'Human Approval Central', desc: 'Critical decisions always require human sign-off.' }, { title: 'Clear Audit Trails', desc: 'Every action is logged for full transparency.' }, { title: 'Adjustable AI Autonomy', desc: 'Fine-tune the level of AI assistance as needed.' }, { title: 'Global AI Kill Switch', desc: 'An immediate pause button for all AI actions.' }], footer: 'Designed for healthcare standards and regulatory confidence.', bg: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2000' },
  { id: 13, type: 'thank-you', title: 'THANK YOU', url: 'https://mcv2.vercel.app/', bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000' }
];

// --- MODAL COMPONENTS ---

const PresentationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const progressRef = useRef(0);

  const next = () => { setCurrentSlide((prev) => (prev + 1 < SLIDE_DATA.length ? prev + 1 : 0)); setProgress(0); progressRef.current = 0; };
  const prev = () => { setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDE_DATA.length - 1)); setProgress(0); progressRef.current = 0; };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        progressRef.current += (50 / 6000) * 100;
        if (progressRef.current >= 100) next(); else setProgress(progressRef.current);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentSlide]);

  const slide = SLIDE_DATA[currentSlide];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden font-sans">
      {SLIDE_DATA.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${i === currentSlide ? 'opacity-40 scale-105' : 'opacity-0 scale-100'}`} style={{ backgroundImage: `url(${s.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(30%) contrast(120%) brightness(30%)' }} />
      ))}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-10 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-black">MC</div>
          <div><span className="text-white text-sm font-black uppercase">Strategy Phase 2.4</span><span className="text-cyan-300 text-[10px] font-black uppercase tracking-[0.3em] block">Module {currentSlide + 1} / {SLIDE_DATA.length}</span></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 shadow-2xl">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-cyan-300">{isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}</button>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" style={{ width: `${progress}%` }} /></div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>
        </div>
      </div>
      <div className="w-full h-full relative flex items-center justify-center pointer-events-none p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-6xl w-full text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pointer-events-auto">
          {slide.type === 'title' && <div className="space-y-6"><h1 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-none italic">{slide.title}</h1><p className="text-2xl md:text-4xl text-cyan-300 font-black uppercase tracking-widest">{slide.subtitle}</p></div>}
          {slide.type === 'contents' && <div className="text-left space-y-10 border-l-8 border-cyan-400 pl-12"><h2 className="text-5xl font-black text-white uppercase">{slide.title}</h2><div className="space-y-4">{slide.items?.map((item, i) => (<div key={i} className="flex items-center gap-6 text-2xl font-black text-slate-100 uppercase"><span className="text-cyan-400">0{i+1}</span>{item.split(' ').slice(1).join(' ')}</div>))}</div></div>}
          {slide.type === 'section' && <div className="flex flex-col items-center justify-center gap-6"><span className="text-[14rem] font-black text-white leading-none">{slide.number}</span><h2 className="text-6xl md:text-8xl font-black text-cyan-300 tracking-tighter uppercase">{slide.title}</h2></div>}
          {slide.type === 'hero-text' && <div className="space-y-8 max-w-4xl mx-auto"><h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] uppercase border-b-8 border-cyan-300 pb-10">{slide.title}</h2><p className="text-3xl text-cyan-300 font-black uppercase tracking-widest">{slide.subtitle}</p><p className="text-2xl text-slate-200 font-bold leading-relaxed">{slide.body}</p></div>}
          {slide.type === 'business-model' && <div className="space-y-12"><h2 className="text-5xl font-black text-white uppercase">{slide.title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{slide.items?.map((item, i) => (<div key={i} className={`p-8 rounded-[3rem] border backdrop-blur-2xl transition-all duration-700 min-h-[300px] flex flex-col justify-center items-center gap-6 ${item.highlight ? 'bg-cyan-500/90 border-cyan-300 shadow-2xl scale-105' : 'bg-white/5 border-white/10 opacity-70'}`}><item.icon className="w-12 h-12 text-white" /><h4 className="text-2xl font-black uppercase text-white">{item.label}</h4><p className="text-base text-cyan-50 font-bold">{item.desc}</p></div>))}</div></div>}
          {slide.type === 'thank-you' && <div className="space-y-12"><h1 className="text-[12rem] font-black text-white leading-none drop-shadow-2xl">{slide.title}</h1><div className="inline-flex items-center gap-6 px-10 py-5 bg-cyan-300 rounded-full text-3xl font-black text-slate-900 shadow-2xl"><Globe className="w-8 h-8" /> {slide.url}</div></div>}
        </div>
      </div>
      <div className="absolute bottom-10 flex gap-10 items-center z-50">
        <button onClick={prev} className="w-14 h-14 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl"><ChevronLeft className="w-8 h-8" /></button>
        <div className="flex gap-2">{SLIDE_DATA.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'w-2.5 bg-white/20'}`} />))}</div>
        <button onClick={next} className="w-14 h-14 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl"><ChevronRight className="w-8 h-8" /></button>
      </div>
    </div>
  );
};

const SystemArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-white/10">
      <div className="bg-slate-50 p-8 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl"><Network className="w-7 h-7" /></div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">System Intelligence</h2>
               <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest mt-1"><span>Architecture v2.4</span><span className="w-1.5 h-1.5 bg-brand-500 rounded-full" /><span>Node Ecosystem</span></div>
            </div>
         </div>
         <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-16 bg-white no-scrollbar">
         <section className="space-y-10">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4"><Cpu className="w-6 h-6 text-brand-600" /><h3 className="text-xl font-black text-slate-900 uppercase">Autonomous Agent Lifecycle</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { icon: ScanLine, title: 'Continuous Scan', desc: 'Agents monitor live SQL state for SLA anomalies every 400ms cycle.' },
                 { icon: BrainCircuit, title: 'Risk Reasoning', desc: 'Logic Engine evaluates business rules & calculates priority scores.' },
                 { icon: GitMerge, title: 'Decision Fork', desc: 'Low risk actions auto-execute; high risk items escalate to human UI.' },
                 { icon: Zap, title: 'Ledger Commit', desc: 'Actions are signed, executed, and logged to the immutable event store.' }
               ].map((step, idx) => (
                 <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-brand-300 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-5 text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-100"><step.icon className="w-6 h-6" /></div>
                    <h4 className="font-black text-slate-900 text-sm uppercase mb-2 tracking-tighter">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">{step.desc}</p>
                 </div>
               ))}
            </div>
         </section>
      </div>
      <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0"><button onClick={onClose} className="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95">Close Infrastructure View</button></div>
    </div>
  </div>
);

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-white/10">
      <div className="bg-slate-50 p-8 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl"><Workflow className="w-7 h-7" /></div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Operational Lifecycle</h2>
               <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest mt-1"><span>Process Flow v2.4</span><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /><span>Chain of Custody</span></div>
            </div>
         </div>
         <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-10 no-scrollbar">
         <div className="max-w-5xl mx-auto space-y-16 py-10 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -ml-0.5 pointer-events-none"></div>
            {[
              { id: '01', title: 'Intake & Assessment', role: 'Nurse Submission', color: 'blue', desc: 'Clinical evaluation performed at home; AI auditor scans notes for risk indicators.', icon: Stethoscope },
              { id: '02', title: 'Fulfillment & Allocation', role: 'Ops Approval', color: 'indigo', desc: 'System identifies best stock location, reserves serial numbers, and pushes to dispatcher.', icon: Box },
              { id: '03', title: 'Field Installation', role: 'Technician Exec', color: 'emerald', desc: 'Hardware setup, client training, and digital verification via secure photo proof.', icon: Truck },
              { id: '04', title: 'Active Service & Monitor', role: 'System AI Watchdog', color: 'amber', desc: '24/7 connectivity heartbeat; automated tickets if battery low or device offline.', icon: Activity }
            ].map((step, i) => (
              <div key={i} className={`relative flex items-center gap-12 group ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                 <div className="flex-1">
                    <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group-hover:shadow-xl transition-all relative overflow-hidden ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                       <div className={`absolute top-0 ${i % 2 === 0 ? 'right-0' : 'left-0'} w-1.5 h-full bg-${step.color}-600`} />
                       <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{step.title}</h4>
                       <p className="text-sm text-slate-500 font-bold leading-relaxed mb-5">{step.desc}</p>
                       <span className={`inline-flex items-center gap-2 px-4 py-2 bg-${step.color}-50 text-${step.color}-700 rounded-xl text-xs font-black uppercase tracking-widest border border-${step.color}-100`}><step.icon className="w-4 h-4" /> {step.role}</span>
                    </div>
                 </div>
                 <div className="shrink-0 w-12 h-12 rounded-full bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-sm z-10">{step.id}</div>
                 <div className="flex-1" />
              </div>
            ))}
         </div>
      </div>
      <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-center shrink-0"><button onClick={onClose} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-base shadow-2xl active:scale-95 transition-all">Understood Nominal</button></div>
    </div>
  </div>
);

// --- MAIN LANDING PAGE ---

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

  const handlePortalEnter = (userId: string, path: string) => {
    store.setUser(userId);
    navigate(path);
  };

  const portals = [
    { title: "Executive View", role: "CEO & BOARD", desc: "Unified strategic command, utilization metrics, and tactical blocker oversight.", path: "/dashboard", userId: "u1", icon: Activity, accent: "blue" },
    { title: "System Admin", role: "ADMIN & CONFIGURATION", desc: "Full system control, AI agent configuration, and security settings.", path: "/dashboard", userId: "u2", icon: Terminal, accent: "cyan" },
    { title: "Operations Manager", role: "LOGISTICS & STOCK", desc: "Logistics command center, exception handling, and stock control.", path: "/ops-dashboard", userId: "u3", icon: Database, accent: "indigo" },
    { title: "Care Lead (Desktop)", role: "CARE ORGANIZATION", desc: "Care planning, patient oversight, and new order approvals.", path: "/care-dashboard", userId: "u4", icon: Heart, accent: "rose" },
    { title: "Care Nurse (Mobile)", role: "FIELD NURSE", desc: "Optimized mobile HUD for patient visits, daily tasks, and live reporting.", path: "/care-dashboard", userId: "u5", icon: Smartphone, accent: "rose" },
    { title: "Field Installer (Mobile)", role: "FIELD TECHNICIAN", desc: "Rugged mobile HUD for route optimization, installation jobs, and digital proof.", path: "/installer-dashboard", userId: "u6", icon: Truck, accent: "emerald" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      {/* MODAL OVERLAYS */}
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}
      {showPresentation && <PresentationModal onClose={() => setShowPresentation(false)} />}

      {/* HERO SECTION */}
      <div className="pt-20 pb-32 px-6 text-center relative">
        <div className="absolute top-0 right-0 p-40 bg-brand-500 rounded-full blur-[150px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute top-1/4 left-0 p-40 bg-cyan-500 rounded-full blur-[150px] opacity-5 -ml-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-brand-400 mb-8 shadow-lg">
              <Zap className="w-3 h-3 fill-current" /> MOBILECARE OPS TERMINAL V2.4
           </div>
           
           <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-8 max-w-4xl leading-tight">
              Orchestrating Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Logistics at Scale.</span>
           </h1>
           
           <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-12 italic">
              Select a persona below to enter their specialized operational environment.
           </p>
           
           <div className="flex flex-wrap justify-center gap-4 mb-20">
              <button onClick={() => setShowPresentation(true)} className="flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-sm font-bold shadow-xl transition-all active:scale-95"><Presentation className="w-4 h-4" /> Strategic Presentation</button>
              <button onClick={() => setShowInfo(true)} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-full text-sm font-bold shadow-sm transition-all active:scale-95"><Info className="w-4 h-4 text-cyan-400" /> Infrastructure</button>
              <button onClick={() => setShowProcess(true)} className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full text-sm font-bold shadow-lg transition-all active:scale-95"><Workflow className="w-4 h-4 text-brand-600" /> Process Flow</button>
           </div>
        </div>
      </div>

      {/* PORTAL GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-32 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portals.map((p, i) => {
               const colors: Record<string, string> = {
                  blue: "text-blue-400 bg-blue-500/5 border-blue-500/20",
                  cyan: "text-cyan-400 bg-cyan-500/5 border-cyan-500/20",
                  indigo: "text-indigo-400 bg-indigo-500/5 border-indigo-500/20",
                  rose: "text-rose-400 bg-rose-500/5 border-rose-500/20",
                  emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20"
               };

               const accentColor = p.accent;

               return (
                  <div key={i} onClick={() => handlePortalEnter(p.userId, p.path)} className="group relative bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
                     <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-opacity duration-700 group-hover:opacity-40 ${accentColor === 'rose' ? 'bg-rose-500' : accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-brand-500'}`}></div>
                     
                     <div className="relative z-10 flex flex-col h-full">
                       <div className="flex justify-between items-start mb-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border ${colors[p.accent]} group-hover:scale-110 transition-transform duration-500`}>
                             <p.icon className="w-8 h-8" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10 group-hover:text-white transition-colors">{p.role}</span>
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{p.title}</h3>
                       <p className="text-sm text-slate-400 leading-relaxed font-medium mb-10 flex-1">{p.desc}</p>
                       
                       <div className="flex items-center text-xs font-bold text-slate-300 gap-2 group-hover:text-cyan-400 transition-colors">
                          Initialize Node <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                       </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};
