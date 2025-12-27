import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Badge, Button } from '../components/ui';
import { Exception, Role } from '../types';
import { 
  AlertCircle, AlertTriangle, CheckCircle, 
  Filter, User, Clock, ArrowRight, MessageSquare, ClipboardCheck,
  ShieldAlert, Activity, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Exceptions: React.FC = () => {
  const { exceptions, currentUser, cases } = useStore();
  const navigate = useNavigate();
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterOwner, setFilterOwner] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // PERMISSION CHECK
  const canManageExceptions = [Role.MC_ADMIN, Role.MC_OPERATIONS].includes(currentUser.role);

  const openExceptions = exceptions.filter(e => e.status !== 'RESOLVED');
  
  // Counters
  const counts = {
    BLOCKER: openExceptions.filter(e => e.severity === 'BLOCKER').length,
    INCIDENT: openExceptions.filter(e => e.severity === 'INCIDENT').length,
    WARNING: openExceptions.filter(e => e.severity === 'WARNING').length,
  };

  const filteredExceptions = openExceptions.filter(e => {
    if (filterSeverity !== 'ALL' && e.severity !== filterSeverity) return false;
    if (filterOwner !== 'ALL' && e.human_owner_role !== filterOwner) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) && !e.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const severityOrder = { BLOCKER: 0, INCIDENT: 1, WARNING: 2 };
    // @ts-ignore
    return (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99);
  });

  const handleAcknowledge = () => {
    if (selectedException && canManageExceptions) {
      store.acknowledgeException(selectedException.id, currentUser.id);
      setSelectedException(null); 
    }
  };

  const handleResolve = () => {
    if (selectedException && resolutionNote.trim() && canManageExceptions) {
      store.resolveException(selectedException.id, resolutionNote);
      setResolutionNote('');
      setSelectedException(null);
    }
  };

  const handleNavigateToEntity = () => {
    if (!selectedException) return;
    
    const { related_entity_type, related_entity_id } = selectedException;

    if (related_entity_type === 'DEVICE') {
        navigate('/assets');
    } else if (related_entity_type === 'CASE') {
        const relatedCase = cases.find(c => c.id === related_entity_id);
        if (relatedCase) {
            navigate(`/clients/${relatedCase.client_id}`);
        } else {
            navigate('/cases');
        }
    } else if (related_entity_type === 'JOB' || related_entity_type === 'RETURN') {
        navigate('/jobs');
    } else {
        alert(`Navigation for ${related_entity_type} not yet implemented.`);
    }
  };

  const SeverityIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'BLOCKER': return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'INCIDENT': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER & CONTROLS */}
      <div className="flex-none mb-6 space-y-4">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-brand-600" />
              Exceptions Queue
            </h2>
            <p className="text-xs text-slate-500 mt-1">Operational interventions required.</p>
          </div>
          <div className="flex gap-4">
             {Object.entries(counts).map(([key, count]) => (
                <div key={key} className={`px-3 py-1 rounded border flex items-center gap-2 ${
                  key === 'BLOCKER' ? 'bg-red-50 border-red-200 text-red-700' :
                  key === 'INCIDENT' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold text-lg leading-none italic">{count}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 italic">{key}s</span>
                </div>
             ))}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 italic">
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm italic">
             <div className="px-3 border-r border-slate-100 italic">
               <Filter className="w-4 h-4 text-slate-400 italic" />
             </div>
             {['ALL', 'BLOCKER', 'INCIDENT', 'WARNING'].map(sev => (
               <button
                 key={sev}
                 onClick={() => setFilterSeverity(sev)}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all italic ${
                   filterSeverity === sev 
                     ? 'bg-slate-800 text-white shadow-sm' 
                     : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 {sev}
               </button>
             ))}
          </div>

          <div className="relative italic">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 italic" />
            <input 
              type="text" 
              placeholder="Search ID, title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 italic" 
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT VIEW */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* LEFT: LIST */}
        <div className="w-1/2 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="flex-none px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center italic">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider italic">{filteredExceptions.length} Items Pending</span>
             <span className="text-xs text-slate-400 italic">Sorted by Severity</span>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto italic">
             {filteredExceptions.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 italic">
                  <CheckCircle className="w-12 h-12 mb-2 text-green-100 italic" />
                  <p className="italic">Queue empty</p>
               </div>
             ) : (
               <div className="divide-y divide-slate-100 italic">
                 {filteredExceptions.map(ex => (
                   <div 
                     key={ex.id}
                     onClick={() => setSelectedException(ex)}
                     className={`group p-4 cursor-pointer transition-all hover:bg-slate-50 border-l-[3px] italic ${
                       selectedException?.id === ex.id ? 'bg-brand-50/50' : ''
                     } ${
                       ex.severity === 'BLOCKER' ? 'border-l-red-500' :
                       ex.severity === 'INCIDENT' ? 'border-l-amber-500' : 'border-l-blue-300'
                     }`}
                   >
                     <div className="flex justify-between items-start mb-1 italic">
                        <div className="flex items-center gap-2 italic">
                           <SeverityIcon severity={ex.severity} />
                           <span className={`font-semibold text-sm italic ${selectedException?.id === ex.id ? 'text-brand-900' : 'text-slate-800'}`}>
                             {ex.title}
                           </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono italic">{ex.created_at}</span>
                     </div>
                     
                     <p className="text-xs text-slate-500 line-clamp-1 mb-2 pl-6 italic">
                       {ex.description}
                     </p>
                     
                     <div className="pl-6 flex items-center gap-3 italic">
                        <Badge color="gray">{ex.related_entity_type} #{ex.related_entity_id}</Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 italic">
                          <User className="w-3 h-3 italic" /> {ex.human_owner_role}
                        </span>
                        {ex.status === 'ACKNOWLEDGED' && (
                           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded italic">ACK</span>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* RIGHT: DETAIL */}
        <div className="w-1/2 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden italic">
          {selectedException ? (
            <div className="flex flex-col h-full italic">
               {/* Detail Header */}
               <div className="flex-none p-6 border-b border-slate-100 italic">
                  <div className="flex justify-between items-start mb-4 italic">
                     <div className="flex items-center gap-2 italic">
                       <Badge color={selectedException.severity === 'BLOCKER' ? 'red' : selectedException.severity === 'INCIDENT' ? 'yellow' : 'blue'}>
                         {selectedException.severity}
                       </Badge>
                       <span className="text-xs text-slate-400 font-mono italic">#{selectedException.id}</span>
                     </div>
                     <div className="text-right italic">
                       <span className="text-xs text-slate-400 block italic">Assigned to</span>
                       <span className="text-sm font-bold text-slate-800 italic">{selectedException.human_owner_role}</span>
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 italic">{selectedException.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 italic">
                     <span className="flex items-center gap-1 italic"><Clock className="w-3 h-3 italic" /> Created {selectedException.created_at}</span>
                     <span className="flex items-center gap-1 italic"><User className="w-3 h-3 italic" /> By {selectedException.created_by}</span>
                  </div>
               </div>

               {/* Detail Body */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 italic">
                  {/* Description */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 italic">Description</h4>
                     {selectedException.description}
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-brand-50 p-4 rounded-lg border border-brand-100 flex gap-3 italic">
                     <div className="mt-0.5 italic"><MessageSquare className="w-5 h-5 text-brand-600 italic" /></div>
                     <div className="italic">
                        <h4 className="text-xs font-bold text-brand-800 uppercase mb-1 italic">AI Recommendation</h4>
                        <p className="text-sm text-brand-900 italic">{selectedException.recommended_action}</p>
                     </div>
                  </div>

                  {/* Context Actions */}
                  <div className="italic">
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 italic">Investigation Tools</h4>
                     <div className="grid grid-cols-2 gap-3 italic">
                        <Button variant="outline" size="sm" className="justify-between italic" onClick={handleNavigateToEntity}>
                           Open {selectedException.related_entity_type} <ArrowRight className="w-3 h-3 italic" />
                        </Button>
                        <Button variant="outline" size="sm" className="justify-between italic">
                           View Audit Trail <ArrowRight className="w-3 h-3 italic" />
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Detail Footer (Actions) */}
               <div className="flex-none p-6 border-t border-slate-100 bg-slate-50/50 italic">
                  {canManageExceptions ? (
                     selectedException.status === 'OPEN' ? (
                        <Button onClick={handleAcknowledge} className="w-full h-10 shadow-sm italic">
                           <ClipboardCheck className="w-4 h-4 mr-2 italic" /> Acknowledge & Take Ownership
                        </Button>
                     ) : (
                        <div className="space-y-3 italic">
                           <textarea 
                              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none italic"
                              placeholder="Describe resolution actions (required)..."
                              rows={2}
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                           />
                           <div className="flex gap-3 italic">
                              <Button variant="outline" className="flex-1 italic" onClick={() => setSelectedException(null)}>Cancel</Button>
                              <Button 
                                 className="flex-[2] bg-green-600 hover:bg-green-700 text-white italic" 
                                 disabled={!resolutionNote.trim()}
                                 onClick={handleResolve}
                              >
                                 <CheckCircle className="w-4 h-4 mr-2 italic" /> Mark Resolved
                              </Button>
                           </div>
                        </div>
                     )
                  ) : (
                     <div className="text-center text-sm text-slate-400 italic">
                        Read-only view.
                     </div>
                  )}
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 italic">
               <Activity className="w-16 h-16 mb-4 opacity-20 italic" />
               <p className="font-medium italic">Select an item to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};