
import React from 'react';
import { useStore } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ClipboardList, CheckCircle, Clock, Heart, Plus, Activity, AlertCircle, FileText } from 'lucide-react';
import { Role } from '../types';

export const CareDashboard: React.FC = () => {
  const { clients, cases, devices, jobs, currentUser, assessments } = useStore();
  const navigate = useNavigate();

  const isLead = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE;

  // Filter data for this care company
  const companyClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  const myClients = companyClients; // In a real app, this would filter by specific nurse assignment
  const myCases = cases.filter(c => c.care_company_id === currentUser.care_company_id);
  
  // High Risk Clients
  const highRiskClients = myClients.filter(c => c.risk_level === 'HIGH');

  // Pending Actions
  const pendingConfirmations = [
    ...devices.filter(d => d.confirmation_needed && d.assigned_client_id && myClients.map(c => c.id).includes(d.assigned_client_id)),
    ...jobs.filter(j => j.confirmation_needed && j.client_id && myClients.map(c => c.id).includes(j.client_id))
  ];

  // Assessments Pending Review (Lead Only)
  const pendingAssessments = assessments.filter(a => a.status === 'DRAFT' && myClients.map(c => c.id).includes(a.client_id));

  const handleReviewAssessment = () => {
      // Find the first draft assessment and navigate to it
      if (pendingAssessments.length > 0) {
          const first = pendingAssessments[0];
          navigate(`/clients/${first.client_id}/assessment/${first.id}/review`);
      }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Heart className="w-8 h-8 text-blue-500" />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-900">Care Center</h2>
              <p className="text-slate-500">
                 {isLead ? 'Lead Nurse Dashboard • Thuiszorg West' : 'Nurse Dashboard • Thuiszorg West'}
              </p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => navigate('/clients')}>
              <Users className="w-4 h-4 mr-2" /> Directory
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={() => navigate('/clients')}>
              <Plus className="w-4 h-4 mr-2" /> New Request
           </Button>
        </div>
      </div>

      {/* ACTION ALERTS */}
      {(pendingConfirmations.length > 0 || pendingAssessments.length > 0) && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingConfirmations.length > 0 && (
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => navigate('/confirmations')}>
                  <div className="flex items-center gap-3">
                     <AlertCircle className="w-6 h-6 text-amber-600" />
                     <div>
                        <h4 className="font-bold text-amber-900">Action Required</h4>
                        <p className="text-sm text-amber-800">{pendingConfirmations.length} items need operational confirmation.</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 border-transparent text-white">Review</Button>
               </div>
            )}
            {isLead && pendingAssessments.length > 0 && (
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <FileText className="w-6 h-6 text-blue-600" />
                     <div>
                        <h4 className="font-bold text-blue-900">Assessment Reviews</h4>
                        <p className="text-sm text-blue-800">{pendingAssessments.length} draft assessments awaiting approval.</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 border-transparent text-white" onClick={handleReviewAssessment}>Review</Button>
               </div>
            )}
         </div>
      )}

      {/* METRICS & NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clients" className="group">
          <Card className="p-6 h-full hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-24 h-24 text-blue-600" />
             </div>
             <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">My Caseload</h3>
                <div className="text-4xl font-bold text-slate-900 mb-1">{myClients.length}</div>
                <div className="text-sm text-slate-600">Active Clients</div>
             </div>
          </Card>
        </Link>

        <Link to="/orders" className="group">
          <Card className="p-6 h-full hover:border-purple-300 hover:shadow-md transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ClipboardList className="w-24 h-24 text-purple-600" />
             </div>
             <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Open Orders</h3>
                <div className="text-4xl font-bold text-slate-900 mb-1">{myCases.filter(c => c.status !== 'CLOSED').length}</div>
                <div className="text-sm text-slate-600">In Progress</div>
             </div>
          </Card>
        </Link>

        <Card className="p-6 h-full border-red-100 bg-red-50/30">
           <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> High Risk Watchlist
           </h3>
           <div className="space-y-3">
              {highRiskClients.length > 0 ? highRiskClients.slice(0, 3).map(c => (
                 <div key={c.id} className="bg-white p-3 rounded border border-red-100 shadow-sm flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{c.full_name}</span>
                    <Link to={`/clients/${c.id}`} className="text-xs text-blue-600 hover:underline">View</Link>
                 </div>
              )) : (
                 <p className="text-sm text-slate-500 italic">No high risk clients.</p>
              )}
           </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY FEED */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Recent Activity
            </h3>
            <span className="text-xs text-slate-400">Last 24 Hours</span>
         </div>
         <Card noPadding>
            <div className="divide-y divide-slate-100">
               {myCases.slice(0, 5).map(c => (
                 <div key={c.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`mt-1 w-2 h-2 rounded-full ${c.status === 'NEW' ? 'bg-blue-500' : c.status === 'APPROVED' ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <div>
                       <p className="text-sm font-bold text-slate-900">
                          Order #{c.id} for {c.client_name}
                       </p>
                       <p className="text-xs text-slate-500 mt-0.5">
                          Status updated to <span className="font-medium text-slate-700">{c.status.replace(/_/g, ' ')}</span>
                       </p>
                    </div>
                    <div className="ml-auto text-xs text-slate-400">2h ago</div>
                 </div>
               ))}
               {myCases.length === 0 && <div className="p-6 text-center text-slate-400 italic">No recent activity.</div>}
            </div>
         </Card>
      </div>
    </div>
  );
};
