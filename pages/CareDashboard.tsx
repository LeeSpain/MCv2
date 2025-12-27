import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ClipboardList, CheckCircle, Clock, Heart, Plus, Activity, 
  AlertCircle, FileText, ArrowRight, Phone, MapPin, ChevronRight,
  Shield, Calendar, Home, Bell, ArrowLeft, Mail,
  HeartPulse, Stethoscope, UserPlus, FileCheck, AlertTriangle
} from 'lucide-react';
import { Role } from '../types';

export const CareDashboard: React.FC = () => {
  const { clients, cases, devices, jobs, currentUser, assessments } = useStore();
  const navigate = useNavigate();

  const companyClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  
  if (currentUser.role === Role.CARE_COMPANY_NURSE) {
    return <MobileNurseView clients={companyClients} currentUser={currentUser} devices={devices} jobs={jobs} />;
  }

  return <DesktopLeadView clients={companyClients} cases={cases} devices={devices} jobs={jobs} assessments={assessments} currentUser={currentUser} />;
};

const MobileNurseView: React.FC<any> = ({ clients, currentUser, devices, jobs }) => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const highRiskClients = clients.filter((c: any) => c.risk_level === 'HIGH');

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
       {/* 1. CLINICAL HEADER */}
       <div className="bg-slate-900 text-white px-8 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px] -mr-8 -mt-8"></div>
          
          <div className="relative z-10 flex justify-between items-center mb-10">
             <div>
                <h1 className="text-3xl font-black tracking-tighter leading-tight italic">
                   Hello,<br/>
                   <span className="text-rose-400">Nurse {currentUser.name.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                   Home Care • Thuiszorg West
                </p>
             </div>
             <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner group">
                <HeartPulse className="w-8 h-8 text-rose-300 group-hover:text-rose-400 transition-colors" />
             </div>
          </div>
          
          {/* REFINED STATS BAR */}
          <div className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 grid grid-cols-2 divide-x divide-white/10 shadow-xl">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Patients</span>
                <span className="text-3xl font-black italic tracking-tighter leading-none">{clients.length}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Open Alerts</span>
                <span className={`text-3xl font-black italic tracking-tighter leading-none ${highRiskClients.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                   {highRiskClients.length}
                </span>
             </div>
          </div>
       </div>

       {/* 2. ATTENTION REQUIRED - TRIAGE VIEW */}
       <div className="px-6 pt-10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
                <AlertCircle className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Critical Triage</h3>
          </div>
          
          {highRiskClients.length > 0 ? (
             highRiskClients.map(c => (
                <div key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="bg-rose-50 border-2 border-rose-100 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm">
                   <div className="flex items-center gap-5">
                      <div className="relative">
                         <div className="w-14 h-14 bg-white rounded-2xl border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm group-hover:rotate-6 transition-transform">
                            <Activity className="w-7 h-7" />
                         </div>
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-4 border-white animate-pulse" />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-lg italic leading-tight">{c.full_name}</h4>
                         <p className="text-[10px] font-black text-rose-700 uppercase tracking-tighter mt-1 italic">High Risk Profile • Action Required</p>
                      </div>
                   </div>
                   <div className="bg-white/50 p-2 rounded-full text-rose-400 group-hover:bg-rose-100 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
             ))
          ) : (
             <div className="p-8 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 italic text-slate-400 text-xs font-bold tracking-wider">No pending clinical alerts.</div>
          )}
       </div>

       {/* 3. QUICK UTILITIES */}
       <div className="px-6 pt-12 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Command Center</h3>
          <div className="grid grid-cols-2 gap-5">
             <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4 active:scale-95 transition-all group hover:border-brand-300">
                <div className="p-4 bg-brand-50 text-brand-600 rounded-3xl shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all"><Plus className="w-6 h-6" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">New Request</span>
             </button>
             <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4 active:scale-95 transition-all group hover:border-amber-300">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-all"><AlertCircle className="w-6 h-6" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Report Issue</span>
             </button>
          </div>
       </div>

       {/* 4. REFINED PATIENT DIRECTORY */}
       <div className="px-6 pt-12 space-y-6">
          <div className="flex justify-between items-center ml-1">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Caseload</h3>
             <button onClick={() => navigate('/clients')} className="text-[10px] font-black text-brand-600 uppercase tracking-widest border-b-2 border-brand-100 pb-0.5">Directory</button>
          </div>
          
          <div className="space-y-5">
             {clients.filter((c:any) => c.risk_level !== 'HIGH').slice(0,3).map((client: any) => (
                <div key={client.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center font-black text-slate-400 text-xl italic shadow-inner">
                            {client.full_name.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900 text-xl leading-none italic mb-2 group-hover:text-brand-600 transition-colors">{client.full_name}</h4>
                            <div className="flex items-center gap-2 text-slate-400">
                               <MapPin className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-bold uppercase tracking-wider">{client.address.split(',')[0]}</span>
                            </div>
                         </div>
                      </div>
                      <Badge color="cyan">Active</Badge>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2.5 py-4 border-2 border-slate-100 rounded-2xl text-slate-700 font-black text-[10px] uppercase tracking-widest active:bg-slate-50 hover:border-slate-200 transition-all">
                         <Phone className="w-4 h-4" /> Call
                      </button>
                      <button 
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="flex items-center justify-center gap-2.5 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-slate-200"
                      >
                         Profile <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const DesktopLeadView: React.FC<any> = ({ clients, cases, devices, assessments, currentUser }) => {
  const navigate = useNavigate();
  const myClients = clients; 
  const myCases = cases.filter((c: any) => c.care_company_id === currentUser.care_company_id);
  const pendingConfirmations = devices.filter((d: any) => d.confirmation_needed && d.assigned_client_id && myClients.map((c:any) => c.id).includes(d.assigned_client_id));

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-end border-b border-slate-200 pb-8 gap-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
             <Heart className="w-3 h-3" /> Care Lead Console
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase italic">
              Operational Control
           </h1>
           <p className="text-slate-500 mt-1 font-medium">Overseeing {myClients.length} active clinical pathways.</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           <Button variant="outline" onClick={() => navigate('/clients')} className="flex-1 lg:flex-none h-12 uppercase tracking-widest text-[10px] font-black italic">Client Directory</Button>
           <Button onClick={() => navigate('/clients')} className="flex-1 lg:flex-none bg-brand-600 hover:bg-brand-700 text-white shadow-xl h-12 uppercase tracking-widest text-[10px] font-black italic border-0">Initiate Request</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard label="Active Caseload" value={myClients.length} sub="Verified Citizens" icon={Users} color="blue" />
         <KPICard label="Fleet Expansion" value={myCases.filter((c: any) => c.status !== 'CLOSED').length} sub="Pending Orders" icon={ClipboardList} color="purple" />
         <KPICard label="Audit Actions" value={pendingConfirmations.length} sub="Checks Needed" icon={CheckCircle} color="amber" />
         <KPICard label="System Risk" value={myClients.filter((c:any) => c.risk_level === 'HIGH').length} sub="High Priority" icon={Activity} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            <Card title="Active Workflow Stream" noPadding className="shadow-lg overflow-hidden border-slate-200">
               <div className="divide-y divide-slate-100">
                  {myCases.slice(0, 6).map((c: any) => (
                    <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate('/orders')}>
                       <div className="flex items-center gap-6">
                          <div className={`w-3 h-3 rounded-full ${c.status === 'NEW' ? 'bg-blue-500 animate-pulse' : c.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <div>
                             <h4 className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-brand-600 transition-colors italic">Order #{c.id}</h4>
                             <p className="text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-widest italic">{c.client_name} • {c.status.replace(/_/g, ' ')}</p>
                          </div>
                       </div>
                       <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:text-brand-600 transition-all">
                          <ChevronRight className="w-5 h-5" />
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="space-y-6">
            <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
               <Activity className="w-5 h-5 text-red-500" /> Strategic Risks
            </h3>
            <div className="space-y-4">
               {myClients.filter((c:any) => c.risk_level === 'HIGH').slice(0, 4).map((c: any) => (
                  <Card key={c.id} noPadding className="border-red-100 group cursor-pointer hover:shadow-md transition-all overflow-hidden" onClick={() => navigate(`/clients/${c.id}`)}>
                     <div className="p-5 flex justify-between items-center bg-red-50/10">
                        <div>
                           <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter group-hover:text-red-700 transition-colors italic">{c.full_name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">High Accountability Zone</p>
                        </div>
                        <Badge color="red">PRIORITY</Badge>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, sub, icon: Icon, color = "blue" }: any) => (
  <Card className="h-36 flex flex-col justify-between hover:border-slate-300 transition-all group shadow-sm">
     <div className="flex justify-between items-start">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</span>
        <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-${color}-50 group-hover:text-${color}-600 transition-colors shadow-inner`}>
           <Icon className="w-5 h-5" />
        </div>
     </div>
     <div>
        <span className="text-4xl font-black tracking-tighter text-slate-900 leading-none italic">{value}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2 italic">{sub}</span>
     </div>
  </Card>
);
