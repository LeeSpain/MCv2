
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Maximize2, X, Activity,
  HeartPulse, ShieldCheck, Terminal,
  Database, Lock, Navigation, Download,
  Printer, Share2, FileText, ChevronRight, ZoomIn, ZoomOut, Box, Truck, Radio, Zap, Network,
  Server, Users, AlertTriangle, AlertOctagon, CheckCircle, Clock, Map
} from 'lucide-react';
import { DeviceStatus, AgentStatus } from '../types';

// --- HELPER: Report Generator (Preserved but enhanced) ---
const generateReportHtml = (metrics: any, reportDate: string, generatedTime: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MobileCare Board Report - ${reportDate}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 0; }
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(0,0,0,0.03); font-weight: 800; pointer-events: none; z-index: 0; white-space: nowrap; }
          @media print { .no-print { display: none; } body { padding: 0; } .page-break { page-break-before: always; } }
        </style>
      </head>
      <body class="bg-white text-slate-900">
        <div class="watermark">CONFIDENTIAL</div>
        <div class="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[15mm] relative z-10 shadow-xl print:shadow-none">
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold">MC</div>
                <h1 class="text-2xl font-extrabold tracking-tight uppercase">MobileCare Board Report</h1>
              </div>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Strategy & Ops Snapshot</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-slate-900">${reportDate}</div>
              <p class="text-[10px] text-slate-400 font-mono uppercase mt-1">TS: ${generatedTime}</p>
            </div>
          </div>
          <div class="mb-10 bg-slate-50 p-6 border-l-4 border-brand-600">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">01 // Strategic Health</h2>
            <p class="text-base text-slate-800 leading-relaxed font-medium">
              Ecosystem metrics indicate a <span class="font-bold text-brand-700">${metrics.utilizationRate}% utilization rate</span>. 
              Operational accountability remains stable at <span class="font-bold text-slate-900">${metrics.accountabilityScore}%</span>.
              ${metrics.criticalIssues === 0 
                ? '<span class="text-green-700 font-bold block mt-2">✓ System risk is nominal.</span>' 
                : `<span class="text-red-600 font-bold block mt-2">⚠ Friction: ${metrics.criticalIssues} strategic blockers require resolution.</span>`}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-8 mb-12">
            <div class="border-b border-slate-100 pb-4">
               <div class="text-[10px] uppercase font-bold text-slate-500 mb-1">Active Fleet</div>
               <div class="text-3xl font-extrabold text-slate-900">${metrics.activeAssets}</div>
            </div>
            <div class="border-b border-slate-100 pb-4">
               <div class="text-[10px] uppercase font-bold text-slate-500 mb-1">Accountability</div>
               <div class="text-3xl font-extrabold text-slate-900">${metrics.accountabilityScore}%</div>
            </div>
          </div>
          <div class="bg-slate-900 text-white p-6 rounded-lg">
             <h4 class="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Automated Forecast</h4>
             <p class="text-xs text-slate-300 leading-relaxed">AI Agents have processed ${metrics.stockCount} inventory movements this cycle. Optimization of the returns flow is projected to increase available stock by 14% WoW.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// --- COMPONENT: UNIFIED CEO DASHBOARD ---
export const CeoDashboard: React.FC = () => {
  const { devices, exceptions, clients, agents, agentRunLogs, timeline } = useStore();
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

  const KPICard = ({ label, value, sub, trend, positive }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-brand-300 transition-all">
       <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          {trend && (
             <span className={`text-xs font-bold flex items-center ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {trend}%
             </span>
          )}
       </div>
       <div>
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 block mt-1">{sub}</span>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. UNIFIED HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Zap className="w-8 h-8 text-brand-500" />
              Executive Dashboard
           </h1>
           <p className="text-slate-500 mt-2">Unified Strategic & Operational Intelligence</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => setShowReportModal(true)} className="font-bold border-slate-300">
              <FileText className="w-4 h-4 mr-2" /> Board Report
           </Button>
           <Button onClick={() => setShowLiveView(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg px-6">
              <Maximize2 className="w-4 h-4 mr-2" /> Live Command
           </Button>
        </div>
      </div>

      {/* 2. TOP METRICS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard label="Asset Fleet" value={totalAssets} sub={`${activeAssets} revenue generating`} trend="2.4" positive />
         <KPICard label="Utilization" value={`${utilizationRate.toFixed(1)}%`} sub="Active Subscription Rate" trend="0.8" positive />
         <KPICard label="Strategic Risk" value={criticalExceptions.length} sub="Active Operational Blockers" positive={criticalExceptions.length === 0} />
         <KPICard label="Partner Reach" value={partnerCount} sub="Strategic Care Organizations" trend="1" positive />
      </div>

      {/* 3. CORE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT: STRATEGIC BLOCKERS (Merged from Today/Dashboard view) */}
         <div className="lg:col-span-2 space-y-8">
            <Card title="Strategic Friction (Action Required)" noPadding className="border-t-4 border-t-red-500">
               {criticalExceptions.length === 0 ? (
                  <div className="p-16 text-center text-slate-400 bg-green-50/20">
                     <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                     <p className="font-bold text-slate-800">Operational Friction Nominal</p>
                     <p className="text-sm">System AI is managing all low-level anomalies.</p>
                  </div>
               ) : (
                  <div className="divide-y divide-slate-100">
                     {criticalExceptions.map(ex => (
                        <div key={ex.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate('/exceptions')}>
                           <div className="flex items-start gap-4">
                              <div className="mt-1 p-2 bg-red-100 rounded-lg text-red-600">
                                 <AlertOctagon className="w-5 h-5" />
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors">{ex.title}</h4>
                                    <Badge color="red">{ex.severity}</Badge>
                                 </div>
                                 <p className="text-sm text-slate-500 line-clamp-1">{ex.description}</p>
                                 <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Ref: {ex.related_entity_type} #{ex.related_entity_id}</span>
                                    <span>Owner: {ex.human_owner_role}</span>
                                 </div>
                              </div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-400 transition-colors" />
                        </div>
                     ))}
                     <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <button onClick={() => navigate('/exceptions')} className="w-full text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest text-center">Open Full Queue</button>
                     </div>
                  </div>
               )}
            </Card>

            <Card title="Utilization Trend (Revenue)">
               <div className="h-64 flex items-end justify-between px-4 gap-4">
                  {[45, 52, 58, 62, 75, 82].map((h, i) => (
                     <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                        <div className="text-center text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 mb-2 transition-opacity">{h}%</div>
                        <div style={{ height: `${h}%` }} className="bg-brand-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all shadow-lg shadow-brand-200" />
                        <div className="text-center text-[10px] text-slate-400 mt-2 border-t border-slate-200 pt-1 uppercase font-bold tracking-widest">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* RIGHT: AI AGENCY & SYSTEM PULSE */}
         <div className="space-y-8">
            <Card className="bg-slate-900 text-white border-slate-800 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal className="w-24 h-24" /></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-brand-500/20 rounded-full border border-brand-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]"><Activity className="w-6 h-6 text-brand-400" /></div>
                     <div><div className="text-sm font-bold text-brand-100">AI Agency State</div><div className="text-2xl font-bold text-white uppercase tracking-tighter">100% Operational</div></div>
                  </div>
                  <div className="space-y-3 border-y border-slate-800 py-4">
                     <div className="flex justify-between text-xs"><span className="text-slate-400">Total Scans (24h)</span><span className="font-mono text-brand-300 font-bold">12,402</span></div>
                     <div className="flex justify-between text-xs"><span className="text-slate-400">Risk Mitigation</span><span className="font-mono text-green-300 font-bold">45 Fixes</span></div>
                  </div>
                  <p className="text-xs text-slate-400 italic leading-relaxed">"System AI is currently prioritizing stock preservation. No high-risk autonomous drift detected."</p>
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800 h-9 text-xs" onClick={() => navigate('/settings/agents')}>Configure Agents</Button>
               </div>
            </Card>

            <Card title="Quick System Links">
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/clients')} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all text-left">
                     <Users className="w-5 h-5 text-slate-400 mb-2" />
                     <span className="text-xs font-bold text-slate-900 block">Directory</span>
                  </button>
                  <button onClick={() => navigate('/report')} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all text-left">
                     <FileText className="w-5 h-5 text-slate-400 mb-2" />
                     <span className="text-xs font-bold text-slate-900 block">Accountability</span>
                  </button>
                  <button onClick={() => navigate('/assets')} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all text-left">
                     <Box className="w-5 h-5 text-slate-400 mb-2" />
                     <span className="text-xs font-bold text-slate-900 block">Inventory</span>
                  </button>
                  <button onClick={() => navigate('/jobs')} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all text-left">
                     <Map className="w-5 h-5 text-slate-400 mb-2" />
                     <span className="text-xs font-bold text-slate-900 block">Logistics</span>
                  </button>
               </div>
            </Card>

            <div className="bg-brand-50 p-5 rounded-xl border border-brand-100 flex gap-4">
               <div className="shrink-0"><ShieldCheck className="w-6 h-6 text-brand-600" /></div>
               <div>
                  <h4 className="text-sm font-bold text-brand-900">Governance Policy</h4>
                  <p className="text-xs text-brand-700 mt-1 leading-relaxed">All autonomous agent actions are logged and subject to daily manual audit by MC_ADMIN.</p>
               </div>
            </div>
         </div>
      </div>

      {/* RENDER MODALS (Preserved but integrated) */}
      {showLiveView && <LiveCommandModal criticalIssues={criticalExceptions.length} activeAssets={activeAssets} utilizationRate={utilizationRate} agents={agents} agentRunLogs={agentRunLogs} timeline={timeline} onClose={() => setShowLiveView(false)} />}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} metrics={reportMetrics} />
    </div>
  );
};

// --- MODAL SUB-COMPONENTS (Simplified and integrated) ---

const LiveCommandModal = ({ criticalIssues, activeAssets, utilizationRate, agents, agentRunLogs, timeline, onClose }: any) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950 text-slate-200 font-sans flex flex-col animate-in fade-in duration-300">
            <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-brand-500" />
                    <h1 className="text-base font-bold tracking-widest">OPS_COMMAND // LIVE_MONITOR</h1>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><X className="w-6 h-6" /></button>
            </header>
            <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
                <div className="col-span-3 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Telemetry</h3>
                        <div className="space-y-4">
                            <div><div className="flex justify-between text-[10px] mb-1"><span>System Load</span><span>12%</span></div><div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[12%]" /></div></div>
                            <div><div className="flex justify-between text-[10px] mb-1"><span>Network Flux</span><span>Stable</span></div><div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[40%]" /></div></div>
                        </div>
                    </div>
                </div>
                <div className="col-span-6 bg-[#0a0a0a] rounded-xl border border-slate-800 overflow-y-auto p-4 font-mono text-[10px] text-slate-400 custom-scrollbar">
                    {agentRunLogs.slice(0, 50).map((l: any) => (
                        <div key={l.id} className="mb-1">
                            <span className="text-slate-600">[{new Date(l.finished_at).toLocaleTimeString()}]</span> <span className="text-brand-400">AGENT_RUN:</span> {l.id}
                        </div>
                    ))}
                </div>
                <div className="col-span-3 space-y-6 text-center">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <div className="text-4xl font-mono font-bold text-white mb-1">{activeAssets}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Fleet</div>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <div className={`text-4xl font-mono font-bold mb-1 ${criticalIssues > 0 ? 'text-red-500' : 'text-slate-600'}`}>{criticalIssues}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blockers</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; metrics: any }> = ({ isOpen, onClose, metrics }) => {
  const [reportHtml, setReportHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { if (isOpen && metrics) { setReportHtml(generateReportHtml(metrics, new Date().toLocaleDateString(), new Date().toLocaleTimeString())); } }, [isOpen, metrics]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
             <span className="font-bold text-sm">Board Report Preview</span>
             <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 bg-slate-100 overflow-hidden flex justify-center p-8"><iframe ref={iframeRef} srcDoc={reportHtml} className="w-full h-full max-w-[210mm] bg-white shadow-lg" title="Report Preview" /></div>
       </div>
    </div>
  );
};
