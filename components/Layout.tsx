
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Role } from '../types';
import { 
  LayoutDashboard, Box, ClipboardList, Wrench, MessageSquare, Settings, 
  AlertOctagon, FileText, AlertCircle, Users, CheckCircle, TrendingUp, MapPin, UserCircle,
  Tag, Home, Loader, LogOut
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, killSwitch } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Mobile Users: Installers AND Standard Nurses
  const isMobile = currentUser.role === Role.INSTALLER || currentUser.role === Role.CARE_COMPANY_NURSE;
  
  // Define allowed paths for mobile users
  const mobilePaths = [
    '/installer-dashboard', 
    '/care-dashboard', 
    '/messages', 
    '/settings', 
    '/clients', 
    '/orders', 
    '/confirmations',
    '/' // Allow Landing Page
  ];

  // --- STRICT REDIRECT LOGIC ---
  useEffect(() => {
    // Exception: Always allow the Landing Page (Root)
    if (location.pathname === '/') {
        setIsRedirecting(false);
        return;
    }

    let shouldRedirect = false;
    let target = '';

    // Case 1: User IS a Mobile User (Installer or Nurse)
    if (isMobile) {
      // If they are NOT on a mobile-allowed path, force them to their specific dashboard
      const isOnAllowedPath = mobilePaths.some(p => location.pathname.startsWith(p));
      if (!isOnAllowedPath) {
        shouldRedirect = true;
        target = currentUser.role === Role.INSTALLER ? '/installer-dashboard' : '/care-dashboard';
      }
    } 
    // Case 2: User is Desktop (CEO, Admin, Ops, Lead Nurse)
    else {
      // Prevent Ops/Admin/Nurses from seeing CEO dashboard
      if (location.pathname === '/ceo-dashboard' && currentUser.role !== Role.CEO) {
         shouldRedirect = true;
         target = currentUser.role === Role.CARE_COMPANY_LEAD_NURSE ? '/care-dashboard' : '/dashboard';
      }
      // Prevent access to mobile-specific dashboards if accessed directly on desktop
      else if (location.pathname === '/installer-dashboard') {
        shouldRedirect = true;
        target = '/dashboard';
      }
    }

    if (shouldRedirect) {
        setIsRedirecting(true);
        navigate(target, { replace: true });
        // Small timeout to allow state to settle
        setTimeout(() => setIsRedirecting(false), 500);
    } else {
        setIsRedirecting(false);
    }
  }, [isMobile, location.pathname, navigate, currentUser.role]);

  // --- RENDER GUARD ---
  if (location.pathname === '/') {
      return <>{children}</>;
  }

  // Loading state during redirects
  const isInvalidMobileState = isMobile && !mobilePaths.some(p => location.pathname.startsWith(p));
  const isInvalidDesktopState = !isMobile && location.pathname === '/installer-dashboard';
  const isInvalidCeoState = !isMobile && location.pathname === '/ceo-dashboard' && currentUser.role !== Role.CEO;

  if (isRedirecting || isInvalidMobileState || isInvalidDesktopState || isInvalidCeoState) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <Loader className="w-8 h-8 animate-spin mb-4 text-brand-600" />
              <p className="text-sm font-medium">Redirecting...</p>
          </div>
      );
  }

  // Navigation items definition with allowed roles
  const allNavItems = [
    {
      path: '/dashboard', 
      label: 'Dashboard',
      icon: Home,
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO]
    },
    {
      path: '/ceo-dashboard',
      label: 'Executive View',
      icon: TrendingUp,
      allowed: [Role.CEO]
    },
    { 
      path: '/ops-dashboard', 
      label: 'Ops Control', 
      icon: LayoutDashboard, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS] 
    },
    {
      path: '/installer-dashboard',
      label: 'My Route',
      icon: MapPin,
      allowed: [Role.INSTALLER]
    },
    {
      path: '/care-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE, Role.INSTALLER] 
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: ClipboardList,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    {
      path: '/confirmations',
      label: 'Tasks',
      icon: CheckCircle,
      allowed: [Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE]
    },
    { 
      path: '/clients', 
      label: 'Clients', 
      icon: Users, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE] 
    },
    { 
      path: '/exceptions', 
      label: 'Exceptions', 
      icon: AlertCircle, 
      allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] 
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
  ];

  const navItems = allNavItems.filter(item => item.allowed.includes(currentUser.role));

  // --- MOBILE LAYOUT ---
  if (isMobile) {
    const hideNav = location.pathname === '/installer-dashboard' || location.pathname === '/care-dashboard';

    return (
      <div className="flex flex-col h-screen bg-slate-50 font-sans">
        <main className={`flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-100 touch-pan-y ${hideNav ? '' : 'pb-24'}`}>
           {children}
           
           {/* Mobile Footer Area (Clean) */}
           <div className="p-8 pb-32 text-center opacity-40">
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-brand-600 flex items-center justify-center gap-2">
                 <LogOut className="w-3 h-3" /> Exit to Portal
              </Link>
           </div>
        </main>

        {!hideNav && (
          <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 grid grid-cols-4 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
             {navItems.slice(0, 3).map(item => { 
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center active:bg-slate-50 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>
                     <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-brand-100' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                     <span className="text-[10px] font-bold">{item.label}</span>
                  </Link>
                );
             })}
             <Link to="/settings" className={`flex flex-col items-center justify-center active:bg-slate-50 transition-colors ${location.pathname === '/settings' ? 'text-brand-600' : 'text-slate-400'}`}>
                <UserCircle className={`w-6 h-6 mb-1 ${location.pathname === '/settings' ? 'fill-brand-100' : ''}`} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
                <span className="text-[10px] font-bold">Profile</span>
             </Link>
          </nav>
        )}
      </div>
    );
  }

  // --- DESKTOP LAYOUT ---
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 transition-all">
        <div className="p-6 border-b border-slate-700">
          <Link to="/" className="block group">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 group-hover:text-brand-400 transition-colors">
              <span className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">MC</span>
              MobileCare
            </h1>
            <p className="text-xs text-slate-400 mt-1">Operations Platform</p>
          </Link>
        </div>

        {killSwitch && (
          <div className="bg-red-600 p-3 m-4 rounded-md animate-pulse flex items-center gap-2 text-sm font-bold">
            <AlertOctagon className="w-5 h-5" />
            KILL SWITCH ACTIVE
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
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
          
          <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white py-3 rounded bg-slate-800 hover:bg-slate-700 transition-colors shadow-sm"
          >
             <LogOut className="w-3 h-3" /> Exit to Portal
          </button>
        </div>
      </aside>

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
