
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { 
  Activity, ShieldCheck, Truck, Users, 
  ArrowRight, Database, Zap, Layout,
  Heart, Terminal, Smartphone
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handlePortalEnter = (userId: string, path: string) => {
    // 1. Switch User Role
    store.setUser(userId);
    // 2. Navigate
    navigate(path);
  };

  const portals = [
    {
      title: "Executive View",
      user: "Martijn",
      role: "CEO",
      description: "Strategic oversight, financial metrics, and risk index reporting.",
      path: "/ceo-dashboard",
      userId: "u1",
      icon: Activity,
      color: "bg-slate-900 text-white",
      ring: "group-hover:ring-slate-400"
    },
    {
      title: "System Admin",
      user: "Admin Ops",
      role: "MC_ADMIN",
      description: "Full system control, AI agent configuration, and security settings.",
      path: "/", // Admin sees Today view by default + Settings access
      userId: "u2",
      icon: Terminal,
      color: "bg-slate-800 text-white",
      ring: "group-hover:ring-slate-600"
    },
    {
      title: "Operations Manager",
      user: "Sarah",
      role: "MC_OPERATIONS",
      description: "Logistics command center, exception handling, and stock control.",
      path: "/ops-dashboard",
      userId: "u3",
      icon: Database,
      color: "bg-blue-600 text-white",
      ring: "group-hover:ring-blue-400"
    },
    {
      title: "Care Lead (Desktop)",
      user: "Nurse Joy",
      role: "LEAD NURSE",
      description: "Care planning, patient oversight, and new order approvals.",
      path: "/care-dashboard",
      userId: "u4",
      icon: Heart,
      color: "bg-rose-600 text-white",
      ring: "group-hover:ring-rose-400"
    },
    {
      title: "Care Nurse (Mobile)",
      user: "Nurse Ann",
      role: "CARE NURSE",
      description: "Patient visits, daily tasks, and quick reporting view.",
      path: "/care-dashboard",
      userId: "u5",
      icon: Smartphone, // Indicates Mobile View
      color: "bg-rose-400 text-white",
      ring: "group-hover:ring-rose-300"
    },
    {
      title: "Field Installer (Mobile)",
      user: "Bob Builder",
      role: "INSTALLER",
      description: "Route optimization, installation jobs, and photo proof.",
      path: "/installer-dashboard",
      userId: "u6",
      icon: Truck,
      color: "bg-emerald-600 text-white",
      ring: "group-hover:ring-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white pt-24 pb-48 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-brand-400 mb-6 shadow-lg">
              <Zap className="w-3 h-3" /> MobileCare Ops Platform v2.4
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Orchestrating Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Logistics at Scale.</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Select a persona below to enter their specific dashboard environment.
           </p>
        </div>
      </div>

      {/* PORTAL GRID - 6 DASHBOARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((p, i) => (
               <div 
                  key={i}
                  onClick={() => handlePortalEnter(p.userId, p.path)}
                  className={`relative group cursor-pointer bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ring-2 ring-transparent ${p.ring}`}
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${p.color}`}>
                        <p.icon className="w-7 h-7" />
                     </div>
                     <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {p.role}
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-xs font-bold text-brand-600 mb-3 uppercase tracking-wider">{p.user}</p>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 min-h-[40px]">
                     {p.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-bold text-slate-900 group-hover:gap-2 transition-all">
                     Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* FEATURE EXPLANATION */}
      <div className="bg-white py-24 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">System Architecture</h2>
               <p className="text-slate-500 mt-2">How MobileCare integrates the value chain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                     <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Access</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Tailored experiences for every stakeholder: from the Board Room (CEO) to the Warehouse (Ops) to the Patient's Living Room (Nurse/Installer).
                  </p>
               </div>
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Chain of Custody</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Every asset is tracked from Warehouse → Installer → Client → Return. Strict state machine logic prevents "lost" devices and ensures billing accuracy.
                  </p>
               </div>
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                     <Layout className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">AI Orchestration</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                     Autonomous agents ('Stock Controller', 'Returns Recovery') continuously scan data to detect SLA breaches and flag exceptions.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white">MC</div>
               <span className="font-bold text-white">MobileCare Ops</span>
            </div>
            <div className="text-sm">
               &copy; {new Date().getFullYear()} MobileCare B.V. Internal Operations System.
            </div>
         </div>
      </footer>

    </div>
  );
};
