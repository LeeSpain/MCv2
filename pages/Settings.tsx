
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Bell, 
  Globe, Moon, LogOut, Save, Smartphone, 
  Terminal, Activity, Power, ArrowRight
} from 'lucide-react';
import { Role } from '../types';

export const Settings: React.FC = () => {
  const { currentUser, agents, killSwitch } = useStore();
  const navigate = useNavigate();
  
  // Tabs: 'PROFILE', 'NOTIFICATIONS', 'SECURITY', 'AI_SYSTEM' (Admin Only)
  const [activeTab, setActiveTab] = useState('PROFILE');

  const handleSave = () => {
      alert("Settings saved successfully.");
  };

  const handleSignOut = () => {
      if (confirm("Are you sure you want to sign out?")) {
          // Simulate logout
          window.location.reload();
      }
  };

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
               <button onClick={handleSignOut} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-sm">
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
                    <Button onClick={handleSave} className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg px-8">
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

           {/* 4. AI CONTROL CENTER REDIRECT */}
           {activeTab === 'AI_SYSTEM' && currentUser.role === Role.MC_ADMIN && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-100 rounded-xl">
                 <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                    <Activity className="w-10 h-10 text-brand-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Orchestration Console</h2>
                 <p className="text-slate-600 max-w-md mb-8">
                    Advanced agent configuration, logs, and autonomy controls have been moved to the dedicated Orchestration Engine interface.
                 </p>
                 <Button onClick={() => navigate('/settings/agents')} className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white shadow-lg text-sm font-bold flex items-center">
                    Launch Console <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
