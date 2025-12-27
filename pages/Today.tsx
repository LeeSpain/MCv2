import React from 'react';
import { useStore } from '../services/store';
import { Role } from '../types';
import { CeoDashboard } from './CeoDashboard';
import { Card, Badge, Button, Stat } from '../components/ui';
import { 
  AlertCircle, CheckCircle, Clock, Zap, Wrench, ShieldAlert, 
  ArrowRight, Activity, Box, AlertTriangle, User, RefreshCw, ClipboardList, AlertOctagon
} from 'lucide-react';
import { AgentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

export const Today: React.FC = () => {
  const { currentUser } = useStore();

  if (currentUser.role === Role.CEO) return <CeoDashboard />;

  return <OpsDashboardView />;
};

const OpsDashboardView: React.FC = () => {
  const { exceptions, devices, jobs, agents, killSwitch } = useStore();
  const navigate = useNavigate();

  const activeAgents = agents.filter(a => a.status === AgentStatus.ENABLED).length;
  const openPriorities = exceptions.filter(e => e.status !== 'RESOLVED' && (e.severity === 'BLOCKER' || e.severity === 'INCIDENT'));
  const todayDate = new Date().toISOString().split('T')[0];
  const jobsToday = jobs.filter(j => j.scheduled_for && j.scheduled_for.startsWith(todayDate));

  return (
    <div className="space-y-8">
      {/* GLOBAL STATUS HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-4 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-700 ${killSwitch ? 'bg-red-700' : 'bg-slate-900'}`}>
           <div className="absolute top-0 right-0 p-20 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-16 -mt-16"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className={`p-3 rounded-2xl ${killSwitch ? 'bg-red-800 shadow-inner' : 'bg-white/10 border border-white/10'}`}>
                    {killSwitch ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <Zap className="w-6 h-6 text-brand-400" />}
                 </div>
                 <div>
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] opacity-60">System Control</h3>
                    <p className="text-xl font-black tracking-tight italic">{killSwitch ? 'EMERGENCY STOP' : 'ACTIVE NOMINAL'}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                 <div>
                    <span className="block text-4xl font-black tracking-tighter italic">{activeAgents}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Logic Nodes</span>
                 </div>
                 <div className="text-right">
                    <span className="block text-4xl font-black tracking-tighter text-cyan-400 italic">100%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Audit State</span>
                 </div>
              </div>
           </div>
           <Activity className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
           <Card className="flex items-center"><Stat label="Fleet Scale" value={devices.length} trend="+1.2% wk" icon={<Box className="w-5 h-5" />} /></Card>
           <Card className="flex items-center"><Stat label="Wait Queue" value="14" color="text-brand-600" icon={<Clock className="w-5 h-5" />} /></Card>
           <Card className="flex items-center"><Stat label="Auto-Fixed" value="128" color="text-emerald-600" icon={<CheckCircle className="w-5 h-5" />} /></Card>
           <Card className="flex items-center"><Stat label="Escalations" value={openPriorities.length} color="text-red-600" positive={false} icon={<AlertTriangle className="w-5 h-5" />} /></Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* PRIMARY TASK LIST */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              High Priority Interventions
            </h3>
            <Badge color="red">{openPriorities.length} Items</Badge>
          </div>

          <Card noPadding className="overflow-hidden shadow-lg border-red-100">
            {openPriorities.length > 0 ? (
               <div className="divide-y divide-slate-100">
                 {openPriorities.map(ex => (
                   <div key={ex.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-red-50/20 transition-colors group cursor-pointer" onClick={() => navigate('/exceptions')}>
                      <div className="flex items-start gap-4">
                         <div className={`mt-1 p-2.5 rounded-xl ${ex.severity === 'BLOCKER' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertOctagon className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-red-700 transition-colors italic">{ex.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{ex.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Box className="w-3 h-3" /> {ex.related_entity_type} #{ex.related_entity_id}</span>
                               <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Target: {ex.human_owner_role}</span>
                            </div>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full md:w-32 h-10 border-red-100 text-red-700 hover:bg-red-50">Triage</Button>
                   </div>
                 ))}
               </div>
            ) : (
               <div className="p-20 text-center bg-emerald-50/30">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <p className="font-black text-slate-900 uppercase tracking-widest text-sm italic">Queue Cleared: No Friction Detected</p>
               </div>
            )}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button onClick={() => navigate('/exceptions')} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-all italic">View Strategic Ledger</button>
            </div>
          </Card>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-8">
           <Card title="Daily Logistics" subtitle="Deployment Stream" noPadding className="shadow-lg">
              <div className="divide-y divide-slate-100">
                 {jobsToday.length > 0 ? jobsToday.map(j => (
                    <div key={j.id} className="p-5 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => navigate('/jobs')}>
                       <div className="shrink-0 p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                          <Wrench className="w-5 h-5" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter truncate italic">{j.client_name}</h4>
                             <Badge color={j.status === 'CONFIRMED' ? 'green' : 'yellow'}>{j.status === 'CONFIRMED' ? 'LIVE' : 'WAIT'}</Badge>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{j.type} • {j.scheduled_for?.split(' ')[1] || 'TBD'}</p>
                       </div>
                    </div>
                 )) : (
                    <div className="p-12 text-center text-slate-400 font-medium text-xs italic">Zero jobs scheduled for local sequence.</div>
                 )}
              </div>
              <div className="p-4 border-t border-slate-100">
                 <Button variant="outline" className="w-full text-[10px] uppercase tracking-widest h-10 font-black italic" onClick={() => navigate('/jobs')}>Open Deployment Map</Button>
              </div>
           </Card>

           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent opacity-40"></div>
              <RefreshCw className="absolute -top-6 -right-6 w-32 h-32 text-white/5 transform rotate-12 group-hover:rotate-45 transition-transform duration-[4s]" />
              
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-4">Stock Optimization</h4>
                 <div className="flex items-end gap-3 mb-6">
                    <span className="text-5xl font-black tracking-tighter italic">84%</span>
                    <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest italic">Efficiency</span>
                 </div>
                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter italic"><span className="text-slate-400">Circular Returns</span><span className="text-cyan-400">+12%</span></div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-500 w-[84%] shadow-[0_0_10px_#0ea5e9]"></div>
                    </div>
                 </div>
                 <Button variant="secondary" size="sm" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 italic" onClick={() => navigate('/assets')}>Audit Stock Chain</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};