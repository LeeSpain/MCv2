
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, Search, Building2, MapPin, 
  Phone, AlertTriangle, Filter, Download
} from 'lucide-react';
import { Role } from '../types';

export const CareClients: React.FC = () => {
  const { clients, currentUser, devices } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  // Permissions
  const isInternalOps = [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO].includes(currentUser.role);
  const isLead = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE;

  const handleAddClient = () => {
      const name = prompt("Enter Client Full Name:");
      if (name) {
          const newClient = store.createClient({
              full_name: name,
              care_company_id: currentUser.care_company_id || 'cc1',
              care_company_name: currentUser.care_company_id === 'cc1' ? 'Thuiszorg West' : 'Zorg & Co'
          });
          navigate(`/clients/${newClient.id}`);
      }
  };

  // Filter Logic
  const filteredClients = clients.filter(c => {
    // 1. Scope (Ops sees all, Care sees their own)
    if (!isInternalOps && c.care_company_id !== currentUser.care_company_id) return false;
    
    // 2. Status
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

    // 3. Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      return c.full_name.toLowerCase().includes(lower) || 
             c.address.toLowerCase().includes(lower) ||
             (c.email && c.email.toLowerCase().includes(lower)) ||
             c.id.toLowerCase().includes(lower);
    }
    return true;
  });

  // Metrics Calculations
  const totalClients = filteredClients.length;
  const highRisk = filteredClients.filter(c => c.risk_level === 'HIGH').length;
  const activeClients = filteredClients.filter(c => c.status === 'ACTIVE').length;
  const totalDevices = devices.filter(d => filteredClients.some(c => c.id === d.assigned_client_id)).length;
  const avgDevices = totalClients > 0 ? (totalDevices / totalClients).toFixed(1) : '0';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-2 border-b border-slate-200">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <Users className="w-8 h-8 text-brand-600" />
             {isInternalOps ? 'Global Client Directory' : 'Client Directory'}
           </h2>
           <p className="text-slate-500 mt-2">
             {isInternalOps 
                ? 'Master registry of all end-users across all care partners.' 
                : 'Manage patient profiles, care plans, and assigned devices.'}
           </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => {}}><Download className="w-4 h-4 mr-2" /> Export List</Button>
           {(isLead || isInternalOps) && <Button onClick={handleAddClient} className="bg-brand-600 hover:bg-brand-700 text-white shadow-md"><Plus className="w-4 h-4 mr-2" /> Add New Client</Button>}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-6">
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Clients</p>
               <p className="text-2xl font-bold text-slate-900">{totalClients}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-400"><Users className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-green-200 bg-green-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Active Service</p>
               <p className="text-2xl font-bold text-green-700">{activeClients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><Users className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-red-200 bg-red-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">High Risk</p>
               <p className="text-2xl font-bold text-red-700">{highRisk}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertTriangle className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Devices / Client</p>
               <p className="text-2xl font-bold text-slate-900">{avgDevices}</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg text-brand-600"><Building2 className="w-6 h-6" /></div>
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search clients..." 
                  className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-80 shadow-inner"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex gap-2">
               {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
                  <button 
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        statusFilter === s 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                     }`}
                  >
                     {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-9 font-bold text-slate-600"><Filter className="w-4 h-4 mr-2" /> Advanced Filters</Button>
      </div>

      {/* Table Content */}
      <Card className="flex-1 overflow-hidden flex flex-col shadow-md border-slate-200" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Client Identity</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Care Partner</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Status & Risk</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Devices</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map(client => {
                const deviceCount = devices.filter(d => d.assigned_client_id === client.id && d.status === 'INSTALLED_ACTIVE').length;
                return (
                  <tr 
                    key={client.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer" 
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-sm font-bold text-brand-600 border border-brand-100 group-hover:bg-brand-100 transition-colors">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{client.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {client.care_company_name}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <Badge color={client.status === 'ACTIVE' ? 'green' : 'gray'}>{client.status}</Badge>
                          {client.risk_level === 'HIGH' && <Badge color="red">HIGH RISK</Badge>}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-2 truncate max-w-[200px]"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {client.address}</div>
                          {client.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {client.phone}</div>}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${deviceCount > 0 ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {deviceCount} Devices
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 text-xs font-bold">View Profile</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p>No clients found matching filters.</p>
             </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center font-medium">
           Showing {filteredClients.length} records
        </div>
      </Card>
    </div>
  );
};
