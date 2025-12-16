
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Badge, Button } from '../components/ui';
import { DeviceStatus } from '../types';
import { 
  Search, Filter, MapPin, Box, RefreshCw, AlertTriangle, 
  Download, Plus, MoreHorizontal, Activity, FileText
} from 'lucide-react';

export const Assets: React.FC = () => {
  const { devices } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Metrics
  const total = devices.length;
  const inStock = devices.filter(d => d.status === DeviceStatus.IN_STOCK).length;
  const active = devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE).length;
  const returns = devices.filter(d => ['AWAITING_RETURN', 'IN_TRANSIT', 'RECEIVED'].includes(d.status)).length;
  const overdue = devices.filter(d => d.sla_breach).length;

  const filteredDevices = devices.filter(d => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (search && !d.serial_number.toLowerCase().includes(search.toLowerCase()) && !d.current_custodian.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.INSTALLED_ACTIVE: return 'green';
      case DeviceStatus.IN_STOCK: return 'blue';
      case DeviceStatus.DORMANT: return 'gray';
      case DeviceStatus.WITH_INSTALLER: return 'yellow';
      case DeviceStatus.AWAITING_RETURN: return 'red';
      default: return 'gray';
    }
  };

  const handleRegisterAsset = () => {
    const serial = prompt("Enter Serial Number (e.g. MC-2024-XXX):");
    if (serial) {
        store.createDevice({
            id: `d-${Date.now()}`,
            serial_number: serial,
            product_id: 'prod-hub',
            status: DeviceStatus.IN_STOCK,
            current_custodian: 'Warehouse',
            last_updated: new Date().toISOString().split('T')[0]
        });
    }
  };

  const handleViewHistory = (deviceId: string) => {
      alert(`Simulating Chain of Custody retrieval for Device ${deviceId}...\n\n- Warehouse (Created)\n- Installer (Transfer)\n- Client (Active)`);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Box className="w-6 h-6 text-brand-600" />
             Asset Inventory
           </h2>
           <p className="text-xs text-slate-500 mt-1">Real-time custody and status tracking.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
           <Button size="sm" onClick={handleRegisterAsset}><Plus className="w-4 h-4 mr-2" /> Register Asset</Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-5 gap-4">
         <Card className="p-3 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Total Assets</p>
               <p className="text-xl font-bold text-slate-900">{total}</p>
            </div>
            <Box className="w-8 h-8 text-slate-100" />
         </Card>
         <Card className="p-3 flex items-center justify-between border-blue-100 bg-blue-50/50">
            <div>
               <p className="text-[10px] font-bold text-blue-500 uppercase">In Stock</p>
               <p className="text-xl font-bold text-blue-700">{inStock}</p>
            </div>
            <Box className="w-8 h-8 text-blue-200" />
         </Card>
         <Card className="p-3 flex items-center justify-between border-green-100 bg-green-50/50">
            <div>
               <p className="text-[10px] font-bold text-green-500 uppercase">Active</p>
               <p className="text-xl font-bold text-green-700">{active}</p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
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
               <p className="text-[10px] font-bold text-red-500 uppercase">SLA Breach</p>
               <p className="text-xl font-bold text-red-700">{overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
         </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search serial, custodian..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex gap-1">
               {['ALL', 'IN_STOCK', 'INSTALLED_ACTIVE', 'WITH_INSTALLER'].map(s => (
                  <button 
                     key={s}
                     onClick={() => setFilterStatus(s)}
                     className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        filterStatus === s 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                     }`}
                  >
                     {s.replace('_', ' ')}
                  </button>
               ))}
            </div>
         </div>
         <Button variant="outline" size="sm" className="h-8"><Filter className="w-3 h-3 mr-2" /> More Filters</Button>
      </div>

      {/* Table */}
      <Card className="flex-1 overflow-hidden flex flex-col" noPadding>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Serial Number</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Custodian</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide">Last Update</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDevices.map(device => (
                <tr key={device.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-2 font-mono text-xs font-medium text-brand-700">{device.serial_number}</td>
                  <td className="px-4 py-2 text-slate-700 font-medium">{store.getProductName(device.product_id)}</td>
                  <td className="px-4 py-2">
                    <Badge color={getStatusColor(device.status)}>{device.status}</Badge>
                    {device.sla_breach && <span className="ml-2 text-[10px] text-white bg-red-600 px-1 rounded font-bold">OVERDUE</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                       <MapPin className="w-3 h-3 text-slate-400" />
                       {device.current_custodian}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">{device.last_updated}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleViewHistory(device.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors" title="View History">
                       <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDevices.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm">
               <Box className="w-8 h-8 mb-2 opacity-20" />
               No assets found matching filters.
            </div>
          )}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
           Showing {filteredDevices.length} of {total} assets
        </div>
      </Card>
    </div>
  );
};
