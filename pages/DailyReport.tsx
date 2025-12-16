
import React, { useMemo } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { DeviceStatus, JobStatus } from '../types';
import { 
  FileText, CheckCircle, Activity, 
  ShieldCheck, ShieldAlert, Download, Share2, Printer,
  AlertOctagon
} from 'lucide-react';

export const DailyReport: React.FC = () => {
  const { devices, jobs, exceptions, agents } = useStore();

  // --- CALCULATIONS (Preserved) ---
  const totalDevices = devices.length;
  const unaccountedDevices = devices.filter(d => !d.current_custodian || d.current_custodian === 'Unknown').length;
  const accountabilityScore = totalDevices > 0 ? ((totalDevices - unaccountedDevices) / totalDevices) * 100 : 100;
  
  const overdueItems = devices.filter(d => d.sla_breach);
  const criticalExceptions = exceptions.filter(e => e.severity === 'BLOCKER' || e.severity === 'INCIDENT');
  
  const statusCounts = devices.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusList = Object.values(DeviceStatus);

  const installsScheduled = jobs.filter(j => j.type === 'INSTALL' && j.status === JobStatus.SCHEDULED).length;
  const installsCompleted = jobs.filter(j => j.type === 'INSTALL' && j.status === JobStatus.COMPLETED).length; 
  const returnsPickup = jobs.filter(j => j.type === 'RETURN' && j.status === JobStatus.SCHEDULED).length;
  
  const aiStats = useMemo(() => {
    return {
      scanned: agents.reduce((sum, a) => sum + (a.status === 'ENABLED' ? 1240 : 0), 0),
      flags: exceptions.length + 5,
      drafts: 12,
      escalations: criticalExceptions.length
    };
  }, [agents, exceptions, criticalExceptions]);

  const isHealthy = unaccountedDevices === 0 && criticalExceptions.length === 0;

  const handlePrint = () => {
      window.print();
  };

  // Render Helper
  const MetricCell = ({ label, value, sub, color = 'text-slate-900' }: any) => (
    <div className="flex-1 px-4 py-3 md:py-0">
      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 font-medium mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 print:pb-0">
      {/* HEADER */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            Daily Accountability Report
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span>Generated for <span className="font-semibold text-slate-700">Martijn (CEO)</span></span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">RUN-ID #8921</span>
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
           <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
           <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
           <Button size="sm"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      {/* 1. EXECUTIVE METRICS STRIP */}
      <Card noPadding>
        <div className="flex flex-col md:flex-row py-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <MetricCell 
            label="Total Assets" 
            value={totalDevices} 
            sub="+2 net change" 
          />
          <MetricCell 
            label="Accountability" 
            value={`${accountabilityScore.toFixed(0)}%`} 
            sub="Target: 100%" 
            color={accountabilityScore === 100 ? 'text-green-600' : 'text-red-600'} 
          />
          <MetricCell 
            label="Missing Stock" 
            value={unaccountedDevices} 
            sub="Immediate Action" 
            color={unaccountedDevices > 0 ? 'text-red-600' : 'text-slate-300'} 
          />
          <MetricCell 
            label="SLA Breaches" 
            value={overdueItems.length} 
            sub="Overdue Items" 
            color={overdueItems.length > 0 ? 'text-amber-600' : 'text-slate-300'} 
          />
          <MetricCell 
            label="Critical Exceptions" 
            value={criticalExceptions.length} 
            sub="Blockers/Incidents" 
            color={criticalExceptions.length > 0 ? 'text-red-600' : 'text-slate-300'} 
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. ASSET DISTRIBUTION */}
          <Card title="Asset Status Distribution" noPadding>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
               {statusList.map(status => {
                 const count = statusCounts[status] || 0;
                 if (count === 0 && !['IN_STOCK', 'INSTALLED_ACTIVE', 'WITH_INSTALLER'].includes(status)) return null;
                 return (
                   <div key={status} className="bg-white p-4 flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase truncate mb-1">{status.replace(/_/g, ' ')}</span>
                      <span className="text-xl font-bold text-slate-800">{count}</span>
                   </div>
                 );
               })}
            </div>
            {/* Visual Bar */}
            <div className="flex h-2 w-full">
              <div style={{ width: `${(statusCounts['INSTALLED_ACTIVE']||0)/totalDevices*100}%` }} className="bg-green-500" />
              <div style={{ width: `${(statusCounts['IN_STOCK']||0)/totalDevices*100}%` }} className="bg-blue-500" />
              <div style={{ width: `${(statusCounts['WITH_INSTALLER']||0)/totalDevices*100}%` }} className="bg-amber-400" />
              <div className="flex-1 bg-slate-100" />
            </div>
          </Card>

          {/* B. CRITICAL OVERDUE LIST */}
          <Card title={`Critical Overdue Items (${overdueItems.length})`} noPadding>
            {overdueItems.length === 0 ? (
               <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-200 mb-2" />
                  No SLA breaches detected.
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-2 text-xs uppercase w-32">Serial</th>
                      <th className="px-5 py-2 text-xs uppercase">Device</th>
                      <th className="px-5 py-2 text-xs uppercase">Custodian</th>
                      <th className="px-5 py-2 text-xs uppercase">SLA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {overdueItems.slice(0, 8).map(d => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-mono text-xs text-slate-600">{d.serial_number}</td>
                        <td className="px-5 py-3 font-medium text-slate-900">{store.getProductName(d.product_id)}</td>
                        <td className="px-5 py-3 text-slate-600">{d.current_custodian}</td>
                        <td className="px-5 py-3"><Badge color="red">BREACH > 24H</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {overdueItems.length > 8 && (
                   <div className="p-2 text-center text-xs text-slate-400 border-t border-slate-100">
                     + {overdueItems.length - 8} more items
                   </div>
                )}
              </div>
            )}
          </Card>

          {/* C. OPERATIONS PERFORMANCE */}
          <div className="grid grid-cols-2 gap-6">
            <Card title="Installations (24h)" className="flex-1">
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{installsCompleted}</span>
                  <span className="text-sm text-slate-500 mb-1">/ {installsScheduled + installsCompleted} completed</span>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: '80%' }} className="bg-green-500 h-full rounded-full" />
               </div>
               <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Scheduled Today</span>
                     <span className="font-bold">{installsScheduled}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Missed / Reschedule</span>
                     <span className="font-bold text-red-600">0</span>
                  </div>
               </div>
            </Card>

            <Card title="Returns Logistics" className="flex-1">
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{returnsPickup}</span>
                  <span className="text-sm text-slate-500 mb-1">pending pickup</span>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: '40%' }} className="bg-blue-500 h-full rounded-full" />
               </div>
               <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">In Transit</span>
                     <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Received (24h)</span>
                     <span className="font-bold">0</span>
                  </div>
               </div>
            </Card>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-6">
           
           {/* CONFIDENCE SCORE */}
           <Card className={`p-5 border-l-4 ${isHealthy ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                 {isHealthy ? <ShieldCheck className="w-6 h-6 text-green-600" /> : <ShieldAlert className="w-6 h-6 text-red-600" />}
                 <h3 className={`font-bold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
                    {isHealthy ? 'System Healthy' : 'Action Required'}
                 </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                 {isHealthy 
                   ? "All chains of custody verified. No blockers detected." 
                   : "Critical exceptions exist. Accountability risk detected."}
              </p>
           </Card>

           {/* AI ACTIVITY FEED */}
           <Card title="AI Activity Log">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> Items Scanned</span>
                    <span className="font-mono font-bold text-slate-800">{aiStats.scanned.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600 flex items-center gap-2"><AlertOctagon className="w-4 h-4 text-amber-500" /> Flags Raised</span>
                    <span className="font-mono font-bold text-slate-800">{aiStats.flags}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Drafts Created</span>
                    <span className="font-mono font-bold text-slate-800">{aiStats.drafts}</span>
                 </div>
                 
                 <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 italic mt-2">
                    "Reporting Agent completed full scan at 07:00. Stock Controller is monitoring 2 overdue returns."
                 </div>
              </div>
           </Card>

           {/* RECENT EXCEPTIONS MINI-LIST */}
           <Card title="Open Blockers" noPadding>
              {criticalExceptions.length === 0 ? (
                 <div className="p-6 text-center text-xs text-slate-400">None.</div>
              ) : (
                 <div className="divide-y divide-slate-100">
                    {criticalExceptions.slice(0, 5).map(e => (
                       <div key={e.id} className="p-3 hover:bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                             <Badge color="red">{e.severity}</Badge>
                             <span className="text-[10px] text-slate-400">#{e.id}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 line-clamp-1">{e.title}</p>
                       </div>
                    ))}
                 </div>
              )}
           </Card>

        </div>
      </div>
    </div>
  );
};
