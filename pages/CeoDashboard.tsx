import React, { useState, useEffect, useRef } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Maximize2, X, Activity,
  ShieldCheck, Terminal,
  Database, FileText, ChevronRight, Box, Radio, Zap,
  Users, AlertOctagon, CheckCircle, Clock, Map,
  Target, Globe, Shield, User, ClipboardList,
  Cpu, HardDrive, Network, Lock, Eye, 
  ArrowRight, RefreshCw, BarChart3, Fingerprint,
  Waves
} from 'lucide-react';
import { DeviceStatus, AgentStatus } from '../types';

// --- HELPER: Report Generator ---
const generateReportHtml = (metrics: any, reportDate: string, generatedTime: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MobileCare Executive Summary - ${reportDate}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 0; }
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.02); font-weight: 800; pointer-events: none; z-index: 0; white-space: nowrap; }
        </style>
      </head>
      <body class="bg-white text-slate-900 p-12">
        <div class="watermark">CONFIDENTIAL</div>
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-12">
            <div>
              <h1 class="text-4xl font-extrabold tracking-tighter uppercase italic">Board Report</h1>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Operational Performance & Risk Ledger</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">${reportDate}</div>
              <p class="text-xs text-slate-400 font-mono">ID: MC-EX-${generatedTime.replace(/:/g, '')}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-12 mb-16">
            <div>
               <p class="text-xs font-bold text-slate-400 uppercase mb-2">Fleet Health</p>
               <p class="text-4xl font-extrabold text-slate-900">${metrics.accountabilityScore}%</p>
               <p class="text-xs text-slate-500 mt-1">Custodian Verified</p>
            </div>
            <div>
               <p class="text-xs font-bold text-slate-400 uppercase mb-2">Fleet Scale</p>
               <p class="text-4xl font-extrabold text-slate-900">${metrics.totalAssets}</p>
               <p class="text-xs text-slate-500 mt-1">Units Managed</p>
            </div>
            <div>
               <p class="text-xs font-bold text-slate-400 uppercase mb-2">Strategic Risk</p>
               <p class="text-4xl font-extrabold ${metrics.criticalIssues > 0 ? 'text-red-600' : 'text-slate-900'}">${metrics.criticalIssues}</p>
               <p class="text-xs text-slate-500 mt-1">Unresolved Blockers</p>
            </div>
          </div>

          <div class="bg-slate-50 p-8 rounded-2xl mb-12 border border-slate-200">
             <h2 class="text-lg font-bold mb-4 uppercase tracking-wider">Executive Synthesis</h2>
             <p class="text-slate-700 leading-relaxed">
                System AI has completed 12,402 state scans in the last 24 hours. Inventory utilization sits at <strong>${metrics.utilizationRate}%</strong>. 
                Circular stock recovery protocols have returned 14% more assets to the 'IN_STOCK' state vs previous week. 
                Governance compliance remains at 100% with all autonomous actions logged to the unified ledger.
             </p>
          </div>

          <div class="border-t border-slate-100 pt-8 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             <span>MobileCare B.V.</span>
             <span>Strictly Internal Use</span>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const CeoDashboard: React.FC = () => {
  const { devices, exceptions, clients, agents, agentRunLogs } = useStore();
  const navigate = useNavigate();
  const [showLiveView, setShowLiveView] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // --- KPI CALCULATIONS ---
  const totalAssets = devices.length;
  const activeAssets = devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE).length;
  const utilizationRate = totalAssets > 0 ? (activeAssets / totalAssets) * 100 : 0;
  const criticalExceptions = exceptions.filter(e => e.status !== 'RESOLVED' && (e.severity === 'BLOCKER' || e.severity === 'INCIDENT'));
  const partnerCount = Array.from(new Set(clients.map(c => c.care_company_name))).length;

  const reportMetrics = {
      totalAssets,
      activeAssets,
      utilizationRate: utilizationRate.toFixed(1),
      accountabilityScore: 99.8,
      criticalIssues: criticalExceptions.length,
      stockCount: devices.filter(d => d.status === 'IN_STOCK').length,
      partnerCount,
      agentCount: agents.filter(a => a.status === AgentStatus.ENABLED).length
  };

  const KPICard = ({ label, value, sub, trend, positive, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-brand-300 transition-all hover:shadow-lg group">
       <div className="flex justify-between items-start">
          <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
             <span className={`text-[10px] font-extrabold flex items-center px-2 py-0.5 rounded-full ${positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {positive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {trend}%
             </span>
          )}
       </div>
       <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{label}</div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">{sub}</div>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. COMMAND HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-8 gap-4">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-2 bg-brand-50 px-2 py-0.5 rounded-full w-fit">
             <Shield className="w-3 h-3" /> Unified Executive Console
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter flex items-center gap-3 italic">
              Strategic Dashboard
           </h1>
           <p className="text-slate-500 mt-1 font-medium">Real-time ecosystem intelligence for Board Oversight.</p>
        </div>
        <div className="flex gap-4">
           <button 
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
           >
              <FileText className="w-4 h-4" /> Board Report
           </button>
           <button 
              onClick={() => setShowLiveView(true)}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
           >
              <Maximize2 className="w-4 h-4" /> Live Command
           </button>
        </div>
      </div>

      {/* 2. VITAL SIGNS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard label="Asset Fleet Health" value={totalAssets} sub={`${activeAssets} revenue generating`} trend="2.4" positive icon={Box} />
         <KPICard label="Active Utilization" value={`${utilizationRate.toFixed(1)}%`} sub="Fleet capacity occupied" trend="0.8" positive icon={Target} />
         <KPICard label="Strategic Friction" value={criticalExceptions.length} sub="Pending blocker items" positive={criticalExceptions.length === 0} icon={AlertOctagon} />
         <KPICard label="Network Reach" value={partnerCount} sub="Partner Care Organizations" trend="1" positive icon={Globe} />
      </div>

      {/* 3. CORE INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT: STRATEGIC BLOCKERS */}
         <div className="lg:col-span-2 space-y-8">
            <Card title="Operational Friction (Action Required)" noPadding className="border-t-4 border-t-red-600 shadow-lg overflow-hidden">
               {criticalExceptions.length === 0 ? (
                  <div className="p-20 text-center bg-green-50/20">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle className="w-10 h-10" />
                     </div>
                     <p className="font-extrabold text-slate-800 text-xl">System Optimal</p>
                     <p className="text-slate-500 mt-2">AI Agents are autonomously mitigating all standard drift.</p>
                  </div>
               ) : (
                  <div className="divide-y divide-slate-100">
                     {criticalExceptions.map(ex => (
                        <div key={ex.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate('/exceptions')}>
                           <div className="flex items-start gap-5">
                              <div className="mt-1 p-3 bg-red-100 rounded-2xl text-red-600 shadow-sm">
                                 <AlertOctagon className="w-6 h-6" />
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-extrabold text-slate-900 group-hover:text-red-700 transition-colors">{ex.title}</h4>
                                    <Badge color="red">{ex.severity}</Badge>
                                 </div>
                                 <p className="text-sm text-slate-500 line-clamp-1">{ex.description}</p>
                                 <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Box className="w-3 h-3" /> Ref: {ex.related_entity_id}</span>
                                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Owner: {ex.human_owner_role}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:text-red-500 transition-all">
                              <ChevronRight className="w-6 h-6" />
                           </div>
                        </div>
                     ))}
                     <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                        <button onClick={() => navigate('/exceptions')} className="text-xs font-extrabold text-slate-500 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors">View All Exceptions Queue</button>
                     </div>
                  </div>
               )}
            </Card>

            <Card title="Utilization & Scale Trend (2024)">
               <div className="h-72 flex items-end justify-between px-6 gap-6">
                  {[45, 52, 58, 62, 75, 82].map((h, i) => (
                     <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                        <div className="text-center text-[10px] font-extrabold text-brand-600 opacity-0 group-hover:opacity-100 mb-2 transition-all transform group-hover:-translate-y-1">{h}%</div>
                        <div style={{ height: `${h}%` }} className="bg-slate-900 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all group-hover:bg-brand-600 shadow-[0_10px_30px_rgba(15,23,42,0.1)] group-hover:shadow-brand-200" />
                        <div className="text-center text-[10px] text-slate-400 mt-3 border-t border-slate-200 pt-2 uppercase font-extrabold tracking-widest">{['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* RIGHT: SYSTEM PULSE & AI AGENCY */}
         <div className="space-y-8">
            <Card className="bg-slate-900 text-white border-slate-800 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform rotate-12"><Activity className="w-48 h-48" /></div>
               <div className="relative z-10 p-6 space-y-8">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-brand-500/10 rounded-2xl border border-brand-500/30 shadow-[0_0_20px_rgba(14,165,233,0.2)] animate-pulse"><Zap className="w-8 h-8 text-brand-400" /></div>
                     <div>
                        <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">AI Orchestrator Pulse</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter">NOMINAL_100%</div>
                     </div>
                  </div>
                  
                  <div className="space-y-4 border-y border-white/5 py-6">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-slate-400">Cycles (24h)</span><span className="font-mono text-brand-300">12,402</span></div>
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-slate-400">Auto-Mitigations</span><span className="font-mono text-green-400">45 Active</span></div>
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-slate-400">Stock Efficiency</span><span className="font-mono text-blue-400">+14% WoW</span></div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic opacity-80">
                     "Neural orchestration is currently prioritizing high-risk intake validation. No high-autonomy drift detected in the last sequence."
                  </p>
                  
                  <button 
                    onClick={() => navigate('/settings/agents')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Configure Logic Nodes <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </Card>

            <Card title="Governance Center">
               <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Directory', icon: Users, path: '/clients' },
                    { label: 'Asset Log', icon: Database, path: '/assets' },
                    { label: 'Schedule', icon: Map, path: '/jobs' },
                    { label: 'Orders', icon: ClipboardList, path: '/cases' }
                  ].map(link => (
                    <button 
                       key={link.label}
                       onClick={() => navigate(link.path)}
                       className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-brand-400 hover:shadow-md transition-all text-left group"
                    >
                       <link.icon className="w-5 h-5 text-slate-400 mb-2 group-hover:text-brand-600 transition-colors" />
                       <span className="text-xs font-extrabold text-slate-900 block">{link.label}</span>
                    </button>
                  ))}
               </div>
            </Card>

            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex gap-4">
               <div className="shrink-0 p-2 bg-white rounded-lg"><ShieldCheck className="w-6 h-6 text-slate-900" /></div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Governance Policy 4.1</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-bold">
                     AI Agent actions are logged immutably. High-autonomy cycles are disabled for financial transactions &gt; €500.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* RENDER MODALS */}
      {showLiveView && (
         <LiveCommandModal 
            criticalIssues={criticalExceptions.length} 
            activeAssets={activeAssets} 
            agentRunLogs={agentRunLogs} 
            agents={agents}
            onClose={() => setShowLiveView(false)} 
         />
      )}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} metrics={reportMetrics} />
    </div>
  );
};

// --- MODAL SUB-COMPONENTS ---

/**
 * UPGRADED LIVE COMMAND MONITOR
 * High-fidelity Dutch Operational Dashboard
 */
const LiveCommandModal = ({ criticalIssues, activeAssets, agentRunLogs, agents, onClose }: any) => {
    const [scannedItems, setScannedItems] = useState(12402);
    const [systemLoad, setSystemLoad] = useState(12);
    const [networkLat, setNetworkLat] = useState(14);
    
    // Simulate live data jitter
    useEffect(() => {
        const interval = setInterval(() => {
            setScannedItems(prev => prev + Math.floor(Math.random() * 3));
            setSystemLoad(prev => Math.max(8, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
            setNetworkLat(prev => Math.max(10, Math.min(18, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#05070a] text-slate-300 font-sans flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* HUD HEADER */}
            <header className="flex-none h-20 border-b border-brand-500/20 bg-slate-900/60 backdrop-blur-xl flex justify-between items-center px-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-brand-500/10 rounded-xl border border-brand-500/30 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-brand-500 animate-pulse" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full animate-ping"></div>
                        </div>
                        <div>
                           <h1 className="text-lg font-black tracking-[0.25em] text-white uppercase italic">Ops_Command // Live_Monitor</h1>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System: Stable</span>
                               <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date().toLocaleTimeString()}</span>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-12 border-x border-white/5 px-12">
                        <div className="text-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Load</div>
                           <div className="text-xl font-mono font-bold text-white leading-none">{systemLoad}%</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</div>
                           <div className="text-xl font-mono font-bold text-brand-400 leading-none">{networkLat.toFixed(1)}ms</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Scans</div>
                           <div className="text-xl font-mono font-bold text-emerald-400 leading-none">{scannedItems.toLocaleString()}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10 rounded-2xl group">
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </header>

            {/* MAIN OPERATIONAL GRID */}
            <main className="flex-1 p-8 grid grid-cols-12 grid-rows-6 gap-6">
                
                {/* 1. GEOSPATIAL TOPOLOGY (Dutch Centers) */}
                <div className="col-span-12 lg:col-span-5 row-span-4 bg-slate-900/40 rounded-3xl border border-white/5 p-8 relative group">
                    <div className="absolute top-6 left-8 z-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                            <Globe className="w-3 h-3 text-brand-500" /> Regional_Network_State
                        </h3>
                    </div>
                    {/* Simulated Map Visual */}
                    <div className="w-full h-full flex items-center justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                         <svg viewBox="0 0 400 400" className="w-full h-full max-h-[350px]">
                            {/* Simple stylized NL outline */}
                            <path d="M150,50 L250,30 L320,80 L350,150 L320,320 L150,350 L80,320 L50,150 L100,80 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-500/20" />
                            {/* Scanning line animation */}
                            <rect width="400" height="2" fill="url(#grad-scan)" className="animate-scan" />
                            <defs>
                                <linearGradient id="grad-scan" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            {/* Nodes */}
                            <circle cx="200" cy="180" r="4" className="fill-brand-500 animate-pulse" /> {/* Amsterdam */}
                            <circle cx="180" cy="220" r="3" className="fill-brand-500/40" /> {/* Rotterdam */}
                            <circle cx="230" cy="240" r="3" className="fill-brand-500/40" /> {/* Utrecht */}
                            <circle cx="270" cy="300" r="3" className="fill-brand-500/40" /> {/* Eindhoven */}
                            <text x="210" y="185" className="text-[8px] fill-slate-400 font-mono">HQ_AMS</text>
                         </svg>
                    </div>
                    <div className="absolute bottom-6 right-8 text-right font-mono text-[9px] text-slate-500">
                        <div className="mb-1">NODES: 1,402 ACTIVE</div>
                        <div>SIGNAL: 100% NOMINAL</div>
                    </div>
                </div>

                {/* 2. LOG STREAM (Real-time events) */}
                <div className="col-span-12 lg:col-span-7 row-span-4 bg-black rounded-3xl border border-white/5 flex flex-col shadow-2xl overflow-hidden">
                    <div className="flex-none h-12 bg-white/5 border-b border-white/5 px-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <Terminal className="w-4 h-4 text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">Central_Orchestration_Ledger</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-green-500 rounded-full" /><span className="text-[9px] font-bold text-slate-500">AUTO_COMMIT</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" /><span className="text-[9px] font-bold text-slate-500">HUMAN_REVIEW</span></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] custom-scrollbar space-y-2 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                        {agentRunLogs.map((log: any, idx: number) => (
                            <div key={log.id} className={`flex gap-4 p-2.5 rounded-lg border border-transparent hover:bg-white/5 transition-all group animate-in slide-in-from-left duration-300 delay-${idx * 50}`}>
                                <span className="text-slate-600 shrink-0">[{new Date(log.finished_at).toLocaleTimeString()}]</span>
                                <span className="text-brand-500 font-black shrink-0 tracking-tighter">AGNT_{log.agent_id.split('-').pop()?.toUpperCase()}</span>
                                <span className="text-slate-400 flex-1">{log.plan.actions[0]?.summary || 'Cycle scanning global state...'}</span>
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter ${
                                    log.applied_actions[0]?.status === 'APPLIED' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                                }`}>
                                    {log.applied_actions[0]?.status || 'IDLE'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. AGENT STATUS GRID */}
                <div className="col-span-12 lg:col-span-9 row-span-2 bg-slate-900/20 rounded-3xl border border-white/5 p-6 flex gap-6 overflow-x-auto no-scrollbar items-center">
                    {agents.map((agent: any) => (
                        <div key={agent.id} className="flex-none w-56 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/40 transition-all cursor-default group">
                            <div className="flex justify-between items-center mb-3">
                                <div className={`p-2 rounded-lg ${agent.status === 'ENABLED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Autonomy</div>
                                    <div className={`text-[10px] font-bold ${agent.autonomy === 'AUTO_EXECUTE' ? 'text-red-400' : 'text-blue-400'}`}>{agent.autonomy.split('_')[0]}</div>
                                </div>
                            </div>
                            <div className="text-xs font-black text-white mb-1 group-hover:text-brand-400 transition-colors truncate uppercase">{agent.name}</div>
                            <div className="flex justify-between items-center text-[9px] font-bold">
                                <span className="text-slate-500">Uptime: 99.9%</span>
                                <span className="text-slate-500">Risk: {agent.risk_level}</span>
                            </div>
                            <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full animate-pulse ${agent.status === 'ENABLED' ? 'bg-emerald-500 w-full' : 'bg-slate-700 w-0'}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. PERFORMANCE CARDS */}
                <div className="col-span-12 lg:col-span-3 row-span-2 space-y-4">
                    <div className="bg-brand-500 p-6 rounded-3xl flex flex-col justify-between h-[calc(50%-0.5rem)] shadow-lg shadow-brand-500/20 group relative overflow-hidden">
                        <Waves className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-700" />
                        <span className="text-[10px] font-black text-brand-900 uppercase tracking-widest opacity-60">Revenue_Fleet</span>
                        <div className="flex items-end gap-2">
                           <span className="text-4xl font-black text-white tracking-tighter italic">{activeAssets}</span>
                           <span className="text-xs font-bold text-brand-900 mb-1 opacity-60">Units</span>
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl flex flex-col justify-between h-[calc(50%-0.5rem)] shadow-lg transition-all duration-500 ${
                        criticalIssues > 0 ? 'bg-red-600 shadow-red-500/20' : 'bg-white/5 border border-white/10'
                    }`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${
                            criticalIssues > 0 ? 'text-red-900' : 'text-slate-500'
                        }`}>System_Friction</span>
                        <div className="flex items-end gap-2">
                           <span className={`text-4xl font-black tracking-tighter italic ${
                               criticalIssues > 0 ? 'text-white animate-pulse' : 'text-slate-700'
                           }`}>{criticalIssues}</span>
                           <span className={`text-xs font-bold mb-1 opacity-60 ${
                               criticalIssues > 0 ? 'text-red-900' : 'text-slate-500'
                           }`}>Issues</span>
                        </div>
                    </div>
                </div>

            </main>
            
            {/* HUD SCAN LINE */}
            <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
                <div className="h-1/2 w-full bg-gradient-to-b from-brand-500/20 to-transparent animate-scan"></div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; metrics: any }> = ({ isOpen, onClose, metrics }) => {
  const [reportHtml, setReportHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { 
    if (isOpen && metrics) { 
      setReportHtml(generateReportHtml(metrics, new Date().toLocaleDateString(), new Date().toLocaleTimeString())); 
    } 
  }, [isOpen, metrics]);
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white shrink-0">
             <span className="font-black text-xs uppercase tracking-widest italic">Board_Report_Preview_v2</span>
             <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-white/10"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 bg-slate-100 overflow-hidden flex justify-center p-8">
             <iframe ref={iframeRef} srcDoc={reportHtml} className="w-full h-full max-w-[210mm] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]" title="Report Preview" />
          </div>
          <div className="p-5 bg-white border-t border-slate-100 flex justify-end gap-3">
             <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900">Close</button>
             <button onClick={() => window.print()} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg">Download PDF</button>
          </div>
       </div>
    </div>
  );
};
