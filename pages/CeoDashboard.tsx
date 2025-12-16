
import React, { useState, useEffect } from 'react';
import { useStore } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { 
  TrendingUp, Users, Box, ShieldCheck, Activity, 
  ArrowUpRight, ArrowDownRight, Globe, AlertTriangle,
  Maximize2, X, Zap, Server, DollarSign, Clock, MapPin,
  Cpu, HeartPulse, Shield, Truck
} from 'lucide-react';
import { DeviceStatus, AgentStatus } from '../types';

export const CeoDashboard: React.FC = () => {
  const { devices, cases, exceptions, clients, agents } = useStore();
  const [showLiveView, setShowLiveView] = useState(false);

  // --- KPI CALCULATIONS ---
  const totalAssets = devices.length;
  const activeAssets = devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE).length;
  const utilizationRate = totalAssets > 0 ? (activeAssets / totalAssets) * 100 : 0;
  
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'ACTIVE').length;
  
  const criticalIssues = exceptions.filter(e => e.severity === 'BLOCKER' || e.severity === 'INCIDENT').length;
  
  const weeklyGrowth = 2.4; // Mock
  const accountabilityScore = 99.8; // Mock

  const KPICard = ({ label, value, sub, trend, positive }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
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

  // --- LIVE COMMAND VIEW MODAL ---
  const LiveCommandModal = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const activeAgents = agents.filter(a => a.status === AgentStatus.ENABLED).length;
    const sysHealth = criticalIssues === 0 ? 100 : Math.max(0, 100 - (criticalIssues * 15));

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-slate-50 w-full h-full max-w-[1600px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
          
          {/* COMMAND HEADER */}
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-600 rounded-lg shadow-lg shadow-brand-900/50">
                   <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold tracking-tight">MobileCare Live Command</h2>
                   <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Amsterdam HQ</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full" />
                      <span className="font-mono text-brand-400 font-bold">{currentTime.toLocaleTimeString()}</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full" />
                      <span className="flex items-center gap-1.5 text-green-400 font-bold"><Zap className="w-3 h-3" /> SYSTEM LIVE</span>
                   </div>
                </div>
             </div>
             <button 
                onClick={() => setShowLiveView(false)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
             >
                <X className="w-8 h-8" />
             </button>
          </div>

          {/* COMMAND BODY */}
          <div className="flex-1 bg-slate-100 p-6 overflow-y-auto">
             <div className="grid grid-cols-12 gap-6 h-full">
                
                {/* COL 1: FINANCIALS & GROWTH (Span 3) */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                   <Card className="bg-white border-none shadow-sm h-1/3 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign className="w-32 h-32" /></div>
                      <div className="relative z-10">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. MRR (Live)</span>
                         <div className="text-4xl font-bold text-slate-900 mt-2">€48,250</div>
                         <div className="flex items-center gap-1 text-xs font-bold text-green-600 mt-1">
                            <ArrowUpRight className="w-3 h-3" /> +4.2% vs last month
                         </div>
                      </div>
                   </Card>
                   <Card className="bg-white border-none shadow-sm h-1/3 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Subscribers</span>
                      <div className="text-4xl font-bold text-slate-900 mt-2">{activeClients}</div>
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-1">
                         <Users className="w-3 h-3" /> Across {clients.map(c => c.care_company_name).filter((v, i, a) => a.indexOf(v) === i).length} Partners
                      </div>
                   </Card>
                   <Card className="bg-slate-900 text-white border-none shadow-sm h-1/3 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Risk Score</span>
                      <div className="flex items-end gap-3 mt-2">
                         <div className="text-4xl font-bold text-white">{sysHealth}%</div>
                         <div className="text-sm text-slate-400 mb-1">Health Index</div>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                         <div style={{ width: `${sysHealth}%` }} className={`h-full rounded-full ${sysHealth > 90 ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                   </Card>
                </div>

                {/* COL 2: MAP & OPS (Span 6) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                   {/* Map Placeholder */}
                   <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-600" /> Active Operations Map
                         </h3>
                         <div className="flex gap-2">
                            <Badge color="green">Amsterdam</Badge>
                            <Badge color="blue">Rotterdam</Badge>
                            <Badge color="gray">Utrecht</Badge>
                         </div>
                      </div>
                      
                      {/* Stylized Map Background */}
                      <div className="absolute inset-0 top-16 opacity-10 flex items-center justify-center pointer-events-none">
                         <Globe className="w-96 h-96 text-slate-900" />
                      </div>

                      {/* Region Stats Overlay */}
                      <div className="grid grid-cols-3 gap-4 mt-auto relative z-10">
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <div className="text-xs text-slate-500 font-bold uppercase">Amsterdam</div>
                            <div className="text-xl font-bold text-slate-800 mt-1">420</div>
                            <div className="text-[10px] text-green-600">Active Units</div>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <div className="text-xs text-slate-500 font-bold uppercase">Rotterdam</div>
                            <div className="text-xl font-bold text-slate-800 mt-1">215</div>
                            <div className="text-[10px] text-green-600">Active Units</div>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <div className="text-xs text-slate-500 font-bold uppercase">Utrecht</div>
                            <div className="text-xl font-bold text-slate-800 mt-1">85</div>
                            <div className="text-[10px] text-green-600">Active Units</div>
                         </div>
                      </div>
                   </div>

                   {/* Logistics Strip */}
                   <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Truck className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-2xl font-bold text-slate-900">{utilizationRate.toFixed(1)}%</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Fleet Utilization</div>
                         </div>
                      </div>
                      <div className="h-10 w-px bg-slate-100" />
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-2xl font-bold text-slate-900">{exceptions.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Pending Exceptions</div>
                         </div>
                      </div>
                      <div className="h-10 w-px bg-slate-100" />
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Box className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-2xl font-bold text-slate-900">{devices.filter(d => d.status === 'IN_STOCK').length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Warehouse Stock</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* COL 3: SYSTEMS & AI (Span 3) */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                   <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-brand-400" /> AI Neural Status
                         </h3>
                         <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">ONLINE</span>
                      </div>
                      
                      <div className="space-y-4 flex-1">
                         {agents.slice(0, 5).map(agent => (
                            <div key={agent.id} className="flex items-center justify-between group">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${agent.status === 'ENABLED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`} />
                                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{agent.name}</span>
                               </div>
                               <span className="text-[10px] font-mono text-slate-500">{agent.last_run.replace(' ago', '')}</span>
                            </div>
                         ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-800">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Infrastructure Health</h4>
                         <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                               <span className="text-slate-400 flex items-center gap-2"><Server className="w-3 h-3" /> API Latency</span>
                               <span className="text-green-400 font-mono">24ms</span>
                            </div>
                            <div className="flex justify-between text-xs">
                               <span className="text-slate-400 flex items-center gap-2"><Shield className="w-3 h-3" /> Security</span>
                               <span className="text-green-400 font-mono">SECURE</span>
                            </div>
                            <div className="flex justify-between text-xs">
                               <span className="text-slate-400 flex items-center gap-2"><HeartPulse className="w-3 h-3" /> Uptime (30d)</span>
                               <span className="text-green-400 font-mono">99.99%</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Executive Overview</h1>
           <p className="text-slate-500 mt-2">MobileCare Performance & Health Monitor</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => setShowLiveView(true)} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg border-slate-900">
              <Maximize2 className="w-4 h-4 mr-2" /> Live Command View
           </Button>
           <div className="h-8 w-px bg-slate-300 mx-1"></div>
           <Button variant="outline">Download Board Report</Button>
           <Button variant="outline">Presentation Mode</Button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            label="Total Asset Value" 
            value="€1.2M" 
            sub={`${totalAssets} units in rotation`} 
            trend={weeklyGrowth} 
            positive 
         />
         <KPICard 
            label="Utilization Rate" 
            value={`${utilizationRate.toFixed(1)}%`} 
            sub={`${activeAssets} active subscriptions`} 
            trend="1.2" 
            positive 
         />
         <KPICard 
            label="Asset Accountability" 
            value={`${accountabilityScore}%`} 
            sub="Chain of Custody Verification" 
            trend="0.1" 
            positive 
         />
         <KPICard 
            label="Operational Risk" 
            value={criticalIssues} 
            sub="Active Critical Incidents" 
            trend={criticalIssues > 0 ? "50" : "0"} 
            positive={criticalIssues === 0} 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT: STRATEGIC HEALTH */}
         <div className="lg:col-span-2 space-y-8">
            <Card title="Growth & Active Service (Last 6 Months)">
               <div className="h-64 flex items-end justify-between px-4 gap-4">
                  {[45, 52, 58, 62, 75, 82].map((h, i) => (
                     <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                        <div className="text-center text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 mb-2 transition-opacity">{h} Active</div>
                        <div style={{ height: `${h}%` }} className="bg-brand-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all shadow-lg shadow-brand-200" />
                        <div className="text-center text-xs text-slate-400 mt-2 border-t border-slate-200 pt-1">
                           {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
               <Card title="Inventory Health">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Deployed (Revenue Generating)</span>
                        <span className="font-bold text-slate-900">{activeAssets}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${utilizationRate}%` }} className="bg-green-500 h-full" />
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Warehouse (Ready)</span>
                        <span className="font-bold text-slate-900">{devices.filter(d => d.status === 'IN_STOCK').length}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: '15%' }} className="bg-blue-500 h-full" />
                     </div>

                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Logistics / Maintenance</span>
                        <span className="font-bold text-slate-900">{devices.filter(d => ['IN_TRANSIT', 'REFURBISHING'].includes(d.status)).length}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: '10%' }} className="bg-amber-400 h-full" />
                     </div>
                  </div>
               </Card>

               <Card title="Care Partner Adoption">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                           <Users className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-2xl font-bold text-slate-900">{totalClients}</div>
                           <div className="text-xs text-slate-500">Total Clients Managed</div>
                        </div>
                     </div>
                     <div className="border-t border-slate-100 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-600">Thuiszorg West</span>
                           <span className="font-bold text-slate-900">42%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-600">Zorg & Co</span>
                           <span className="font-bold text-slate-900">38%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-600">Direct Private</span>
                           <span className="font-bold text-slate-900">20%</span>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
         </div>

         {/* RIGHT: AI & SYSTEMS */}
         <div className="space-y-8">
            <Card title="AI Agency Performance" className="bg-slate-900 text-white border-slate-800">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-brand-500/20 rounded-full border border-brand-500/50">
                        <Activity className="w-6 h-6 text-brand-400" />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-brand-100">Agency Uptime</div>
                        <div className="text-2xl font-bold text-white">100%</div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Items Scanned (24h)</span>
                        <span className="font-mono text-brand-300">12,402</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Anomalies Flagged</span>
                        <span className="font-mono text-amber-300">3</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Auto-Remediation</span>
                        <span className="font-mono text-green-300">45</span>
                     </div>
                  </div>

                  <div className="p-3 bg-slate-800 rounded text-xs text-slate-300 italic leading-relaxed">
                     "System operating within normal parameters. Stock Controller agent is optimizing warehouse allocation for Q1 efficiency."
                  </div>
               </div>
            </Card>

            <Card title="Operational Alerts">
               {criticalIssues === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                     <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                     <p>Zero critical incidents.</p>
                     <p className="text-xs mt-1">Operations team has full control.</p>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {exceptions.filter(e => e.severity !== 'WARNING').slice(0, 3).map(e => (
                        <div key={e.id} className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                           <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                           <div>
                              <div className="text-sm font-bold text-red-800">{e.title}</div>
                              <div className="text-xs text-red-600 mt-1">{e.human_owner_role} Assigned</div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </Card>
         </div>

      </div>

      {/* RENDER MODAL */}
      {showLiveView && <LiveCommandModal />}
    </div>
  );
};
