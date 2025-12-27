import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Role } from '../types';
import { 
  Box, MessageSquare, Settings, 
  AlertCircle, Users, CheckCircle, MapPin, UserCircle,
  Home, Loader, LogOut, Shield, Activity, Package, Heart, FileText, Calendar, Bell, Wifi, Battery
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, killSwitch } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Identify roles that should only have a mobile "app" experience
  const isFieldUser = currentUser.role === Role.INSTALLER || currentUser.role === Role.CARE_COMPANY_NURSE;
  
  useEffect(() => {
    if (location.pathname === '/') {
        setIsRedirecting(false);
        return;
    }

    let shouldRedirect = false;
    let target = '';

    if (isFieldUser) {
      const allowedPaths = ['/installer-dashboard', '/care-dashboard', '/messages', '/settings', '/clients', '/orders', '/confirmations', '/'];
      const isOnAllowedPath = allowedPaths.some(p => location.pathname.startsWith(p));
      if (!isOnAllowedPath) {
        shouldRedirect = true;
        target = currentUser.role === Role.INSTALLER ? '/installer-dashboard' : '/care-dashboard';
      }
    } 

    if (shouldRedirect) {
        setIsRedirecting(true);
        navigate(target, { replace: true });
        setTimeout(() => setIsRedirecting(false), 500);
    } else {
        setIsRedirecting(false);
    }
  }, [isFieldUser, location.pathname, navigate, currentUser.role]);

  if (location.pathname === '/') return <>{children}</>;

  if (isRedirecting) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 font-sans">
              <Loader className="w-10 h-10 animate-spin mb-4 text-cyan-400" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">Syncing Mobile Node...</p>
          </div>
      );
  }

  // --- PERSONA BASED NAV ---
  const getNavItems = () => {
    if (currentUser.role === Role.INSTALLER) {
        return [
            { path: '/installer-dashboard', label: 'Route', icon: MapPin },
            { path: '/messages', label: 'Inbox', icon: MessageSquare },
            { path: '/settings', label: 'Profile', icon: UserCircle },
        ];
    }
    if (currentUser.role === Role.CARE_COMPANY_NURSE) {
        return [
            { path: '/care-dashboard', label: 'Home', icon: Home },
            { path: '/clients', label: 'Patients', icon: Users },
            { path: '/messages', label: 'Alerts', icon: Bell },
        ];
    }
    
    // Default Desktop Nav (Ops/CEO)
    return [
      { path: '/dashboard', label: 'Dashboard', icon: Home, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/messages', label: 'Messages', icon: MessageSquare, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE] },
      { path: '/exceptions', label: 'Exceptions', icon: AlertCircle, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/cases', label: 'All Orders', icon: Package, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/assets', label: 'Assets', icon: Box, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/jobs', label: 'Jobs Schedule', icon: Calendar, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/report', label: 'Daily Report', icon: FileText, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO] },
      { path: '/care-dashboard', label: 'Care Hub', icon: Heart, allowed: [Role.CARE_COMPANY_LEAD_NURSE] },
      { path: '/clients', label: 'Clients', icon: Users, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CARE_COMPANY_LEAD_NURSE] },
      { path: '/settings', label: 'Settings', icon: Settings, allowed: [Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO, Role.CARE_COMPANY_LEAD_NURSE] },
    ].filter(item => item.allowed?.includes(currentUser.role));
  };

  const navItems = getNavItems();

  // --- MOBILE PERSONA VIEW (INSTALLER/NURSE) ---
  if (isFieldUser) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-0 md:p-8 font-sans overflow-hidden">
        {/* Device Frame (Only visible on desktop) */}
        <div className="w-full max-w-[420px] h-[100vh] md:h-[840px] bg-white md:rounded-[3rem] md:border-[10px] md:border-slate-900 shadow-2xl relative overflow-hidden flex flex-col md:scale-95 lg:scale-100 transition-transform origin-center">
          
          {/* Simulated Status Bar */}
          <div className="h-10 px-8 flex justify-between items-center bg-transparent z-[70] absolute top-0 w-full">
            <span className="text-xs font-black text-white/40 drop-shadow-sm select-none">9:41</span>
            <div className="flex items-center gap-2 text-white/40">
               <Wifi className="w-3.5 h-3.5" />
               <Battery className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            {children}
          </div>

          {/* Persona Bottom Navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 h-24 z-[60] grid grid-cols-3 px-6 pb-6">
            {navItems.map(item => { 
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center transition-all ${isActive ? 'text-brand-600 scale-105' : 'text-slate-400'}`}>
                    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-brand-50' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                  </Link>
                );
            })}
          </nav>
        </div>

        {/* Exit Button (External to phone frame) */}
        <button 
           onClick={() => navigate('/')}
           className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all opacity-50 hover:opacity-100"
        >
           <LogOut className="w-3.5 h-3.5" /> Exit to Portal
        </button>

        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    );
  }

  // --- DESKTOP OPS VIEW (CEO/ADMIN) ---
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col shadow-2xl z-20 transition-all shrink-0">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="block group">
            <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-3 group-hover:text-cyan-400 transition-colors">
              <span className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]">MC</span>
              MOBILECARE
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 pl-1 italic">Operations Platform</p>
          </Link>
        </div>

        {killSwitch && (
          <div className="bg-red-600/10 border-y border-red-500/20 p-4 m-0 animate-pulse flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-500">
            <Activity className="w-5 h-5" />
            System Paused: Override Active
          </div>
        )}

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-brand-700/30 border border-brand-500/30 flex items-center justify-center text-lg font-black text-brand-400 shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{currentUser.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
             <LogOut className="w-3.5 h-3.5" /> Exit to Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#f8fafc]">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div className="flex items-center gap-4">
             <Link to="/" className="md:hidden w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">MC</Link>
             <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase">
               {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Overview'}
             </h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
             <div className="hidden lg:flex items-center gap-3 border-x border-slate-100 px-8 h-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-green-600 uppercase">Operational</span>
                </div>
             </div>
             
             <Link to="/settings" className="md:hidden p-1">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-brand-600 font-black">
                   {currentUser.name.charAt(0)}
                </div>
             </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 md:pb-10 no-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
