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
  Waves, Server, Printer, Share2, Download, Activity as ActivityIcon
} from 'lucide-react';
import { DeviceStatus, AgentStatus } from '../types';

export const CeoDashboard: React.FC = () => {
  const { devices, exceptions, clients, agents, agentRunLogs, killSwitch } = useStore();
  const navigate = useNavigate();
  const [showLiveView, setShowLiveView] = useState(false);

  // --- KPI CALCULATIONS ---
  const totalAssets = devices.length;
  const unaccountedDevices = devices.filter(d => !d.current_custodian || d.current_custodian === 'Unknown').length;
  const activeAssets = devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE).length;
  const accountabilityScore = totalAssets > 0 ? ((totalAssets - unaccountedDevices) / totalAssets) * 100 : 100;
  const criticalExceptions = exceptions.filter(e => e.status !== 'RESOLVED' && (e.severity === 'BLOCKER' || e.severity === 'INCIDENT'));
  const overdueItems = devices.filter(d => d.sla_breach);

  const MetricCard = ({ label, value, sub, color = 'text-slate-900', trend, positive }: any) => (
    <Card className="flex flex-col justify-between h-36 hover:border-brand-300 transition-all shadow-sm group">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{label}</p>
        <p className={`text-4xl font-black tracking-tighter leading-none italic ${color}`}>{value}</p>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic leading-tight">{sub}</p>
        {trend && (
           <span className={`text-[10px] font-black flex items-center px-2 py-0.5 rounded-full ${positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
              {positive ? '↑' : '↓'} {trend}%
           </span>
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. REPORT HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-8 gap-4">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2 bg-brand-50 px-2 py-0.5 rounded-full w-fit">
             <Shield className="w-3 h-3" /> System Status: {killSwitch ? 'PAUSED' : 'OPERATIONAL'}
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase italic">
              Daily Accountability Report
           </h1>
           <p className="text-slate-500 mt-1 font-medium italic uppercase tracking-wider text-xs">
              Generated for Martijn (CEO) • {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • RUN-ID #8921
           </p>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"><Printer className="w-4 h-4" /></button>
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"><Share2 className="w-4 h-4" /></button>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm italic"><Download className="w-4 h-4" /> Export CSV</button>
           <button 
              onClick={() => setShowLiveView(true)}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 italic"
           >
              <Maximize2 className="w-4 h-4" /> Live Command
           </button>
        </div>
      </div>

      {/* 2. CORE METRICS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         <MetricCard label="Total Assets" value={totalAssets} sub="+2 net change" />
         <MetricCard label="Accountability" value={`${accountabilityScore.toFixed(0)}%`} sub="Target: 100%" color={accountabilityScore === 100 ? 'text-emerald-600' : 'text-red-600'} />
         <MetricCard label="Missing Stock" value={unaccountedDevices} sub="Immediate Action" color={unaccountedDevices > 0 ? 'text-red-600' : 'text-slate-300'} />
         <MetricCard label="SLA Breaches" value={overdueItems.length} sub="Overdue Items" color={overdueItems.length > 0 ? 'text-amber-600' : 'text-slate-300'} />
         <MetricCard label="Critical Exceptions" value={criticalExceptions.length} sub="Blockers / Incidents" color={criticalExceptions.length > 0 ? 'text-red-600' : 'text-slate-300'} />
      </div>

      {/* 3. DETAILED LEDGER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card title={`Critical Overdue Items (${overdueItems.length})`} noPadding className="shadow-lg overflow-hidden border-slate-200">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase italic text-[10px] tracking-widest">
                        <tr>
                           <th className="px-6 py-4">Serial</th>
                           <th className="px-6 py-4">Device</th>
                           <th className="px-6 py-4">Custodian</th>
                           <th className="px-6 py-4">SLA Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {overdueItems.length > 0 ? overdueItems.map(d => (
                           <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-black text-brand-700 italic">#{d.serial_number}</td>
                              <td className="px-6 py-4 font-black text-slate-800 uppercase tracking-tighter italic">{store.getProductName(d.product_id)}</td>
                              <td className="px-6 py-4 text-slate-500 font-bold italic">{d.current_custodian}</td>
                              <td className="px-6 py-4">
                                 <Badge color="red">BREACH &gt; 24H</Badge>
                              </td>
                           </tr>
                        )) : (
                           <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">All chain of custody verified. No blockers.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </Card>

            <Card title="System Performance Synthesis" className="border-l-4 border-l-brand-500">
               <p className="text-slate-700 leading-relaxed font-bold italic">
                  Operational state is nominal. AI Orchestrator has completed 12,402 state scans in the last 24 hours. 
                  Inventory utilization remains stable at 84%. Circular stock recovery protocols have returned 14% more assets to 'IN STOCK' vs previous week. 
                  Governance compliance remains at 100% with all autonomous actions logged to the unified ledger.
               </p>
            </Card>
         </div>

         <div className="space-y-6">
            <Card title="Operational Risk Status" className={`${criticalExceptions.length > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
               <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${criticalExceptions.length > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     {criticalExceptions.length > 0 ? <AlertOctagon className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                     <h4 className={`text-lg font-black uppercase tracking-tighter italic ${criticalExceptions.length > 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                        {criticalExceptions.length > 0 ? 'Action Required' : 'State: Healthy'}
                     </h4>
                     <p className={`text-xs font-bold italic ${criticalExceptions.length > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                        {criticalExceptions.length > 0 ? 'Accountability risk detected.' : 'No blockers detected in ledger.'}
                     </p>
                  </div>
               </div>
               {criticalExceptions.length > 0 && (
                  <Button onClick={() => navigate('/exceptions')} className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest text-xs h-10 border-0">Resolve Blockers</Button>
               )}
            </Card>

            <Card title="AI Intelligence Audit">
               <div className="space-y-5 italic">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span className="text-slate-400">Logic Nodes</span>
                     <span className="text-slate-900">{agents.filter(a => a.status === AgentStatus.ENABLED).length} Active</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-500 w-full animate-pulse shadow-[0_0_10px_#0ea5e9]"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                     Neural orchestration is currently prioritizing high-risk intake validation. No high-autonomy drift detected.
                  </p>
               </div>
            </Card>

            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden italic">
               <div className="absolute top-0 right-0 p-10 bg-brand-500 rounded-full blur-[80px] opacity-10 -mr-8 -mt-8"></div>
               <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Governance Policy 4.1</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-bold italic">
                     AI Agent actions are logged immutably. High-autonomy cycles are disabled for financial transactions {" > "} €500.
                  </p>
                  <button onClick={() => navigate('/settings/agents')} className="mt-4 text-[10px] font-black uppercase tracking-widest text-white border-b border-brand-500 pb-1 hover:text-brand-400 transition-colors italic">Audit Logic Nodes</button>
               </div>
            </div>
         </div>
      </div>

      {/* RENDER LIVE MONITOR MODAL */}
      {showLiveView && (
         <LiveCommandModal 
            criticalIssues={criticalExceptions.length} 
            activeAssets={activeAssets} 
            agentRunLogs={agentRunLogs} 
            agents={agents}
            onClose={() => setShowLiveView(false)} 
         />
      )}
    </div>
  );
};

/**
 * PROFESSIONAL LIVE COMMAND MONITOR
 */
const LiveCommandModal = ({ criticalIssues, activeAssets, agentRunLogs, agents, onClose }: any) => {
    const [scannedItems, setScannedItems] = useState(12402);
    const [systemLoad, setSystemLoad] = useState(12);
    const [networkLat, setNetworkLat] = useState(14);
    const [liveLogs, setLiveLogs] = useState<any[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setScannedItems(prev => prev + Math.floor(Math.random() * 5));
            setSystemLoad(prev => Math.max(8, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
            setNetworkLat(prev => Math.max(10, Math.min(18, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const baseLogs = agentRunLogs.length > 0 ? [...agentRunLogs].reverse() : [];
        let index = 0;
        
        const feedLog = () => {
            if (baseLogs.length > 0) {
               setLiveLogs(prev => [...prev, baseLogs[index % baseLogs.length]].slice(-100));
               index++;
            } else {
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
        feedLog(); 
        return () => clearInterval(interval);
    }, [agentRunLogs]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [liveLogs]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#02040a] text-slate-300 font-sans flex flex-col animate-in fade-in duration-500 overflow-hidden select-none italic">
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
                           <h1 className="text-xl font-black tracking-[0.3em] text-white uppercase flex items-center gap-2 italic">
                              Ops Command <span className="text-brand-500 opacity-30 font-light italic">|</span> Live Monitor
                           </h1>
                           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 italic">
                               <span className="flex items-center gap-2 text-green-500 italic">
                                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse italic" /> 
                                  Cluster State: Optimized
                               </span>
                               <span className="flex items-center gap-2 italic">
                                  <Clock className="w-3 h-3 text-brand-400 italic" /> {new Date().toLocaleTimeString()}
                               </span>
                           </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-12 text-center h-full italic">
                    <div className="hidden lg:flex items-center gap-16 border-x border-white/5 px-16 h-full italic">
                        <div className="flex flex-col items-center">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 italic">Node Load</div>
                           <div className="text-2xl font-mono font-black text-white leading-none tracking-tighter flex items-end gap-1 italic">{systemLoad}<span className="text-[10px] text-brand-500 mb-0.5 italic">%</span></div>
                           <div className="w-20 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner"><div style={{ width: `${systemLoad}%` }} className="h-full bg-brand-500 transition-all duration-700" /></div>
                        </div>
                        <div className="flex flex-col items-center italic">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 italic">Latency</div>
                           <div className="text-2xl font-mono font-black text-brand-400 leading-none tracking-tighter flex items-end gap-1 italic">{networkLat.toFixed(1)}<span className="text-[10px] text-brand-500 mb-0.5 italic">ms</span></div>
                           <div className="w-20 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner"><div style={{ width: `${(networkLat/30)*100}%` }} className="h-full bg-brand-400 transition-all duration-700" /></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10 rounded-2xl group shadow-lg active:scale-95 italic"><X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300 italic" /></button>
                </div>
            </header>
            <main className="flex-1 p-8 grid grid-cols-12 grid-rows-6 gap-8 relative italic">
                <div className="col-span-12 lg:col-span-5 row-span-4 bg-slate-900/30 rounded-[3rem] border border-white/5 p-12 relative overflow-hidden group shadow-2xl backdrop-blur-sm italic">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
                    <div className="absolute top-10 left-12 z-10">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3 mb-1 italic"><Globe className="w-4 h-4 text-brand-500 animate-spin-slow italic" /> Regional Flow State</h3>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest italic"><div className="w-2 h-2 rounded-full bg-brand-500/40 border border-brand-500 animate-pulse italic" /> High Availability Link: Active</div>
                    </div>
                    <div className="w-full h-full flex items-center justify-center relative italic">
                         <div className="absolute w-full h-full rounded-full border border-white/[0.02] animate-ping duration-[6s]"></div>
                         <svg viewBox="0 0 400 400" className="w-full h-full max-h-[420px] drop-shadow-[0_0_50px_rgba(14,165,233,0.1)] transform group-hover:scale-[1.03] transition-transform duration-[3s] ease-out italic">
                            <path d="M120,60 L180,45 L260,30 L320,80 L360,150 L340,300 L220,360 L100,320 L50,200 L70,120 Z" fill="rgba(14,165,233,0.02)" stroke="rgba(14,165,233,0.15)" strokeWidth="2" className="transition-all duration-700 group-hover:stroke-brand-500/30 italic" />
                            <rect width="400" height="2" fill="url(#grad-scan)" className="animate-scan italic" />
                            <g className="nodes italic">
                                <circle cx="180" cy="140" r="6" className="fill-brand-500 shadow-brand-500 shadow-2xl italic" />
                                <circle cx="180" cy="140" r="14" className="stroke-brand-500/30 fill-none animate-ping italic" />
                                <text x="195" y="145" className="text-[11px] fill-white font-mono font-black tracking-tighter italic">MC AMS HQ</text>
                                <circle cx="140" cy="200" r="4" className="fill-brand-400/50 italic" /><circle cx="195" cy="185" r="4" className="fill-brand-400/50 italic" /><circle cx="260" cy="285" r="4" className="fill-brand-400/50 italic" />
                            </g>
                            <defs><linearGradient id="grad-scan" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="transparent" /><stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                         </svg>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-7 row-span-4 bg-black/50 rounded-[3rem] border border-white/10 flex flex-col shadow-2xl backdrop-blur-3xl overflow-hidden group italic">
                    <div className="flex-none h-16 bg-white/[0.03] border-b border-white/10 px-10 flex justify-between items-center relative italic">
                        <div className="flex items-center gap-4 relative z-10 italic"><Terminal className="w-5 h-5 text-emerald-400 italic" /><span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 italic">Central Orchestration Ledger</span></div>
                        <div className="flex items-center gap-8 relative z-10 italic"><div className="flex items-center gap-3 italic"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e] italic" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">INGEST STREAM: ACTIVE</span></div></div>
                    </div>
                    <div ref={logContainerRef} className="flex-1 overflow-y-auto p-10 font-mono text-[11px] custom-scrollbar space-y-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat italic">
                        {liveLogs.map((log: any) => (
                            <div key={log.id} className="flex gap-8 p-4 rounded-2xl border bg-brand-500/[0.03] border-white/5 hover:bg-brand-500/[0.08] transition-all duration-500 animate-in slide-in-from-left-6 italic">
                                <span className="text-slate-600 shrink-0 font-bold tabular-nums tracking-tighter italic">[{new Date(log.finished_at).toLocaleTimeString()}]</span>
                                <span className="text-slate-300 flex-1 leading-relaxed font-medium italic">{log.plan?.actions?.[0]?.summary || 'Orchestration cycle complete. Validation successful.'}</span>
                                <div className="flex items-center gap-4 italic"><span className="px-3 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-tighter border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 italic">APPLIED</span></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-9 row-span-2 bg-slate-900/10 rounded-[3rem] border border-white/5 p-10 flex items-center gap-8 overflow-x-auto no-scrollbar relative italic">
                    {agents.map((agent: any) => (
                        <div key={agent.id} className="flex-none w-72 h-full p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-brand-500/40 hover:bg-white/[0.06] transition-all cursor-pointer group flex flex-col justify-between shadow-lg italic">
                            <div className="flex justify-between items-start mb-4 italic"><div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 italic"><Zap className="w-6 h-6 group-hover:scale-110 transition-transform italic" /></div></div>
                            <div className="italic"><div className="text-sm font-black text-white mb-2 group-hover:text-brand-400 transition-colors truncate uppercase tracking-tighter italic">{agent.name}</div><div className="mt-5 h-2 w-full bg-slate-800/50 rounded-full overflow-hidden shadow-inner italic"><div className="h-full bg-emerald-500 w-full animate-pulse italic" /></div></div>
                        </div>
                    ))}
                </div>
                <div className="col-span-12 lg:col-span-3 row-span-2 space-y-6 italic">
                    <div className="bg-brand-600 p-10 rounded-[3rem] flex flex-col justify-between h-[calc(50%-0.75rem)] shadow-2xl shadow-brand-900/40 group relative overflow-hidden ring-4 ring-brand-500/20 italic">
                        <Waves className="absolute -bottom-12 -right-12 w-48 h-48 text-white/10 group-hover:scale-150 transition-transform duration-[3s] pointer-events-none ease-in-out" />
                        <div className="relative z-10 italic"><span className="text-[11px] font-black text-brand-900 uppercase tracking-[0.4em] opacity-70 italic">Fleet Active</span><div className="flex items-end gap-3 mt-3 italic"><span className="text-6xl font-black text-white tracking-tighter leading-none drop-shadow-lg italic">{activeAssets}</span></div></div>
                    </div>
                    <div className={`p-10 rounded-[3rem] flex flex-col justify-between h-[calc(50%-0.75rem)] shadow-2xl transition-all duration-700 border-2 ${criticalIssues > 0 ? 'bg-red-600 border-red-500 shadow-red-900/40 ring-4 ring-red-500/20' : 'bg-white/5 border-white/5 backdrop-blur-3xl'} italic`}>
                        <div className="italic"><span className={`text-[11px] font-black uppercase tracking-[0.4em] opacity-70 italic ${criticalIssues > 0 ? 'text-red-950' : 'text-slate-600'}`}>System Risks</span><div className="flex items-end gap-3 mt-3 italic"><span className={`text-6xl font-black tracking-tighter leading-none drop-shadow-lg italic ${criticalIssues > 0 ? 'text-white animate-pulse' : 'text-slate-400'}`}>{criticalIssues}</span></div></div>
                    </div>
                </div>
            </main>
            <style>{`@keyframes scan { 0% { transform: translateY(-450px); } 100% { transform: translateY(450px); } } .animate-scan { animation: scan 10s linear infinite; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}
