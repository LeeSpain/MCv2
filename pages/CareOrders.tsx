import React from 'react';
import { useStore } from '../services/store';
import { Card, Badge } from '../components/ui';
import { ClipboardList } from 'lucide-react';

export const CareOrders: React.FC = () => {
  const { cases, currentUser } = useStore();

  const myCases = cases.filter(c => c.care_company_id === currentUser.care_company_id);

  // Map internal status to simple clinical status
  const getSimpleStatus = (status: string) => {
    switch (status) {
      case 'NEW': return { text: 'Submitted', color: 'blue' };
      case 'APPROVED':
      case 'STOCK_ALLOCATED': return { text: 'Being Prepared', color: 'blue' };
      case 'INSTALLATION_PENDING': return { text: 'Installation Scheduled', color: 'yellow' };
      case 'INSTALLED':
      case 'ACTIVE_SERVICE': return { text: 'Active', color: 'green' };
      case 'RETURN_PENDING': return { text: 'Return in Progress', color: 'yellow' };
      case 'CLOSED': return { text: 'Closed', color: 'gray' };
      default: return { text: 'Processing', color: 'gray' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-brand-600" />
          Active Orders
        </h2>
        <p className="text-slate-500">Track the status of your requests.</p>
      </div>

      <div className="space-y-4">
        {myCases.map(c => {
           const simpleStatus = getSimpleStatus(c.status);
           return (
             <Card key={c.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-slate-900">{c.client_name}</span>
                      <span className="text-xs text-slate-400 font-mono">#{c.id}</span>
                   </div>
                   <p className="text-sm text-slate-600">
                      {c.items.join(', ')}
                   </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                   <Badge color={simpleStatus.color as any}>{simpleStatus.text}</Badge>
                   <span className="text-xs text-slate-400">Updated: {new Date().toLocaleDateString()}</span>
                </div>
             </Card>
           );
        })}
        {myCases.length === 0 && (
           <div className="p-12 text-center text-slate-400 border-2 border-dashed rounded-xl">
              No active orders found.
           </div>
        )}
      </div>
    </div>
  );
};