import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { MOCK_USERS } from '../services/mockData';
import { Role } from '../types';
import { LayoutDashboard, Box, ClipboardList, Wrench, MessageSquare, Settings, LogOut, AlertOctagon, FileText, AlertCircle, Users, CheckCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, killSwitch } = useStore();
  const location = useLocation();

  // Navigation items definition with allowed roles
  const allNavItems = [
    // OPS / ADMIN ROUTES
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/exceptions', 
      label: 'Exceptions', 
      icon: AlertCircle, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/report', 
      label: 'Daily Report', 
      icon: FileText, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/assets', 
      label: 'Assets', 
      icon: Box, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/cases', 
      label: 'All Cases', 
      icon: ClipboardList, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/jobs', 
      label: 'Jobs', 
      icon: Wrench, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.INSTALLER] 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },

    // CARE COMPANY ROUTES
    {
      path: '/care-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    {
      path: '/clients',
      label: 'My Clients',
      icon: Users,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    {
      path: '/orders',
      label: 'Active Orders',
      icon: ClipboardList,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    {
      path: '/confirmations',
      label: 'Confirmations',
      icon: CheckCircle,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },

    // SHARED
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE] 
    },
  ];

  // Filter items based on current user role
  const navItems = allNavItems.filter(item => item.allowed.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">MC</span>
            MobileCare
          </h1>
          <p className="text-xs text-slate-400 mt-1">Operations Platform</p>
        </div>

        {killSwitch && (
          <div className="bg-red-600 p-3 m-4 rounded-md animate-pulse flex items-center gap-2 text-sm font-bold">
            <AlertOctagon className="w-5 h-5" />
            KILL SWITCH ACTIVE
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-sm font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          
          <label className="text-xs text-slate-500 block mb-2">Simulate Role:</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded p-2 focus:outline-none focus:border-brand-500"
            value={currentUser.id}
            onChange={(e) => store.setUser(e.target.value)}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
             {currentUser.care_company_id && <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">Thuiszorg West</span>}
             <span className="text-sm text-slate-500">System Status: <span className="text-green-600 font-bold">OPERATIONAL</span></span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};