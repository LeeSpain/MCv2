
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { 
  User, Mail, Phone, Lock, Bell, 
  Globe, Moon, LogOut, Save, Smartphone, 
  Terminal, Activity, Power, Search, Play, 
  Eye, Edit3, Zap, AlertTriangle, BookOpen, 
  ShieldAlert, ChevronRight, Server, XCircle
} from 'lucide-react';
import { Role, Agent, AgentStatus, AutonomyLevel } from '../types';

export const Settings: React.FC = () => {
  const { currentUser, agents, killSwitch } = useStore();
  
  // Tabs: 'PROFILE', 'NOTIFICATIONS', 'SECURITY', 'AI_SYSTEM' (Admin Only)
  const [activeTab, setActiveTab] = useState('PROFILE');

  // --- RENDER HELPERS ---
  const renderTabButton = (id: string, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        activeTab === id 
          ? 'bg-brand-50 text-brand-700 font-bold' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <User className="w-6 h-6 text-brand-600" />
             Account & System Settings
           </h2>
           <p className="text-xs text-slate-500 mt-1">Manage your profile, security, and global system configuration.</p>
        </div>
      </div>

      {/* Main Layout - Full Height Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <Card noPadding className="h-full flex flex-col">
            <div className="p-2 flex-1">
               <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Settings</div>
               <nav className="space-y-0.5">
                  {renderTabButton('PROFILE', 'My Profile', <User className="w-4 h-4" />)}
                  {renderTabButton('NOTIFICATIONS', 'Notifications', <Bell className="w-4 h-4" />)}
                  {renderTabButton('SECURITY', 'Security', <Lock className="w-4 h-4" />)}
               </nav>
               
               {/* ADMIN ONLY SECTION */}
               {currentUser.role === Role.MC_ADMIN && (
                 <>
                   <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">System Administration</div>
                   <nav className="space-y-0.5">
                      {renderTabButton('AI_SYSTEM', 'AI Control Center', <Terminal className="w-4 h-4" />)}
                   </nav>
                 </>
               )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
               <button className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-sm">
                  <LogOut className="w-4 h-4" />
                  Sign Out
               </button>
            </div>
          </Card>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-3 h-full overflow-hidden flex flex-col">
           
           {/* 1. PROFILE SETTINGS */}
           {activeTab === 'PROFILE' && (
              <div className="h-full overflow-y-auto pr-2 space-y-6">
                 <Card title="Personal Information">
                    <div className="flex flex-col md:flex-row gap-8 items-start p-2">
                       <div className="flex-shrink-0 flex flex-col items-center gap-3">
                          <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-white shadow-md">
                             {currentUser.name.charAt(0)}
                          </div>
                          <button className="text-xs text-brand-600 font-bold hover:underline">Change Avatar</button>
                       </div>
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                             <input type="text" defaultValue={currentUser.name} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                             <div className="p-2.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-600 flex items-center justify-between border border-slate-200 cursor-not-allowed">
                                {currentUser.role}
                                <Lock className="w-3 h-3 text-slate-400" />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="email" defaultValue={`${currentUser.name.toLowerCase().replace(' ', '.')}@mobilecare.nl`} className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                             <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="tel" defaultValue="+31 6 1234 5678" className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </Card>

                 <Card title="Preferences">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Language</label>
                          <div className="relative">
                             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <select className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                                <option>Nederlands (Dutch)</option>
                                <option>English (US)</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Theme</label>
                          <div className="relative">
                             <Moon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <select className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                                <option>Light Mode</option>
                                <option>Dark Mode</option>
                                <option>System Default</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 </Card>

                 <div className="flex justify-end pt-4">
                    <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg px-8">
                       <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                 </div>
              </div>
           )}

           {/* 2. NOTIFICATIONS */}
           {activeTab === 'NOTIFICATIONS' && (
              <div className="h-full overflow-y-auto pr-2 space-y-6">
                 <Card title="Communication Channels">
                    <div className="space-y-4">
                       {[
                          { label: 'Email Notifications', desc: 'Receive daily digests and critical alerts via email.', icon: Mail },
                          { label: 'SMS Alerts', desc: 'Urgent operational blockers will be sent to your phone.', icon: Smartphone },
                          { label: 'Push Notifications', desc: 'Real-time updates on your active dashboard.', icon: Bell },
                       ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                             <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white rounded-lg shadow-sm text-brand-600 border border-slate-100">
                                   <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-sm text-slate-900">{item.label}</h4>
                                   <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                             </div>
                             <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id={`toggle-${i}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-brand-200 checked:right-0 checked:border-brand-600" defaultChecked />
                                <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-brand-200 cursor-pointer checked:bg-brand-600"></label>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>

                 <Card title="Alert Preferences">
                    <div className="space-y-4 p-2">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                          <span className="text-sm font-medium text-slate-700">Notify me immediately about SLA Breaches</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                          <span className="text-sm font-medium text-slate-700">Notify me when new Exceptions are assigned to my role</span>
                       </div>
                       {currentUser.role !== Role.INSTALLER && (
                          <div className="flex items-center gap-3">
                             <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                             <span className="text-sm font-medium text-slate-700">Receive Daily Morning Briefing (07:00 AM)</span>
                          </div>
                       )}
                    </div>
                 </Card>
              </div>
           )}

           {/* 3. SECURITY */}
           {activeTab === 'SECURITY' && (
              <div className="h-full overflow-y-auto pr-2 space-y-6">
                 <Card title="Password & Authentication">
                    <div className="space-y-5 max-w-lg p-2">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                          <input type="password" value="********" disabled className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 cursor-not-allowed" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                          <input type="password" placeholder="Min. 8 characters" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
                          <input type="password" placeholder="Re-enter password" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                       </div>
                       <div className="pt-2">
                          <Button variant="outline" className="w-full">Update Password</Button>
                       </div>
                    </div>
                 </Card>

                 <Card title="Active Sessions">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <Smartphone className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm text-green-900">Current Session</h4>
                                <p className="text-xs text-green-700">Chrome on macOS • Amsterdam, NL</p>
                             </div>
                          </div>
                          <Badge color="green">Active Now</Badge>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl opacity-70">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500">
                                <Smartphone className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm text-slate-700">iPhone 14 Pro</h4>
                                <p className="text-xs text-slate-500">App Login • 2 hours ago</p>
                             </div>
                          </div>
                          <button className="text-xs text-red-600 font-bold hover:underline">Revoke</button>
                       </div>
                    </div>
                 </Card>
              </div>
           )}

           {/* 4. AI CONTROL CENTER (ADMIN ONLY) */}
           {activeTab === 'AI_SYSTEM' && currentUser.role === Role.MC_ADMIN && (
              <div className="h-full">
                 <AiControlPanel agents={agents} killSwitch={killSwitch} />
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// SUB-COMPONENT: AI CONTROL PANEL (Transplanted from SettingsAgents.tsx)
// ==================================================================================
const AiControlPanel: React.FC<{ agents: Agent[], killSwitch: boolean }> = ({ agents, killSwitch }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (status: AgentStatus) => {
    if (selectedAgent) {
      store.updateAgent(selectedAgent.id, { status });
      setSelectedAgent({ ...selectedAgent, status });
    }
  };

  const handleAutonomyChange = (autonomy: AutonomyLevel) => {
    if (selectedAgent) {
      store.updateAgent(selectedAgent.id, { autonomy });
      setSelectedAgent({ ...selectedAgent, autonomy });
    }
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full">
      
      {/* 1. MASTER HEADER */}
      <div className="flex-none bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-brand-900 rounded-lg border border-brand-700">
              <Activity className="w-5 h-5 text-brand-400" />
           </div>
           <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Orchestration Engine
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">v2.4.0</span>
              </h2>
           </div>
        </div>
        
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
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. SIDEBAR LIST */}
        <div className="w-72 flex-none border-r border-slate-200 bg-slate-50 flex flex-col">
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

        {/* 3. AGENT DETAIL */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
           {selectedAgent ? (
             <>
               <div className="flex-none p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h3>
                     <p className="text-xs text-slate-500">{selectedAgent.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Button 
                       size="sm"
                       onClick={() => store.runAgent(selectedAgent.id)} 
                       disabled={killSwitch || selectedAgent.status === AgentStatus.DISABLED}
                       className={selectedAgent.status === AgentStatus.ENABLED ? 'bg-green-600 hover:bg-green-700' : ''}
                     >
                       <Play className="w-3 h-3 mr-2" /> 
                       Run Cycle
                     </Button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto">
                  
                  {/* Controls */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 border-b border-slate-100 bg-slate-50/50">
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
                                 onClick={() => handleStatusChange(s)}
                                 className={`flex-1 py-2 text-xs font-bold first:rounded-l-md last:rounded-r-md border transition-all ${
                                    isActive ? activeClass : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                 }`}
                               >
                                 {s}
                               </button>
                             )
                           })}
                        </div>
                     </div>

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
                                 onClick={() => handleAutonomyChange(opt.level)}
                                 className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 first:rounded-l-md last:rounded-r-md border transition-all ${
                                    isActive ? activeClass : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                 }`}
                               >
                                 <Icon className="w-3 h-3" /> {opt.label}
                               </button>
                             )
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Permissions & Rules */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                             <BookOpen className="w-3.5 h-3.5 text-slate-400" /> System Instructions
                           </h4>
                           <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 italic font-medium">
                              "{selectedAgent.system_instructions}"
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Permissions Matrix
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
                                 ) : <span className="text-[10px] text-slate-400 px-1">None authorized</span>}
                              </div>
                           </div>
                           
                           {/* Forbidden */}
                           <div className="border border-red-100 rounded-md overflow-hidden opacity-80">
                              <div className="bg-red-50 px-3 py-2 border-b border-red-100 flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-red-800 uppercase flex items-center gap-1.5">
                                    <XCircle className="w-3 h-3" /> Strictly Forbidden
                                 </span>
                              </div>
                              <div className="p-2 bg-white flex flex-wrap gap-1.5">
                                 {selectedAgent.restricted_actions.never?.map(a => (
                                    <code key={a} className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-[10px] line-through decoration-red-300">{a}</code>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Console Footer */}
               <div className="flex-none bg-slate-900 border-t border-slate-700 text-slate-300 h-48 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/50">
                     <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> AGENT_OUTPUT_STREAM
                     </span>
                     <span className="text-[10px] text-slate-500">Live Connection • Latency 12ms</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 custom-scrollbar">
                     {selectedAgent.logs.length > 0 ? (
                        selectedAgent.logs.map((log, i) => (
                           <div key={i} className="flex gap-2 hover:bg-white/5 py-0.5 -mx-2 px-2 rounded">
                              <span className="text-slate-500 flex-shrink-0 w-20">[{new Date().toLocaleTimeString()}]</span>
                              <span className={log.includes('[AUTO]') ? 'text-red-400' : log.includes('[DRAFT]') ? 'text-amber-400' : 'text-blue-300'}>{log}</span>
                           </div>
                        ))
                     ) : (
                        <div className="text-slate-600 italic opacity-50">System ready. Waiting for execution trigger...</div>
                     )}
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
