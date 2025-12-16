import React from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { CaseStatus, JobStatus } from '../types';
import { 
  AlertOctagon, CheckCircle, ClipboardCheck, Truck, 
  ArrowRight, Clock, AlertTriangle, Package, XCircle 
} from 'lucide-react';

export const OpsDashboard: React.FC = () => {
  const { exceptions, cases, jobs, devices, currentUser } = useStore();
  const navigate = useNavigate();

  // --- FILTERS ---
  const criticalExceptions = exceptions.filter(e => e.status !== 'RESOLVED' && (e.severity === 'BLOCKER' || e.severity === 'INCIDENT'));
  const pendingApprovals = cases.filter(c => c.status === CaseStatus.NEW);
  const missedJobs = jobs.filter(j => j.status === JobStatus.MISSED || j.status === JobStatus.RESCHEDULE_REQUIRED);
  const slaBreaches = devices.filter(d => d.sla_breach);
  const returnsPending = jobs.filter(j => j.type === 'RETURN' && j.status === JobStatus.NEEDS_SCHEDULING);

  // --- ACTIONS ---
  const handleQuickApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.approveCase(id);
  };

  const handleLogisticsAction = (action: string, job: any) => {
     if (action === 'contact') {
        alert(`Opening comms channel for ${job.client_name}...`);
        navigate('/messages');
     } else if (action === 'reschedule') {
        // In real app: open modal
        const newDate = prompt("Enter new date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
        if (newDate) {
           store.rescheduleJob(job.id, newDate); // Updated method call
           alert(`Job rescheduled to ${newDate}`);
        }
     } else if (action === 'book_return') {
        alert(`Return label generated for ${job.client_name}. Notification sent.`);
        navigate('/jobs');
     }
  };

  const StatCard = ({ label, value, color, icon: Icon, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${
        value > 0 ? `border-${color}-200 bg-${color}-50` : 'border-slate-200 opacity-80'
      }`}
    >
      <div>
        <p className={`text-[10px] uppercase font-bold tracking-wider ${value > 0 ? `text-${color}-700` : 'text-slate-500'}`}>{label}</p>
        <p className={`text-2xl font-bold ${value > 0 ? `text-${color}-900` : 'text-slate-700'}`}>{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${value > 0 ? `bg-${color}-200 text-${color}-700` : 'bg-slate-100 text-slate-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  return (
    <div className="max-w-full space-y-6">
      {/* 1. HEADER & KPI STRIP */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Operations Control Center</h2>
          <p className="text-xs text-slate-500">Welcome back, {currentUser.name}. You have <strong className="text-slate-900">{criticalExceptions.length + pendingApprovals.length + missedJobs.length}</strong> active items requiring attention.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">SYSTEM STATUS</span>
          <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> OPERATIONAL
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Critical Blockers" 
          value={criticalExceptions.length} 
          color="red" 
          icon={AlertOctagon} 
          onClick={() => navigate('/exceptions')}
        />
        <StatCard 
          label="Pending Approvals" 
          value={pendingApprovals.length} 
          color="blue" 
          icon={ClipboardCheck} 
          onClick={() => navigate('/cases')}
        />
        <StatCard 
          label="Missed Jobs" 
          value={missedJobs.length} 
          color="amber" 
          icon={Clock} 
          onClick={() => navigate('/jobs')}
        />
        <StatCard 
          label="SLA Breaches" 
          value={slaBreaches.length} 
          color="red" 
          icon={AlertTriangle} 
          onClick={() => navigate('/assets')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. MAIN COLUMN: THE QUEUE (Exceptions + Approvals) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* URGENT EXCEPTIONS */}
          <Card title="Priority Queue (Exceptions)" noPadding className="border-t-4 border-t-red-500">
            {criticalExceptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No critical exceptions. Queue clear.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {criticalExceptions.map(ex => (
                  <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                     <div className="flex items-start gap-3">
                        <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{ex.title}</span>
                              <Badge color="red">{ex.severity}</Badge>
                           </div>
                           <p className="text-xs text-slate-500 line-clamp-1">{ex.description}</p>
                           <div className="mt-1 text-[10px] font-mono text-slate-400">
                              {ex.related_entity_type} #{ex.related_entity_id} • Owner: {ex.human_owner_role}
                           </div>
                        </div>
                     </div>
                     <Button size="sm" variant="outline" onClick={() => navigate('/exceptions')}>Resolve</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* APPROVALS QUEUE */}
          <Card title="Approvals Required" noPadding className="border-t-4 border-t-blue-500">
             {pendingApprovals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No pending approvals.</div>
             ) : (
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                      <tr>
                         <th className="px-4 py-2">Case ID</th>
                         <th className="px-4 py-2">Client</th>
                         <th className="px-4 py-2">Items</th>
                         <th className="px-4 py-2 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {pendingApprovals.map(c => (
                         <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                            <td className="px-4 py-3 font-medium">{c.client_name}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                               {store.getProductIdsToNames(c.product_ids).join(', ')}
                            </td>
                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                               <Button size="sm" variant="outline" className="h-7 text-red-600 border-red-200 hover:bg-red-50">
                                  <XCircle className="w-3 h-3" />
                               </Button>
                               <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700" onClick={(e) => handleQuickApprove(c.id, e)}>
                                  <CheckCircle className="w-3 h-3 mr-1" /> Approve
                               </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}
          </Card>

        </div>

        {/* 3. SIDE COLUMN: LOGISTICS WATCHLIST */}
        <div className="space-y-6">
           
           {/* MISSED JOBS ALERT */}
           <Card title="Logistics Issues" noPadding>
              <div className="bg-amber-50 p-3 border-b border-amber-100 flex justify-between items-center">
                 <span className="text-xs font-bold text-amber-800 uppercase">Missed / Reschedule</span>
                 <span className="text-xs font-bold bg-amber-200 text-amber-900 px-1.5 rounded">{missedJobs.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                 {missedJobs.slice(0, 5).map(j => (
                    <div key={j.id} className="p-3">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-slate-800">{j.client_name}</span>
                          <span className="text-[10px] text-red-500 font-bold">{j.status}</span>
                       </div>
                       <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" /> Was: {j.scheduled_for}
                       </div>
                       <div className="mt-2 flex gap-2">
                          <button onClick={() => handleLogisticsAction('contact', j)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] py-1 rounded font-medium transition-colors">Contact</button>
                          <button onClick={() => handleLogisticsAction('reschedule', j)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] py-1 rounded font-medium transition-colors">Reschedule</button>
                       </div>
                    </div>
                 ))}
                 {missedJobs.length === 0 && <div className="p-4 text-center text-xs text-slate-400">No logistics issues.</div>}
              </div>
           </Card>

           {/* RETURNS WATCHLIST */}
           <Card title="Returns Pending Pickup" noPadding>
               <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase">Awaiting Logistics</span>
                  <Badge color="blue">{returnsPending.length}</Badge>
               </div>
               <div className="divide-y divide-slate-100">
                  {returnsPending.slice(0, 5).map(j => (
                     <div key={j.id} className="p-3 flex justify-between items-center">
                        <div>
                           <p className="text-xs font-bold text-slate-800">{j.client_name}</p>
                           <p className="text-[10px] text-slate-500">Return Request</p>
                        </div>
                        <Button onClick={() => handleLogisticsAction('book_return', j)} size="sm" variant="outline" className="h-6 text-[10px] px-2">Book</Button>
                     </div>
                  ))}
               </div>
               <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button onClick={() => navigate('/jobs')} className="text-[10px] font-bold text-brand-600 flex items-center justify-center gap-1 w-full">
                     View All Logistics <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
           </Card>

           {/* SLA WATCHLIST */}
           <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-2">
                 <AlertTriangle className="w-3.5 h-3.5" /> SLA Breach Watch
              </h4>
              <p className="text-xs text-red-700 mb-3">
                 <strong>{slaBreaches.length} devices</strong> have exceeded custody timers. Immediate accountability check required.
              </p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white border-0 h-8 text-xs" onClick={() => navigate('/assets')}>
                 View Accountability Report
              </Button>
           </div>

        </div>
      </div>
    </div>
  );
};