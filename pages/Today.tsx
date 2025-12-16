import React from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button, Stat } from '../components/ui';
import { 
  AlertCircle, CheckCircle, Clock, Zap, Wrench, ShieldAlert, PlayCircle, Send, 
  ArrowRight, Activity, Calendar, MoreHorizontal, User, Box, AlertTriangle 
} from 'lucide-react';
import { Role, AgentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

export const Today: React.FC = () => {
  const { exceptions, devices, jobs, agents, killSwitch, currentUser } = useStore();
  const navigate = useNavigate();

  const isCEO = currentUser.role === Role.CEO;

  // --- DATA PROCESSING ---
  const activeAgents = agents.filter(a => a.status === AgentStatus.ENABLED).length;
  const lastRunAgent = agents.reduce((prev, current) => (prev.last_run > current.last_run) ? prev : current, agents[0]);

  // Priorities
  const openPriorities = exceptions.filter(e => 
    e.status !== 'RESOLVED' && 
    (e.severity === 'BLOCKER' || e.severity === 'INCIDENT')
  );

  // Overdue
  const overdueDevices = devices.filter(d => d.sla_breach);
  const todayDate = new Date().toISOString().split('T')[0];
  const missedJobs = jobs.filter(j => j.scheduled_for && j.scheduled_for < todayDate && j.status !== 'COMPLETED');

  // Schedule
  const jobsToday = jobs.filter(j => j.scheduled_for && j.scheduled_for.startsWith(todayDate));

  // Quick Actions
  const handleBatchAcknowledge = () => {
    if (confirm("Acknowledge all open WARNINGs?")) {
      store.batchAcknowledgeWarnings();
    }
  };

  const handleSendReminders = () => {
    store.sendReminders();
    alert("Reminders queued for sending.");
  };

  // --- EMPTY STATE ---
  const isAllClear = openPriorities.length === 0 && overdueDevices.length === 0 && missedJobs.length === 0 && jobsToday.length === 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* 1. TOP ROW: SYSTEM & METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* System Status (Span 4) */}
        <div className={`md:col-span-4 rounded-xl p-5 text-white flex flex-col justify-between shadow-sm relative overflow-hidden ${killSwitch ? 'bg-red-700' : 'bg-slate-900'}`}>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-lg ${killSwitch ? 'bg-red-800' : 'bg-slate-800'}`}>
                    {killSwitch ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5 text-brand-400" />}
                 </div>
                 <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider opacity-90">
                       {killSwitch ? 'EMERGENCY STOP' : 'SYSTEM OPERATIONAL'}
                    </h3>
                    <p className="text-xs opacity-60">AI Orchestration Active</p>
                 </div>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                 <div>
                    <span className="block text-2xl font-bold">{activeAgents}</span>
                    <span className="text-[10px] uppercase opacity-60">Active Agents</span>
                 </div>
                 <div className="text-right">
                    <span className="block text-xs opacity-60">Last Cycle</span>
                    <span className="text-xs font-mono">{lastRunAgent.last_run}</span>
                 </div>
              </div>
           </div>
           {/* Background Decoration */}
           <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
        </div>

        {/* Metrics (Span 8) */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
           <Card className="flex items-center">
              <Stat label="Items Scanned" value="1,240" trend="+12% today" icon={<Box className="w-4 h-4" />} />
           </Card>
           <Card className="flex items-center">
              <Stat label="Drafts Pending" value="12" color="text-blue-600" icon={<Clock className="w-4 h-4" />} />
           </Card>
           <Card className="flex items-center">
              <Stat label="Auto-Fixed" value="45" color="text-green-600" icon={<CheckCircle className="w-4 h-4" />} />
           </Card>
           <Card className="flex items-center">
              <Stat label="Escalations" value={openPriorities.length} color="text-amber-600" icon={<AlertTriangle className="w-4 h-4" />} />
           </Card>
        </div>
      </div>

      {isAllClear ? (
         <Card className="p-16 text-center border-dashed border-green-200 bg-green-50/50">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800">Operational Excellence Achieved</h3>
            <p className="text-green-600 mt-2">No urgent actions required. All systems nominal.</p>
         </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. LEFT COLUMN: ACTION ITEMS (2/3 Width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Priorities Table */}
            {openPriorities.length > 0 && (
              <Card title={`Priorities (${openPriorities.length})`} noPadding className="border-l-4 border-l-red-500 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3 text-xs uppercase tracking-wide w-24">Severity</th>
                      <th className="px-5 py-3 text-xs uppercase tracking-wide">Issue</th>
                      <th className="px-5 py-3 text-xs uppercase tracking-wide">Owner</th>
                      <th className="px-5 py-3 text-xs uppercase tracking-wide text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {openPriorities.map(ex => (
                      <tr key={ex.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-3">
                           <Badge color={ex.severity === 'BLOCKER' ? 'red' : 'yellow'}>{ex.severity}</Badge>
                        </td>
                        <td className="px-5 py-3">
                           <div className="font-medium text-slate-900">{ex.title}</div>
                           <div className="text-xs text-slate-500 flex items-center gap-1">
                              {ex.related_entity_type} #{ex.related_entity_id}
                           </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600 font-mono uppercase">
                           {ex.human_owner_role}
                        </td>
                        <td className="px-5 py-3 text-right">
                           <Button size="sm" variant="outline" onClick={() => navigate('/exceptions')}>Review</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* Overdue Items Table */}
            {(overdueDevices.length > 0 || missedJobs.length > 0) && (
               <Card title="Overdue & Watchlist" noPadding className="overflow-hidden">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                     <tr>
                       <th className="px-5 py-3 text-xs uppercase tracking-wide">Item</th>
                       <th className="px-5 py-3 text-xs uppercase tracking-wide">Reason</th>
                       <th className="px-5 py-3 text-xs uppercase tracking-wide">Custodian/Client</th>
                       <th className="px-5 py-3 text-xs uppercase tracking-wide text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {overdueDevices.map(d => (
                       <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-5 py-3 font-medium text-slate-900">{d.product_name} <span className="text-slate-400 font-normal ml-1">{d.serial_number}</span></td>
                         <td className="px-5 py-3"><Badge color="red">SLA Breach</Badge></td>
                         <td className="px-5 py-3 text-xs text-slate-600">{d.current_custodian}</td>
                         <td className="px-5 py-3 text-right">
                            <Button size="sm" variant="outline" className="h-7 text-xs">Investigate</Button>
                         </td>
                       </tr>
                     ))}
                     {missedJobs.map(j => (
                       <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-5 py-3 font-medium text-slate-900">{j.type} Job</td>
                         <td className="px-5 py-3"><Badge color="yellow">Missed Appt</Badge></td>
                         <td className="px-5 py-3 text-xs text-slate-600">{j.client_name}</td>
                         <td className="px-5 py-3 text-right">
                            <Button size="sm" variant="outline" className="h-7 text-xs">Reschedule</Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
            )}
          </div>

          {/* 3. RIGHT COLUMN: SCHEDULE & TOOLS (1/3 Width) */}
          <div className="space-y-6">
            
            {/* Today's Schedule */}
            <Card title="Today's Schedule" noPadding>
               <div className="divide-y divide-slate-50">
                  {jobsToday.length > 0 ? jobsToday.map(j => (
                     <div key={j.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-600">
                           <span className="text-xs font-bold uppercase">{j.scheduled_for?.split(' ')[1]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{j.type}</h4>
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${j.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-amber-500'}`} />
                           </div>
                           <p className="text-xs text-slate-500 truncate">{j.client_name}</p>
                           <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                              <User className="w-3 h-3" /> {j.installer_name}
                           </div>
                        </div>
                     </div>
                  )) : (
                     <div className="p-8 text-center text-slate-400 italic text-sm">
                        No jobs scheduled.
                     </div>
                  )}
               </div>
               <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                  <button className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1 w-full" onClick={() => navigate('/jobs')}>
                     View Full Calendar <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </Card>

            {/* Quick Actions Panel */}
            {!isCEO && (
              <Card title="Quick Actions">
                 <div className="space-y-3">
                    <Button variant="outline" onClick={handleSendReminders} className="w-full justify-start text-xs h-9">
                       <Send className="w-3 h-3 mr-2 text-slate-400" /> Send Daily Reminders
                    </Button>
                    <Button variant="outline" onClick={handleBatchAcknowledge} className="w-full justify-start text-xs h-9">
                       <CheckCircle className="w-3 h-3 mr-2 text-slate-400" /> Acknowledge Warnings
                    </Button>
                    <Button variant="outline" disabled className="w-full justify-start text-xs h-9 opacity-50 cursor-not-allowed">
                       <PlayCircle className="w-3 h-3 mr-2 text-slate-400" /> Auto-Process Returns
                    </Button>
                 </div>
              </Card>
            )}

            <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
               <h4 className="text-brand-800 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Pro Tip
               </h4>
               <p className="text-xs text-brand-700 leading-relaxed">
                  Focus on <strong>Blockers</strong> first. AI will handle low-risk reminders automatically at 09:00.
               </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};