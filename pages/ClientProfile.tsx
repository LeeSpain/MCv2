
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { Role, CaseStatus } from '../types';
import { 
  ArrowLeft, FileText, Package, Plus, AlertCircle, Edit, User, 
  Phone, Mail, MapPin, Activity, Calendar, History, Shield, 
  ClipboardList, CheckCircle, Clock, BrainCircuit
} from 'lucide-react';

export const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, carePlans, devices, assessments, timeline, cases, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ASSESSMENTS' | 'PLAN' | 'TIMELINE' | 'ORDERS'>('OVERVIEW');

  const client = clients.find(c => c.id === id);
  if (!client) return <div className="p-8 text-center text-slate-500">Client not found</div>;

  const plan = carePlans.find(p => p.client_id === id && p.status === 'ACTIVE');
  const clientDevices = devices.filter(d => d.assigned_client_id === id);
  const clientAssessments = assessments.filter(a => a.client_id === id).sort((a,b) => b.created_at.localeCompare(a.created_at));
  const clientTimeline = timeline.filter(t => t.client_id === id).sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  const clientCases = cases.filter(c => c.client_id === id).sort((a,b) => b.created_at.localeCompare(a.created_at));

  // --- PERMISSION CHECK ---
  const isInternalOps = [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO].includes(currentUser.role);
  const isLeadNurse = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE;
  
  // Edit logic: Internal Ops can edit basic profile data (address/contact). Lead Nurse can do everything.
  const canEditProfile = isInternalOps || isLeadNurse;
  // Clinical logic: Only Nurses can perform assessments.
  const canPerformAssessment = isLeadNurse || currentUser.role === Role.CARE_COMPANY_NURSE;

  // --- ACTIONS ---
  const handleQuickOrder = () => {
    if (plan) {
      // Auto-create case from plan
      store.createCase({
        id: `c${Date.now()}`,
        client_id: client.id,
        client_name: client.full_name,
        care_company_id: client.care_company_id,
        status: CaseStatus.NEW,
        created_at: new Date().toLocaleDateString(),
        product_ids: plan.agreed_product_ids,
        line_items: plan.agreed_product_ids.map((pid, idx) => ({
          id: `li-${Date.now()}-${idx}`,
          product_id: pid,
          requested_qty: 1,
          allocated_device_ids: [],
          status: 'REQUESTED'
        }))
      });
      navigate('/cases'); // Redirect to generic order list for Ops, or specific for Care
    }
  };

  const startNewAssessment = () => {
    navigate(`/clients/${client.id}/assessment/new`);
  };

  const handleEditProfile = () => {
      const newAddress = prompt("Update Address:", client.address);
      if (newAddress !== null) {
          store.updateClient(client.id, { address: newAddress });
      }
  };

  // Determine back link based on role
  const backLink = isInternalOps ? "/clients" : "/clients";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER & IDENTITY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
           <Link to={backLink} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to Directory
           </Link>
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500 border-4 border-white shadow-sm">
                 {client.full_name.charAt(0)}
              </div>
              <div>
                 <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                   {client.full_name}
                   <Badge color={client.status === 'ACTIVE' ? 'green' : 'gray'}>{client.status}</Badge>
                 </h1>
                 <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                   <span>Born: {client.dob}</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span>ID: {client.id}</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {client.care_company_name}</span>
                 </p>
              </div>
           </div>
        </div>
        <div className="flex gap-3">
           {canEditProfile && <Button variant="outline" onClick={handleEditProfile}><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>}
           {canPerformAssessment && (
              <Button onClick={startNewAssessment} className="bg-brand-600 hover:bg-brand-700 text-white">
                <Activity className="w-4 h-4 mr-2" /> New Assessment
              </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. SIDEBAR INFO */}
        <div className="space-y-6">
           <Card className="p-5 space-y-4">
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Contact Details</h4>
                 <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                       <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                       {client.address}
                    </div>
                    {client.phone && (
                       <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {client.phone}
                       </div>
                    )}
                    {client.email && (
                       <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {client.email}
                       </div>
                    )}
                 </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Risk Profile</h4>
                 <div className={`p-3 rounded-lg border ${
                    client.risk_level === 'HIGH' ? 'bg-red-50 border-red-200 text-red-800' :
                    client.risk_level === 'MEDIUM' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-green-50 border-green-200 text-green-800'
                 }`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                       <Activity className="w-4 h-4" /> {client.risk_level} Risk
                    </div>
                    <p className="text-xs opacity-90">
                       {client.risk_level === 'HIGH' ? 'Requires frequent monitoring.' : 'Standard monitoring schedule.'}
                    </p>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Emergency Contacts</h4>
                 {client.emergency_contacts.length > 0 ? (
                    <ul className="space-y-2">
                       {client.emergency_contacts.map((c, i) => (
                          <li key={i} className="text-sm">
                             <span className="font-bold text-slate-800 block">{c.name}</span>
                             <span className="text-slate-500 text-xs">{c.relation} • {c.phone}</span>
                          </li>
                       ))}
                    </ul>
                 ) : (
                    <span className="text-xs text-red-500 italic">No contacts listed</span>
                 )}
              </div>
           </Card>
        </div>

        {/* 3. MAIN CONTENT TABS */}
        <div className="lg:col-span-3">
           {/* Tab Navigation */}
           <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
              {['OVERVIEW', 'ASSESSMENTS', 'PLAN', 'ORDERS', 'TIMELINE'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                       activeTab === tab 
                       ? 'border-brand-600 text-brand-600' 
                       : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                 >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                 </button>
              ))}
           </div>

           {/* OVERVIEW TAB */}
           {activeTab === 'OVERVIEW' && (
              <div className="space-y-6">
                 {/* Active Plan Summary */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Current Care Plan">
                       {plan ? (
                          <div className="space-y-4">
                             <div className="p-3 bg-brand-50 border border-brand-100 rounded-lg">
                                <h4 className="text-xs font-bold text-brand-800 uppercase mb-1">Primary Goal</h4>
                                <p className="text-sm text-brand-900 font-medium">{plan.goals}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <span className="text-xs text-slate-500 block">Review Due</span>
                                   <span className="text-sm font-bold text-slate-800">{plan.review_date}</span>
                                </div>
                                <div>
                                   <span className="text-xs text-slate-500 block">Created By</span>
                                   <span className="text-sm font-bold text-slate-800">{plan.created_by_name}</span>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" onClick={() => setActiveTab('PLAN')} className="w-full">View Full Plan</Button>
                          </div>
                       ) : (
                          <div className="text-center py-8 text-slate-500">
                             <p>No active care plan.</p>
                             {canPerformAssessment && (
                                <Button size="sm" className="mt-2" onClick={startNewAssessment}>
                                   <BrainCircuit className="w-4 h-4 mr-2" /> Start Assessment Flow
                                </Button>
                             )}
                          </div>
                       )}
                    </Card>

                    <Card title="Active Devices">
                       <div className="space-y-3">
                          {clientDevices.length > 0 ? clientDevices.map(d => (
                             <div key={d.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded">
                                <div className="flex items-center gap-3">
                                   <Package className="w-8 h-8 text-slate-300 p-1.5 bg-slate-100 rounded" />
                                   <div>
                                      <p className="text-sm font-bold text-slate-900">{store.getProductName(d.product_id)}</p>
                                      <p className="text-xs text-slate-500 font-mono">{d.serial_number}</p>
                                   </div>
                                </div>
                                <Badge color={d.status === 'INSTALLED_ACTIVE' ? 'green' : 'gray'}>{d.status.replace('INSTALLED_', '')}</Badge>
                             </div>
                          )) : (
                             <p className="text-sm text-slate-400 italic text-center py-4">No devices installed.</p>
                          )}
                       </div>
                    </Card>
                 </div>

                 <Card title="Recent Activity" noPadding>
                    <div className="divide-y divide-slate-100">
                       {clientTimeline.slice(0, 3).map(event => (
                          <div key={event.id} className="p-4 flex gap-4">
                             <div className="mt-1">
                                {event.event_type === 'ASSESSMENT' && <FileText className="w-4 h-4 text-blue-500" />}
                                {event.event_type === 'CARE_PLAN' && <ClipboardList className="w-4 h-4 text-green-500" />}
                                {event.event_type === 'ORDER' && <Package className="w-4 h-4 text-purple-500" />}
                                {event.event_type === 'SYSTEM' && <Activity className="w-4 h-4 text-slate-400" />}
                                {event.event_type === 'DEVICE' && <CheckCircle className="w-4 h-4 text-brand-500" />}
                             </div>
                             <div>
                                <p className="text-sm text-slate-800">{event.summary}</p>
                                <p className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                   <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                                   <span>•</span>
                                   <span>{event.actor_name || 'System'}</span>
                                </p>
                             </div>
                          </div>
                       ))}
                       <button onClick={() => setActiveTab('TIMELINE')} className="w-full py-2 text-xs text-center text-brand-600 hover:bg-slate-50 font-bold">View Full Timeline</button>
                    </div>
                 </Card>
              </div>
           )}

           {/* ASSESSMENTS TAB */}
           {activeTab === 'ASSESSMENTS' && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Assessments History</h3>
                    {canPerformAssessment && <Button size="sm" onClick={startNewAssessment}><Plus className="w-4 h-4 mr-2" /> New Assessment</Button>}
                 </div>
                 {clientAssessments.length > 0 ? clientAssessments.map(ass => (
                    <Card key={ass.id} className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="text-lg font-bold text-slate-900">{ass.type} Assessment</h4>
                             <p className="text-xs text-slate-500">Performed by {ass.performed_by_name} on {ass.assessment_date}</p>
                          </div>
                          <Badge color="green">{ass.status}</Badge>
                       </div>
                       <div className="grid grid-cols-2 gap-6 mb-4">
                          <div className="p-3 bg-slate-50 rounded border border-slate-100">
                             <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Needs Summary</span>
                             <p className="text-sm text-slate-700">{ass.needs_summary}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded border border-slate-100">
                             <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Recommendation</span>
                             <div className="flex flex-wrap gap-2 mt-1">
                                {store.getProductIdsToNames(ass.recommended_product_ids).map(d => (
                                   <span key={d} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">{d}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="text-xs text-slate-500 italic">
                          Notes: {ass.notes}
                       </div>
                    </Card>
                 )) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-xl text-slate-400">
                       No assessments recorded.
                    </div>
                 )}
              </div>
           )}

           {/* CARE PLAN TAB */}
           {activeTab === 'PLAN' && (
              <div className="space-y-4">
                 {plan ? (
                    <Card className="p-8">
                       <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                          <div>
                             <h3 className="text-xl font-bold text-slate-900">Active Care Plan</h3>
                             <p className="text-sm text-slate-500">Activated on {plan.created_at} by {plan.created_by_name}</p>
                          </div>
                          {canPerformAssessment && <Button variant="outline" size="sm"><Edit className="w-3 h-3 mr-2" /> Revise Plan</Button>}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                             <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-brand-500" /> Care Goals
                             </h4>
                             <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 text-brand-900 text-sm font-medium leading-relaxed">
                                {plan.goals}
                             </div>
                          </div>

                          <div>
                             <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4 text-brand-500" /> Agreed Devices
                             </h4>
                             <div className="space-y-2">
                                {store.getProductIdsToNames(plan.agreed_product_ids).map(d => (
                                   <div key={d} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span className="text-sm font-medium text-slate-700">{d}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="mt-8 pt-6 border-t border-slate-100">
                          <h4 className="text-sm font-bold text-slate-800 uppercase mb-3">Review Schedule</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                             <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                Review every {plan.review_interval_days} days
                             </div>
                             <div className="w-px h-4 bg-slate-300" />
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                Next review: <span className="font-bold text-slate-900">{plan.review_date}</span>
                             </div>
                          </div>
                       </div>
                    </Card>
                 ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-xl text-slate-400">
                       <p className="mb-4">No active care plan.</p>
                       {canPerformAssessment && <Button onClick={startNewAssessment}>Create Initial Plan</Button>}
                    </div>
                 )}
              </div>
           )}

           {/* ORDERS TAB */}
           {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Order History</h3>
                    {canEditProfile && <Button size="sm" onClick={handleQuickOrder}><Plus className="w-4 h-4 mr-2" /> New Order</Button>}
                 </div>
                 {clientCases.length > 0 ? clientCases.map(c => (
                    <Card key={c.id} className="p-4 flex items-center justify-between">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-slate-900">Order #{c.id}</span>
                             <span className="text-xs text-slate-500">{c.created_at}</span>
                          </div>
                          <p className="text-sm text-slate-600">{store.getProductIdsToNames(c.product_ids).join(', ')}</p>
                       </div>
                       <Badge color={c.status === 'CLOSED' ? 'gray' : 'blue'}>{c.status}</Badge>
                    </Card>
                 )) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-xl text-slate-400">
                       No orders on file.
                    </div>
                 )}
              </div>
           )}

           {/* TIMELINE TAB */}
           {activeTab === 'TIMELINE' && (
              <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4 relative">
                 {clientTimeline.map(event => (
                    <div key={event.id} className="relative pl-6">
                       <div className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                          event.event_type === 'SYSTEM' ? 'bg-slate-300' : 'bg-brand-500'
                       }`} />
                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <span className="text-sm font-bold text-slate-900">{event.summary}</span>
                          <span className="text-xs text-slate-400 font-mono">{new Date(event.timestamp).toLocaleString()}</span>
                       </div>
                       <p className="text-xs text-slate-500 mb-2">
                          Source: <span className="font-medium text-slate-700">{event.source}</span> • Actor: {event.actor_name}
                       </p>
                    </div>
                 ))}
                 {clientTimeline.length === 0 && (
                    <p className="text-slate-500 italic">No timeline events.</p>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
