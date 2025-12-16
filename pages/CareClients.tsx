
import React, { useState } from 'react';
import { useStore } from '../services/store';
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
  // Calculate average devices per client for the filtered set (mock logic for demo)
  const totalDevices = devices.filter(d => filteredClients.some(c => c.id === d.assigned_client_id)).length;
  const avgDevices = totalClients > 0 ? (totalDevices / totalClients).toFixed(1) : '0';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Users className="w-6 h-6 text-brand-600" />
             {isInternalOps ? 'Global Client Directory' : 'My Client List'}
           </h2>
           <p className="text-xs text-slate-500 mt-1">
             {isInternalOps 
                ? 'Master registry of all end-users across all care partners.' 
                : 'Manage patient profiles, care plans, and assigned devices.'}
           </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
           {(isLead || isInternalOps) && <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Client</Button>}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-4">
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Total Clients</p>
               <p className="text-xl font-bold text-slate-900">{totalClients}</p>
            </div>
            <Users className="w-8 h-8 text-slate-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between border-green-100 bg-green-50/50">
            <div>
               <p className="text-[10px] font-bold text-green-600 uppercase">Active Service</p>
               <p className="text-xl font-bold text-green-700">{activeClients}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between border-red-100 bg-red-50/50">
            <div>
               <p className="text-[10px] font-bold text-red-600 uppercase">High Risk</p>
               <p className="text-xl font-bold text-red-700">{highRisk}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Devices</p>
               <p className="text-xl font-bold text-slate-900">{avgDevices}</p>
            </div>
            <Building2 className="w-8 h-8 text-slate-200" />
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search name, address, ID..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex gap-1">
               {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
                  <button 
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        statusFilter === s 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                     }`}
                  >
                     {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-8"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
      </div>

      {/* Table Content */}
      <Card className="flex-1 overflow-hidden flex flex-col" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Client Identity</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Care Partner</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Status & Risk</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Devices</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-right">Actions</th>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{client.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-1.5 text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {client.care_company_name}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                          <Badge color={client.status === 'ACTIVE' ? 'green' : 'gray'}>{client.status}</Badge>
                          {client.risk_level === 'HIGH' && <Badge color="red">HIGH RISK</Badge>}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="text-xs text-slate-600 space-y-0.5">
                          <div className="flex items-center gap-1.5 truncate max-w-[200px]"><MapPin className="w-3 h-3 text-slate-300" /> {client.address}</div>
                          {client.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-300" /> {client.phone}</div>}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${deviceCount > 0 ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {deviceCount} Devices
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                       <Button size="sm" variant="outline" className="h-7 text-xs">View Profile</Button>
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
        <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
           Showing {filteredClients.length} records
        </div>
      </Card>
    </div>
  );
};
