import React from 'react';
import { useStore } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { Link } from 'react-router-dom';
import { Users, Plus, ChevronRight } from 'lucide-react';
import { Role } from '../types';

export const CareClients: React.FC = () => {
  const { clients, currentUser, devices } = useStore();

  const myClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  const isLead = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
             <Users className="w-8 h-8 text-brand-600" />
             My Clients
           </h2>
           <p className="text-slate-500">Manage client profiles and care plans.</p>
        </div>
        {isLead && <Button><Plus className="w-4 h-4 mr-2" /> Add New Client</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {myClients.map(client => {
          const deviceCount = devices.filter(d => d.assigned_client_id === client.id && d.status === 'INSTALLED_ACTIVE').length;
          return (
            <Link key={client.id} to={`/clients/${client.id}`}>
              <Card className="flex items-center justify-between p-6 hover:shadow-md transition-shadow group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                       {client.full_name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="font-bold text-lg text-slate-900">{client.full_name}</h4>
                       <p className="text-sm text-slate-500">{client.address}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8">
                    <div className="text-center">
                       <span className="block text-xl font-bold text-slate-900">{deviceCount}</span>
                       <span className="text-xs text-slate-400 uppercase font-bold">Devices</span>
                    </div>
                    <Badge color={client.status === 'ACTIVE' ? 'green' : 'gray'}>{client.status}</Badge>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500" />
                 </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};