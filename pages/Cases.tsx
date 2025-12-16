
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { CaseStatus, Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Search, Filter, CheckCircle, XCircle, 
  Clock, ArrowRight, Package, Box, AlertTriangle, Building2,
  RefreshCw, Wrench
} from 'lucide-react';

export const Cases: React.FC = () => {
  const { cases, currentUser } = useStore();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Permissions
  const canApprove = [Role.MC_ADMIN, Role.MC_OPERATIONS].includes(currentUser.role);
  const canCreate = [Role.MC_ADMIN, Role.CARE_COMPANY_LEAD_NURSE].includes(currentUser.role);

  // Metrics
  const total = cases.length;
  const newCases = cases.filter(c => c.status === CaseStatus.NEW).length;
  const active = cases.filter(c => c.status !== CaseStatus.NEW && c.status !== CaseStatus.CLOSED).length;
  const closed = cases.filter(c => c.status === CaseStatus.CLOSED).length;

  // Filter Logic
  const filteredCases = cases.filter(c => {
    if (statusFilter === 'NEW' && c.status !== CaseStatus.NEW) return false;
    if (statusFilter === 'PROCESSING' && (c.status === CaseStatus.NEW || c.status === CaseStatus.CLOSED)) return false;
    if (statusFilter === 'CLOSED' && c.status !== CaseStatus.CLOSED) return false;
    
    if (search && !c.client_name.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (canApprove) store.approveCase(id);
  };

  const handleAllocate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (canApprove) {
        store.allocateCase(id);
    }
  };

  const handleCreateJob = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(canApprove) {
          store.createInstallJobsFromAllocation(id);
      }
  };

  const handleManage = (clientId: string) => {
      navigate(`/clients/${clientId}`);
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'blue';
      case CaseStatus.APPROVED: return 'green';
      case CaseStatus.CLOSED: return 'gray';
      case CaseStatus.INSTALLATION_PENDING: return 'yellow';
      case CaseStatus.ACTIVE_SERVICE: return 'green';
      case CaseStatus.STOCK_ALLOCATED: return 'blue';
      default: return 'gray';
    }
  };

  const getLineItemStatusColor = (status: string) => {
      switch(status) {
          case 'ALLOCATED': return 'green';
          case 'PARTIAL': return 'yellow';
          case 'OUT_OF_STOCK': return 'red';
          default: return 'gray';
      }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ClipboardList className="w-6 h-6 text-brand-600" />
             Order Management
           </h2>
           <p className="text-xs text-slate-500 mt-1">Process intake, approvals, and fulfillment.</p>
        </div>
        <div className="flex gap-2">
           {canCreate && <Button size="sm">New Case</Button>}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-4">
         <Card className="p-3 flex items-center justify-between border-slate-200">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Total Orders</p>
               <p className="text-xl font-bold text-slate-900">{total}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-slate-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between bg-blue-50 border-blue-100">
            <div>
               <p className="text-[10px] font-bold text-blue-600 uppercase">New Requests</p>
               <p className="text-xl font-bold text-blue-700">{newCases}</p>
            </div>
            <Box className="w-8 h-8 text-blue-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Processing</p>
               <p className="text-xl font-bold text-slate-900">{active}</p>
            </div>
            <Clock className="w-8 h-8 text-slate-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
               <p className="text-xl font-bold text-slate-900">{closed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-slate-200" />
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search client, case ID..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex gap-1">
               {['ALL', 'NEW', 'PROCESSING', 'CLOSED'].map(s => (
                  <button 
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        statusFilter === s 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                     }`}
                  >
                     {s === 'ALL' ? 'All Orders' : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-8"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
      </div>

      {/* Table View */}
      <Card className="flex-1 overflow-hidden flex flex-col" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0 z-10">
               <tr>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide w-32">Case ID</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Client Details</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Line Items & Allocation</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Workflow Status</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide text-right">Ops Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredCases.map(c => {
                 const isFullyAllocated = c.line_items.every(li => li.status === 'ALLOCATED');
                 const hasAllocationIssues = c.line_items.some(li => li.status === 'OUT_OF_STOCK' || li.status === 'PARTIAL');

                 return (
                   <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-4 py-3">
                        <div className="font-mono font-medium text-slate-700">{c.id}</div>
                        <div className="text-[10px] text-slate-400">{c.created_at}</div>
                     </td>
                     <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{c.client_name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                           <Building2 className="w-3 h-3" /> {c.care_company_id === 'cc1' ? 'Thuiszorg West' : 'Zorg & Co'}
                        </div>
                     </td>
                     <td className="px-4 py-3">
                        <div className="space-y-1.5">
                          {c.line_items.map((li, i) => (
                             <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded border border-slate-100">
                                <div className="flex items-center gap-2">
                                   <Package className="w-3 h-3 text-slate-400" />
                                   <span className="font-medium text-slate-700">{store.getProductName(li.product_id)}</span>
                                   <span className="text-slate-400">x{li.requested_qty}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] text-slate-500">Allocated: <strong>{li.allocated_device_ids.length}</strong></span>
                                   <Badge color={getLineItemStatusColor(li.status) as any}>{li.status}</Badge>
                                </div>
                             </div>
                          ))}
                        </div>
                     </td>
                     <td className="px-4 py-3">
                        <Badge color={getStatusColor(c.status)}>{c.status.replace('_', ' ')}</Badge>
                     </td>
                     <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          
                          {/* NEW CASE ACTIONS */}
                          {c.status === CaseStatus.NEW && canApprove && (
                             <>
                               <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                                 <XCircle className="w-3 h-3" />
                               </Button>
                               <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={(e) => handleApprove(c.id, e)}>
                                 <CheckCircle className="w-3 h-3 mr-1" /> Approve
                               </Button>
                             </>
                          )}

                          {/* POST-APPROVAL ACTIONS (Allocations) */}
                          {(c.status === CaseStatus.APPROVED || c.status === CaseStatus.STOCK_ALLOCATED) && canApprove && (
                              <>
                                {/* Show Allocate if issues or not fully done yet (idempotent) */}
                                {(!isFullyAllocated || hasAllocationIssues) && (
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-brand-200 text-brand-700 hover:bg-brand-50" onClick={(e) => handleAllocate(c.id, e)}>
                                        <RefreshCw className="w-3 h-3 mr-1" /> Allocate
                                    </Button>
                                )}
                                
                                {/* Show Create Jobs if fully allocated but jobs not yet created/case advanced */}
                                {isFullyAllocated && (
                                    <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white" onClick={(e) => handleCreateJob(c.id, e)}>
                                        <Wrench className="w-3 h-3 mr-1" /> Create Jobs
                                    </Button>
                                )}
                              </>
                          )}

                          {/* GENERIC MANAGE */}
                          {c.status !== CaseStatus.NEW && c.status !== CaseStatus.APPROVED && c.status !== CaseStatus.STOCK_ALLOCATED && (
                             <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleManage(c.client_id)}>
                               Manage <ArrowRight className="w-3 h-3 ml-1" />
                             </Button>
                          )}
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
          {filteredCases.length === 0 && (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
                <p>No orders found matching criteria.</p>
             </div>
          )}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
           Showing {filteredCases.length} of {total} orders
        </div>
      </Card>
    </div>
  );
};
