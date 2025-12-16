
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Button } from '../components/ui';
import { 
  Play, Activity, Terminal, ShieldAlert, 
  Eye, Edit3, Zap, BookOpen, Lock, 
  Search, Power, Server, ChevronRight, FileText, CloudLightning
} from 'lucide-react';
import { Agent, AgentStatus, AutonomyLevel, Role } from '../types';

export const SettingsAgents: React.FC = () => {
  const { agents, killSwitch, currentUser, agentRunLogs } = useStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0] || null); 
  const [searchTerm, setSearchTerm] = useState('');

  // PERMISSION CHECK
  const canEdit = currentUser.role === Role.MC_ADMIN;

  const handleStatusChange = (status: AgentStatus) => {
    if (selectedAgent && canEdit) {
      store.updateAgent(selectedAgent.id, { status });
      setSelectedAgent({ ...selectedAgent, status });
    }
  };

  const handleAutonomyChange = (autonomy: AutonomyLevel) => {
    if (selectedAgent && canEdit) {
      store.updateAgent(selectedAgent.id, { autonomy });
      setSelectedAgent({ ...selectedAgent, autonomy });
    }
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter logs for selected agent
  const currentLogs = selectedAgent ? agentRunLogs.filter(l => l.agent_id === selectedAgent.id).slice(0, 10) : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* 1. MASTER HEADER - System Wide Controls */}
      <div className="flex-none bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-brand-900 rounded-lg border border-brand-700">
              <Activity className="w-5 h-5 text-brand-400" />
           </div>
           <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                AI Control Center
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">v2.4.0</span>
              </h2>
              <p className="text-xs text-slate-400">Orchestration & Autonomy Management</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 text-right">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System State</span>
                <span className={`text-sm font-bold flex items-center gap-1.5 ${killSwitch ? 'text-red-500' : 'text-green-500'}`}>
                   <span className={`w-2 h-2 rounded-full ${killSwitch ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                   {killSwitch ? 'EMERGENCY STOP' : 'OPERATIONAL'}
                </span>
              </div>
           </div>
           
           {canEdit && (
              <div className="h-8 w-px bg-slate-700 mx-2" />
           )}

           {canEdit && (
              <button 
                onClick={() => store.toggleKillSwitch()}
                className={`group flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs transition-all border ${
                  killSwitch 
                    ? 'bg-green-600 border-green-500 hover:bg-green-500 text-white' 
                    : 'bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50 hover:text-red-200'
                }`}
              >
                <Power className="w-4 h-4" />
                {killSwitch ? 'RESTORE SYSTEMS' : 'KILL SWITCH'}
              </button>
           )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. SIDEBAR - Agent List */}
        <div className="w-80 flex-none border-r border-slate-200 bg-slate-50 flex flex-col">
           {/* Search */}
           <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Filter agents..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500"
                 />
              </div>
           </div>

           {/* List */}
           <div className="flex-1 overflow-y-auto">
              {filteredAgents.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`px-4 py-3 border-b border-slate-100 cursor-pointer transition-colors hover:bg-white group ${
                    selectedAgent?.id === agent.id 
                      ? 'bg-white border-l-4 border-l-brand-600 shadow-sm z-10 relative' 
                      : 'border-l-4 border-l-transparent text-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold ${selectedAgent?.id === agent.id ? 'text-slate-900' : 'text-slate-700'}`}>
                       {agent.name}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${agent.status === AgentStatus.ENABLED ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                     <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">
                        {agent.code}
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className={`text-[10px] font-medium px-1.5 rounded ${
                        agent.autonomy === AutonomyLevel.AUTO_EXECUTE ? 'text-red-700 bg-red-50' :
                        agent.autonomy === AutonomyLevel.DRAFT_ONLY ? 'text-amber-700 bg-amber-50' :
                        'text-blue-700 bg-blue-50'
                     }`}>
                        {agent.autonomy.replace('_', ' ')}
                     </span>
                     <ChevronRight className={`w-3 h-3 text-slate-300 ${selectedAgent?.id === agent.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* 3. MAIN CONTENT - Agent Detail */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
           {selectedAgent ? (
             <>
               {/* Detail Toolbar */}
               <div className="flex-none p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h3>
                     <p className="text-xs text-slate-500">{selectedAgent.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     {!canEdit && (
                       <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-100 mr-2">Read Only</span>
                     )}
                     
                     <Button 
                       size="sm"
                       variant="outline"
                       onClick={() => store.runOpsAgent(selectedAgent.id, 'DRAFT')} 
                       disabled={killSwitch || selectedAgent.status === AgentStatus.DISABLED}
                       className="text-amber-700 border-amber-200 hover:bg-amber-50"
                     >
                       <FileText className="w-3 h-3 mr-2" /> 
                       Run Plan (Draft)
                     </Button>

                     <Button 
                       size="sm"
                       variant="outline"
                       onClick={() => store.runOpsAgent(selectedAgent.id)} 
                       disabled={killSwitch || selectedAgent.status === AgentStatus.DISABLED}
                       className="text-blue-700 border-blue-200 hover:bg-blue-50"
                     >
                       <Play className="w-3 h-3 mr-2" /> 
                       Run Now
                     </Button>

                     <Button 
                       size="sm"
                       onClick={() => store.runOpsAgent(selectedAgent.id, 'AUTO')} 
                       disabled={killSwitch || selectedAgent.status === AgentStatus.DISABLED}
                       className="bg-red-600 hover:bg-red-700 text-white"
                     >
                       <CloudLightning className="w-3 h-3 mr-2" /> 
                       Run Auto
                     </Button>
                  </div>
               </div>

               {/* Scrollable Config Area */}
               <div className="flex-1 overflow-y-auto">
                  
                  {/* Status & Autonomy Control Panel */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 border-b border-slate-100 bg-slate-50/50">
                     
                     {/* Status Controls */}
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Operational Status</label>
                        <div className="flex rounded-md shadow-sm">
                           {[AgentStatus.ENABLED, AgentStatus.PAUSED, AgentStatus.DISABLED].map((s) => {
                             const isActive = selectedAgent.status === s;
                             let activeClass = '';
                             if(s === AgentStatus.ENABLED) activeClass = 'bg-green-600 text-white border-green-600 hover:bg-green-700';
                             if(s === AgentStatus.PAUSED) activeClass = 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600';
                             if(s === AgentStatus.DISABLED) activeClass = 'bg-slate-600 text-white border-slate-600 hover:bg-slate-700';

                             return (
                               <button
                                 key={s}
                                 disabled={!canEdit}
                                 onClick={() => handleStatusChange(s)}
                                 className={`flex-1 py-2 text-xs font-bold first:rounded-l-md last:rounded-r-md border transition-all ${
                                    isActive 
                                    ? activeClass 
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                 }`}
                               >
                                 {s}
                               </button>
                             )
                           })}
                        </div>
                     </div>

                     {/* Autonomy Controls */}
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Autonomy Level</label>
                        <div className="flex rounded-md shadow-sm">
                           {[
                             { level: AutonomyLevel.OBSERVE_ONLY, icon: Eye, label: 'Observe', color: 'blue' },
                             { level: AutonomyLevel.DRAFT_ONLY, icon: Edit3, label: 'Draft', color: 'amber' },
                             { level: AutonomyLevel.AUTO_EXECUTE, icon: Zap, label: 'Auto-Execute', color: 'red' }
                           ].map((opt) => {
                             const isActive = selectedAgent.autonomy === opt.level;
                             const Icon = opt.icon;
                             
                             let activeClass = '';
                             if(opt.color === 'blue') activeClass = 'bg-blue-600 text-white border-blue-600';
                             if(opt.color === 'amber') activeClass = 'bg-amber-500 text-white border-amber-500';
                             if(opt.color === 'red') activeClass = 'bg-red-600 text-white border-red-600';

                             return (
                               <button
                                 key={opt.level}
                                 disabled={!canEdit}
                                 onClick={() => handleAutonomyChange(opt.level)}
                                 className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 first:rounded-l-md last:rounded-r-md border transition-all ${
                                    isActive 
                                    ? activeClass 
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                 }`}
                               >
                                 <Icon className="w-3 h-3" /> {opt.label}
                               </button>
                             )
                           })}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                     
                     {/* LEFT COL: Instructions */}
                     <div className="space-y-6">
                        <div>
                           <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                             <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                             System Instructions
                           </h4>
                           <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 italic font-medium">
                              "{selectedAgent.system_instructions}"
                           </div>
                        </div>

                        <div>
                           <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                             <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                             Behavior Rules
                           </h4>
                           <ul className="space-y-2">
                              {selectedAgent.behavior_rules.split('. ').map((rule, i) => (
                                 <li key={i} className="flex gap-2 text-xs text-slate-600">
                                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] flex items-center justify-center flex-shrink-0 border border-slate-200">{i+1}</span>
                                    <span className="mt-0.5">{rule.replace(/^\d\)\s*/, '')}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     {/* RIGHT COL: Permissions */}
                     <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          Permissions Matrix
                        </h4>
                        
                        <div className="space-y-3">
                           {/* Auto Execute */}
                           <div className="border border-green-200 rounded-md overflow-hidden">
                              <div className="bg-green-50 px-3 py-2 border-b border-green-100 flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-green-800 uppercase flex items-center gap-1.5">
                                    <Zap className="w-3 h-3" /> Auto-Execute Allowed
                                 </span>
                              </div>
                              <div className="p-2 bg-white flex flex-wrap gap-1.5">
                                 {selectedAgent.allowed_actions.auto_execute?.length ? (
                                    selectedAgent.allowed_actions.auto_execute.map(a => (
                                       <code key={a} className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded text-[10px]">{a}</code>
                                    ))
                                 ) : (
                                    <span className="text-[10px] text-slate-400 px-1">None authorized</span>
                                 )}
                              </div>
                           </div>

                           {/* Draft Only */}
                           <div className="border border-amber-200 rounded-md overflow-hidden">
                              <div className="bg-amber-50 px-3 py-2 border-b border-amber-100 flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1.5">
                                    <Edit3 className="w-3 h-3" /> Draft / Approval Required
                                 </span>
                              </div>
                              <div className="p-2 bg-white flex flex-wrap gap-1.5">
                                 {selectedAgent.allowed_actions.draft_only?.length ? (
                                    selectedAgent.allowed_actions.draft_only.map(a => (
                                       <code key={a} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px]">{a}</code>
                                    ))
                                 ) : (
                                    <span className="text-[10px] text-slate-400 px-1">None</span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Run History Logs */}
               <div className="flex-none bg-slate-900 border-t border-slate-700 text-slate-300 h-56 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/50">
                     <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> EXECUTION_LOGS [{selectedAgent.code}]
                     </span>
                     <span className="text-[10px] text-slate-500">Live Stream</span>
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-xs custom-scrollbar">
                     <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-500 font-bold">
                           <tr>
                              <th className="px-4 py-2 w-32">Time</th>
                              <th className="px-4 py-2 w-24">Mode</th>
                              <th className="px-4 py-2">Actions Applied</th>
                              <th className="px-4 py-2 text-right">Run ID</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                           {currentLogs.length > 0 ? (
                              currentLogs.map(log => {
                                 const appliedCount = log.applied_actions.filter(a => a.status === 'APPLIED').length;
                                 const skippedCount = log.applied_actions.filter(a => a.status === 'SKIPPED').length;
                                 const failedCount = log.applied_actions.filter(a => a.status === 'FAILED').length;
                                 
                                 return (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                       <td className="px-4 py-2 text-slate-400">{new Date(log.started_at).toLocaleTimeString()}</td>
                                       <td className="px-4 py-2">
                                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                             log.autonomy === 'AUTO' ? 'bg-red-900/50 text-red-300 border border-red-900' :
                                             log.autonomy === 'DRAFT' ? 'bg-amber-900/50 text-amber-300 border border-amber-900' :
                                             'bg-blue-900/50 text-blue-300 border border-blue-900'
                                          }`}>
                                             {log.autonomy}
                                          </span>
                                       </td>
                                       <td className="px-4 py-2">
                                          <div className="flex gap-2">
                                             {appliedCount > 0 && <span className="text-green-400">{appliedCount} applied</span>}
                                             {skippedCount > 0 && <span className="text-slate-500">{skippedCount} skipped</span>}
                                             {failedCount > 0 && <span className="text-red-400">{failedCount} failed</span>}
                                             {log.kill_switch && <span className="text-red-500 font-bold uppercase ml-2">KILL SWITCH</span>}
                                          </div>
                                       </td>
                                       <td className="px-4 py-2 text-right text-slate-600 font-mono text-[10px]">{log.id.slice(-6)}</td>
                                    </tr>
                                 );
                              })
                           ) : (
                              <tr>
                                 <td colSpan={4} className="px-4 py-8 text-center text-slate-600 italic">No recent execution logs.</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
             </>
           ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                 <Server className="w-16 h-16 mb-4 opacity-10" />
                 <p className="font-medium">Select an agent from the list</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
