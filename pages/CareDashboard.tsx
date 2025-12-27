import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ClipboardList, CheckCircle, Clock, Heart, Plus, Activity, 
  AlertCircle, FileText, ArrowRight, Phone, MapPin, ChevronRight,
  Calendar, Home, Bell, Search, Filter,
  HeartPulse, Stethoscope, UserPlus, AlertTriangle, TrendingUp,
  MessageSquare, Navigation, User, Settings, Package,
  Eye, RefreshCw, ExternalLink, Zap, Shield, MoreVertical,
  ChevronDown, Inbox, Send, CheckCircle2, XCircle, Timer,
  Truck, Building2, ArrowUpRight, BarChart3, PieChart
} from 'lucide-react';
import { Role, Client, Case, CaseStatus } from '../types';

export const CareDashboard: React.FC = () => {
  const { clients, cases, devices, jobs, currentUser, assessments } = useStore();
  const navigate = useNavigate();

  const companyClients = clients.filter(c => c.care_company_id === currentUser.care_company_id);
  
  if (currentUser.role === Role.CARE_COMPANY_NURSE) {
    return <MobileNurseView clients={companyClients} currentUser={currentUser} devices={devices} jobs={jobs} />;
  }

  return <DesktopLeadView clients={companyClients} cases={cases} devices={devices} jobs={jobs} assessments={assessments} currentUser={currentUser} />;
};

// ============================================
// MOBILE NURSE VIEW (UNCHANGED)
// ============================================
const MobileNurseView: React.FC<any> = ({ clients, currentUser, devices, jobs }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'today' | 'patients' | 'alerts'>('today');
  
  const highRiskClients = clients.filter((c: Client) => c.risk_level === 'HIGH');
  const mediumRiskClients = clients.filter((c: Client) => c.risk_level === 'MEDIUM');
  
  const todaysVisits = clients.slice(0, 3).map((c: Client, i: number) => ({
    ...c,
    visitTime: ['09:00', '11:30', '14:00'][i],
    visitType: ['Follow-up', 'Assessment', 'Medication Review'][i],
    status: i === 0 ? 'next' : i === 1 ? 'upcoming' : 'scheduled'
  }));

  const completedToday = 2;
  const totalToday = todaysVisits.length + completedToday;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-200 px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500 font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-900">Nurse {currentUser.name.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
              {highRiskClients.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {highRiskClients.length}
                </span>
              )}
            </button>
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{completedToday}/{totalToday}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Visits Today</div>
          </div>
          <div className="bg-rose-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-rose-600">{highRiskClients.length}</div>
            <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide">High Risk</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{clients.length}</div>
            <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Patients</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 px-5 py-2 flex gap-1">
        {[
          { id: 'today', label: 'Today', icon: Calendar },
          { id: 'patients', label: 'Patients', icon: Users },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: highRiskClients.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">
        {activeTab === 'today' && (
          <>
            {todaysVisits.filter(v => v.status === 'next').map((visit: any) => (
              <div key={visit.id} className="bg-white rounded-2xl border-2 border-rose-200 shadow-sm overflow-hidden">
                <div className="bg-rose-50 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Up Next</span>
                  <span className="text-xs font-bold text-rose-600">{visit.visitTime}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-lg font-bold text-rose-600">
                        {visit.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{visit.full_name}</h3>
                        <p className="text-sm text-slate-500">{visit.visitType}</p>
                      </div>
                    </div>
                    <Badge color={visit.risk_level === 'HIGH' ? 'red' : visit.risk_level === 'MEDIUM' ? 'yellow' : 'green'}>
                      {visit.risk_level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{visit.address}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">
                      <Navigation className="w-4 h-4" /> Navigate
                    </button>
                    <button 
                      onClick={() => navigate(`/clients/${visit.id}`)}
                      className="flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl text-white font-semibold text-sm transition-colors"
                    >
                      Start <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Today's Schedule</h2>
                <span className="text-xs text-slate-500">{todaysVisits.length} visits</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {todaysVisits.map((visit: any) => (
                  <div 
                    key={visit.id}
                    onClick={() => navigate(`/clients/${visit.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center">
                        <div className="text-sm font-bold text-slate-900">{visit.visitTime}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{visit.status === 'next' ? 'Now' : 'Est'}</div>
                      </div>
                      <div className={`w-1 h-10 rounded-full ${visit.status === 'next' ? 'bg-rose-500' : 'bg-slate-200'}`} />
                      <div>
                        <h4 className="font-semibold text-slate-900">{visit.full_name}</h4>
                        <p className="text-xs text-slate-500">{visit.visitType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        visit.risk_level === 'HIGH' ? 'bg-rose-500' : 
                        visit.risk_level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-rose-300 hover:bg-rose-50 transition-all group">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">New Assessment</span>
                </button>
                <button className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-amber-300 hover:bg-amber-50 transition-all group">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Report Incident</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'patients' && (
          <>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search patients..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {clients.map((client: Client) => (
                <div 
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold ${
                      client.risk_level === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                      client.risk_level === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {client.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{client.full_name}</h4>
                      <p className="text-xs text-slate-500">{client.address.split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={client.risk_level === 'HIGH' ? 'red' : client.risk_level === 'MEDIUM' ? 'yellow' : 'green'}>
                      {client.risk_level}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'alerts' && (
          <>
            {highRiskClients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">All Clear</h3>
                <p className="text-sm text-slate-500">No high-risk alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-rose-700 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> High Priority Patients
                </h2>
                {highRiskClients.map((client: Client) => (
                  <div 
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 cursor-pointer hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-rose-200 rounded-xl flex items-center justify-center text-base font-bold text-rose-700">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{client.full_name}</h4>
                          <p className="text-xs text-rose-600 font-medium">Requires immediate attention</p>
                        </div>
                      </div>
                      <Badge color="red">HIGH</Badge>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-rose-200 rounded-xl text-rose-700 font-semibold text-sm hover:bg-rose-100 transition-colors"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/clients/${client.id}`); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600 rounded-xl text-white font-semibold text-sm hover:bg-rose-700 transition-colors"
                      >
                        View Profile <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mediumRiskClients.length > 0 && (
              <div className="space-y-3 mt-6">
                <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Medium Priority
                </h2>
                {mediumRiskClients.map((client: Client) => (
                  <div 
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-sm font-bold text-amber-700">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{client.full_name}</h4>
                          <p className="text-xs text-slate-500">{client.address.split(',')[0]}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around">
        <button className="flex flex-col items-center gap-1 text-rose-600">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => navigate('/clients')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Patients</span>
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

// ============================================
// DESKTOP LEAD VIEW - PREMIUM UPGRADE
// ============================================
const DesktopLeadView: React.FC<any> = ({ clients, cases, devices, assessments, currentUser }) => {
  const navigate = useNavigate();
  
  const myClients = clients; 
  const myCases = cases.filter((c: Case) => c.care_company_id === currentUser.care_company_id);
  const pendingConfirmations = devices.filter((d: any) => d.confirmation_needed && d.assigned_client_id && myClients.map((c: Client) => c.id).includes(d.assigned_client_id));
  
  const highRiskClients = clients.filter((c: Client) => c.risk_level === 'HIGH');
  const mediumRiskClients = clients.filter((c: Client) => c.risk_level === 'MEDIUM');
  const lowRiskClients = clients.filter((c: Client) => c.risk_level === 'LOW');
  const activeCases = myCases.filter((c: Case) => c.status !== CaseStatus.CLOSED);
  const newCases = myCases.filter((c: Case) => c.status === CaseStatus.NEW);
  const installingCases = myCases.filter((c: Case) => c.status === CaseStatus.INSTALLATION_PENDING);

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'blue';
      case CaseStatus.APPROVED: return 'cyan';
      case CaseStatus.STOCK_ALLOCATED: return 'cyan';
      case CaseStatus.INSTALLATION_PENDING: return 'yellow';
      case CaseStatus.ACTIVE_SERVICE: return 'green';
      case CaseStatus.CLOSED: return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return Inbox;
      case CaseStatus.APPROVED: return CheckCircle2;
      case CaseStatus.STOCK_ALLOCATED: return Package;
      case CaseStatus.INSTALLATION_PENDING: return Truck;
      case CaseStatus.ACTIVE_SERVICE: return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Care Hub</h1>
          <p className="text-slate-500 mt-1">Welcome back, {currentUser.name}. Here's your care operations overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </Button>
          <Button onClick={() => navigate('/clients')} className="bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-lg shadow-rose-500/20 gap-2">
            <Plus className="w-4 h-4" />
            New Care Request
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <Users className="w-6 h-6 text-slate-600 group-hover:text-rose-600 transition-colors" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +3
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{clients.length}</div>
          <div className="text-sm text-slate-500">Active Patients</div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            {highRiskClients.length > 0 && (
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">Urgent</span>
            )}
          </div>
          <div className="text-3xl font-bold mb-1">{highRiskClients.length}</div>
          <div className="text-rose-100">High Risk Patients</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ClipboardList className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </div>
            {newCases.length > 0 && (
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                {newCases.length}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{activeCases.length}</div>
          <div className="text-sm text-slate-500">Active Orders</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Clock className="w-6 h-6 text-slate-600 group-hover:text-amber-600 transition-colors" />
            </div>
            {pendingConfirmations.length > 0 && (
              <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {pendingConfirmations.length}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{pendingConfirmations.length}</div>
          <div className="text-sm text-slate-500">Pending Confirmations</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Column - 2 spans */}
        <div className="col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/clients')}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-all group"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">New Assessment</span>
              </button>
              <button 
                onClick={() => navigate('/clients')}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Package className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Order Equipment</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <UserPlus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Add Patient</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all group">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">View Analytics</span>
              </button>
            </div>
          </div>

          {/* Pending Confirmations Alert */}
          {pendingConfirmations.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Action Required</h3>
                    <p className="text-sm text-amber-700">{pendingConfirmations.length} installation{pendingConfirmations.length > 1 ? 's' : ''} awaiting your confirmation</p>
                  </div>
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                  Review All
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pendingConfirmations.slice(0, 2).map((device: any) => (
                  <div key={device.id} className="bg-white rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{device.serial_number}</div>
                        <div className="text-xs text-slate-500">Scheduled for installation</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-emerald-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-slate-400" />
                <h2 className="font-bold text-slate-900">Recent Orders</h2>
              </div>
              <button 
                onClick={() => navigate('/orders')}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {myCases.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">No Orders Yet</h3>
                <p className="text-slate-500 text-sm mb-4">Start by creating an equipment order for your patients</p>
                <Button onClick={() => navigate('/clients')} size="sm" className="bg-rose-600 hover:bg-rose-700 text-white border-0">
                  <Plus className="w-4 h-4 mr-2" /> Create Order
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myCases.slice(0, 5).map((c: Case) => {
                  const StatusIcon = getStatusIcon(c.status);
                  return (
                    <div key={c.id} onClick={() => navigate('/orders')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          c.status === CaseStatus.NEW ? 'bg-blue-100' : 
                          c.status === CaseStatus.INSTALLATION_PENDING ? 'bg-amber-100' :
                          c.status === CaseStatus.ACTIVE_SERVICE ? 'bg-emerald-100' :
                          'bg-slate-100'
                        }`}>
                          <StatusIcon className={`w-5 h-5 ${
                            c.status === CaseStatus.NEW ? 'text-blue-600' : 
                            c.status === CaseStatus.INSTALLATION_PENDING ? 'text-amber-600' :
                            c.status === CaseStatus.ACTIVE_SERVICE ? 'text-emerald-600' :
                            'text-slate-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">{c.client_name}</span>
                            <span className="text-xs text-slate-400 font-mono">#{c.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{c.line_items?.length || 0} item{(c.line_items?.length || 0) !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{c.created_at}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color={getStatusColor(c.status)}>{c.status.replace(/_/g, ' ')}</Badge>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Patient Risk Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Patient Overview</h2>
              <button 
                onClick={() => navigate('/clients')}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                View All
              </button>
            </div>
            
            {/* Risk Distribution */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-sm text-slate-600">High Risk</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{highRiskClients.length}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(highRiskClients.length / clients.length) * 100}%` }} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-slate-600">Medium Risk</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{mediumRiskClients.length}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(mediumRiskClients.length / clients.length) * 100}%` }} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Low Risk</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{lowRiskClients.length}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(lowRiskClients.length / clients.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* High Risk Patients */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h2 className="font-bold text-rose-900">High Risk Patients</h2>
              </div>
              <span className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {highRiskClients.length}
              </span>
            </div>
            {highRiskClients.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 font-medium">All patients stable</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {highRiskClients.slice(0, 4).map((client: Client) => (
                  <div 
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="px-5 py-3 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-sm font-bold text-rose-600">
                        {client.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">{client.full_name}</div>
                        <div className="text-xs text-slate-500">{client.address.split(',')[0]}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Pipeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900 mb-4">Order Pipeline</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">New Orders</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{newCases.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm font-medium text-slate-700">Allocated</span>
                </div>
                <span className="text-sm font-bold text-cyan-600">{myCases.filter((c: Case) => c.status === CaseStatus.STOCK_ALLOCATED).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Installing</span>
                </div>
                <span className="text-sm font-bold text-amber-600">{installingCases.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">{myCases.filter((c: Case) => c.status === CaseStatus.ACTIVE_SERVICE).length}</span>
              </div>
            </div>
          </div>

          {/* AI Status Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">MobileCare AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-xs text-slate-400">Monitoring Active</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-slate-400">SLA Compliance</span>
                <span className="text-emerald-400 font-semibold">98.2%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-slate-400">Active Devices</span>
                <span className="text-white font-semibold">{devices.filter((d: any) => d.status === 'INSTALLED_ACTIVE').length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Open Exceptions</span>
                <span className="text-white font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};