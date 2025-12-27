import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Badge, Button } from '../components/ui';
import { 
  MapPin, Calendar, CheckCircle, Navigation, Phone, 
  Camera, X, Package, UserCircle, Upload, ClipboardCheck, 
  Clock, ArrowRight, Map as MapIcon, ChevronRight
} from 'lucide-react';

export const InstallerDashboard: React.FC = () => {
  const { jobs, currentUser, devices } = useStore();
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Filter for Bob's jobs
  const myJobs = jobs.filter(j => j.installer_name === currentUser.name || j.installer_name === 'Bob Builder');
  const todaysJobs = myJobs.filter(j => j.status !== 'COMPLETED');
  
  // Find the first job as the "Next Stop"
  const nextJob = todaysJobs[0];

  const submitCompletion = () => {
    if (nextJob) {
        store.completeJob(nextJob.id);
        setPhotoUploaded(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* 1. PREMIUM APP HEADER */}
      <div className="bg-slate-900 text-white px-8 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[60px] -mr-8 -mt-8"></div>
         
         <div className="relative z-10 flex justify-between items-center mb-10">
            <div>
               <h1 className="text-3xl font-black tracking-tighter leading-tight italic">
                  {getGreeting()},<br/>
                  <span className="text-brand-400">Installer {currentUser.name.split(' ')[0]}</span>
               </h1>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Route Active
               </p>
            </div>
            <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner group">
               <UserCircle className="w-8 h-8 text-slate-300 group-hover:text-brand-400 transition-colors" />
            </div>
         </div>

         {/* SLEEK STATS BAR */}
         <div className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 grid grid-cols-2 divide-x divide-white/10 shadow-xl">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Queue Status</span>
               <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-black italic tracking-tighter leading-none">0/{myJobs.length}</span>
                  <span className="text-[10px] text-slate-400 font-bold mb-0.5">STOPS</span>
               </div>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">ETA Accuracy</span>
               <div className="flex items-end gap-1.5 text-green-400">
                  <span className="text-3xl font-black italic tracking-tighter leading-none">98%</span>
                  <span className="text-[10px] font-bold mb-0.5 opacity-70">ON TIME</span>
               </div>
            </div>
         </div>
      </div>

      {/* 2. TASK SECTION */}
      <div className="flex-1 px-6 pt-10 pb-32">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-brand-50 rounded-xl text-brand-600 shadow-sm border border-brand-100">
                  <Calendar className="w-5 h-5" />
               </div>
               <h3 className="font-black text-sm text-slate-900 uppercase tracking-widest">Priority Sequence</h3>
            </div>
            <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all">
               Full Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
         </div>

         {nextJob ? (
            <div className="space-y-6">
               {/* HIGH-FOCUS NEXT STOP CARD */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden transition-all group hover:border-brand-300">
                  <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-b border-slate-100">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Route Intelligence • Job #{nextJob.id}</span>
                     <Badge color="blue">~12m Away</Badge>
                  </div>
                  
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{nextJob.client_name}</h4>
                           <div className="flex items-center gap-2 text-slate-500">
                              <MapPin className="w-4 h-4 text-brand-500" />
                              <p className="text-xs font-bold italic">123 Dorpsstraat, Amsterdam</p>
                           </div>
                        </div>
                        <div className="bg-slate-900 text-white w-16 h-16 rounded-3xl flex flex-col items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-60">ETA</span>
                           <span className="text-lg font-black italic tracking-tighter">14:00</span>
                        </div>
                     </div>

                     {/* Equipment Manifest */}
                     <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 mb-8">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipment Verification</span>
                           <Package className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                              <span className="text-sm font-bold text-slate-700">Smart Hub (Gen 4)</span>
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><CheckCircle className="w-3.5 h-3.5 text-white" /></div>
                           </div>
                           <p className="text-[10px] text-slate-400 font-bold italic px-1">Access Notes: Elevator code 1234, floor 2.</p>
                        </div>
                     </div>

                     {/* Action Grid */}
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <button className="flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-black text-[10px] uppercase tracking-widest active:bg-slate-100 transition-all hover:border-slate-300">
                           <Phone className="w-4 h-4" /> Call Client
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-black text-[10px] uppercase tracking-widest active:bg-slate-100 transition-all hover:border-slate-300">
                           <MapIcon className="w-4 h-4" /> Start Nav
                        </button>
                     </div>

                     <button 
                        onClick={submitCompletion}
                        className="w-full py-6 bg-brand-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-[0_15px_30px_rgba(14,165,233,0.3)] active:scale-[0.98] hover:bg-brand-700 transition-all text-xs italic flex items-center justify-center gap-3"
                     >
                        Confirm Arrival & Complete <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-slate-200" />
               </div>
               <p className="text-slate-400 font-black italic uppercase tracking-[0.3em] text-[10px]">No active route sequence detected</p>
               <button className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">Refresh Sync</button>
            </div>
         )}
      </div>
    </div>
  );
};
