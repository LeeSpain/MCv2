
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { 
  TrendingUp, Users, Box, ShieldCheck, Activity, 
  ArrowUpRight, ArrowDownRight, Globe, AlertTriangle,
  Maximize2, X, Zap, Server, DollarSign, Clock, MapPin,
  Cpu, HeartPulse, Shield, Truck, Terminal, Wifi, Layers,
  Crosshair, Radio, Network, Database, Lock, Search, 
  ChevronRight, ZoomIn, ZoomOut, Navigation
} from 'lucide-react';
import { DeviceStatus, AgentStatus, Agent } from '../types';

export const CeoDashboard: React.FC = () => {
  const { devices, cases, exceptions, clients, agents, agentRunLogs, timeline } = useStore();
  const [showLiveView, setShowLiveView] = useState(false);

  // --- KPI CALCULATIONS ---
  const totalAssets = devices.length;
  const activeAssets = devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE).length;
  const utilizationRate = totalAssets > 0 ? (activeAssets / totalAssets) * 100 : 0;
  
  const totalClients = clients.length;
  const criticalIssues = exceptions.filter(e => e.severity === 'BLOCKER' || e.severity === 'INCIDENT').length;
  const weeklyGrowth = 2.4; 
  const accountabilityScore = 99.8; 

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

  // --- LIVE COMMAND INTERNAL COMPONENTS ---

  const TelemetryGraph = ({ color = '#10b981' }: { color?: string }) => {
      // Simulates a scrolling line chart for system load
      const canvasRef = useRef<HTMLCanvasElement>(null);
      
      useEffect(() => {
          const ctx = canvasRef.current?.getContext('2d');
          if (!ctx) return;
          
          let dataPoints = Array(40).fill(0).map(() => 20 + Math.random() * 10);
          let animationFrameId: number;

          const draw = () => {
              // Shift data
              const last = dataPoints[dataPoints.length - 1];
              const next = last + (Math.random() - 0.5) * 15;
              dataPoints.push(Math.max(5, Math.min(95, next)));
              dataPoints.shift();

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              
              // Draw Grid (Subtle)
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              for(let i=0; i<ctx.canvas.width; i+=15) { ctx.moveTo(i,0); ctx.lineTo(i, ctx.canvas.height); }
              for(let j=0; j<ctx.canvas.height; j+=15) { ctx.moveTo(0,j); ctx.lineTo(ctx.canvas.width, j); }
              ctx.stroke();

              // Draw Line
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.lineJoin = 'round';
              ctx.shadowColor = color;
              ctx.shadowBlur = 10;
              
              ctx.beginPath();
              dataPoints.forEach((val, i) => {
                  const x = (i / (dataPoints.length - 1)) * ctx.canvas.width;
                  const y = ctx.canvas.height - (val / 100) * ctx.canvas.height;
                  if (i === 0) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
              });
              ctx.stroke();

              // Draw Fill Gradient
              const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
              gradient.addColorStop(0, `${color}40`); // 25% opacity
              gradient.addColorStop(1, `${color}00`); // 0% opacity
              
              ctx.fillStyle = gradient;
              ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
              ctx.lineTo(0, ctx.canvas.height);
              ctx.fill();
              ctx.shadowBlur = 0; // Reset shadow

              setTimeout(() => {
                  animationFrameId = requestAnimationFrame(draw);
              }, 100); 
          };
          draw();
          return () => cancelAnimationFrame(animationFrameId);
      }, [color]);

      return <canvas ref={canvasRef} width={280} height={50} className="w-full h-12" />;
  };

  const VectorMap = () => {
     const [blips, setBlips] = useState<{id:number, x:number, y:number, status:string, label:string}[]>([]);
     const [selectedBlip, setSelectedBlip] = useState<number | null>(null);
     const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
     const [zoom, setZoom] = useState(1);

     // Define static "Zones" simulating Dutch cities relative to a 100x100 grid
     const zones = [
         { name: 'AMSTERDAM', x: 45, y: 35 },
         { name: 'ROTTERDAM', x: 30, y: 65 },
         { name: 'UTRECHT', x: 60, y: 50 },
     ];

     useEffect(() => {
        // Init assets clustered around zones
        const generate = () => Array.from({length: 12}).map((_, i) => {
           const zone = zones[i % zones.length];
           return {
               id: i,
               // Randomize around city center
               x: zone.x + (Math.random() - 0.5) * 15,
               y: zone.y + (Math.random() - 0.5) * 15,
               status: Math.random() > 0.8 ? 'moving' : 'idle',
               label: `UNIT-${1000+i}`
           };
        });
        setBlips(generate());

        const interval = setInterval(() => {
           setBlips(prev => prev.map(b => {
              if (b.status === 'moving' || Math.random() > 0.95) {
                  return {
                      ...b,
                      x: b.x + (Math.random() - 0.5) * 0.5,
                      y: b.y + (Math.random() - 0.5) * 0.5,
                      status: 'moving'
                  };
              }
              return b;
           }));
        }, 1000);
        return () => clearInterval(interval);
     }, []);

     // Target Lock Logic
     useEffect(() => {
         if (selectedBlip !== null) {
             const target = blips.find(b => b.id === selectedBlip);
             if (target) {
                 setMapCenter({ x: target.x, y: target.y });
                 setZoom(2.5); // Zoom in on lock
             }
         } else {
             setZoom(1);
             setMapCenter({ x: 50, y: 50 });
         }
     }, [selectedBlip, blips]);

     return (
        <div className="relative w-full h-full bg-[#0f172a] overflow-hidden rounded-xl border border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] group">
           
           {/* MAP LAYERS TRANSFORMER */}
           <div 
             className="absolute inset-0 transition-all duration-1000 ease-in-out"
             style={{ 
                 transform: `scale(${zoom}) translate(${(50 - mapCenter.x)/2}%, ${(50 - mapCenter.y)/2}%)`,
                 transformOrigin: 'center center'
             }}
           >
               {/* 1. Map Grid (Dark Mode Streets) */}
               <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-20 pointer-events-none" style={{ 
                  backgroundImage: `
                      linear-gradient(#334155 1px, transparent 1px), 
                      linear-gradient(90deg, #334155 1px, transparent 1px)
                  `, 
                  backgroundSize: '40px 40px' 
               }}></div>

               {/* 2. City Zones (Text Labels on Map) */}
               {zones.map((z, i) => (
                   <div key={i} className="absolute text-slate-600 font-bold text-[8px] tracking-[0.2em] pointer-events-none" style={{ left: `${z.x}%`, top: `${z.y}%` }}>
                       {z.name}
                   </div>
               ))}

               {/* 3. Assets (Blips) */}
               {blips.map(b => (
                   <div 
                      key={b.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedBlip(b.id === selectedBlip ? null : b.id); }}
                      className="absolute cursor-pointer transition-all duration-1000 ease-linear hover:z-50"
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                   >
                      {/* Pulse Ring */}
                      {b.status === 'moving' && (
                          <div className="absolute -inset-4 border border-brand-500/30 rounded-full animate-ping"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`relative w-3 h-3 -ml-1.5 -mt-1.5 transform transition-transform hover:scale-150 ${b.id === selectedBlip ? 'scale-150' : ''}`}>
                          <div className={`w-full h-full rounded-full shadow-[0_0_10px] ${
                              b.id === selectedBlip ? 'bg-red-500 shadow-red-500' : 'bg-emerald-400 shadow-emerald-400'
                          }`}></div>
                          
                          {/* Label Tooltip */}
                          <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-white text-[6px] px-1.5 py-0.5 rounded whitespace-nowrap backdrop-blur-sm pointer-events-none ${b.id === selectedBlip ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              {b.label}
                          </div>
                      </div>
                   </div>
               ))}
           </div>

           {/* 4. Target Lock Overlay (Fixed on Screen) */}
           {selectedBlip !== null && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                   <div className="w-24 h-24 border-2 border-red-500/50 rounded-full animate-pulse relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-red-500"></div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-red-500"></div>
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-red-500"></div>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 bg-red-500"></div>
                       <div className="absolute -bottom-8 w-full text-center text-red-500 font-mono text-xs font-bold tracking-widest bg-black/50 rounded">
                           TARGET_LOCKED
                       </div>
                   </div>
               </div>
           )}

           {/* 5. HUD Overlay (UI Controls) */}
           <div className="absolute top-4 left-4 p-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest mb-1">
                 <Navigation className="w-3 h-3" /> LIVE_OPS
              </div>
              <div className="text-[9px] text-slate-400 font-mono leading-tight">
                 LAT: 52.3676° N<br/>
                 LON: 4.9041° E<br/>
                 TRACKING: {blips.length} UNITS
              </div>
           </div>

           <div className="absolute bottom-4 right-4 flex flex-col gap-2">
               <button className="p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 border border-slate-700" onClick={() => setZoom(z => Math.min(z + 0.5, 4))}>
                   <ZoomIn className="w-4 h-4" />
               </button>
               <button className="p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 border border-slate-700" onClick={() => { setZoom(1); setSelectedBlip(null); }}>
                   <ZoomOut className="w-4 h-4" />
               </button>
           </div>
        </div>
     );
  }

  const AgentNeuralNet = () => {
      const orchestrator = agents.find(a => a.code === 'ORCHESTRATOR');
      const specialists = agents.filter(a => a.code !== 'ORCHESTRATOR');

      return (
          <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
              <div className="text-xs font-bold text-slate-400 mb-4 flex justify-between items-center z-10">
                  <span className="flex items-center gap-2"><Network className="w-3 h-3 text-brand-400" /> CORTEX ACTIVITY</span>
                  <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                  </span>
              </div>

              <div className="flex-1 relative z-10 flex flex-col justify-center items-center gap-6">
                  {/* Central Node */}
                  <div className="relative group cursor-pointer">
                      <div className="absolute -inset-8 bg-brand-500/10 rounded-full animate-pulse blur-xl"></div>
                      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all duration-500 ${orchestrator?.status === 'ENABLED' ? 'border-brand-500 text-brand-400' : 'border-slate-700 text-slate-600'}`}>
                          <Activity className="w-8 h-8" />
                      </div>
                      <div className="absolute -right-20 top-4 text-left">
                          <div className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900/80 px-2 py-1 rounded border border-slate-800">Orchestrator</div>
                      </div>
                  </div>

                  {/* Satellite Nodes (Grid) */}
                  <div className="grid grid-cols-4 gap-4 w-full px-2">
                      {specialists.map((agent, i) => (
                          <div key={agent.id} className="flex flex-col items-center gap-2 group relative">
                              {/* Connection Line (CSS generated) */}
                              <div className={`absolute bottom-full left-1/2 w-px h-6 bg-gradient-to-t from-slate-700 to-transparent transition-all duration-500 ${agent.status === 'ENABLED' ? 'h-8 bg-brand-500/30' : ''}`}></div>
                              
                              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-500 z-10 ${
                                  agent.status === 'ENABLED' 
                                  ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                                  : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50'
                              }`}>
                                  {agent.code.includes('STOCK') ? <Box className="w-4 h-4" /> : 
                                   agent.code.includes('INSTALL') ? <Truck className="w-4 h-4" /> :
                                   agent.code.includes('COMMS') ? <Radio className="w-4 h-4" /> :
                                   <Zap className="w-4 h-4" />}
                              </div>
                              <div className="text-[8px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-1 bg-black px-1 rounded">
                                  {agent.code.split('_')[0]}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  const UnifiedEventLog = () => {
     const combinedLogs = useMemo(() => {
         const logs = [
             ...agentRunLogs.map(l => ({
                 id: l.id,
                 time: l.finished_at,
                 source: agents.find(a => a.id === l.agent_id)?.name || 'Unknown Agent',
                 message: l.applied_actions.length > 0 
                    ? `Executed ${l.applied_actions.length} actions (${l.autonomy})`
                    : `Scan complete. System nominal.`,
                 type: 'AGENT',
                 risk: l.plan.actions.some(a => a.risk === 'HIGH') ? 'HIGH' : 'LOW'
             })),
             ...timeline.map(t => ({
                 id: t.id,
                 time: t.timestamp,
                 source: t.source === 'AI' ? 'System AI' : t.actor_name || 'User',
                 message: t.summary,
                 type: 'SYSTEM',
                 risk: 'LOW'
             }))
         ].sort((a,b) => b.time.localeCompare(a.time)).slice(0, 50);
         return logs;
     }, [agentRunLogs, timeline, agents]);

     return (
        <div className="h-64 bg-[#0a0a0a] font-mono text-[10px] p-3 rounded-xl border border-slate-800 overflow-y-auto custom-scrollbar shadow-inner flex flex-col gap-1">
           {combinedLogs.length === 0 && <div className="text-slate-600 italic text-center mt-10">Initializing data stream...</div>}
           
           {combinedLogs.map((l) => (
              <div key={l.id} className="flex gap-3 hover:bg-slate-900/50 p-1 rounded transition-colors group">
                 <div className="text-slate-500 w-12 flex-shrink-0 opacity-70 group-hover:opacity-100">
                    {new Date(l.time).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                 </div>
                 <div className="flex-1 min-w-0">
                    <span className={`font-bold mr-2 ${
                        l.type === 'AGENT' ? 'text-brand-400' : 'text-amber-400'
                    }`}>
                        [{l.source.toUpperCase().replace(' ', '_')}]
                    </span>
                    <span className={`text-slate-300 ${l.risk === 'HIGH' ? 'text-red-400' : ''}`}>
                        {l.message}
                    </span>
                 </div>
              </div>
           ))}
        </div>
     );
  }

  const LiveCommandModal = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const sysHealth = criticalIssues === 0 ? 100 : Math.max(0, 100 - (criticalIssues * 15));

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-200 font-sans flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* 1. COMMAND HEADER */}
        <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 shadow-2xl z-50">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(2,132,199,0.5)] border border-brand-400/30">
                     <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h1 className="text-base font-bold text-white tracking-widest flex items-center gap-2">
                        MOBILECARE <span className="text-slate-600">//</span> OPS_COMMAND
                     </h1>
                  </div>
              </div>
              
              {/* Top Stats */}
              <div className="hidden lg:flex items-center gap-6 border-l border-slate-700 pl-6 ml-2">
                  <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Latency</span>
                      <span className="text-xs font-mono text-emerald-400">12ms</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Uptime</span>
                      <span className="text-xs font-mono text-white">99.99%</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Active Agents</span>
                      <span className="text-xs font-mono text-brand-400">{agents.filter(a => a.status === 'ENABLED').length} / {agents.length}</span>
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                 <div className="text-xl font-mono font-bold text-white leading-none tracking-tight">
                    {currentTime.toLocaleTimeString([], {hour12: false})}
                 </div>
                 <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] text-right mt-1">
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                 </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
              <button 
                 onClick={() => setShowLiveView(false)}
                 className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors"
              >
                 <X className="w-6 h-6" />
              </button>
           </div>
        </header>

        {/* 2. MAIN GRID LAYOUT */}
        <div className="flex-1 p-4 lg:p-6 overflow-hidden grid grid-cols-12 gap-4 lg:gap-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
           
           {/* LEFT COLUMN: TELEMETRY (Span 3) */}
           <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 lg:gap-6 min-h-0">
              
              {/* Vitals Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-lg">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <HeartPulse className="w-3 h-3 text-emerald-500" /> Platform Vitals
                    </h3>
                    <div className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">LIVE</div>
                 </div>
                 
                 <div className="space-y-6">
                     <div>
                         <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">
                             <span>Processing Load</span>
                             <span className="text-emerald-400 font-mono">12%</span>
                         </div>
                         <TelemetryGraph color="#10b981" />
                     </div>
                     <div>
                         <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">
                             <span>Network Traffic</span>
                             <span className="text-blue-400 font-mono">4.2 GB/s</span>
                         </div>
                         <TelemetryGraph color="#3b82f6" />
                     </div>
                 </div>
              </div>

              {/* Event Stream */}
              <div className="flex-1 flex flex-col min-h-0 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg">
                 <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-brand-500" /> Operations Log
                    </h3>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    </div>
                 </div>
                 <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 p-2">
                        <UnifiedEventLog />
                    </div>
                 </div>
              </div>
           </div>

           {/* CENTER COLUMN: MAP (Span 6) */}
           <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 lg:gap-6 min-h-0">
              {/* Map Container */}
              <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                 <VectorMap />
              </div>

              {/* Ticker Stats */}
              <div className="h-20 bg-slate-900/90 border border-slate-800 rounded-xl flex divide-x divide-slate-800 backdrop-blur-md shadow-lg">
                 <div className="flex-1 flex flex-col justify-center items-center p-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Active Assets</span>
                    <span className="text-2xl font-mono font-bold text-white">{activeAssets}</span>
                 </div>
                 <div className="flex-1 flex flex-col justify-center items-center p-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Blockers</span>
                    <span className={`text-2xl font-mono font-bold ${criticalIssues > 0 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>{criticalIssues}</span>
                 </div>
                 <div className="flex-1 flex flex-col justify-center items-center p-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Utilization</span>
                    <span className="text-2xl font-mono font-bold text-blue-400">{utilizationRate.toFixed(0)}%</span>
                 </div>
                 <div className="flex-1 flex flex-col justify-center items-center p-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Net Growth</span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">+{weeklyGrowth}%</span>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: AI & STATUS (Span 3) */}
           <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 lg:gap-6 min-h-0">
              
              {/* Agent Neural Net */}
              <div className="flex-1 min-h-[250px]">
                  <AgentNeuralNet />
              </div>

              {/* Status Blocks */}
              <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg backdrop-blur-sm">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500">
                           <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white uppercase tracking-wider">Security</div>
                           <div className="text-[10px] text-emerald-500 font-mono">ENCRYPTION: ACTIVE</div>
                        </div>
                     </div>
                     <Lock className="w-4 h-4 text-slate-700" />
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg backdrop-blur-sm">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500">
                           <Database className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white uppercase tracking-wider">Database</div>
                           <div className="text-[10px] text-blue-500 font-mono">REPLICATION: 0ms</div>
                        </div>
                     </div>
                     <Server className="w-4 h-4 text-slate-700" />
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
           <Button variant="secondary" onClick={() => setShowLiveView(true)} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg border-slate-900 ring-2 ring-offset-2 ring-transparent hover:ring-brand-500 transition-all">
              <Maximize2 className="w-4 h-4 mr-2" /> Launch Command
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
