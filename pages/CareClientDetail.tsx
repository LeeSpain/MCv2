
import React from 'react';
import { useStore, store } from '../services/store';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import { ArrowLeft, FileText, Package, Plus, AlertCircle, Edit, MessageSquare } from 'lucide-react';
import { Role } from '../types';

export const CareClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, carePlans, devices, currentUser } = useStore();

  const client = clients.find(c => c.id === id);
  const plan = carePlans.find(p => p.client_id === id);
  const clientDevices = devices.filter(d => d.assigned_client_id === id);

  const isLead = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE;

  if (!client) return <div>Client not found</div>;

  const handleLogNote = () => {
      const note = prompt("Enter clinical or operational note:");
      if (note) {
          store.addTimelineEvent(client.id, `Manual Note: ${note}`);
      }
  };

  const handleReportIssue = () => {
      const issue = prompt("Describe the issue (will create an exception):");
      if (issue) {
          store.createException({
              severity: 'WARNING',
              title: 'Client Issue Reported',
              description: `${currentUser.name} reported: ${issue}`,
              related_entity_type: 'DEVICE', // Simplification
              related_entity_id: clientDevices[0]?.id || 'unknown',
          });
          alert("Issue reported to Operations.");
      }
  };

  const handleEndService = () => {
      if (confirm("Are you sure you want to END SERVICE for this client? This will trigger a return request for all devices.")) {
          store.endClientService(client.id);
          alert("Service ended. Returns Recovery process initiated.");
          navigate('/clients');
      }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link to="/clients" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
           <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="flex justify-between items-start">
           <div>
              <h2 className="text-3xl font-bold text-slate-900">{client.full_name}</h2>
              <p className="text-slate-500">{client.address} • {client.status}</p>
           </div>
           {isLead && client.status === 'ACTIVE' && (
             <Link to={`/clients/${id}/new-order`}>
               <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg">
                 <Plus className="w-4 h-4 mr-2" /> Request Devices / Services
               </Button>
             </Link>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Care Plan Column */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <FileText className="w-5 h-5 text-slate-500" /> Care Plan
            </h3>
            {plan ? (
               <Card className="p-6 space-y-4">
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Goals</h4>
                     <p className="text-slate-900">{plan.goals}</p>
                  </div>
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Requirements</h4>
                     <p className="text-slate-900">{plan.requirements}</p>
                  </div>
                  <div className="flex gap-8 pt-4 border-t border-slate-100">
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Next Review</h4>
                        <p className="text-slate-700">{plan.review_date}</p>
                     </div>
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Notes</h4>
                        <p className="text-slate-700 italic">{plan.notes}</p>
                     </div>
                  </div>
                  {isLead && <Button variant="outline" size="sm" className="mt-4"><Edit className="w-3 h-3 mr-2" /> Update Plan</Button>}
               </Card>
            ) : (
               <Card className="p-8 text-center text-slate-500 border-dashed">
                  <p className="mb-4">No care plan established yet.</p>
                  {isLead && <Button>Create Care Plan</Button>}
               </Card>
            )}

            {/* Simple Device Status */}
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mt-8">
               <Package className="w-5 h-5 text-slate-500" /> Active Devices
            </h3>
            <div className="space-y-3">
               {clientDevices.map(d => (
                  <Card key={d.id} className="flex justify-between items-center p-4">
                     <span className="font-medium text-slate-900">{store.getProductName(d.product_id)}</span>
                     {d.status === 'INSTALLED_ACTIVE' ? (
                        <Badge color="green">Active</Badge>
                     ) : d.status === 'AWAITING_RETURN' ? (
                        <Badge color="yellow">Return Pending</Badge>
                     ) : d.status === 'DORMANT' ? (
                        <Badge color="red">Dormant</Badge>
                     ) : (
                        <Badge color="blue">In Progress</Badge>
                     )}
                  </Card>
               ))}
               {clientDevices.length === 0 && (
                  <p className="text-slate-500 italic">No devices assigned.</p>
               )}
            </div>
         </div>

         {/* Side Info */}
         <div className="space-y-6">
            <Card title="Quick Actions">
               <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogNote}>
                     <MessageSquare className="w-4 h-4 mr-2" /> Log Client Note
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleReportIssue}>
                     <AlertCircle className="w-4 h-4 mr-2" /> Report Issue
                  </Button>
                  {isLead && client.status === 'ACTIVE' && (
                      <Button variant="outline" onClick={handleEndService} className="w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-200">
                          End Service
                      </Button>
                  )}
               </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
               <strong>Note:</strong> Logistics are handled by MobileCare. You do not need to manage stock or returns directly.
            </div>
         </div>
      </div>
    </div>
  );
};
