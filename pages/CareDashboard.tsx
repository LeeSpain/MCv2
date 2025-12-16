import React from 'react';
import { useStore } from '../services/store';
import { Card, Button } from '../components/ui';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, CheckCircle, Clock } from 'lucide-react';

export const CareDashboard: React.FC = () => {
  const { clients, cases, devices, jobs, currentUser } = useStore();

  // Filter data for this care company
  const myClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  const myCases = cases.filter(c => c.care_company_id === currentUser.care_company_id);
  const myDevices = devices.filter(d => d.assigned_client_id && myClients.map(c => c.id).includes(d.assigned_client_id));
  
  const pendingConfirmations = [
    ...myDevices.filter(d => d.confirmation_needed),
    ...jobs.filter(j => j.confirmation_needed && j.client_id && myClients.map(c => c.id).includes(j.client_id))
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome, {currentUser.name.split(' ')[0]}</h2>
          <p className="text-slate-500">Here is what needs your attention today.</p>
        </div>
        <Button variant="outline">English / Nederlands</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clients" className="group">
          <Card className="p-6 h-full hover:border-brand-300 hover:shadow-md transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Users className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-800">My Clients</h3>
                   <span className="text-slate-500 text-sm">View & Manage</span>
                </div>
             </div>
             <p className="text-3xl font-bold text-slate-900">{myClients.length}</p>
             <p className="text-xs text-slate-400 mt-1">Active Profiles</p>
          </Card>
        </Link>

        <Link to="/orders" className="group">
          <Card className="p-6 h-full hover:border-brand-300 hover:shadow-md transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                   <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-800">Active Orders</h3>
                   <span className="text-slate-500 text-sm">Track Status</span>
                </div>
             </div>
             <p className="text-3xl font-bold text-slate-900">{myCases.filter(c => c.status !== 'CLOSED').length}</p>
             <p className="text-xs text-slate-400 mt-1">In Progress</p>
          </Card>
        </Link>

        <Link to="/confirmations" className="group">
          <Card className={`p-6 h-full hover:border-brand-300 hover:shadow-md transition-all ${pendingConfirmations.length > 0 ? 'border-amber-200 bg-amber-50' : ''}`}>
             <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full transition-colors ${pendingConfirmations.length > 0 ? 'bg-amber-200 text-amber-700 group-hover:bg-amber-600 group-hover:text-white' : 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'}`}>
                   <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-800">Confirmations</h3>
                   <span className="text-slate-500 text-sm">Action Required</span>
                </div>
             </div>
             <p className={`text-3xl font-bold ${pendingConfirmations.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>{pendingConfirmations.length}</p>
             <p className="text-xs text-slate-400 mt-1">Pending Requests</p>
          </Card>
        </Link>
      </div>

      <div>
         <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
           <Clock className="w-5 h-5 text-slate-400" /> Recent Updates
         </h3>
         <Card className="divide-y divide-slate-100">
            {myCases.slice(0, 3).map(c => (
              <div key={c.id} className="p-4 flex justify-between items-center">
                 <div>
                    <span className="text-sm font-bold text-slate-900 block">{c.client_name}</span>
                    <span className="text-xs text-slate-500">Order #{c.id} status updated to {c.status}</span>
                 </div>
                 <span className="text-xs text-slate-400">2h ago</span>
              </div>
            ))}
            {myCases.length === 0 && <div className="p-6 text-center text-slate-400 italic">No recent activity.</div>}
         </Card>
      </div>
    </div>
  );
};