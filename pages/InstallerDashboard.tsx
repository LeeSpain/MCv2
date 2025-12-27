import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Button, Badge } from '../components/ui';
import { 
  MapPin, Calendar, CheckCircle, Navigation, Phone, 
  ChevronRight, Camera, X, Package, Battery, Wifi, Signal, 
  MessageSquare, UserCircle, ArrowLeft, MoreHorizontal, Activity,
  UploadCloud, ClipboardCheck, History, Info
} from 'lucide-react';
import { Role } from '../types';

export const InstallerDashboard: React.FC = () => {
  const { jobs, currentUser } = useStore();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const myJobs = jobs.filter(j => j.installer_name === currentUser.name || j.installer_name === 'Bob Builder');
  const today = new Date().toISOString().split('T')[0];
  const todaysJobs = myJobs
    .filter(j => j.scheduled_for && j.scheduled_for.startsWith(today))
    .sort((a,b) => (a.scheduled_for || '').localeCompare(b.scheduled_for || ''));

  const submitCompletion = () => {
    if (activeJobId) {
        store.completeJob(activeJobId);
        setActiveJobId(null);
        setPhotoUploaded(false);
    }
  };

  if (activeJobId) {
    const job = jobs.find(j => j.id === activeJobId);
    return (
        <div className="fixed inset-0 z-[100] bg-[#f8fafc] flex flex-col font-sans animate-in slide-in-from-bottom-12 duration-500">
            {/* Manifest Header */}
            <div className="bg-[#0f172a] text-white p-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-emerald-500 rounded-full blur-[100px] opacity-10 -mr-16 -mt-16"></div>
                <div className="flex justify-between items-center relative z-10">
                   <div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1 block">Active Protocol</span>
                      <h2 className="text-3xl font-black tracking-tighter uppercase leading-none italic">Execution</h2>
                   </div>
                   <button onClick={() => setActiveJobId(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 backdrop-blur-md">
                      <X className="w-6 h-6 text-white" />
                   </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Step 1: Capture */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">01</div>
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Digital Evidence Capture</h3>
                   </div>
                   <div 
                      onClick={() => setPhotoUploaded(true)}
                      className={`h-64 rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                          photoUploaded 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-200 bg-white text-slate-400 active:scale-[0.98]'
                      }`}
                   >
                      {photoUploaded ? (
                          <>
                              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                              <CheckCircle className="w-16 h-16 mb-4 relative z-10" />
                              <span className="text-xl font-black uppercase tracking-tighter italic relative z-10">Capture Verified</span>
                          </>
                      ) : (
                          <>
                              <Camera className="w-16 h-16 mb-4 opacity-20" />
                              <span className="text-xl font-black uppercase tracking-tighter italic">Upload Photo Proof</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-50 italic">Tap to open field camera</span>
                          </>
                      )}
                   </div>
                </div>

                {/* Step 2: Confirmation */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-black">02</div>
                       <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Client Authorization</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                             <ClipboardCheck className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 italic">Signature Requirement</span>
                       </div>
                       <Badge color="yellow">Pending</Badge>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <Button 
                    onClick={submitCompletion}
                    disabled={!photoUploaded}
                    className="w-full h-18 py-5 bg-slate-900 text-white font-black tracking-tighter uppercase text-xl shadow-2xl rounded-2xl italic active:scale-[0.97]"
                >
                    <UploadCloud className="w-6 h-6 mr-2" /> Sync To Ledger
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen">
       {/* INDUSTRIAL HUD HEADER */}
       <div className="bg-[#0f172a] text-white p-6 pt-12 pb-10 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-brand-500 rounded-full blur-[130px] opacity-10 -mr-20 -mt-20"></div>
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h1 className="text-3xl font-black tracking-tighter leading-none uppercase italic">Route HUD</h1>
                   <div className="flex items-center gap-2 mt-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">System Node Live</p>
                   </div>
                </div>
                <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                   <UserCircle className="w-8 h-8 text-slate-400" />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">
                   <span className="block text-3xl font-black tracking-tighter italic">{todaysJobs.length}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Remaining</span>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">
                   <span className="block text-3xl font-black tracking-tighter text-emerald-400 italic">0</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Completed</span>
                </div>
             </div>
          </div>
       </div>

       {/* JOB LISTING */}
       <div className="px-6 space-y-6 pb-12">
          <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Calendar className="w-3 h-3" /> Sequential Jobs
             </h3>
             <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest italic flex items-center gap-1">
                <History className="w-3 h-3" /> History
             </button>
          </div>

          <div className="space-y-4">
             {todaysJobs.map((job, idx) => {
                const isActive = idx === 0 && job.status !== 'COMPLETED';
                const isDone = job.status === 'COMPLETED';
                
                return (
                   <div 
                      key={job.id} 
                      className={`p-6 rounded-[2.5rem] border shadow-sm transition-all relative overflow-hidden ${
                         isActive 
                         ? 'bg-white border-brand-500 ring-4 ring-brand-500/10' 
                         : isDone 
                            ? 'bg-slate-100/50 border-slate-200' 
                            : 'bg-white border-slate-200'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs italic ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                               {idx + 1}
                            </div>
                            <Badge color={job.type === 'INSTALL' ? 'cyan' : 'yellow'}>{job.type}</Badge>
                         </div>
                         <div className="text-right">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 italic block leading-none">{job.scheduled_for?.split(' ')[1]}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase italic tracking-tighter">Planned Slot</span>
                         </div>
                      </div>

                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3 italic">{job.client_name}</h4>
                      
                      <div className="flex items-start gap-3 text-sm font-bold text-slate-500 mb-8 italic">
                         <div className="mt-1 p-1 bg-slate-50 rounded-md"><MapPin className="w-3.5 h-3.5 text-brand-500" /></div>
                         <span className="leading-tight">
                            123 Dorpsstraat, Amsterdam<br/>
                            <span className="text-[10px] text-slate-400 font-medium">Entrance: Rear code 1402</span>
                         </span>
                      </div>

                      {isDone ? (
                         <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 font-black uppercase tracking-widest text-xs gap-3 italic">
                            <CheckCircle className="w-5 h-5" /> Node Verified & Synced
                         </div>
                      ) : (
                         <div className="grid grid-cols-2 gap-3">
                            <button className="h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:bg-slate-200 transition-colors italic">
                               <Phone className="w-4 h-4" /> Comms
                            </button>
                            <button className="h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:bg-slate-200 transition-colors italic">
                               <Navigation className="w-4 h-4" /> Route
                            </button>
                            <button 
                               onClick={() => setActiveJobId(job.id)}
                               className={`col-span-2 h-18 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all italic ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}
                            >
                               Execute Deployment
                            </button>
                         </div>
                      )}
                   </div>
                )
             })}

             {todaysJobs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                   <ClipboardCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">No active route detected</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
