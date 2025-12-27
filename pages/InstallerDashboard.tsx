import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Badge } from '../components/ui';
import { 
  MapPin, Calendar, CheckCircle, Navigation, Phone, 
  Camera, Package, Clock, ChevronRight, User,
  Wrench, Home, MessageSquare, Settings, AlertCircle,
  Play, Check, X, Truck, Route, Timer, Bell, Search
} from 'lucide-react';
import { Job, JobStatus } from '../types';

export const InstallerDashboard: React.FC = () => {
  const { jobs, currentUser, devices } = useStore();
  const [activeTab, setActiveTab] = useState<'route' | 'jobs' | 'completed'>('route');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter for current installer's jobs
  const myJobs = jobs.filter(j => j.installer_name === currentUser.name || j.installer_name === 'Bob Builder');
  const pendingJobs = myJobs.filter(j => j.status !== JobStatus.COMPLETED);
  const completedJobs = myJobs.filter(j => j.status === JobStatus.COMPLETED);
  const nextJob = pendingJobs[0];

  // Mock schedule times
  const jobsWithSchedule = pendingJobs.map((job, i) => ({
    ...job,
    scheduledTime: ['09:30', '11:00', '14:30', '16:00'][i] || '17:00',
    estimatedDuration: '45 min',
    address: '123 Dorpsstraat, Amsterdam',
    equipment: ['Smart Hub (Gen 4)', 'Motion Sensor x2'],
    accessNotes: 'Elevator code 1234, Floor 2, Apt 12B'
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleStartJob = (job: Job) => {
    setSelectedJob(job as any);
  };

  const handleCompleteJob = (jobId: string) => {
    store.completeJob(jobId);
    setSelectedJob(null);
  };

  // Active Job View
  if (selectedJob) {
    const jobDetails = jobsWithSchedule.find(j => j.id === selectedJob.id) || selectedJob;
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-5 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setSelectedJob(null)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Job #{selectedJob.id}</span>
            <div className="w-10" />
          </div>
          <div className="text-center">
            <p className="text-emerald-100 text-sm mb-1">Currently Active</p>
            <h1 className="text-2xl font-bold">{selectedJob.client_name}</h1>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Location Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Location</h3>
                <p className="text-sm text-slate-500">{(jobDetails as any).address || '123 Dorpsstraat, Amsterdam'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold text-sm transition-colors">
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">
                <Phone className="w-4 h-4" />
                Call Client
              </button>
            </div>
          </div>

          {/* Access Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Access Notes</span>
            </div>
            <p className="text-sm text-amber-700">{(jobDetails as any).accessNotes || 'No special instructions'}</p>
          </div>

          {/* Equipment List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-slate-400" />
              <span className="font-semibold text-slate-900">Equipment to Install</span>
            </div>
            <div className="space-y-2">
              {((jobDetails as any).equipment || ['Smart Hub (Gen 4)']).map((item: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-5 h-5 text-slate-400" />
              <span className="font-semibold text-slate-900">Completion Checklist</span>
            </div>
            <div className="space-y-2">
              {['Equipment installed', 'Connectivity verified', 'Client briefed', 'Photo proof captured'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-md flex items-center justify-center">
                    {i < 2 && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 font-semibold transition-colors">
            <Camera className="w-5 h-5" />
            Capture Proof Photo
          </button>

          {/* Complete Button */}
          <button 
            onClick={() => handleCompleteJob(selectedJob.id)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-bold text-lg shadow-lg shadow-emerald-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Mark Job Complete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Clean Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500 font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-900">{currentUser.name.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{completedJobs.length}/{myJobs.length}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Jobs Done</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{pendingJobs.length}</div>
            <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Remaining</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">98%</div>
            <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">On Time</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-5 py-2 flex gap-1">
        {[
          { id: 'route', label: 'My Route', icon: Route },
          { id: 'jobs', label: 'All Jobs', icon: Wrench },
          { id: 'completed', label: 'Completed', icon: CheckCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-5 space-y-5">
        
        {/* ROUTE TAB */}
        {activeTab === 'route' && (
          <>
            {/* Next Job Card */}
            {nextJob && (
              <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Next Stop</span>
                  <div className="flex items-center gap-2">
                    <Timer className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600">{jobsWithSchedule[0]?.scheduledTime}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-lg font-bold text-emerald-600">
                        {nextJob.client_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{nextJob.client_name}</h3>
                        <p className="text-sm text-slate-500">{nextJob.type} Job</p>
                      </div>
                    </div>
                    {/* Fixed Error: Changed color 'amber' to valid value 'yellow' */}
                    <Badge color={nextJob.type === 'INSTALL' ? 'blue' : 'yellow'}>
                      {nextJob.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{jobsWithSchedule[0]?.address}</span>
                  </div>

                  {/* Equipment Preview */}
                  <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 uppercase">Equipment</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(jobsWithSchedule[0]?.equipment || ['Smart Hub']).map((item: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </button>
                    <button 
                      onClick={() => handleStartJob(nextJob)}
                      className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold text-sm transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Route Timeline */}
            {pendingJobs.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Today's Route</h2>
                  <span className="text-xs text-slate-500">{pendingJobs.length} stops</span>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {jobsWithSchedule.slice(1).map((job, i) => (
                    <div 
                      key={job.id}
                      onClick={() => handleStartJob(job)}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-center">
                          <div className="text-sm font-bold text-slate-900">{job.scheduledTime}</div>
                          <div className="text-[10px] text-slate-400">{job.estimatedDuration}</div>
                        </div>
                        <div className="w-1 h-10 bg-slate-200 rounded-full" />
                        <div>
                          <h4 className="font-semibold text-slate-900">{job.client_name}</h4>
                          <p className="text-xs text-slate-500">{job.type} • {job.address.split(',')[0]}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {pendingJobs.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">All Done!</h3>
                <p className="text-sm text-slate-500">No more jobs scheduled for today</p>
              </div>
            )}
          </>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {myJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => job.status !== JobStatus.COMPLETED && handleStartJob(job)}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    job.status === JobStatus.COMPLETED ? 'opacity-60' : 'hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold ${
                      job.status === JobStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                      job.type === 'INSTALL' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {job.status === JobStatus.COMPLETED ? <Check className="w-5 h-5" /> : job.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{job.client_name}</h4>
                      <p className="text-xs text-slate-500">{job.type} • Job #{job.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={
                      job.status === JobStatus.COMPLETED ? 'green' :
                      job.status === JobStatus.CONFIRMED ? 'blue' :
                      'gray'
                    }>
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                    {job.status !== JobStatus.COMPLETED && (
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* COMPLETED TAB */}
        {activeTab === 'completed' && (
          <>
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">No Completed Jobs</h3>
                <p className="text-sm text-slate-500">Completed jobs will appear here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {completedJobs.map((job) => (
                  <div key={job.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{job.client_name}</h4>
                        <p className="text-xs text-slate-500">{job.type} • Completed</p>
                      </div>
                    </div>
                    <Badge color="green">Done</Badge>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around">
        <button className="flex flex-col items-center gap-1 text-emerald-600">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Route className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Route</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Settings</span>
        </button>
      </div>
    </div>
  );
};