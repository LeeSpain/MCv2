
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { JobStatus } from '../types';
import { 
  Calendar, User, MapPin, Clock, CheckCircle, 
  AlertCircle, Wrench, RefreshCw, Search, Filter, 
  Package, ChevronLeft, ChevronRight 
} from 'lucide-react';

export const Jobs: React.FC = () => {
  const { jobs, cases } = useStore();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Metrics
  const total = jobs.length;
  const needsScheduling = jobs.filter(j => j.status === JobStatus.NEEDS_SCHEDULING).length;
  const confirmed = jobs.filter(j => j.status === JobStatus.CONFIRMED).length;
  const installs = jobs.filter(j => j.type === 'INSTALL').length;
  const returns = jobs.filter(j => j.type === 'RETURN').length;

  const filteredJobs = jobs.filter(j => {
    if (filterType !== 'ALL' && j.type !== filterType) return false;
    if (search && !j.client_name.toLowerCase().includes(search.toLowerCase()) && !j.installer_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.CONFIRMED: return 'green';
      case JobStatus.COMPLETED: return 'blue';
      case JobStatus.NEEDS_SCHEDULING: return 'yellow';
      case JobStatus.MISSED: return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Calendar className="w-6 h-6 text-brand-600" />
             Operations Schedule
           </h2>
           <p className="text-xs text-slate-500 mt-1">Logistics management for installations and returns.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center bg-white border border-slate-300 rounded-md px-2 py-1 mr-2">
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <span className="text-xs font-bold text-slate-700 px-2">Today, {new Date().toLocaleDateString()}</span>
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
           </div>
           <Button size="sm"><Calendar className="w-4 h-4 mr-2" /> Book New Job</Button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-5 gap-4">
         <Card className="p-3 flex items-center justify-between bg-slate-50 border-slate-200">
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Pending Schedule</p>
               <p className="text-xl font-bold text-slate-900">{needsScheduling}</p>
            </div>
            <Clock className="w-8 h-8 text-slate-300" />
         </Card>
         <Card className="p-3 flex items-center justify-between bg-green-50 border-green-100">
            <div>
               <p className="text-[10px] font-bold text-green-600 uppercase">Confirmed</p>
               <p className="text-xl font-bold text-green-700">{confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Installations</p>
               <p className="text-xl font-bold text-slate-900">{installs}</p>
            </div>
            <Wrench className="w-8 h-8 text-slate-100" />
         </Card>
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Returns</p>
               <p className="text-xl font-bold text-slate-900">{returns}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-slate-100" />
         </Card>
         <Card className="p-3 flex items-center justify-between border-red-100 bg-red-50/50">
            <div>
               <p className="text-[10px] font-bold text-red-500 uppercase">Attention</p>
               <p className="text-xl font-bold text-red-700">{jobs.filter(j => j.status === JobStatus.MISSED || j.status === JobStatus.RESCHEDULE_REQUIRED).length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search client, installer..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex gap-1">
               {['ALL', 'INSTALL', 'RETURN'].map(t => (
                  <button 
                     key={t}
                     onClick={() => setFilterType(t)}
                     className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        filterType === t 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                     }`}
                  >
                     {t === 'ALL' ? 'All Jobs' : t === 'INSTALL' ? 'Installations' : 'Returns'}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-8"><Filter className="w-3 h-3 mr-2" /> View Map</Button>
      </div>

      {/* Dense List View */}
      <Card className="flex-1 overflow-hidden flex flex-col" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0 z-10">
               <tr>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide w-32">Scheduled</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide w-24">Type</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Client</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Details</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Installer</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                 <th className="px-4 py-3 text-xs uppercase tracking-wide text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredJobs.map(job => {
                 const jobCase = cases.find(c => c.id === job.case_id);
                 const products = jobCase ? store.getProductIdsToNames(jobCase.product_ids) : [];
                 
                 return (
                   <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-4 py-3">
                        {job.scheduled_for ? (
                          <div>
                             <div className="font-bold text-slate-900">{job.scheduled_for.split(' ')[1]}</div>
                             <div className="text-xs text-slate-500">{job.scheduled_for.split(' ')[0]}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic flex items-center gap-1">
                             <Clock className="w-3 h-3" /> Unscheduled
                          </span>
                        )}
                     </td>
                     <td className="px-4 py-3">
                        <div className={`flex items-center gap-2 font-medium ${job.type === 'INSTALL' ? 'text-brand-700' : 'text-purple-700'}`}>
                           {job.type === 'INSTALL' ? <Wrench className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                           {job.type}
                        </div>
                     </td>
                     <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{job.client_name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> Area West
                        </div>
                     </td>
                     <td className="px-4 py-3">
                        {products.length > 0 ? (
                           <div className="flex flex-col gap-0.5">
                              {products.slice(0, 2).map((p, i) => (
                                 <span key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                    <Package className="w-3 h-3 text-slate-300" /> {p}
                                 </span>
                              ))}
                              {products.length > 2 && <span className="text-[10px] text-slate-400 pl-4">+{products.length - 2} more</span>}
                           </div>
                        ) : (
                           <span className="text-xs text-slate-400">-</span>
                        )}
                     </td>
                     <td className="px-4 py-3">
                        {job.installer_name ? (
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {job.installer_name.charAt(0)}
                             </div>
                             <span className="text-slate-700">{job.installer_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Unassigned</span>
                        )}
                     </td>
                     <td className="px-4 py-3">
                        <Badge color={getStatusColor(job.status)}>{job.status.replace('_', ' ')}</Badge>
                        {job.confirmation_needed && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-200">CONFIRM NEEDED</span>}
                     </td>
                     <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-xs">Manage</Button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
          {filteredJobs.length === 0 && (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Calendar className="w-12 h-12 mb-3 opacity-20" />
                <p>No jobs found matching criteria.</p>
             </div>
          )}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
           Showing {filteredJobs.length} of {total} scheduled items
        </div>
      </Card>
    </div>
  );
};
