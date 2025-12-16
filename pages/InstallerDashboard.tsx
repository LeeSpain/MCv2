
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Button, Badge } from '../components/ui';
import { MapPin, Calendar, CheckCircle, Navigation, Phone, ChevronRight, Camera, X, Package } from 'lucide-react';
import { Role } from '../types';

export const InstallerDashboard: React.FC = () => {
  const { jobs, currentUser, cases } = useStore();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // DEMO LOGIC: If I am an Installer, show my name. If I am viewing this page as a non-installer (e.g. during a transition or debug), show 'Bob Builder's view
  const displayUser = currentUser.role === Role.INSTALLER ? currentUser : { name: 'Bob Builder (View)' };

  // Filter for "My Jobs"
  const myJobs = jobs.filter(j => j.installer_name === currentUser.name || j.installer_name === 'Bob Builder');
  
  const today = new Date().toISOString().split('T')[0];
  const todaysJobs = myJobs.filter(j => j.scheduled_for && j.scheduled_for.startsWith(today)).sort((a,b) => (a.scheduled_for || '').localeCompare(b.scheduled_for || ''));
  const futureJobs = myJobs.filter(j => !j.scheduled_for || j.scheduled_for > today);

  const startCompletionFlow = (id: string) => {
    setActiveJobId(id);
    setPhotoUploaded(false);
  };

  const handleUploadPhoto = () => {
    // Simulate camera/upload delay
    setTimeout(() => {
        setPhotoUploaded(true);
    }, 800);
  };

  const submitCompletion = () => {
    if (activeJobId) {
        store.completeJob(activeJobId); // Use proper completion logic
        setActiveJobId(null);
        alert("Job synced successfully! Assets updated.");
    }
  };

  // Mobile Action Handlers
  const handleCall = () => window.location.href = "tel:+31612345678";
  const handleMap = () => window.open("https://maps.google.com/?q=Amsterdam", "_blank");

  return (
    <div className="space-y-4">
       {/* HEADER - Mobile App Style */}
       <div className="bg-slate-900 text-white pt-10 pb-10 px-6 rounded-b-[2.5rem] shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">Good Morning,<br/>{displayUser.name.split(' ')[0]}</h1>
                   <p className="text-slate-300 text-sm mt-2 font-medium">You have {todaysJobs.length} stops today.</p>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-white/20">
                   {displayUser.name.charAt(0)}
                </div>
             </div>
             <div className="flex gap-3">
                <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                   <span className="block text-2xl font-bold">{todaysJobs.filter(j => j.status === 'COMPLETED').length}/{todaysJobs.length}</span>
                   <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Completed</span>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                   <span className="block text-2xl font-bold text-green-400">100%</span>
                   <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">On Time</span>
                </div>
             </div>
          </div>
       </div>

       <div className="px-4 space-y-6">
          {/* TODAY'S ROUTE */}
          <div>
             <h3 className="font-bold text-slate-900 px-1 flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-brand-600" /> Today's Schedule
             </h3>
             
             <div className="space-y-4">
                {todaysJobs.length === 0 ? (
                   <div className="p-8 text-center text-slate-400 italic bg-white rounded-2xl shadow-sm border border-slate-200">
                      No jobs scheduled for today. Enjoy the break!
                   </div>
                ) : (
                   todaysJobs.map((job, index) => {
                      const isNext = index === 0 && job.status !== 'COMPLETED';
                      const isCompleted = job.status === 'COMPLETED';
                      const isCompleting = activeJobId === job.id;
                      
                      // Resolve products if available
                      const jobCase = cases.find(c => c.id === job.case_id);
                      const productNames = jobCase ? store.getProductIdsToNames(jobCase.product_ids) : [];

                      if (isCompleting) {
                          return (
                              <div key={job.id} className="bg-white rounded-2xl border border-brand-200 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                  <div className="bg-brand-50 p-4 border-b border-brand-100 flex justify-between items-center">
                                      <h4 className="font-bold text-brand-900">Complete Job #{job.id}</h4>
                                      <button onClick={() => setActiveJobId(null)} className="p-1 rounded-full hover:bg-brand-100 text-brand-700">
                                          <X className="w-5 h-5" />
                                      </button>
                                  </div>
                                  <div className="p-6 space-y-6">
                                      <div className="text-center space-y-4">
                                          <div 
                                              onClick={handleUploadPhoto}
                                              className={`h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                                                  photoUploaded 
                                                  ? 'border-green-500 bg-green-50 text-green-700' 
                                                  : 'border-slate-300 bg-slate-50 text-slate-500 active:bg-slate-100'
                                              }`}
                                          >
                                              {photoUploaded ? (
                                                  <>
                                                      <CheckCircle className="w-8 h-8 mb-2" />
                                                      <span className="text-sm font-bold">Photo Attached</span>
                                                  </>
                                              ) : (
                                                  <>
                                                      <Camera className="w-8 h-8 mb-2" />
                                                      <span className="text-sm font-bold">Tap to Take Photo</span>
                                                      <span className="text-xs">Proof of Installation</span>
                                                  </>
                                              )}
                                          </div>
                                      </div>
                                      <div className="space-y-3">
                                          <Button 
                                              className={`w-full h-14 text-lg shadow-xl ${photoUploaded ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'}`} 
                                              disabled={!photoUploaded}
                                              onClick={submitCompletion}
                                          >
                                              {photoUploaded ? 'Submit & Finish' : 'Upload Proof First'}
                                          </Button>
                                      </div>
                                  </div>
                              </div>
                          )
                      }

                      return (
                         <div key={job.id} className={`relative rounded-2xl overflow-hidden border shadow-sm transition-all ${isNext ? 'border-brand-500 ring-4 ring-brand-100/50 bg-white z-10' : 'border-slate-200 bg-white'}`}>
                            {isNext && <div className="bg-brand-600 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-wide flex justify-between items-center">
                               <span>Next Stop</span>
                               <span className="text-brand-100 flex items-center gap-1"><Navigation className="w-3 h-3" /> ~15 min</span>
                            </div>}
                            
                            <div className="p-5">
                               <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                     <Badge color={job.type === 'INSTALL' ? 'blue' : 'yellow'}>{job.type}</Badge>
                                     <span className="font-mono text-xs text-slate-400">#{job.id}</span>
                                  </div>
                                  <div className="text-right">
                                     <span className="block font-bold text-slate-900 text-xl">{job.scheduled_for?.split(' ')[1]}</span>
                                  </div>
                               </div>

                               <h4 className="font-bold text-xl text-slate-900 mb-1">{job.client_name}</h4>
                               <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                                  <span>123 Dorpsstraat, Amsterdam<br/><span className="text-xs text-slate-400">(Floor 2, Elevator code 1234)</span></span>
                               </div>

                               {productNames.length > 0 && (
                                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-6">
                                     <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                        <Package className="w-3 h-3" /> Equipment
                                     </h5>
                                     <ul className="space-y-1">
                                        {productNames.map((name, i) => (
                                           <li key={i} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {name}
                                           </li>
                                        ))}
                                     </ul>
                                  </div>
                               )}

                               {isCompleted ? (
                                  <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-green-100">
                                     <CheckCircle className="w-5 h-5" /> Job Completed
                                  </div>
                               ) : (
                                  <div className="grid grid-cols-2 gap-3">
                                     <button onClick={handleCall} className="flex items-center justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold active:bg-slate-100 transition-colors">
                                        <Phone className="w-4 h-4 mr-2" /> Call
                                     </button>
                                     <button onClick={handleMap} className="flex items-center justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold active:bg-slate-100 transition-colors">
                                        <Navigation className="w-4 h-4 mr-2" /> Map
                                     </button>
                                     <button className="col-span-2 h-14 bg-slate-900 text-white rounded-xl text-base font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center" onClick={() => startCompletionFlow(job.id)}>
                                        Mark Complete
                                     </button>
                                  </div>
                               )}
                            </div>
                         </div>
                      );
                   })
                )}
             </div>
          </div>

          {/* UPCOMING */}
          <div className="pt-4 pb-8">
             <h3 className="font-bold text-slate-900 px-1 mb-3 text-sm uppercase tracking-wide opacity-60">Upcoming</h3>
             <div className="space-y-3">
                {futureJobs.map(job => {
                   const jobCase = cases.find(c => c.id === job.case_id);
                   const items = jobCase ? store.getProductIdsToNames(jobCase.product_ids).length : 0;
                   return (
                      <div key={job.id} className="bg-white/60 p-4 rounded-xl border border-slate-200/60 flex justify-between items-center backdrop-blur-sm">
                         <div>
                            <div className="font-bold text-slate-900">{job.client_name}</div>
                            <div className="text-xs text-slate-500">{job.scheduled_for || 'Unscheduled'} • {job.type} • {items} Items</div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                   )
                })}
                {futureJobs.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No future jobs scheduled.</div>}
             </div>
          </div>
       </div>
    </div>
  );
};
