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
  Waves, Server, Activity as ActivityIcon
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
 * PROFESSIONAL LIVE COMMAND MONITOR
 * Advanced Operational HUD for High-Density Intelligence
 */
const LiveCommandModal = ({ criticalIssues, activeAssets, agentRunLogs, agents, onClose }: any) => {
    const [scannedItems, setScannedItems] = useState(12402);
    const [systemLoad, setSystemLoad] = useState(12);
    const [networkLat, setNetworkLat] = useState(14);
    const [liveLogs, setLiveLogs] = useState<any[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    // Simulation: Telemetry jitter
    useEffect(() => {
        const interval = setInterval(() => {
            setScannedItems(prev => prev + Math.floor(Math.random() * 5));
            setSystemLoad(prev => Math.max(8, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
            setNetworkLat(prev => Math.max(10, Math.min(18, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Simulation: Log feeder for a more active "live" feel
    useEffect(() => {
        const baseLogs = agentRunLogs.length > 0 ? [...agentRunLogs].reverse() : [];
        let index = 0;
        
        const feedLog = () => {
            if (baseLogs.length > 0) {
               setLiveLogs(prev => [...prev, baseLogs[index % baseLogs.length]].slice(-100));
               index++;
            } else {
               // Placeholder feeder
               const dummyLog = {
                 id: `sys-${Date.now()}`,
                 finished_at: new Date().toISOString(),
                 agent_id: 'SYSTEM_WATCHER',
                 plan: { actions: [{ summary: 'Global state integrity verified. All nodes responding.' }] },
                 applied_actions: [{ status: 'APPLIED' }],
                 autonomy: 'AUTO'
               };
               setLiveLogs(prev => [...prev, dummyLog].slice(-100));
            }
        };

        const interval = setInterval(feedLog, 4000);
        feedLog(); // Initial
        return () => clearInterval(interval);
    }, [agentRunLogs]);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [liveLogs]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#02040a] text-slate-300 font-sans flex flex-col animate-in fade-in duration-500 overflow-hidden select-none">
            {/* HUD HEADER */}
            <header className="flex-none h-20 border-b border-brand-500/20 bg-slate-900/60 backdrop-blur-2xl flex justify-between items-center px-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-60"></div>
                
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-12 h-12 bg-brand-500/10 rounded-2xl border border-brand-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(14,165,233,0.15)]">
                                <ActivityIcon className="w-7 h-7 text-brand-500 animate-pulse" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-4 border-[#02040a] animate-ping"></div>
                        </div>
                        <div>
                           <h1 className="text-xl font-black tracking-[0.3em] text-white uppercase italic flex items-center gap-2">
                              Ops_Command <span className="text-brand-500 opacity-30 font-light">|</span> Live_Monitor
                           </h1>
                           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                               <span className="flex items-center gap-2 text-green-500">
                                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 
                                  Cluster_State: Optimized
                               </span>
                               <span className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-brand-400" /> {new Date().toLocaleTimeString()}
                               </span>
                               <span className="font-mono text-slate-600">v4.2.1-stable</span>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-12 text-center h-full">
                    {/* Live Telemetry Panels */}
                    <div className="hidden lg:flex items-center gap-16 border-x border-white/5 px-16 h-full">
                        <div className="flex flex-col items-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Node Load</div>
                           <div className="text-2xl font-mono font-black text-white leading-none tracking-tighter flex items-end gap-1">
                             {systemLoad}
                             <span className="text-[10px] text-brand-500 mb-0.5">%</span>
                           </div>
                           <div className="w-20 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner">
                              <div style={{ width: `${systemLoad}%` }} className="h-full bg-brand-500 transition-all duration-700" />
                           </div>
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Latency</div>
                           <div className="text-2xl font-mono font-black text-brand-400 leading-none tracking-tighter flex items-end gap-1">
                             {networkLat.toFixed(1)}
                             <span className="text-[10px] text-brand-500 mb-0.5">ms</span>
                           </div>
                           <div className="w-20 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner">
                              <div style={{ width: `${(networkLat/30)*100}%` }} className="h-full bg-brand-400 transition-all duration-700" />
                           </div>
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Cycles_24h</div>
                           <div className="text-2xl font-mono font-black text-emerald-400 leading-none tracking-tighter">
                             {scannedItems.toLocaleString()}
                           </div>
                           <div className="text-[9px] font-bold text-emerald-500/40 mt-1 uppercase tracking-tighter italic">Ledger_Committed</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose} 
                        className="p-4 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10 rounded-2xl group shadow-lg active:scale-95"
                    >
                        <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </header>

            {/* OPERATIONAL Theater */}
            <main className="flex-1 p-8 grid grid-cols-12 grid-rows-6 gap-8 relative">
                {/* NOTE: remainder of component unchanged from your pasted file */}
                {/* ... */}
            </main>

            {/* AMBIENT SCREEN EFFECTS */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] select-none mix-blend-overlay">
                <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_6px,3px_100%]"></div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#000_100%)]"></div>

            <style>{`
                @keyframes scan { 0% { transform: translateY(-450px); } 100% { transform: translateY(450px); } }
                @keyframes dash { to { stroke-dashoffset: -20; } }
                .animate-scan { animation: scan 10s linear infinite; }
                .animate-dash { animation: dash 2s linear infinite; }
                .animate-spin-slow { animation: spin 20s linear infinite; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.5); }
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
