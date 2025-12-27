import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ClipboardList, CheckCircle, Clock, Heart, Plus, Activity, 
  AlertCircle, FileText, ArrowRight, Phone, MapPin, ChevronRight,
  Shield, Calendar, Signal, Wifi, Battery, Home, UserCircle, Bell, ArrowLeft, Mail,
  HeartPulse, Stethoscope, UserPlus
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
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const highRiskClients = clients.filter((c: any) => c.risk_level === 'HIGH');

  const MobilePatientCard = ({ client }: any) => (
    <div 
      onClick={() => setSelectedClientId(client.id)}
      className="bg-white/70 backdrop-blur-md p-5 rounded-[2.5rem] border border-white shadow-sm active:scale-95 transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-5">
        <div className={`w-15 h-15 rounded-3xl flex items-center justify-center text-xl font-black border-2 italic transition-transform group-hover:scale-110 duration-500 ${client.risk_level === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100'} shadow-lg`}>
          {client.full_name.charAt(0)}
        </div>
        <div>
          <h4 className="font-black text-slate-900 text-lg uppercase tracking-tighter italic leading-none mb-1">{client.full_name}</h4>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             <MapPin className="w-3 h-3" /> {client.address.split(',')[0]}
          </div>
        </div>
      </div>
      <div className="p-3 rounded-full bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );

  if (selectedClientId) {
    const client = clients.find((c: any) => c.id === selectedClientId);
    return (
      <div className="fixed inset-0 z-50 bg-[#f1f5f9] flex flex-col font-sans animate-in slide-in-from-right-12 duration-500">
         {/* Patient Context HUD */}
         <div className="bg-[#0f172a] text-white p-6 pt-14 pb-12 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-rose-500 rounded-full blur-[110px] opacity-10 -mr-10 -mt-10"></div>
            <div className="flex justify-between items-center relative z-10">
               <button onClick={() => setSelectedClientId(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 backdrop-blur-md">
                  <ArrowLeft className="w-6 h-6 text-white" />
               </button>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <HeartPulse className="w-7 h-7 text-rose-400" />
               </div>
            </div>
            
            <div className="text-center mt-8 relative z-10">
               <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black border-2 border-white/20 shadow-inner italic">
                  {client.full_name.charAt(0)}
               </div>
               <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-3">{client.full_name}</h2>
               <div className="flex justify-center gap-3">
                  <Badge color={client.status === 'ACTIVE' ? 'cyan' : 'gray'}>{client.status}</Badge>
                  {client.risk_level === 'HIGH' && <Badge color="red">CRITICAL PATHWAY</Badge>}
               </div>
            </div>
         </div>

         {/* Interaction Content */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 -mt-6">
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white shadow-xl">
               <div className="grid grid-cols-2 divide-x divide-slate-100">
                  <button className="py-8 flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors active:scale-95 rounded-l-[2rem]">
                     <div className="p-4 bg-emerald-100 text-emerald-600 rounded-3xl shadow-emerald-50 shadow-lg"><Phone className="w-7 h-7" /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 italic">Call Patient</span>
                  </button>
                  <button className="py-8 flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors active:scale-95 rounded-r-[2rem]">
                     <div className="p-4 bg-blue-100 text-blue-600 rounded-3xl shadow-blue-50 shadow-lg"><Mail className="w-7 h-7" /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 italic">Send Alert</span>
                  </button>
               </div>
            </div>

            <Card title="Clinical Summary" subtitle="Last Observation" className="rounded-[2.5rem] border-white shadow-lg overflow-hidden">
               <div className="p-4 bg-slate-50/50 rounded-3xl border border-slate-100 text-base text-slate-700 leading-relaxed font-bold italic">
                  "Patient reports consistent mobility improvements. Verification of glucose hub link required during this sequence."
               </div>
               <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <p className="text-xs font-bold text-blue-800 italic">{client.address}</p>
               </div>
            </Card>
         </div>

         {/* Sequence Footer */}
         <div className="p-6 bg-white border-t border-slate-200 pb-10">
            <Button onClick={() => setSelectedClientId(null)} className="w-full h-18 py-5 bg-[#0f172a] text-white font-black tracking-tighter uppercase text-xl shadow-2xl rounded-3xl italic active:scale-95 transition-transform">
               Finalize Sequence
            </Button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-[#f1f5f9] min-h-screen">
       {/* CARE HUD HEADER */}
       <div className="bg-[#0f172a] text-white p-8 pt-16 pb-14 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[120px] opacity-10 -mr-16 -mt-16"></div>
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-12">
                <div>
                   <h1 className="text-3xl font-black tracking-tighter leading-none uppercase italic">Care Hub</h1>
                   <div className="flex items-center gap-2 mt-4 text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] italic">Sequence Active</p>
                   </div>
                </div>
                <button className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-inner relative">
                   <Bell className="w-7 h-7 text-slate-300" />
                   {highRiskClients.length > 0 && <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0f172a]" />}
                </button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-inner">
                   <span className="block text-4xl font-black tracking-tighter italic">{clients.length}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Total Load</span>
                </div>
                <div className={`backdrop-blur-xl border p-6 rounded-[2.5rem] shadow-inner transition-colors duration-700 ${highRiskClients.length > 0 ? 'bg-rose-500/20 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
                   <span className={`block text-4xl font-black tracking-tighter italic ${highRiskClients.length > 0 ? 'text-rose-400' : 'text-white'}`}>{highRiskClients.length}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Intervention</span>
                </div>
             </div>
          </div>
       </div>

       {/* WORKFLOW SECTIONS */}
       <div className="px-6 space-y-10 pb-20">
          {highRiskClients.length > 0 && (
            <div className="space-y-5">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] flex items-center gap-2 italic">
                     <AlertCircle className="w-4 h-4" /> Immediate Sequence
                  </h3>
                  <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase italic">Action Reqd</span>
               </div>
               {highRiskClients.map((c: any) => <MobilePatientCard key={c.id} client={c} />)}
            </div>
          )}

          <div className="space-y-5">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-2 italic">
                   <Stethoscope className="w-4 h-4" /> Client Registry
                </h3>
                <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors">
                   <UserPlus className="w-5 h-5" />
                </button>
             </div>
             <div className="space-y-4">
                {clients.filter((c:any) => c.risk_level !== 'HIGH').map((c: any) => <MobilePatientCard key={c.id} client={c} />)}
             </div>
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
