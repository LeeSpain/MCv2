import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { 
  Activity, ArrowRight, Database, Zap, Heart, Terminal, 
  Smartphone, Truck, Presentation as PresentationIcon, Globe, X, Network, Workflow,
  Info, ChevronLeft, ChevronRight, Play, Pause, Shield, Box, 
  RefreshCw, BarChart3, Users, Cpu, Layout as LayoutIcon, AlertCircle
} from 'lucide-react';

// --- HELPER ICONS & DATA ---
const AlertOctagon = (props: any) => <AlertCircle {...props} />;
const BrainCircuit = (props: any) => <Cpu {...props} />;
const Target = (props: any) => <Activity {...props} />;

const SLIDE_DATA = [
  { id: 1, type: 'title', title: 'MobileCare Intelligent Control', subtitle: 'The Future of Healthcare Logistics', bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000' },
  { id: 2, type: 'content', title: 'The Problem', content: 'Ageing populations create a logistics nightmare. Tracking device custody, SLA performance, and clinical compliance at scale is impossible for humans alone.', icon: AlertOctagon },
  { id: 3, type: 'content', title: 'The Solution: Orchestration', content: 'We don\'t just track inventory; we orchestrate it. A unified ledger governed by specialized AI agents ensuring 100% accountability.', icon: Zap },
  { id: 4, type: 'content', title: 'AI Specialist Agents', content: 'Dedicated logic nodes for Stock control, Logistics, Comms, and Compliance. They work 24/7 while humans handle the exceptions.', icon: Cpu },
  { id: 5, type: 'content', title: 'Persona-Based Environments', content: 'Tailored interfaces for CEOs, Ops Managers, Nurses, and Installers. Data where it matters, when it matters.', icon: LayoutIcon },
  { id: 6, type: 'content', title: 'Market Scale', content: 'Operational in 12 regions, supporting 5,000+ active clinical nodes. Scaling to 50,000 nodes by 2026.', icon: Globe },
  { id: 7, type: 'content', title: 'Circular Asset Recovery', content: 'Our "Returns Recovery" agent has increased asset utilization by 22% by automating the retrieval of dormant devices.', icon: RefreshCw },
  { id: 8, type: 'content', title: 'Intelligent Intake', content: 'AI-assisted clinical assessments map patient needs to equipment manifests in real-time, reducing ordering errors by 90%.', icon: BrainCircuit },
  { id: 9, type: 'content', title: 'Unified Ledger', content: 'Every device movement, every clinical note, and every agent action is logged immutably for total governance.', icon: Database },
  { id: 10, type: 'content', title: 'Field Performance', content: 'Mobile-first field tools allow Installers and Nurses to focus on people, while the platform handles the paperwork.', icon: Smartphone },
  { id: 11, type: 'content', title: 'Revenue Engine', content: 'Logistics efficiency drives 40% higher margins than traditional home-care equipment providers.', icon: BarChart3 },
  { id: 12, type: 'content', title: 'Roadmap 2025', content: 'Predictive maintenance nodes, automated procurement, and expanded European logistics expansion.', icon: Target },
  { id: 13, type: 'thank-you', title: 'Operational Excellence.', subtitle: 'Join the Revolution.', url: 'https://mobilecare.com', bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000' }
];

// --- MODAL COMPONENTS ---

const PresentationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (playing) {
      timer = setInterval(() => {
        if (current < SLIDE_DATA.length - 1) setCurrent(c => c + 1);
        else setPlaying(false);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [playing, current]);

  const slide = SLIDE_DATA[current];
  const Icon = (slide as any).icon || Activity;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans animate-in fade-in duration-300 overflow-hidden">
      <div className="absolute inset-0 z-0">
         {slide.bg ? <img src={slide.bg} className="w-full h-full object-cover opacity-20" alt="" /> : <div className="w-full h-full bg-slate-900" />}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>
      <div className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]">MC</div>
          <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Strategic Briefing</span>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><X className="w-6 h-6" /></button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 text-center">
         {slide.type === 'title' || slide.type === 'thank-you' ? (
            <div className="max-w-4xl animate-in zoom-in-95 duration-500">
               <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic leading-tight">{slide.title}</h2>
               <p className="text-lg md:text-2xl text-brand-400 font-bold uppercase tracking-[0.2em]">{slide.subtitle}</p>
            </div>
         ) : (
            <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-500">
               <div className="w-20 h-20 bg-brand-500/20 border border-brand-500/50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-brand-400 shadow-[0_0_40px_rgba(14,165,233,0.2)]">
                  <Icon className="w-10 h-10" />
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 italic">{slide.title}</h3>
               <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium">{slide.content}</p>
            </div>
         )}
      </div>
      <div className="relative z-10 p-8 md:p-12 flex flex-col items-center">
         <div className="flex items-center gap-8 mb-6">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-10" disabled={current === 0}><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={() => setPlaying(!playing)} className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl transition-all active:scale-90">
               {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button onClick={() => setCurrent(c => Math.min(SLIDE_DATA.length - 1, c + 1))} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-10" disabled={current === SLIDE_DATA.length - 1}><ChevronRight className="w-6 h-6" /></button>
         </div>
         <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${((current + 1) / SLIDE_DATA.length) * 100}%` }} />
         </div>
      </div>
    </div>
  );
};

const ArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
         <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Platform Infrastructure</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">MobileCare Ops V2.4 Stack</p>
         </div>
         <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArchCard icon={Shield} title="Unified Ledger" desc="A single source of truth using an immutable event-stream. Every change in device custody is cryptographically signed." tags={['PostgreSQL', 'Redis']} />
            <ArchCard icon={Cpu} title="Orchestration Layer" desc="Decoupled AI agents running on dedicated nodes with restricted autonomy levels (Observe, Draft, Execute)." tags={['Node.js', 'LLM-Orch']} />
            <ArchCard icon={LayoutIcon} title="Persona Modules" desc="Highly optimized frontend shells that hydrate based on role. Shared UI components with RBAC data binding." tags={['React 18', 'Tailwind']} />
         </div>
         <div className="p-8 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-16 -mt-16" />
            <div className="relative z-10 space-y-4">
               <span className="inline-flex px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-lg text-brand-400 text-[10px] font-black uppercase tracking-widest italic">Technical Strategy</span>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase">Resilient Data Architecture</h3>
               <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                  The system is designed for 99.9% availability using a state-machine pattern for Assets. No device is ever lost in the logic; missing transitions trigger the Compliance Agent automatically.
               </p>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const ArchCard = ({ icon: Icon, title, desc, tags }: any) => (
   <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 mb-5 shadow-sm group-hover:scale-110 transition-transform"><Icon className="w-6 h-6" /></div>
      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3 italic">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">{desc}</p>
      <div className="flex flex-wrap gap-2">{tags.map((t: string) => <span key={t} className="text-[8px] font-black bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">{t}</span>)}</div>
   </div>
);

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
       <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Operational Engine</h2>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Lifecycle of a MobileCare Engagement</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all"><X className="w-5 h-5" /></button>
       </div>
       <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          <ProcessStep num="01" title="Intake & Evaluation" desc="Care Nurses perform digital assessments. AI analyzes keywords to flag clinical risks and suggest an equipment manifest." icon={Users} color="bg-blue-600" />
          <ProcessStep num="02" title="Strategic Allocation" desc="The Stock Controller agent scans the warehouse for matching serial numbers and reserves assets instantly." icon={Box} color="bg-cyan-600" />
          <ProcessStep num="03" title="Deployment Logistics" desc="Field Technicians receive optimized routes. Arrival, demo completion, and photo proof are logged instantly." icon={Truck} color="bg-emerald-600" />
          <ProcessStep num="04" title="Active Monitoring" desc="Status agents periodically ping Care Partners. Dormant devices are automatically flagged for circular recovery." icon={Activity} color="bg-amber-600" />
          <ProcessStep num="05" title="Circular Recovery" desc="Returns Recovery agent generates pickup tasks. Assets are refurbished and moved back to 'IN STOCK' status." icon={RefreshCw} color="bg-rose-600" />
       </div>
    </div>
  </div>
);

const ProcessStep = ({ num, title, desc, icon: Icon, color }: any) => (
   <div className="flex gap-8 group">
      <div className="flex flex-col items-center">
         <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all z-10`}><Icon className="w-7 h-7" /></div>
         <div className="w-0.5 flex-1 bg-slate-100 group-last:hidden" />
      </div>
      <div className="pb-10">
         <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Step {num}</div>
         <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-3 italic group-hover:text-brand-600 transition-colors">{title}</h3>
         <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">{desc}</p>
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
    { title: "Executive View", role: "CEO & BOARD", desc: "Unified strategic command, utilization metrics, and tactical blocker oversight.", path: "/dashboard", userId: "u1", icon: Activity, bg: "bg-slate-900" },
    { title: "System Admin", role: "ADMIN & CONFIGURATION", desc: "Full system control, AI agent configuration, and security settings.", path: "/dashboard", userId: "u2", icon: Terminal, bg: "bg-slate-900" },
    { title: "Operations Manager", role: "LOGISTICS & STOCK", desc: "Logistics command center, exception handling, and stock control.", path: "/ops-dashboard", userId: "u3", icon: Database, bg: "bg-blue-600" },
    { title: "Care Lead (Desktop)", role: "CARE ORGANIZATION", desc: "Care planning, patient oversight, and new order approvals.", path: "/care-dashboard", userId: "u4", icon: Heart, bg: "bg-rose-600" },
    { title: "Care Nurse (Mobile)", role: "FIELD NURSE", desc: "Patient visits, daily tasks, and quick reporting view.", path: "/care-dashboard", userId: "u5", icon: Smartphone, bg: "bg-rose-500" },
    { title: "Field Installer (Mobile)", role: "FIELD TECHNICIAN", desc: "Route optimization, installation jobs, and photo proof.", path: "/installer-dashboard", userId: "u6", icon: Truck, bg: "bg-emerald-600" }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] font-sans selection:bg-brand-500 selection:text-white">
      
      {/* MODAL OVERLAYS */}
      {showInfo && <ArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}
      {showPresentation && <PresentationModal onClose={() => setShowPresentation(false)} />}

      {/* HERO SECTION */}
      <div className="pt-20 pb-20 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e293b]/50 border border-brand-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-8 shadow-2xl backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 fill-current" /> MOBILECARE OPS PLATFORM V2.4
           </div>
           
           <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Orchestrating Healthcare <br/>
              <span className="text-[#2dd4bf]">Logistics at Scale.</span>
           </h1>
           
           <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12">
              Select a persona below to enter their specialized operational environment.
           </p>
           
           <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button 
                 onClick={() => setShowPresentation(true)} 
                 className="flex items-center gap-3 px-8 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                 <PresentationIcon className="w-4 h-4" /> 
                 Presentation
              </button>
              <button 
                 onClick={() => setShowInfo(true)} 
                 className="flex items-center gap-3 px-8 py-3 bg-transparent hover:bg-white/5 border border-slate-700 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                 <Info className="w-4 h-4" /> 
                 Architecture
              </button>
              <button 
                 onClick={() => setShowProcess(true)} 
                 className="flex items-center gap-3 px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                 <Workflow className="w-4 h-4" /> 
                 Operational Process
              </button>
           </div>
        </div>
      </div>

      {/* PORTAL GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portals.map((p, i) => (
              <div 
                key={i} 
                onClick={() => handlePortalEnter(p.userId, p.path)} 
                className="group bg-white rounded-[2rem] p-8 border border-transparent shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col relative"
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${p.bg}`}>
                       <p.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.role}</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{p.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8 flex-1">{p.desc}</p>
                 
                 <div className="flex items-center text-[13px] font-bold text-slate-900 gap-1.5 group-hover:text-brand-600 transition-colors">
                    Enter Dashboard <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
            ))}
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};
