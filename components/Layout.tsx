
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { MOCK_USERS } from '../services/mockData';
import { Role } from '../types';
import { 
  LayoutDashboard, Box, ClipboardList, Wrench, MessageSquare, Settings, 
  AlertOctagon, FileText, AlertCircle, Users, CheckCircle, TrendingUp, MapPin, UserCircle,
  Tag, Home
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, killSwitch } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = currentUser.role === Role.INSTALLER;
  
  // Define allowed paths for mobile installers
  const mobilePaths = ['/installer-dashboard', '/messages', '/settings'];
  
  // --- STRICT REDIRECT LOGIC ---
  useEffect(() => {
    // Case 1: User IS an Installer
    if (isMobile) {
      // If they are NOT on a mobile-allowed path, force them to their dashboard
      const isOnAllowedPath = mobilePaths.some(p => location.pathname.startsWith(p));
      if (!isOnAllowedPath) {
        navigate('/installer-dashboard', { replace: true });
      }
    } 
    // Case 2: User is NOT an Installer (CEO, Admin, etc.)
    else {
      // If they ARE on the installer dashboard, force them to the main home page
      if (location.pathname === '/installer-dashboard') {
        navigate('/', { replace: true });
      }
    }
  }, [isMobile, location.pathname, navigate]);

  // --- RENDER GUARD ---
  // prevent rendering the wrong layout layout/content mismatch while the useEffect triggers the redirect
  if (isMobile && !mobilePaths.some(p => location.pathname.startsWith(p))) return null;
  if (!isMobile && location.pathname === '/installer-dashboard') return null;

  // Navigation items definition with allowed roles
  const allNavItems = [
    // PRIMARY DASHBOARD (TODAY VIEW)
    {
      path: '/',
      label: 'Dashboard',
      icon: Home,
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO]
    },

    // EXECUTIVE
    {
      path: '/ceo-dashboard',
      label: 'Executive View',
      icon: TrendingUp,
      allowed: [Role.CEO]
    },

    // OPS / ADMIN ROUTES
    { 
      path: '/ops-dashboard', 
      label: 'Ops Control', 
      icon: LayoutDashboard, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS] 
    },
    { 
      path: '/exceptions', 
      label: 'Exceptions', 
      icon: AlertCircle, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/clients', 
      label: 'Client Directory', // Shared with Care, but Ops sees Global
      icon: Users, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE] 
    },
    { 
      path: '/cases', 
      label: 'All Orders', 
      icon: ClipboardList, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/assets', 
      label: 'Assets', 
      icon: Box, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    {
      path: '/products',
      label: 'Product Catalog',
      icon: Tag,
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS]
    },
    { 
      path: '/jobs', 
      label: 'Jobs Schedule', 
      icon: Wrench, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/report', 
      label: 'Daily Report', 
      icon: FileText, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE, Role.INSTALLER] 
    },

    // INSTALLER ROUTES
    {
      path: '/installer-dashboard',
      label: 'My Route',
      icon: MapPin,
      allowed: [Role.INSTALLER]
    },

    // CARE COMPANY ROUTES (Specific Dashboard)
    {
      path: '/care-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    // Note: 'Clients' route is handled in the shared block above now
    {
      path: '/orders',
      label: 'My Active Orders',
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
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE, Role.INSTALLER] 
    },
  ];

  // Filter items based on current user role
  const navItems = allNavItems.filter(item => item.allowed.includes(currentUser.role));

  // --- MOBILE LAYOUT (INSTALLER) ---
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 font-sans">
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 relative bg-slate-100 touch-pan-y">
           {children}
           
           {/* Mobile Role Switcher (Dev Tool) - pushed to bottom of content */}
           <div className="p-8 pb-32 text-center opacity-60">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Dev: Simulate Role</label>
              <select 
                className="bg-white border border-slate-300 text-xs p-2 rounded shadow-sm w-full max-w-xs appearance-none text-center"
                value={currentUser.id}
                onChange={(e) => store.setUser(e.target.value)}
              >
                {MOCK_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
           </div>
        </main>

        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 grid grid-cols-3 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
           {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center active:bg-slate-50 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>
                   <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-brand-100' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                   <span className="text-[10px] font-bold">{item.label}</span>
                </Link>
              );
           })}
           {/* Mobile Profile Tab */}
           <Link to="/settings" className={`flex flex-col items-center justify-center active:bg-slate-50 transition-colors ${location.pathname === '/settings' ? 'text-brand-600' : 'text-slate-400'}`}>
              <UserCircle className={`w-6 h-6 mb-1 ${location.pathname === '/settings' ? 'fill-brand-100' : ''}`} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Profile</span>
           </Link>
        </nav>
      </div>
    );
  }

  // --- DESKTOP LAYOUT (DEFAULT) ---
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 transition-all">
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
            // Updated logic to handle root path correctly
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
              
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
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-sm font-bold shadow-lg border border-brand-600">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          
          <label className="text-xs text-slate-500 block mb-2 font-bold uppercase tracking-wider">Simulate Role:</label>
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
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
             {currentUser.care_company_id && <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">Thuiszorg West</span>}
             <span className="text-sm text-slate-500 font-medium">System Status: <span className="text-green-600 font-bold ml-1">OPERATIONAL</span></span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};
