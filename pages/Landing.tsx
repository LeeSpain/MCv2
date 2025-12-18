import React, { useState, useEffect, useRef } from 'react';
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
  Map, MapPin, Radio, AlertOctagon, User, Shield,
  ChevronLeft, ChevronRight, Presentation,
  TrendingUp, Globe, Target, Play, Pause,
  ArrowDownRight, ArrowUpRight, Warehouse, Stethoscope, Building2
} from 'lucide-react';

const SLIDE_DATA = [
  { 
    id: 1, 
    type: 'title', 
    title: 'MobileCare Intelligent Control', 
    subtitle: 'The Future of Operational Excellence',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000' 
  },
  { 
    id: 2, 
    type: 'contents', 
    title: 'CONTENTS', 
    items: ['01 Business Today', '02 Challenge & Decision', '03 Platform Essence', '04 Value Delivered', '05 Closing'],
    bg: 'https://images.unsplash.com/photo-1614732414444-af9613f3f1a3?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 3, 
    type: 'section', 
    number: '01', 
    title: 'Business Today',
    bg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 4, 
    type: 'hero-text', 
    title: 'MobileCare Stock Control Platform', 
    subtitle: 'An AI-Driven Control Layer for MobileCare Operations', 
    body: 'Bringing visibility, accountability, and intelligence to MobileCare’s growing device and care operations.',
    bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 5, 
    type: 'business-model', 
    title: 'A Strong Operational Business', 
    items: [
      { label: 'Device & Service Management', desc: 'Manages healthcare devices and services across multiple clients and care partners.', icon: Shield },
      { label: 'Proven & Growing', desc: 'The business model is proven, active, and expanding, but scaling demands tighter control.', highlight: true, icon: TrendingUp },
      { label: 'Core Operations', desc: 'Includes device stock, installations, returns, care coordination, and ongoing support.', icon: Zap }
    ], 
    insight: 'Board Insight: The foundation is solid — the challenge is scale and control.',
    bg: 'https://images.unsplash.com/photo-1518433278981-2244f08e9a69?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 6, 
    type: 'section', 
    number: '02', 
    title: 'Challenge & Decision',
    bg: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 7, 
    type: 'complexity', 
    title: 'Growth Increases Complexity', 
    subtitle: 'Operational complexity grows faster than revenue if not actively controlled.', 
    flow: [
      { label: 'Warehouses', icon: Warehouse },
      { label: 'Nurses', icon: Stethoscope },
      { label: 'Clients', icon: Users },
      { label: 'Installers', icon: Truck }
    ],
    risks: ['Risk', 'Cost', 'Errors', 'Delays'],
    bg: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 8, 
    type: 'strategy', 
    title: 'Control the Business Before It Controls Us', 
    subtitle: "MobileCare's strategic response to scaling challenges.", 
    bullet: ['Single operational control platform instead of adding more staff.', 'Centralize visibility across the entire device lifecycle.', 'Introduce intelligence to support daily decision-making.'], 
    moves: [{ title: 'Defensive Move', desc: 'Reduce operational risk and prevent chaos.' }, { title: 'Offensive Move', desc: 'Enable sustainable, scalable growth.' }],
    bg: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 9, 
    type: 'section', 
    number: '03', 
    title: 'Platform Essence',
    bg: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 10, 
    type: 'platform-orb', 
    title: 'One Platform That Sees Everything', 
    subtitle: 'A single, real-time operational pane connecting every aspect of the business.', 
    principle: "Key Principle: If it's not visible in the platform, it doesn't exist operationally.",
    bg: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 11, 
    type: 'ai-assistant', 
    title: 'AI as an Operational Assistant', 
    does: ['Monitors operations continuously & detects risks early.', 'Highlights overdue devices and missed actions.', 'Suggests next steps to the operations team.'], 
    doesNot: ['Replace people or make clinical decisions.', 'Act without human oversight and control.'], 
    footer: 'AI supports management — it does not override it.',
    bg: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 12, 
    type: 'trust', 
    title: 'Built for Trust and Oversight', 
    items: [
      { title: 'Human Approval Central', desc: 'Critical decisions always require human sign-off.' }, 
      { title: 'Clear Audit Trails', desc: 'Every action is logged for full transparency.' }, 
      { title: 'Adjustable AI Autonomy', desc: 'Fine-tune the level of AI assistance as needed.' }, 
      { title: 'Global AI Kill Switch', desc: 'An immediate pause button for all AI actions.' }
    ], 
    footer: 'Healthcare standards, accountability, and regulatory confidence.',
    bg: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 13, 
    type: 'section', 
    number: '04', 
    title: 'Value Delivered',
    bg: 'https://images.unsplash.com/photo-1522071823929-09407aa9a56d?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 14, 
    type: 'immediate-value', 
    title: 'Immediate Business Value', 
    operational: ['Full visibility of stock and assets.', 'Fewer lost or idle devices.', 'Faster installations and returns.', 'Clear responsibility at every stage.'], 
    management: ['Daily clarity and measurable performance.', 'Fewer surprises and reduced firefighting.'],
    bg: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 15, 
    type: 'strategic-value', 
    title: 'Strategic Value for the Future', 
    subtitle: 'A Platform, Not Just a Tool', 
    icons: ['Scales with Growth', 'Supports New Services', 'Data-Driven Decisions', 'Defensible Advantage'], 
    footer: 'This platform increases enterprise value, not just efficiency.',
    bg: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 16, 
    type: 'section', 
    number: '05', 
    title: 'Closing',
    bg: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 17, 
    type: 'transformation', 
    title: 'From Operations to Control', 
    body: 'The platform transforms MobileCare from a busy operational company into a controlled, intelligent, and scalable organisation.', 
    points: ['Risk decreases as we scale.', 'Visibility improves across all operations.', 'Decisions get smarter with data-driven insights.'],
    bg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000'
  },
  { 
    id: 18, 
    type: 'thank-you', 
    title: 'THANK YOU', 
    url: 'https://mcv2.vercel.app/',
    bg: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000'
  }
];

const AUTOPLAY_DURATION = 6000;

const PresentationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<number>(0);

  const next = () => {
    setCurrentSlide((prev) => (prev + 1 < SLIDE_DATA.length ? prev + 1 : 0));
    setProgress(0);
    progressRef.current = 0;
  };

  const prev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDE_DATA.length - 1));
    setProgress(0);
    progressRef.current = 0;
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      const interval = 50; 
      const step = (interval / AUTOPLAY_DURATION) * 100;
      
      timerRef.current = setInterval(() => {
        progressRef.current += step;
        if (progressRef.current >= 100) {
          next();
        } else {
          setProgress(progressRef.current);
        }
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
      if (e.key === 'p') togglePlay();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const slide = SLIDE_DATA[currentSlide];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden font-sans">
      
      {/* Cinematic Background Images with Dark Tint to ensure text contrast */}
      {SLIDE_DATA.map((s, i) => (
        <div 
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${i === currentSlide ? 'opacity-40 scale-105' : 'opacity-0 scale-100'}`}
          style={{ 
            backgroundImage: `url(${s.bg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'grayscale(30%) contrast(120%) brightness(30%)'
          }}
        />
      ))}

      {/* Persistent Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>

      {/* Top Bar Navigation */}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-10 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(34,211,238,0.4)]">MC</div>
           <div>
              <span className="text-white text-sm font-black tracking-tight block uppercase">Phase 2.4 Strategy</span>
              <span className="text-cyan-300 text-[10px] font-black uppercase tracking-[0.3em]">Module {currentSlide + 1} / {SLIDE_DATA.length}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 shadow-2xl">
              <button onClick={togglePlay} className="p-1 text-white hover:text-cyan-300 transition-colors">
                 {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-cyan-300 transition-all duration-75 ease-linear shadow-[0_0_10px_#22d3ee]"
                    style={{ width: `${progress}%` }}
                 />
              </div>
           </div>

           <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/10 rounded-full">
             <X className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Main Content Stage with scroll safety for small screens */}
      <div className="w-full h-full relative flex items-center justify-center pointer-events-none px-12 py-16">
        
        <div className="max-w-6xl w-full max-h-full overflow-y-auto no-scrollbar relative z-10 animate-in fade-in slide-in-from-right-12 duration-700 pointer-events-auto flex flex-col justify-center">
          
          {/* TITLE SLIDE */}
          {slide.type === 'title' && (
            <div className="text-center space-y-10 max-w-4xl mx-auto">
               <h1 className="text-[4rem] md:text-[6.5rem] font-black text-white tracking-tighter leading-[0.85] italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                 {slide.title}
               </h1>
               <div className="h-2 w-48 bg-cyan-300 mx-auto rounded-full shadow-[0_0_30px_rgba(34,211,238,0.8)]"></div>
               <p className="text-2xl md:text-4xl text-cyan-300 font-black tracking-[0.2em] uppercase drop-shadow-lg">
                 {slide.subtitle}
               </p>
            </div>
          )}

          {/* CONTENTS SLIDE */}
          {slide.type === 'contents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-10">
                  <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter border-l-8 border-cyan-300 pl-10 uppercase drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <div className="space-y-4">
                    {slide.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-8 group cursor-default">
                         <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-cyan-300 font-black border border-cyan-300/40 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
                            {String(i + 1).padStart(2, '0')}
                         </div>
                         <span className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight drop-shadow-md">{item.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="relative flex justify-center perspective-1000 hidden lg:flex">
                  <div className="w-[28rem] h-[28rem] border-4 border-cyan-300/20 rounded-full animate-spin-slow rotate-x-45 ring-[16px] ring-cyan-300/5"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-64 h-64 bg-cyan-300/30 rounded-full blur-[100px] animate-pulse"></div>
                     <Globe className="w-40 h-40 text-white drop-shadow-[0_0_50px_rgba(34,211,238,0.6)]" strokeWidth={1} />
                  </div>
               </div>
            </div>
          )}

          {/* SECTION DIVIDER */}
          {slide.type === 'section' && (
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
               <div className="relative">
                  <span className="text-[12rem] md:text-[16rem] font-black text-cyan-300/10 italic leading-none select-none">{slide.number}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[12rem] md:text-[16rem] font-black text-white italic leading-none translate-x-6 translate-y-6 drop-shadow-2xl">{slide.number}</span>
                  </div>
               </div>
               <div className="hidden md:block h-64 w-3 bg-cyan-300 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.6)]"></div>
               <h2 className="text-[5rem] md:text-[8rem] font-black text-white tracking-tighter italic leading-none text-center md:text-left drop-shadow-2xl uppercase">{slide.title}</h2>
            </div>
          )}

          {/* HERO TEXT SLIDE */}
          {slide.type === 'hero-text' && (
             <div className="space-y-12 max-w-5xl">
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter border-b-[10px] border-cyan-300 pb-10 inline-block italic uppercase drop-shadow-2xl">
                  {slide.title}
                </h2>
                <h3 className="text-3xl md:text-5xl text-cyan-300 font-black uppercase tracking-[0.1em] drop-shadow-xl">{slide.subtitle}</h3>
                <div className="max-w-4xl text-2xl md:text-3xl text-slate-100 leading-relaxed font-bold italic opacity-90 drop-shadow-lg">
                  {slide.body}
                </div>
             </div>
          )}

          {/* BUSINESS MODEL GRID */}
          {slide.type === 'business-model' && (
             <div className="space-y-10">
                <h2 className="text-4xl md:text-5xl font-black text-white text-center italic tracking-tighter mb-12 uppercase drop-shadow-2xl">{slide.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {slide.items?.map((item, i) => {
                      const Icon = item.icon || Zap;
                      return (
                        <div key={i} className={`p-8 rounded-[3rem] border backdrop-blur-2xl transition-all duration-700 min-h-[300px] flex flex-col justify-center ${item.highlight ? 'bg-cyan-500/90 border-cyan-300 shadow-[0_0_80px_rgba(34,211,238,0.4)] scale-105 z-10' : 'bg-white/5 border-white/10 opacity-70'}`}>
                           <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${item.highlight ? 'bg-white text-cyan-600' : 'bg-cyan-300/20 text-cyan-300'}`}>
                              <Icon className="w-8 h-8" />
                           </div>
                           <h4 className={`text-2xl font-black mb-4 leading-tight italic uppercase tracking-tighter ${item.highlight ? 'text-white' : 'text-slate-100'}`}>{item.label}</h4>
                           <p className={`text-base leading-relaxed font-bold ${item.highlight ? 'text-cyan-50' : 'text-slate-300'}`}>{item.desc}</p>
                        </div>
                      );
                   })}
                </div>
                <div className="mt-12 bg-cyan-300/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border-2 border-cyan-300/30 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                   <p className="text-2xl md:text-3xl font-black text-cyan-300 italic tracking-tight">
                     <span className="text-slate-500 not-italic uppercase text-[10px] block mb-3 tracking-[0.5em] font-black">Strategic Conclusion</span>
                     "{slide.insight}"
                   </p>
                </div>
             </div>
          )}

          {/* COMPLEXITY FLOW */}
          {slide.type === 'complexity' && (
             <div className="text-center space-y-16">
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">{slide.title}</h2>
                <p className="text-2xl md:text-3xl text-cyan-300 font-black max-w-4xl mx-auto uppercase tracking-widest drop-shadow-lg">{slide.subtitle}</p>
                
                <div className="relative flex justify-center items-center gap-12 md:gap-20 py-10">
                   <div className="absolute h-1.5 w-[85%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/50 to-cyan-300/0 z-0"></div>
                   
                   {slide.flow?.map((node, i) => {
                      const Icon = node.icon;
                      return (
                        <div key={i} className="flex flex-col items-center gap-6 relative z-10 shrink-0">
                           <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 rounded-[2.5rem] border-4 border-cyan-300/50 flex items-center justify-center text-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-gradient-to-br from-slate-900 to-black ring-8 ring-white/5">
                              <Icon className="w-12 h-12 md:w-14 md:h-14" />
                           </div>
                           <span className="text-xs md:text-lg font-black text-slate-100 uppercase tracking-[0.4em] drop-shadow-md">{node.label}</span>
                        </div>
                      );
                   })}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                   {slide.risks?.map((risk, i) => (
                      <div key={i} className="bg-red-500/10 border-2 border-red-500/30 py-6 rounded-[2rem] text-red-500 font-black uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-3 text-base">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                         {risk}
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* PLATFORM ORB SLIDE */}
          {slide.type === 'platform-orb' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <h2 className="text-6xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">{slide.title}</h2>
                 <p className="text-2xl md:text-3xl text-cyan-300 font-black uppercase tracking-widest drop-shadow-lg">{slide.subtitle}</p>
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                    <p className="text-2xl text-slate-100 font-black italic">"{slide.principle}"</p>
                 </div>
              </div>
              <div className="relative flex items-center justify-center hidden lg:flex">
                 <div className="w-[32rem] h-[32rem] rounded-full border-2 border-cyan-300/20 flex items-center justify-center relative animate-spin-slow">
                    {[Users, Box, MapPin, ClipboardList, RefreshCw, Building2].map((Icon, idx) => (
                      <div 
                        key={idx} 
                        className="absolute w-16 h-16 bg-slate-900 border-2 border-cyan-300/50 rounded-2xl flex items-center justify-center text-cyan-300 shadow-2xl"
                        style={{ 
                          transform: `rotate(${idx * 60}deg) translate(15.5rem) rotate(-${idx * 60}deg)` 
                        }}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                    ))}
                 </div>
                 <div className="absolute w-48 h-48 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(34,211,238,0.5)] border-4 border-white/20">
                    <span className="text-white text-2xl font-black uppercase tracking-tighter italic">Orchestrator</span>
                 </div>
              </div>
            </div>
          )}

          {/* THANK YOU SLIDE */}
          {slide.type === 'thank-you' && (
            <div className="text-center space-y-16">
               <div className="relative inline-block">
                  <h1 className="text-[10rem] md:text-[14rem] font-black text-white italic tracking-tighter leading-none drop-shadow-[0_20px_60px_rgba(0,0,0,1)]">
                    {slide.title}
                  </h1>
                  <div className="absolute -top-10 -right-10 animate-bounce">
                    <Zap className="w-24 h-24 text-cyan-300 fill-cyan-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
                  </div>
               </div>
               <div className="flex flex-col items-center gap-10">
                  <div className="px-12 py-6 bg-cyan-300 border-4 border-white/20 rounded-full text-3xl md:text-4xl font-black text-slate-900 shadow-[0_20px_50px_rgba(34,211,238,0.4)] flex items-center gap-6 group cursor-pointer hover:scale-110 transition-all duration-500">
                     <Globe className="w-10 h-10" /> {slide.url}
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 font-black uppercase tracking-[0.8em] text-sm pt-8">
                     <div className="w-24 h-0.5 bg-slate-800"></div>
                     <span>MobileCare Operations v2.4</span>
                     <div className="w-24 h-0.5 bg-slate-800"></div>
                  </div>
               </div>
            </div>
          )}

          {/* FALLBACK FOR GENERIC CONTENT SLIDES (Trust, AI Assistant, Strategy etc.) */}
          {!['title', 'contents', 'section', 'hero-text', 'business-model', 'complexity', 'platform-orb', 'thank-you'].includes(slide.type) && (
            <div className="space-y-6 md:space-y-10">
               <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b-4 md:border-b-8 border-cyan-300 pb-4 md:pb-8 gap-4">
                  <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">{slide.title}</h2>
                  {slide.subtitle && <p className="text-lg md:text-2xl text-cyan-300 font-black uppercase tracking-widest italic">{slide.subtitle}</p>}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                  <div className="space-y-6 md:space-y-8">
                    {slide.body && <p className="text-2xl md:text-4xl text-slate-100 leading-tight font-black italic border-l-8 border-cyan-300 pl-10 drop-shadow-lg">{slide.body}</p>}
                    
                    {slide.bullet && (
                      <ul className="space-y-4 md:space-y-6">
                        {slide.bullet.map((b, i) => (
                           <li key={i} className="flex gap-4 md:gap-6 text-lg md:text-2xl text-slate-200 font-bold leading-tight">
                              <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full mt-3 shrink-0 shadow-[0_0_15px_rgba(34,211,238,1)]" /> 
                              {b}
                           </li>
                        ))}
                      </ul>
                    )}

                    {slide.does && (
                       <div className="bg-emerald-300/5 backdrop-blur-2xl p-6 md:p-8 rounded-[3rem] border-2 border-emerald-300/30 shadow-2xl relative overflow-hidden">
                          <h4 className="text-emerald-300 font-black uppercase tracking-[0.5em] mb-4 md:mb-6 flex items-center gap-4 text-xs">
                             <CheckCircle className="w-5 h-5" /> Active Systems
                          </h4>
                          <ul className="space-y-3 md:space-y-4">
                             {slide.does.map((b, i) => <li key={i} className="flex gap-4 text-slate-100 text-base md:text-xl font-black italic tracking-tighter uppercase leading-none"><span className="text-emerald-300">#</span> {b}</li>)}
                          </ul>
                       </div>
                    )}
                  </div>

                  <div className="space-y-6 md:space-y-8">
                     {slide.moves && (
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                           {slide.moves.map((m, i) => (
                             <div key={i} className="p-6 md:p-8 bg-white/5 border-2 border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-default shadow-xl">
                                <h5 className="text-xl md:text-3xl font-black text-cyan-300 mb-2 italic uppercase tracking-tighter drop-shadow-md">{m.title}</h5>
                                <p className="text-slate-300 text-sm md:text-lg font-bold leading-snug drop-shadow-sm">{m.desc}</p>
                             </div>
                           ))}
                        </div>
                     )}

                     {slide.items && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                           {slide.items.map((m, i) => (
                             <div key={i} className="p-4 md:p-5 bg-slate-900/80 border border-white/10 rounded-2xl shadow-lg group hover:border-cyan-300/40 transition-colors">
                                <h5 className="text-sm font-black text-slate-100 mb-1 uppercase tracking-tighter italic text-cyan-300">{m.title}</h5>
                                <p className="text-slate-400 text-[11px] md:text-xs font-bold leading-relaxed">{m.desc}</p>
                             </div>
                           ))}
                        </div>
                     )}

                     {slide.doesNot && (
                       <div className="bg-red-400/5 backdrop-blur-2xl p-6 md:p-8 rounded-[3rem] border-2 border-red-400/30 shadow-2xl relative overflow-hidden">
                          <h4 className="text-red-400 font-black uppercase tracking-[0.5em] mb-4 md:mb-6 flex items-center gap-4 text-xs">
                             <AlertOctagon className="w-5 h-5" /> Hard Guardrails
                          </h4>
                          <ul className="space-y-3 md:space-y-4">
                             {slide.doesNot.map((b, i) => <li key={i} className="flex gap-4 text-slate-100 text-base md:text-xl font-black italic tracking-tighter uppercase leading-none"><span className="text-red-400">×</span> {b}</li>)}
                          </ul>
                       </div>
                    )}

                    {slide.operational && (
                       <div className="space-y-4 md:space-y-6">
                          <div className="bg-cyan-300/10 p-6 rounded-[2.5rem] border border-cyan-300/30 shadow-lg">
                             <h4 className="text-cyan-300 font-black uppercase tracking-widest mb-3 text-[10px] italic">Layer 0: Active Ops</h4>
                             <ul className="space-y-2 md:space-y-3">
                                {slide.operational.map((b, i) => <li key={i} className="flex gap-3 text-slate-100 text-xs md:text-sm font-bold"><CheckCircle className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" /> {b}</li>)}
                             </ul>
                          </div>
                          <div className="bg-slate-300/10 p-6 rounded-[2.5rem] border border-slate-300/30 shadow-lg">
                             <h4 className="text-slate-300 font-black uppercase tracking-widest mb-3 text-[10px] italic">Layer 1: Fleet Management</h4>
                             <ul className="space-y-2 md:space-y-3">
                                {slide.management.map((b, i) => <li key={i} className="flex gap-3 text-slate-300 text-xs md:text-sm font-bold"><CheckCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {b}</li>)}
                             </ul>
                          </div>
                       </div>
                    )}
                  </div>
               </div>
               
               {slide.footer && (
                  <div className="pt-8 md:pt-12 text-center text-2xl md:text-4xl font-black text-white italic opacity-100 drop-shadow-2xl max-w-5xl mx-auto leading-none">
                     <span className="text-cyan-300 block text-[9px] md:text-[10px] not-italic uppercase tracking-[1em] mb-6 md:mb-8 font-black">Strategic Conclusion</span>
                     "{slide.footer}"
                  </div>
               )}
            </div>
          )}

        </div>

      </div>

      {/* Navigation & Status Interface */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center z-50">
         <div className="flex items-center gap-10">
            <button 
              onClick={prev} 
              className="w-16 h-16 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all group shadow-xl"
            >
               <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-3">
               {SLIDE_DATA.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setCurrentSlide(i); setProgress(0); progressRef.current = 0; }}
                    className={`h-2.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-16 bg-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'w-2.5 bg-white/20 hover:bg-white/40'}`} 
                  />
               ))}
            </div>
            <button 
              onClick={next} 
              className="w-16 h-16 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all group shadow-xl"
            >
               <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         <div className="flex flex-col items-end gap-2 text-slate-700 font-mono text-[9px] uppercase tracking-widest">
            <div className="flex items-center gap-6">
               <span>MobileCare_Intelligence_Core</span>
               <span className="h-4 w-px bg-slate-800"></span>
               <span>Confidential_Board_Document</span>
            </div>
            <div className="opacity-40">Ref_ID: MC_PLATFORM_V2.4_FINAL</div>
         </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        .rotate-x-45 {
          transform: perspective(1000px) rotateX(65deg);
        }
        .perspective-1000 {
          perspective: 2000px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const SystemArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
      
      {/* Header */}
      <div className="bg-slate-50 p-6 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
               <Network className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Intelligence</h2>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Architecture v2.4</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Hybrid AI/Human Ops</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-white">
         
         {/* 1. THE AI LIFECYCLE */}
         <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-100"><Cpu className="w-5 h-5" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Autonomous Agent Lifecycle</h3>
                        <p className="text-xs text-slate-500">How the system thinks and acts in 400ms cycles.</p>
                    </div>
                </div>
            </div>
            
            <div className="relative">
               {/* Connector Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Stage 1 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors border border-slate-100">
                        <ScanLine className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">1. Continuous Scan</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Agents scan the live state (SQL) for anomalies like <code>stock &lt; min</code> every cycle without human polling.
                     </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                        <BrainCircuit className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">2. Risk Reasoning</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        The Logic Engine evaluates anomalies against business rules, calculating a <strong>Risk Score (0-100)</strong> to determine safety.
                     </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors border border-slate-100">
                        <GitMerge className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">3. Decision Fork</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        <strong>Low Risk:</strong> Auto-Execute fix. <strong>High Risk:</strong> Halt &amp; Draft a proposal for human review (Human-in-the-Loop).
                     </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-slate-100">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">4. Distributed Action</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Actions committed to the ledger, and dispatched to mobile endpoints for real-world field execution.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. AI VS HUMAN */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"><Users className="w-5 h-5" /></div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Symbiotic Operations Protocol</h3>
                  <p className="text-xs text-slate-500">Separation of concerns for maximum operational efficiency.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               
               <div className="bg-slate-50/50 p-8 border-b md:border-b-0 md:border-r border-slate-200 relative group hover:bg-purple-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Cpu className="w-24 h-24 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-purple-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div> The Neural Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles high-volume tasks where speed and precision are critical.
                  </p>
                  <ul className="space-y-4">
                     {[
                        { label: "SLA Guarding", desc: "Automated tracking of stock vs commitments" },
                        { label: "Math & Logic", desc: "Complex inventory allocation and routing" },
                        { label: "Continuous Audit", desc: "Verifying every chain-of-custody move" },
                        { label: "Draft Generation", desc: "Pre-writing clinical assessment summaries" }
                     ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-xs">
                           <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                           <div>
                              <strong className="text-slate-900">{item.label}</strong>
                              <span className="text-slate-500 block">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="bg-white p-8 relative group hover:bg-blue-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Users className="w-24 h-24 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div> The Human Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles high-context tasks requiring empathy and judgment.
                  </p>
                  <ul className="space-y-4">
                     {[
                        { label: "Clinical Judgement", desc: "Final approval of care plans and products" },
                        { label: "Exception Resolution", desc: "Solving unique blockers flagged by AI" },
                        { label: "Field Excellence", desc: "Face-to-face training and hardware setup" },
                        { label: "Strategic Oversight", desc: "Management of care organization partners" }
                     ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-xs">
                           <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-[10px] font-bold">H</div>
                           <div>
                              <strong className="text-slate-900">{item.label}</strong>
                              <span className="text-slate-500 block">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </section>

         {/* 3. UNIFIED DATA FABRIC */}
         <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><Server className="w-5 h-5" /></div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Unified Data Architecture</h3>
                   <p className="text-xs text-slate-500">Every persona, one source of truth.</p>
                </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none"></div>
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  
                  <div className="flex flex-col gap-4">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <Smartphone className="w-6 h-6 text-cyan-400" />
                        <div>
                           <div className="text-xs font-bold text-white uppercase">Field Apps</div>
                           <div className="text-[10px] text-slate-500 font-mono">Mobile Node</div>
                        </div>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <Terminal className="w-6 h-6 text-purple-400" />
                        <div>
                           <div className="text-xs font-bold text-white uppercase">Orchestrator</div>
                           <div className="text-[10px] text-slate-500 font-mono">Logic Node</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                     <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center animate-pulse">
                        <Database className="w-10 h-10 text-cyan-50" />
                     </div>
                     <div className="mt-4 text-center">
                        <div className="text-sm font-bold text-white tracking-widest uppercase">The Ledger</div>
                        <div className="text-[10px] text-slate-500 font-mono">Immutable Event Store</div>
                     </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 leading-relaxed shadow-inner">
                     <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="text-cyan-400">EVENT_STREAM</span>
                        <span className="text-green-500">CONNECTED</span>
                     </div>
                     <div className="space-y-1">
                        <div className="flex gap-2"><span className="text-slate-600">09:41</span> <span className="text-blue-400">INTAKE_NEW</span> <span className="text-white">#C12</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:41</span> <span className="text-purple-400">AI_RISK_SCORE</span> <span className="text-white">82</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:42</span> <span className="text-green-400">STOCK_LOCK</span> <span className="text-white">#X99</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:43</span> <span className="text-cyan-400">JOB_PUSH</span> <span className="text-white">#BOB</span></div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
         <p className="text-xs text-slate-500 font-medium">Confidential MobileCare Engineering Document • Internal Use Only</p>
         <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95">Close & Resume</button>
      </div>
    </div>
  </div>
);

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
      
      <div className="bg-slate-50 p-6 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
               <Workflow className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">End-to-End Operational Lifecycle</h2>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Standard Operating Procedure</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>AI Safeguards</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
         
         <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-cyan-400" /> Secure Chain of Custody</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                   Every asset move is verified through multiple checkpoints. If a device moves from the warehouse to a client, 
                   the system requires a scan from the Installer and a digital signature from the Care Pro.
                </p>
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Human</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span> AI Oversight</div>
            </div>
         </div>

         <div className="p-12 max-w-5xl mx-auto">
            <div className="relative space-y-16">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-[1px]"></div>

                {/* 1. INTAKE */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-blue-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">1. Intake &amp; Assessment</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Care organization nurse evaluates the patient at home, identifying risks like falls or isolation.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                            <User className="w-3.5 h-3.5" /> Nurse Submission
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-blue-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">01</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-50/30 transition-all">
                         <div className="flex items-start gap-4">
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                            <div>
                               <h5 className="text-sm font-bold text-white mb-2">Auditor Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Instantly scans clinical notes for risk keywords and flags high-priority cases.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. LOGISTICS */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-50/30 transition-all text-right">
                         <div className="flex items-start gap-4 justify-end">
                            <div className="text-right">
                               <h5 className="text-sm font-bold text-white mb-2">Logistics Optimizer</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Reserves stock and validates circular stock availability before fulfillment.
                               </p>
                            </div>
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-slate-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">02</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-slate-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-slate-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">2. Fulfillment &amp; Allocation</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Operations approves the request and system locks specific serial numbers to the patient.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                            <Shield className="w-3.5 h-3.5" /> Ops Approval
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. FIELD */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-emerald-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">3. Field Installation</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Installer sets up hardware, conducts training, and performs photo verification.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                            <Truck className="w-3.5 h-3.5" /> Technician Stop
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-emerald-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">03</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-50/30 transition-all">
                         <div className="flex items-start gap-4">
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                            <div>
                               <h5 className="text-sm font-bold text-white mb-2">Verification Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Pings device API and checks photo GPS metadata to ensure signal is LIVE.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. MONITORING */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-500/30 transition-all text-right">
                         <div className="flex items-start gap-4 justify-end">
                            <div className="text-right">
                               <h5 className="text-sm font-bold text-white mb-2">Watchdog &amp; SLA Monitor</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Continuously checks heartbeat. If device goes offline &gt; 24h or battery low, auto-creates support ticket for Care Team.
                               </p>
                            </div>
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-amber-500 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">04</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-amber-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-amber-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">4. Active Service</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Patient lives safely with 24/7 monitoring while system maintains uptime.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                            <Activity className="w-3.5 h-3.5" /> Live Uptime
                         </div>
                      </div>
                   </div>
                </div>

            </div>
         </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
         <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> All Systems Nominal
         </button>
      </div>
    </div>
  </div>
);

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
    {
      title: "Executive View",
      role: "CEO & Board",
      description: "Unified strategic command, utilization metrics, and tactical blocker oversight.",
      path: "/dashboard",
      userId: "u1",
      icon: Activity,
      color: "bg-slate-900 text-white",
      ring: "group-hover:ring-slate-400"
    },
    {
      title: "System Admin",
      role: "Admin & Configuration",
      description: "Full system control, AI agent configuration, and security settings.",
      path: "/dashboard", 
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
      icon: Smartphone, 
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
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}
      {showPresentation && <PresentationModal onClose={() => setShowPresentation(false)} />}

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white pt-24 pb-48 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-6 shadow-lg">
              <Zap className="w-3 h-3" /> MobileCare Ops Platform v2.4
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Orchestrating Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Logistics at Scale.</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Select a persona below to enter their specialized operational environment.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button 
                onClick={() => setShowPresentation(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-full text-sm font-bold text-white transition-all shadow-xl hover:shadow-cyan-500/40 active:scale-95 group"
              >
                <Presentation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Presentation
              </button>

              <button 
                onClick={() => setShowInfo(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-bold text-white transition-all shadow-xl hover:shadow-brand-500/20 active:scale-95"
              >
                <Info className="w-5 h-5 text-cyan-400" />
                Architecture
              </button>
              
              <button 
                onClick={() => setShowProcess(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full text-sm font-bold transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                <Workflow className="w-5 h-5 text-blue-600" />
                Operational Process
              </button>
           </div>
        </div>
      </div>

      {/* PORTAL GRID */}
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
                     <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white">MC</div>
               <span className="font-bold text-white tracking-tight">MobileCare Operations</span>
            </div>
            <div className="text-xs font-medium">
               &copy; {new Date().getFullYear()} MobileCare B.V. Internal Control Systems.
            </div>
         </div>
      </footer>

    </div>
  );
};