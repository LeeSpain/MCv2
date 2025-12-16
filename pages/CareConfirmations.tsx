
import React from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { CheckCircle, Clock } from 'lucide-react';

export const CareConfirmations: React.FC = () => {
  const { devices, jobs, clients, currentUser } = useStore();

  const myClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  const myClientIds = myClients.map(c => c.id);

  // Find items needing confirmation
  const devicesNeedingConfirmation = devices.filter(d => d.confirmation_needed && d.assigned_client_id && myClientIds.includes(d.assigned_client_id));
  const jobsNeedingConfirmation = jobs.filter(j => j.confirmation_needed && j.client_id && myClientIds.includes(j.client_id));

  const handleDeviceConfirm = (id: string) => {
    store.confirmDevice(id);
  };

  const handleJobConfirm = (id: string) => {
    // Care company only confirms availability/schedule, they do not COMPLETE the job.
    store.confirmJobSchedule(id); 
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-amber-500" />
          Confirmations Required
        </h2>
        <p className="text-slate-500">Please verify the following to ensure service continuity.</p>
      </div>

      <div className="space-y-4">
        {/* Device Confirmations */}
        {devicesNeedingConfirmation.map(d => (
           <Card key={d.id} className="p-6 border-l-4 border-l-amber-500">
              <div className="flex justify-between items-center">
                 <div>
                    <h4 className="font-bold text-slate-900 text-lg">Confirm Device Usage</h4>
                    <p className="text-slate-600 my-1">
                       Is the <strong>{store.getProductName(d.product_id)}</strong> for client <strong>{d.current_custodian.replace('Client: ', '')}</strong> still in active use?
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                       <Clock className="w-3 h-3" /> Last confirmed: {d.last_updated}
                    </p>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm">Report Issue</Button>
                    <Button onClick={() => handleDeviceConfirm(d.id)} className="bg-green-600 hover:bg-green-700">Yes, Still in Use</Button>
                 </div>
              </div>
           </Card>
        ))}

        {/* Job Confirmations */}
        {jobsNeedingConfirmation.map(j => (
           <Card key={j.id} className="p-6 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-center">
                 <div>
                    <h4 className="font-bold text-slate-900 text-lg">Confirm Appointment Availability</h4>
                    <p className="text-slate-600 my-1">
                       Please confirm availability for <strong>{j.type}</strong> at client <strong>{j.client_name}</strong> on <strong>{j.scheduled_for}</strong>.
                    </p>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm">Request Reschedule</Button>
                    <Button onClick={() => handleJobConfirm(j.id)} className="bg-blue-600 hover:bg-blue-700">Confirm Availability</Button>
                 </div>
              </div>
           </Card>
        ))}

        {devicesNeedingConfirmation.length === 0 && jobsNeedingConfirmation.length === 0 && (
           <div className="p-16 text-center bg-slate-50 border border-slate-200 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">All Clear!</h3>
              <p className="text-slate-500">No pending confirmations.</p>
           </div>
        )}
      </div>
    </div>
  );
};
