
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { Role, CaseStatus } from '../types';
import { 
  ArrowLeft, FileText, Package, Plus, AlertCircle, Edit, User, 
  Phone, Mail, MapPin, Activity, Calendar, History, Shield, 
  ClipboardList, CheckCircle, Clock, BrainCircuit, AlertTriangle
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
  
  const canEditProfile = isInternalOps || isLeadNurse;
  const canPerformAssessment = isLeadNurse || currentUser.role === Role.CARE_COMPANY_NURSE;

  // --- ACTIONS ---
  const handleQuickOrder = () => {
    if (plan) {
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
      navigate('/cases');
    }
  };

  const startNewAssessment = () => navigate(`/clients/${client.id}/assessment/new`);

  const handleEditProfile = () => {
      const newAddress = prompt("Update Address:", client.address);
      if (newAddress !== null) store.updateClient(client.id, { address: newAddress });
  };

  const backLink = isInternalOps ? "/clients" : "/clients";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. HEADER & IDENTITY */}
      <div className="bg-white border-b border-slate-200 pb-8 pt-2">
        <Link to={backLink} className="text-sm text-slate-500 hover:text-brand-600 font-medium flex items-center gap-2 mb-6">
           <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
           <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-lg">
                 {client.full_name.charAt(0)}
              </div>
              <div>
                 <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-bold text-slate-900">{client.full_name}</h1>
                    <Badge color={client.status === 'ACTIVE' ? 'green' : 'gray'}>{client.status}</Badge>
                    {client.risk_level === 'HIGH' && <Badge color="red">HIGH RISK</Badge>}
                 </div>
                 <div className="flex items-center gap-6 mt-3 text-sm text-slate-500">
                   <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Born: {client.dob}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>{client.care_company_name}</span>
                   </div>
                   <div className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-400">ID: {client.id}</div>
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
              {canEditProfile && <Button variant="outline" onClick={handleEditProfile} className="h-10 px-4 font-bold text-slate-600"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>}
              {canPerformAssessment && (
                 <Button onClick={startNewAssessment} className="h-10 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md">
                   <Activity className="w-4 h-4 mr-2" /> New Assessment
                 </Button>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. SIDEBAR INFO */}
        <div className="space-y-6">
           <Card className="p-6 space-y-6 border-slate-200 shadow-sm">
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Details</h4>
                 <div className="space-y-4 text-sm text-slate-700">
                    <div className="flex items-start gap-3">
                       <div className="p-1.5 bg-slate-100 rounded text-slate-500 mt-0.5"><MapPin className="w-4 h-4" /></div>
                       <span className="font-medium leading-relaxed">{client.address}</span>
                    </div>
                    {client.phone && (
                       <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Phone className="w-4 h-4" /></div>
                          <span className="font-medium">{client.phone}</span>
                       </div>
                    )}
                    {client.email && (
                       <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Mail className="w-4 h-4" /></div>
                          <span className="font-medium">{client.email}</span>
                       </div>
                    )}
                 </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Risk Profile</h4>
                 <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    client.risk_level === 'HIGH' ? 'bg-red-50 border-red-200 text-red-900' :
                    client.risk_level === 'MEDIUM' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                    'bg-green-50 border-green-200 text-green-900'
                 }`}>
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                        client.risk_level === 'HIGH' ? 'text-red-600' : 
                        client.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                    }`} />
                    <div>
                        <div className="font-bold text-sm">{client.risk_level} Risk Level</div>
                        <p className="text-xs opacity-80 mt-1 leading-snug">
                           {client.risk_level === 'HIGH' ? 'Requires frequent monitoring and check-ins.' : 'Standard monitoring schedule applies.'}
                        </p>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Emergency Contacts</h4>
                 {client.emergency_contacts.length > 0 ? (
                    <div className="space-y-3">
                       {client.emergency_contacts.map((c, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <span className="font-bold text-slate-900 text-sm block">{c.name}</span>
                             <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                                <span>{c.relation}</span>
                                <span className="font-mono">{c.phone}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <span className="text-xs text-red-500 italic bg-red-50 px-2 py-1 rounded">No contacts listed</span>
                 )}
              </div>
           </Card>
        </div>

        {/* 3. MAIN CONTENT TABS */}
        <div className="lg:col-span-3">
           {/* Tab Navigation */}
           <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
              {['OVERVIEW', 'ASSESSMENTS', 'PLAN', 'ORDERS', 'TIMELINE'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                       activeTab === tab 
                       ? 'border-brand-600 text-brand-600 bg-brand-50/50' 
                       : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                 >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                 </button>
              ))}
           </div>

           {/* OVERVIEW TAB */}
           {activeTab === 'OVERVIEW' && (
              <div className="space-y-8">
                 {/* Active Plan Summary */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Current Care Plan" className="h-full">
                       {plan ? (
                          <div className="space-y-6">
                             <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
                                <h4 className="text-xs font-bold text-brand-800 uppercase mb-2">Primary Goal</h4>
                                <p className="text-sm text-brand-900 font-medium leading-relaxed">{plan.goals}</p>
                             </div>
                             <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                                <div>
                                   <span className="text-xs text-slate-500 block mb-1">Review Due</span>
                                   <span className="font-bold text-slate-800">{plan.review_date}</span>
                                </div>
                                <div className="text-right">
                                   <span className="text-xs text-slate-500 block mb-1">Manager</span>
                                   <span className="font-bold text-slate-800">{plan.created_by_name}</span>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" onClick={() => setActiveTab('PLAN')} className="w-full h-10 font-bold border-slate-200">View Full Plan</Button>
                          </div>
                       ) : (
                          <div className="text-center py-12 text-slate-500">
                             <p className="mb-4">No active care plan.</p>
                             {canPerformAssessment && (
                                <Button size="sm" className="mt-2 bg-brand-600 text-white" onClick={startNewAssessment}>
                                   <BrainCircuit className="w-4 h-4 mr-2" /> Start Assessment Flow
                                </Button>
                             )}
                          </div>
                       )}
                    </Card>

                    <Card title="Active Devices" className="h-full">
                       <div className="space-y-3">
                          {clientDevices.length > 0 ? clientDevices.map(d => (
                             <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                                      <Package className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900">{store.getProductName(d.product_id)}</p>
                                      <p className="text-xs text-slate-500 font-mono">{d.serial_number}</p>
                                   </div>
                                </div>
                                <Badge color={d.status === 'INSTALLED_ACTIVE' ? 'green' : 'gray'}>{d.status.replace('INSTALLED_', '')}</Badge>
                             </div>
                          )) : (
                             <p className="text-sm text-slate-400 italic text-center py-12">No devices installed.</p>
                          )}
                       </div>
                    </Card>
                 </div>

                 <Card title="Recent Activity" noPadding>
                    <div className="divide-y divide-slate-100">
                       {clientTimeline.slice(0, 5).map(event => (
                          <div key={event.id} className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                             <div className="mt-1">
                                {event.event_type === 'ASSESSMENT' && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><FileText className="w-4 h-4" /></div>}
                                {event.event_type === 'CARE_PLAN' && <div className="p-2 bg-green-100 text-green-600 rounded-full"><ClipboardList className="w-4 h-4" /></div>}
                                {event.event_type === 'ORDER' && <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Package className="w-4 h-4" /></div>}
                                {event.event_type === 'SYSTEM' && <div className="p-2 bg-slate-100 text-slate-500 rounded-full"><Activity className="w-4 h-4" /></div>}
                                {event.event_type === 'DEVICE' && <div className="p-2 bg-brand-100 text-brand-600 rounded-full"><CheckCircle className="w-4 h-4" /></div>}
                             </div>
                             <div>
                                <p className="text-sm font-medium text-slate-900">{event.summary}</p>
                                <p className="text-xs text-slate-500 flex gap-2 mt-1 font-medium">
                                   <span>{new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                   <span>•</span>
                                   <span className="text-slate-700">{event.actor_name || 'System AI'}</span>
                                </p>
                             </div>
                          </div>
                       ))}
                       <div className="p-3 bg-slate-50 border-t border-slate-100">
                          <button onClick={() => setActiveTab('TIMELINE')} className="w-full py-2 text-xs font-bold text-center text-brand-600 hover:text-brand-700 uppercase tracking-wide">View Full Timeline</button>
                       </div>
                    </div>
                 </Card>
              </div>
           )}

           {/* ASSESSMENTS TAB */}
           {activeTab === 'ASSESSMENTS' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Assessments History</h3>
                    {canPerformAssessment && <Button size="sm" onClick={startNewAssessment} className="bg-brand-600 text-white font-bold"><Plus className="w-4 h-4 mr-2" /> New Assessment</Button>}
                 </div>
                 {clientAssessments.length > 0 ? clientAssessments.map(ass => (
                    <Card key={ass.id} className="p-6 border-slate-200 shadow-sm">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-lg font-bold text-slate-900">{ass.type} Assessment</h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Performed by {ass.performed_by_name} on {ass.assessment_date}</p>
                             </div>
                          </div>
                          <Badge color="green">{ass.status}</Badge>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Needs Summary</span>
                             <p className="text-sm text-slate-800 leading-relaxed">{ass.needs_summary}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Recommendation</span>
                             <div className="flex flex-wrap gap-2">
                                {store.getProductIdsToNames(ass.recommended_product_ids).map(d => (
                                   <span key={d} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{d}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="text-xs text-slate-500 italic pl-1 border-l-2 border-slate-200">
                          Notes: {ass.notes}
                       </div>
                    </Card>
                 )) : (
                    <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
                       <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                       No assessments recorded.
                    </div>
                 )}
              </div>
           )}

           {/* CARE PLAN TAB */}
           {activeTab === 'PLAN' && (
              <div className="space-y-6">
                 {plan ? (
                    <Card className="p-8 border-slate-200 shadow-md">
                       <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                          <div>
                             <h3 className="text-2xl font-bold text-slate-900">Active Care Plan</h3>
                             <p className="text-sm text-slate-500 mt-1">Activated on <span className="font-medium text-slate-800">{plan.created_at}</span> by <span className="font-medium text-slate-800">{plan.created_by_name}</span></p>
                          </div>
                          {canPerformAssessment && <Button variant="outline" size="sm" className="font-bold text-slate-600"><Edit className="w-4 h-4 mr-2" /> Revise Plan</Button>}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-brand-500" /> Care Goals
                             </h4>
                             <div className="p-5 bg-brand-50 rounded-xl border border-brand-100 text-brand-900 text-sm font-medium leading-relaxed shadow-sm">
                                {plan.goals}
                             </div>
                          </div>

                          <div>
                             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-brand-500" /> Agreed Devices
                             </h4>
                             <div className="space-y-3">
                                {store.getProductIdsToNames(plan.agreed_product_ids).map(d => (
                                   <div key={d} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                      <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle className="w-3 h-3" /></div>
                                      <span className="text-sm font-bold text-slate-700">{d}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="mt-10 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 p-8 rounded-b-xl">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Review Schedule</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-sm text-slate-700">
                             <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                <Calendar className="w-4 h-4 text-brand-500" />
                                <span>Frequency: <strong>{plan.review_interval_days} days</strong></span>
                             </div>
                             <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                <Clock className="w-4 h-4 text-brand-500" />
                                <span>Next Review: <strong>{plan.review_date}</strong></span>
                             </div>
                          </div>
                       </div>
                    </Card>
                 ) : (
                    <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
                       <p className="mb-4">No active care plan.</p>
                       {canPerformAssessment && <Button onClick={startNewAssessment} className="font-bold">Create Initial Plan</Button>}
                    </div>
                 )}
              </div>
           )}

           {/* ORDERS TAB */}
           {activeTab === 'ORDERS' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Order History</h3>
                    {canEditProfile && <Button size="sm" onClick={handleQuickOrder} className="font-bold bg-brand-600 text-white"><Plus className="w-4 h-4 mr-2" /> New Order</Button>}
                 </div>
                 {clientCases.length > 0 ? clientCases.map(c => (
                    <Card key={c.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-slate-200 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                             <Package className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-slate-900 text-lg">Order #{c.id}</span>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">{c.created_at}</span>
                             </div>
                             <p className="text-sm text-slate-600 font-medium">{store.getProductIdsToNames(c.product_ids).join(', ')}</p>
                          </div>
                       </div>
                       <Badge color={c.status === 'CLOSED' ? 'gray' : 'blue'}>{c.status}</Badge>
                    </Card>
                 )) : (
                    <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
                       No orders on file.
                    </div>
                 )}
              </div>
           )}

           {/* TIMELINE TAB */}
           {activeTab === 'TIMELINE' && (
              <div className="space-y-0 pl-8 border-l-2 border-slate-200 ml-4 py-4">
                 {clientTimeline.map(event => (
                    <div key={event.id} className="relative pl-8 pb-10 group last:pb-0">
                       <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          event.event_type === 'SYSTEM' ? 'bg-slate-300' : 'bg-brand-500'
                       }`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                       </div>
                       <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                             <span className="text-sm font-bold text-slate-900">{event.summary}</span>
                             <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                             <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{event.source}</span>
                             <span>by {event.actor_name || 'System'}</span>
                          </p>
                       </div>
                    </div>
                 ))}
                 {clientTimeline.length === 0 && (
                    <p className="text-slate-500 italic pl-6">No timeline events.</p>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
