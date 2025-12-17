
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { CheckCircle, Clock, AlertTriangle, Calendar, Search, Filter, Activity, Box, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CareConfirmations: React.FC = () => {
  const { devices, jobs, clients, currentUser } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'DEVICE' | 'APPOINTMENT'>('ALL');

  const myClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  const myClientIds = myClients.map(c => c.id);

  // 1. Devices needing confirmation (periodic check)
  const deviceTasks = devices
    .filter(d => d.confirmation_needed && d.assigned_client_id && myClientIds.includes(d.assigned_client_id))
    .map(d => {
        const client = myClients.find(c => c.id === d.assigned_client_id);
        return {
            id: d.id,
            type: 'DEVICE',
            client_id: d.assigned_client_id,
            client_name: client?.full_name || 'Unknown',
            title: 'Verify Active Usage',
            detail: `${store.getProductName(d.product_id)} (${d.serial_number})`,
            sub_detail: `Last check: ${d.last_updated}`,
            date: d.last_updated,
            icon: Box,
            color: 'amber'
        };
    });

  // 2. Jobs needing confirmation (appointments)
  const jobTasks = jobs
    .filter(j => j.confirmation_needed && j.client_id && myClientIds.includes(j.client_id))
    .map(j => ({
        id: j.id,
        type: 'APPOINTMENT',
        client_id: j.client_id,
        client_name: j.client_name,
        title: 'Confirm Appointment',
        detail: `${j.type} Visit`,
        sub_detail: j.scheduled_for ? `Scheduled: ${j.scheduled_for}` : 'Scheduling in progress',
        date: j.scheduled_for || 'Pending',
        icon: Calendar,
        color: 'blue'
    }));

  const allTasks = [...deviceTasks, ...jobTasks].filter(t => filter === 'ALL' || t.type === filter);

  // Metrics
  const total = allTasks.length;
  const deviceCount = deviceTasks.length;
  const jobCount = jobTasks.length;

  // Actions
  const handleConfirm = (task: any) => {
      if (task.type === 'DEVICE') {
          store.confirmDevice(task.id);
      } else {
          store.confirmJobSchedule(task.id);
      }
  };

  const handleIssue = (task: any) => {
      const issue = prompt("Describe the issue (e.g., Client unavailable, Device broken):");
      if (issue) {
          store.createException({
              severity: 'WARNING',
              title: `Issue Reported: ${task.title}`,
              description: `${currentUser.name} reported: ${issue} for ${task.detail}`,
              related_entity_type: task.type === 'DEVICE' ? 'DEVICE' : 'JOB',
              related_entity_id: task.id
          });
          alert("Issue reported to Operations.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-2">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <CheckCircle className="w-8 h-8 text-brand-600" />
             Confirmations
           </h2>
           <p className="text-slate-500 mt-2">Verify ongoing usage and upcoming appointments.</p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-6">
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Actions</p>
               <p className="text-2xl font-bold text-slate-900">{deviceCount + jobCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-500"><AlertTriangle className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-amber-200 bg-amber-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Device Checks</p>
               <p className="text-2xl font-bold text-amber-800">{deviceCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600"><Box className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-blue-200 bg-blue-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Appointments</p>
               <p className="text-2xl font-bold text-blue-800">{jobCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Calendar className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed Today</p>
               <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle className="w-6 h-6" /></div>
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="flex gap-2">
               {['ALL', 'DEVICE', 'APPOINTMENT'].map(t => (
                  <button 
                     key={t}
                     onClick={() => setFilter(t as any)}
                     className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        filter === t 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                     }`}
                  >
                     {t === 'ALL' ? 'All Tasks' : t === 'DEVICE' ? 'Device Checks' : 'Appointments'}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-9 font-bold text-slate-600"><Filter className="w-4 h-4 mr-2" /> Filter List</Button>
      </div>

      {/* Task List Table */}
      <Card className="flex-1 overflow-hidden flex flex-col shadow-md border-slate-200" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider w-16">Type</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Required Action</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Context</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${task.type === 'DEVICE' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        <task.icon className="w-5 h-5" />
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-900">{task.client_name}</div>
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-[10px] px-2 mt-1 border-slate-200 text-slate-500 hover:text-brand-600"
                        onClick={() => navigate(`/clients/${task.client_id}`)}
                     >
                        View Profile
                     </Button>
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-800">{task.title}</div>
                     <div className="text-xs text-slate-500 mt-0.5">{task.detail}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-600">
                        {task.sub_detail}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Button 
                           variant="outline" 
                           className="h-9 px-3 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 font-bold"
                           onClick={() => handleIssue(task)}
                        >
                           Report Issue
                        </Button>
                        <Button 
                           className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white shadow-sm font-bold"
                           onClick={() => handleConfirm(task)}
                        >
                           <CheckCircle className="w-4 h-4 mr-1.5" /> Confirm
                        </Button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allTasks.length === 0 && (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                <p className="text-sm">No pending confirmations found.</p>
             </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center font-medium">
           Showing {allTasks.length} pending items
        </div>
      </Card>
    </div>
  );
};
