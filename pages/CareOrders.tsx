
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { ClipboardList, ArrowRight, Package, Search, Filter, Clock, CheckCircle, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CaseStatus } from '../types';

export const CareOrders: React.FC = () => {
  const { cases, currentUser } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const myCases = cases.filter(c => c.care_company_id === currentUser.care_company_id);

  // Metrics
  const total = myCases.length;
  const processing = myCases.filter(c => ['NEW', 'APPROVED', 'STOCK_ALLOCATED', 'INSTALLATION_PENDING'].includes(c.status)).length;
  const active = myCases.filter(c => c.status === 'ACTIVE_SERVICE' || c.status === 'INSTALLED').length;
  const closed = myCases.filter(c => c.status === 'CLOSED').length;

  // Filter Logic
  const filteredCases = myCases.filter(c => {
    if (statusFilter === 'OPEN' && !['NEW', 'APPROVED', 'STOCK_ALLOCATED', 'INSTALLATION_PENDING'].includes(c.status)) return false;
    if (statusFilter === 'ACTIVE' && c.status !== 'ACTIVE_SERVICE' && c.status !== 'INSTALLED') return false;
    if (statusFilter === 'CLOSED' && c.status !== 'CLOSED') return false;
    
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        return c.client_name.toLowerCase().includes(lower) || 
               c.id.toLowerCase().includes(lower) ||
               store.getProductIdsToNames(c.product_ids).some(p => p.toLowerCase().includes(lower));
    }
    return true;
  });

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

  const handleRowClick = (clientId: string) => {
      navigate(`/clients/${clientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-2">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <ClipboardList className="w-8 h-8 text-brand-600" />
             Active Orders
           </h2>
           <p className="text-slate-500 mt-2">Track status and fulfillment of patient requests.</p>
        </div>
        <div>
           <Button onClick={() => navigate('/clients')} className="bg-brand-600 hover:bg-brand-700 text-white shadow-md font-bold">
              <Package className="w-4 h-4 mr-2" /> New Request
           </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-6">
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
               <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-400"><ClipboardList className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-blue-200 bg-blue-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Processing</p>
               <p className="text-2xl font-bold text-blue-700">{processing}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Clock className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-green-200 bg-green-50/50 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Active Service</p>
               <p className="text-2xl font-bold text-green-700">{active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><CheckCircle className="w-6 h-6" /></div>
         </Card>
         <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Closed</p>
               <p className="text-2xl font-bold text-slate-900">{closed}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-400"><Box className="w-6 h-6" /></div>
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search orders, clients..." 
                  className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-80 shadow-inner"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex gap-2">
               {['ALL', 'OPEN', 'ACTIVE', 'CLOSED'].map(s => (
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
         <Button variant="outline" size="sm" className="h-9 font-bold text-slate-600"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
      </div>

      {/* Table Content */}
      <Card className="flex-1 overflow-hidden flex flex-col shadow-md border-slate-200" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider w-32">Order ID</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Requested Items</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Last Update</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map(c => {
                const simpleStatus = getSimpleStatus(c.status);
                const itemNames = store.getProductIdsToNames(c.product_ids);
                
                return (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer" 
                    onClick={() => handleRowClick(c.client_id)}
                  >
                    <td className="px-6 py-4">
                       <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">#{c.id}</span>
                       <div className="text-[10px] text-slate-400 mt-1">{c.created_at}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="font-bold text-slate-900">{c.client_name}</div>
                       <div className="text-xs text-slate-500 flex items-center gap-1">
                          Ref: {c.client_id}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1">
                          {itemNames.slice(0, 2).map((name, idx) => (
                             <span key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full"></div> {name}
                             </span>
                          ))}
                          {itemNames.length > 2 && <span className="text-[10px] text-slate-400 pl-3">+{itemNames.length - 2} more</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge color={simpleStatus.color as any}>{simpleStatus.text}</Badge>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-slate-500 font-medium">Today</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-slate-600 group-hover:border-brand-300 group-hover:text-brand-600">
                          View Details <ArrowRight className="w-3 h-3 ml-1" />
                       </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
                <p>No orders found matching filters.</p>
             </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center font-medium">
           Showing {filteredCases.length} records
        </div>
      </Card>
    </div>
  );
};
