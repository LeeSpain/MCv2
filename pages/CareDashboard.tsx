
import React from 'react';
import { useStore } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, ClipboardList, CheckCircle, Clock, Heart, Plus, Activity, 
  AlertCircle, FileText, ArrowRight, Phone, MapPin, ChevronRight,
  Shield, Calendar
} from 'lucide-react';
import { Role } from '../types';

export const CareDashboard: React.FC = () => {
  const { clients, cases, devices, jobs, currentUser, assessments } = useStore();
  const navigate = useNavigate();

  // Scope: Company Data
  const companyClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  
  // Nurse specific: Mobile View
  if (currentUser.role === Role.CARE_COMPANY_NURSE) {
    return <MobileNurseView clients={companyClients} currentUser={currentUser} devices={devices} jobs={jobs} />;
  }

  // Lead Nurse specific: Desktop View
  return <DesktopLeadView clients={companyClients} cases={cases} devices={devices} jobs={jobs} assessments={assessments} currentUser={currentUser} />;
};

// ============================================================================
// MOBILE NURSE VIEW (End Worker on Phone)
// ============================================================================
const MobileNurseView: React.FC<{ clients: any[], currentUser: any, devices: any[], jobs: any[] }> = ({ clients, currentUser, devices, jobs }) => {
  const navigate = useNavigate();
  
  // Identify high risk or attention needed
  const highRiskClients = clients.filter(c => c.risk_level === 'HIGH');
  const myVisits = jobs.filter(j => j.status === 'SCHEDULED'); // Mock: jobs assigned to company

  return (
    <div className="space-y-6">
       {/* 1. Header Card */}
       <div className="bg-slate-900 text-white pt-10 pb-10 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-2xl font-bold tracking-tight">Hello, {currentUser.name.split(' ')[0]}</h1>
                   <p className="text-slate-300 text-sm mt-1">Care Nurse • Thuiszorg West</p>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-white/20">
                   {currentUser.name.charAt(0)}
                </div>
             </div>
             
             {/* Stats Row */}
             <div className="flex gap-3 mt-4">
                <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                   <span className="block text-2xl font-bold">{clients.length}</span>
                   <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Patients</span>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                   <span className={`block text-2xl font-bold ${highRiskClients.length > 0 ? 'text-red-400' : 'text-white'}`}>{highRiskClients.length}</span>
                   <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Alerts</span>
                </div>
             </div>
          </div>
       </div>

       <div className="px-4 space-y-6 pb-20">
          
          {/* 2. Priority Alerts */}
          {highRiskClients.length > 0 && (
             <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Attention Required</h3>
                {highRiskClients.map(c => (
                   <div key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                         <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-red-900">{c.full_name}</h4>
                         <p className="text-xs text-red-700">High Risk Profile • Check-in Needed</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-300" />
                   </div>
                ))}
             </div>
          )}

          {/* 3. Quick Actions Grid */}
          <div>
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-3">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/clients')} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Plus className="w-6 h-6" /></div>
                   <span className="text-xs font-bold text-slate-700">New Request</span>
                </button>
                <button className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50">
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-full"><AlertCircle className="w-6 h-6" /></div>
                   <span className="text-xs font-bold text-slate-700">Report Issue</span>
                </button>
             </div>
          </div>

          {/* 4. Patient Directory List */}
          <div>
             <div className="flex justify-between items-center px-1 mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Patients</h3>
                <Link to="/clients" className="text-xs font-bold text-brand-600">See All</Link>
             </div>
             
             <div className="space-y-3">
                {clients.slice(0, 5).map(c => (
                   <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                               {c.full_name.charAt(0)}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">{c.full_name}</h4>
                               <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {c.address.split(',')[0]}
                               </p>
                            </div>
                         </div>
                         <Badge color={c.status === 'ACTIVE' ? 'green' : 'gray'}>{c.status}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-1">
                         <a href={`tel:${c.phone}`} className="flex items-center justify-center py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 active:bg-slate-200">
                            <Phone className="w-3.5 h-3.5 mr-2" /> Call
                         </a>
                         <button onClick={() => navigate(`/clients/${c.id}`)} className="flex items-center justify-center py-2 bg-slate-900 rounded-lg text-xs font-bold text-white shadow active:scale-[0.97]">
                            View Profile
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// ============================================================================
// DESKTOP LEAD NURSE VIEW (Supervisor on Laptop)
// ============================================================================
const DesktopLeadView: React.FC<any> = ({ clients, cases, devices, jobs, assessments, currentUser }) => {
  const navigate = useNavigate();
  const myClients = clients; 
  const myCases = cases.filter((c: any) => c.care_company_id === currentUser.care_company_id);
  
  // High Risk Clients
  const highRiskClients = myClients.filter((c: any) => c.risk_level === 'HIGH');

  // Pending Actions
  const pendingConfirmations = [
    ...devices.filter((d: any) => d.confirmation_needed && d.assigned_client_id && myClients.map((c:any) => c.id).includes(d.assigned_client_id)),
    ...jobs.filter((j: any) => j.confirmation_needed && j.client_id && myClients.map((c:any) => c.id).includes(j.client_id))
  ];

  // Assessments Pending Review (Lead Only)
  const pendingAssessments = assessments.filter((a: any) => a.status === 'DRAFT' && myClients.map((c:any) => c.id).includes(a.client_id));

  const KPICard = ({ label, value, sub, icon: Icon, color = "blue", onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-${color}-300 hover:shadow-md transition-all cursor-pointer group`}
    >
       <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 group-hover:bg-${color}-100 transition-colors`}>
             <Icon className="w-5 h-5" />
          </div>
       </div>
       <div>
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 block mt-1">{sub}</span>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                 <Heart className="w-6 h-6 text-white" />
              </div>
              Care Center
           </h1>
           <p className="text-slate-500 mt-2">
              Lead Nurse Dashboard • Thuiszorg West
           </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => navigate('/clients')}>
              <Users className="w-4 h-4 mr-2" /> Directory
           </Button>
           <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg" onClick={() => navigate('/clients')}>
              <Plus className="w-4 h-4 mr-2" /> New Request
           </Button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            label="My Caseload" 
            value={myClients.length} 
            sub="Active Clients" 
            icon={Users} 
            color="blue"
            onClick={() => navigate('/clients')}
         />
         <KPICard 
            label="Open Orders" 
            value={myCases.filter((c: any) => c.status !== 'CLOSED').length} 
            sub="In Progress" 
            icon={ClipboardList} 
            color="purple"
            onClick={() => navigate('/orders')}
         />
         <KPICard 
            label="Pending Action" 
            value={pendingConfirmations.length} 
            sub="Confirmations Required" 
            icon={CheckCircle} 
            color="amber"
            onClick={() => navigate('/confirmations')}
         />
         <KPICard 
            label="High Risk" 
            value={highRiskClients.length} 
            sub="Watchlist" 
            icon={Activity} 
            color="red"
            onClick={() => navigate('/clients')}
         />
      </div>

      {/* ACTION ALERTS */}
      {(pendingConfirmations.length > 0 || pendingAssessments.length > 0) && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingConfirmations.length > 0 && (
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                        <AlertCircle className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-amber-900 text-lg">Action Required</h4>
                        <p className="text-sm text-amber-800">{pendingConfirmations.length} items need operational confirmation.</p>
                     </div>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700 border-transparent text-white shadow-md" onClick={() => navigate('/confirmations')}>
                     Review Items
                  </Button>
               </div>
            )}
            {pendingAssessments.length > 0 && (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-blue-900 text-lg">Assessment Reviews</h4>
                        <p className="text-sm text-blue-800">{pendingAssessments.length} draft assessments awaiting approval.</p>
                     </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 border-transparent text-white shadow-md" onClick={() => navigate(`/clients/${pendingAssessments[0].client_id}/assessment/${pendingAssessments[0].id}/review`)}>
                     Review Drafts
                  </Button>
               </div>
            )}
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT: RECENT ACTIVITY */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-slate-400" /> Recent Activity
               </h3>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last 24 Hours</span>
            </div>
            <Card noPadding>
               <div className="divide-y divide-slate-100">
                  {myCases.slice(0, 5).map((c: any) => (
                    <div key={c.id} className="p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate('/orders')}>
                       <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.status === 'NEW' ? 'bg-blue-500' : c.status === 'APPROVED' ? 'bg-green-500' : 'bg-slate-300'}`} />
                       <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                             Order #{c.id} for {c.client_name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                             Status updated to <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{c.status.replace(/_/g, ' ')}</span>
                          </p>
                       </div>
                       <div className="text-xs text-slate-400 font-medium">2h ago</div>
                    </div>
                  ))}
                  {myCases.length === 0 && <div className="p-8 text-center text-slate-400 italic">No recent activity recorded.</div>}
               </div>
               <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button onClick={() => navigate('/orders')} className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center justify-center gap-1 w-full uppercase tracking-wide">
                     View All Activity <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </Card>
         </div>

         {/* RIGHT: HIGH RISK LIST */}
         <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
               <Activity className="w-5 h-5 text-red-500" /> High Risk Watchlist
            </h3>
            <Card noPadding className="border-red-100 overflow-hidden">
               <div className="divide-y divide-slate-100">
                  {highRiskClients.length > 0 ? highRiskClients.slice(0, 5).map((c: any) => (
                     <div key={c.id} className="p-4 hover:bg-red-50/30 transition-colors flex justify-between items-center group">
                        <div>
                           <div className="font-bold text-slate-900 text-sm group-hover:text-red-700 transition-colors">{c.full_name}</div>
                           <div className="text-xs text-slate-500">{c.address}</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(`/clients/${c.id}`)}>View</Button>
                     </div>
                  )) : (
                     <div className="p-8 text-center text-slate-400 italic">No high risk clients.</div>
                  )}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};
