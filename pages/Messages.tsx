
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { Badge, Button } from '../components/ui';
import { 
  MessageSquare, Inbox, Send, Bell, 
  Bot, Search, Filter, Clock, 
  AlertCircle, Sparkles, Tag, Activity, 
  ArrowLeft, Phone, MoreVertical, Check, X
} from 'lucide-react';
import { Message, Role } from '../types';

export const Messages: React.FC = () => {
  const { messages, currentUser } = useStore();
  
  // --- ROLE CHECK ---
  const isMobileUser = currentUser.role === Role.INSTALLER;

  // --- SHARED DATA FETCHING ---
  // Helper to check if a message is relevant
  const isMessageRelevant = (m: Message) => {
    // 1. Ops/Admin/CEO see everything
    if ([Role.MC_ADMIN, Role.MC_OPERATIONS, Role.CEO].includes(currentUser.role)) {
        return true;
    }
    // 2. Installers
    if (currentUser.role === Role.INSTALLER) {
        if (m.recipient_group === 'INSTALLER') return true;
        if (m.sender_name === currentUser.name) return true;
        if (m.sender_name === 'Bob Builder' && currentUser.name === 'Bob Builder') return true; // Mock support
        return false;
    }
    // 3. Care Companies
    if ([Role.CARE_COMPANY_LEAD_NURSE, Role.CARE_COMPANY_NURSE].includes(currentUser.role)) {
        if (m.recipient_group === 'CARE_COMPANY') return true;
        if (m.sender_name === currentUser.name) return true;
        return false;
    }
    return false;
  };

  const relevantMessages = messages.filter(isMessageRelevant);

  // ==================================================================================
  // MOBILE RENDER (INSTALLER VIEW)
  // ==================================================================================
  if (isMobileUser) {
    return <MobileMessagesInterface messages={relevantMessages} currentUser={currentUser} />;
  }

  // ==================================================================================
  // DESKTOP RENDER (COMMAND CENTER) - Preserved from previous version
  // ==================================================================================
  return <DesktopCommandCenter messages={relevantMessages} currentUser={currentUser} />;
};

// ==================================================================================
// SUB-COMPONENTS
// ==================================================================================

/**
 * MOBILE INTERFACE
 * A WhatsApp/iMessage style interface optimized for touch and small screens.
 */
const MobileMessagesInterface: React.FC<{ messages: Message[], currentUser: any }> = ({ messages, currentUser }) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'CHATS' | 'ALERTS'>('CHATS');
  const [replyText, setReplyText] = useState('');

  // Filter for tabs
  const chats = messages.filter(m => m.category === 'DIRECT_MESSAGE');
  const alerts = messages.filter(m => m.category === 'SYSTEM_NOTIFICATION');
  
  const displayedList = activeTab === 'CHATS' ? chats : alerts;

  const handleSelect = (m: Message) => {
    setSelectedMessage(m);
    if (!m.is_read) store.markMessageRead(m.id);
  };

  const handleSendReply = () => {
      if (replyText.trim()) {
          store.sendMessage({
              id: `m-${Date.now()}`,
              category: 'DIRECT_MESSAGE',
              sender_type: 'HUMAN',
              sender_name: currentUser.name,
              sender_role: currentUser.role,
              recipient_group: 'OPERATIONS',
              subject: `Re: ${selectedMessage?.subject}`,
              preview: replyText,
              body: replyText,
              priority: 'NORMAL',
              is_read: false,
              timestamp: new Date().toLocaleTimeString(),
              tags: ['Reply']
          });
          setReplyText('');
          // In a real app, this would append to thread. For now, we clear selection or show toast.
          alert('Reply sent!');
          setSelectedMessage(null);
      }
  };

  // --- MOBILE DETAIL VIEW ---
  if (selectedMessage) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col font-sans">
        {/* Detail Header */}
        <div className="bg-slate-900 text-white p-4 pt-safe-top flex items-center gap-3 shadow-md">
           <button onClick={() => setSelectedMessage(null)} className="p-2 -ml-2 rounded-full active:bg-white/10">
              <ArrowLeft className="w-6 h-6" />
           </button>
           <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{selectedMessage.sender_name}</h3>
              <p className="text-xs text-slate-400 truncate">{selectedMessage.sender_role}</p>
           </div>
           {selectedMessage.category === 'DIRECT_MESSAGE' && (
              <button className="p-2 rounded-full bg-green-600 text-white shadow active:scale-95">
                 <Phone className="w-5 h-5" />
              </button>
           )}
        </div>

        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
           {/* Date Divider */}
           <div className="flex justify-center">
              <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded-full font-bold">
                 {selectedMessage.timestamp}
              </span>
           </div>

           {/* Message Bubble */}
           <div className={`flex flex-col ${selectedMessage.sender_name === currentUser.name ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                 selectedMessage.category === 'SYSTEM_NOTIFICATION' 
                    ? 'bg-white border-l-4 border-l-purple-500 text-slate-800' 
                    : selectedMessage.sender_name === currentUser.name 
                       ? 'bg-brand-600 text-white rounded-tr-none'
                       : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
              }`}>
                 {/* Subject in bubble if relevant */}
                 <div className="font-bold text-sm mb-1 opacity-90">{selectedMessage.subject}</div>
                 <div className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.body}</div>
                 
                 {/* Metadata */}
                 <div className="mt-2 flex gap-2 justify-end opacity-70">
                    {selectedMessage.sender_type === 'AI' && <Bot className="w-3 h-3" />}
                    <span className="text-[10px]">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
              </div>
           </div>

           {/* Action Card (If needed) */}
           {selectedMessage.action_required && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" /> Action Required
                 </div>
                 <p className="text-xs text-amber-700 mb-4">Please acknowledge or approve this request to proceed.</p>
                 <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 bg-white border border-amber-200 rounded-lg text-amber-800 font-bold text-sm active:bg-amber-100">
                       <X className="w-4 h-4" /> Decline
                    </button>
                    <button 
                       onClick={() => { store.approveMessageAction(selectedMessage.id); setSelectedMessage(null); }}
                       className="flex items-center justify-center gap-2 py-3 bg-amber-600 text-white rounded-lg font-bold text-sm shadow active:bg-amber-700"
                    >
                       <Check className="w-4 h-4" /> Approve
                    </button>
                 </div>
              </div>
           )}
        </div>

        {/* Reply Bar */}
        <div className="p-3 bg-white border-t border-slate-200 pb-safe-bottom">
           <div className="flex gap-2">
              <input 
                 type="text" 
                 placeholder="Type a reply..." 
                 className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                 value={replyText}
                 onChange={e => setReplyText(e.target.value)}
              />
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="bg-brand-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow active:scale-95 transition-transform disabled:opacity-50"
              >
                 <Send className="w-5 h-5 ml-0.5" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- MOBILE LIST VIEW ---
  return (
    <div className="flex flex-col h-full bg-slate-50">
       {/* Mobile Header */}
       <div className="bg-slate-900 text-white pt-8 pb-4 px-6 rounded-b-[2rem] shadow-lg mb-4 flex-none">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h1 className="text-2xl font-bold">Inbox</h1>
                <p className="text-slate-400 text-xs">{activeTab === 'CHATS' ? 'Your Conversations' : 'System Notifications'}</p>
             </div>
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <Bell className="w-5 h-5 text-white" />
                {messages.filter(m => !m.is_read).length > 0 && (
                   <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                )}
             </div>
          </div>
          
          {/* Custom Tabs */}
          <div className="flex p-1 bg-slate-800/50 rounded-xl backdrop-blur-sm">
             <button 
                onClick={() => setActiveTab('CHATS')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'CHATS' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}
             >
                Messages
             </button>
             <button 
                onClick={() => setActiveTab('ALERTS')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ALERTS' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}
             >
                Alerts
             </button>
          </div>
       </div>

       {/* Scrollable List */}
       <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
          {displayedList.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Inbox className="w-16 h-16 mb-4 opacity-20" />
                <p>No {activeTab === 'CHATS' ? 'messages' : 'alerts'} found.</p>
             </div>
          ) : (
             displayedList.map(m => (
                <div 
                   key={m.id} 
                   onClick={() => handleSelect(m)}
                   className={`bg-white p-4 rounded-xl border shadow-sm active:scale-[0.98] transition-all flex gap-4 ${m.is_read ? 'border-slate-200' : 'border-l-4 border-l-brand-500 border-y-slate-200 border-r-slate-200'}`}
                >
                   {/* Avatar / Icon */}
                   <div className="flex-shrink-0">
                      {m.category === 'SYSTEM_NOTIFICATION' ? (
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center ${m.sender_type === 'AI' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                            {m.sender_type === 'AI' ? <Bot className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                         </div>
                      ) : (
                         <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                            {m.sender_name.charAt(0)}
                         </div>
                      )}
                   </div>

                   {/* Content */}
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className={`text-sm truncate pr-2 ${m.is_read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                            {m.sender_name}
                         </h4>
                         <span className="text-[10px] text-slate-400 whitespace-nowrap">{m.timestamp}</span>
                      </div>
                      <p className={`text-sm mb-1 truncate ${m.is_read ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                         {m.subject}
                      </p>
                      <div className="flex items-center gap-2">
                         {m.action_required && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Action</span>}
                         {m.priority === 'HIGH' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Urgent</span>}
                      </div>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
};

/**
 * DESKTOP INTERFACE
 * The robust command center for Ops/Admin/CEO.
 */
const DesktopCommandCenter: React.FC<{ messages: Message[], currentUser: any }> = ({ messages, currentUser }) => {
  const [viewMode, setViewMode] = useState<'INBOX' | 'FEED'>('INBOX');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT'>('INBOX');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'HIGH_PRIORITY' | 'AI_LOGS'>('ALL');

  const chatMessages = messages.filter(m => m.category === 'DIRECT_MESSAGE');
  const systemMessages = messages.filter(m => m.category === 'SYSTEM_NOTIFICATION');

  const filteredChats = chatMessages.filter(m => {
    if (activeTab === 'INBOX' && m.sender_name === currentUser.name) return false;
    if (activeTab === 'SENT' && m.sender_name !== currentUser.name) return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredLogs = systemMessages.filter(m => {
    if (notifFilter === 'HIGH_PRIORITY' && m.priority !== 'HIGH') return false;
    if (notifFilter === 'AI_LOGS' && m.sender_type !== 'AI') return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (m: Message) => {
    setSelectedMessage(m);
    if (!m.is_read) store.markMessageRead(m.id);
  };

  const MessageIcon = ({ type, role }: { type: string, role?: string }) => {
    if (type === 'AI') return <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 border border-purple-200"><Bot className="w-5 h-5" /></div>;
    return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">{role?.charAt(0) || 'U'}</div>;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Top Bar */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               {viewMode === 'INBOX' ? <MessageSquare className="w-6 h-6 text-brand-600" /> : <Activity className="w-6 h-6 text-slate-600" />}
               Command Center
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {viewMode === 'INBOX' ? 'Direct Communications & Approvals' : 'System Activity & Operational Logs'}
            </p>
         </div>
         <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <button 
               onClick={() => { setViewMode('INBOX'); setSelectedMessage(null); }}
               className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'INBOX' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               <Inbox className="w-4 h-4" /> Inbox
            </button>
            <button 
               onClick={() => { setViewMode('FEED'); setSelectedMessage(null); }}
               className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'FEED' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               <Bell className="w-4 h-4" /> System Alerts
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
         {viewMode === 'INBOX' ? (
            <div className="flex h-full gap-6">
               {/* Sidebar List */}
               <div className="w-1/3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex gap-2 bg-slate-50">
                     <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="Search inbox..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {filteredChats.map(m => (
                        <div key={m.id} onClick={() => handleSelect(m)} className={`p-4 cursor-pointer border-l-[3px] hover:bg-slate-50 ${selectedMessage?.id === m.id ? 'bg-brand-50/30 border-l-brand-600' : 'border-l-transparent'}`}>
                           <div className="flex justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900">{m.sender_name}</span>
                              <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                           </div>
                           <h4 className="text-sm font-medium text-slate-800 mb-1">{m.subject}</h4>
                           <p className="text-xs text-slate-500 truncate">{m.preview}</p>
                        </div>
                     ))}
                  </div>
               </div>
               {/* Reading Pane */}
               <div className="w-2/3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  {selectedMessage ? (
                     <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100">
                           <div className="flex items-center gap-4 mb-4">
                              <MessageIcon type={selectedMessage.sender_type} role={selectedMessage.sender_role} />
                              <div>
                                 <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                                 <p className="text-xs text-slate-500">From {selectedMessage.sender_name} • {selectedMessage.timestamp}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex-1 p-8 text-sm text-slate-800 overflow-y-auto leading-relaxed">
                           {selectedMessage.body}
                           {selectedMessage.action_required && (
                              <div className="mt-6 bg-amber-50 border border-amber-200 rounded p-4">
                                 <h4 className="font-bold text-amber-900 text-sm mb-2">Action Required</h4>
                                 <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { store.approveMessageAction(selectedMessage.id); alert('Action Approved'); }}>Approve</Button>
                              </div>
                           )}
                        </div>
                     </div>
                  ) : (
                     <div className="flex items-center justify-center h-full text-slate-300">Select a message</div>
                  )}
               </div>
            </div>
         ) : (
            // Feed View (Simplified for brevity as logic exists in previous step, just re-rendering)
            <div className="h-full bg-slate-50 border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
               <div className="p-3 bg-white border-b border-slate-200 flex justify-between">
                  <div className="flex gap-2 items-center"><Filter className="w-4 h-4 text-slate-400" /> <span className="text-xs font-bold text-slate-600">Event Stream</span></div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredLogs.map(log => (
                     <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-4">
                        <div className={`mt-1 p-1.5 rounded ${log.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                           {log.priority === 'HIGH' ? <AlertCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                           <div className="flex justify-between"><span className="text-sm font-bold text-slate-800">{log.subject}</span></div>
                           <p className="text-xs text-slate-600 mt-1">{log.body}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
