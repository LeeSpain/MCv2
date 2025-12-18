import React, { useMemo } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { DeviceStatus, JobStatus } from '../types';
import {
  FileText,
  CheckCircle,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Download,
  Share2,
  Printer,
  AlertOctagon
} from 'lucide-react';

export const DailyReport: React.FC = () => {
  const { devices, jobs, exceptions, agents } = useStore();

  // --- CALCULATIONS ---
  const totalDevices = devices.length;
  const unaccountedDevices = devices.filter(
    d => !d.current_custodian || d.current_custodian === 'Unknown'
  ).length;

  const accountabilityScore =
    totalDevices > 0
      ? ((totalDevices - unaccountedDevices) / totalDevices) * 100
      : 100;

  const overdueItems = devices.filter(d => d.sla_breach);
  const criticalExceptions = exceptions.filter(
    e => e.severity === 'BLOCKER' || e.severity === 'INCIDENT'
  );

  const statusCounts = devices.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusList = Object.values(DeviceStatus);

  const installsScheduled = jobs.filter(
    j => j.type === 'INSTALL' && j.status === JobStatus.SCHEDULED
  ).length;

  const installsCompleted = jobs.filter(
    j => j.type === 'INSTALL' && j.status === JobStatus.COMPLETED
  ).length;

  const returnsPickup = jobs.filter(
    j => j.type === 'RETURN' && j.status === JobStatus.SCHEDULED
  ).length;

  const aiStats = useMemo(
    () => ({
      scanned: agents.reduce(
        (sum, a) => sum + (a.status === 'ENABLED' ? 1240 : 0),
        0
      ),
      flags: exceptions.length + 5,
      drafts: 12,
      escalations: criticalExceptions.length
    }),
    [agents, exceptions, criticalExceptions]
  );

  const isHealthy =
    unaccountedDevices === 0 && criticalExceptions.length === 0;

  const handlePrint = () => window.print();

  const MetricCell = ({ label, value, sub, color = 'text-slate-900' }: any) => (
    <div className="flex-1 px-4 py-3 md:py-0">
      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && (
        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
          {sub}
        </div>
      )}
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
            <span>
              Generated for{' '}
              <span className="font-semibold text-slate-700">
                Martijn (CEO)
              </span>
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              RUN-ID #8921
            </span>
          </p>
        </div>

        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* METRICS */}
      <Card noPadding>
        <div className="flex flex-col md:flex-row py-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <MetricCell label="Total Assets" value={totalDevices} sub="+2 net change" />
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
            sub="Blockers / Incidents"
            color={criticalExceptions.length > 0 ? 'text-red-600' : 'text-slate-300'}
          />
        </div>
      </Card>

      {/* CRITICAL OVERDUE ITEMS */}
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
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">
                      {d.serial_number}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {store.getProductName(d.product_id)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {d.current_custodian}
                    </td>
                    <td className="px-5 py-3">
                      <Badge color="red">BREACH &gt; 24H</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* SYSTEM STATUS */}
      <Card
        className={`p-5 border-l-4 ${
          isHealthy
            ? 'border-l-green-500 bg-green-50/30'
            : 'border-l-red-500 bg-red-50/30'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          {isHealthy ? (
            <ShieldCheck className="w-6 h-6 text-green-600" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-red-600" />
          )}
          <h3 className={`font-bold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
            {isHealthy ? 'System Healthy' : 'Action Required'}
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isHealthy
            ? 'All chains of custody verified. No blockers detected.'
            : 'Critical exceptions exist. Accountability risk detected.'}
        </p>
      </Card>
    </div>
  );
};