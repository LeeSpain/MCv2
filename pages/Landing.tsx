import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { 
  Activity, ShieldCheck, Truck, Users, 
  ArrowRight, Database, Zap, Layout,
  Heart, Terminal, Smartphone, Info, X,
  Cpu, GitMerge, BrainCircuit, ScanLine,
  Clock, CheckCircle, AlertTriangle, FileText,
  Workflow, Network, Lock, Server,
  ClipboardList, Box, RefreshCw, Bot,
  Map, Radio, AlertOctagon, User, Shield
} from 'lucide-react';

const SystemArchitectureModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
      
      {/* Header */}
      <div className="bg-slate-50 p-6 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
               <Network className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Intelligence</h2>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Architecture v2.4</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Hybrid AI/Human Ops</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-white">
         
         {/* 1. THE AI LIFECYCLE */}
         <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-100"><Cpu className="w-5 h-5" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Autonomous Agent Lifecycle</h3>
                        <p className="text-xs text-slate-500">How the system thinks and acts in 400ms cycles.</p>
                    </div>
                </div>
            </div>
            
            <div className="relative">
               {/* Connector Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Stage 1 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors border border-slate-100">
                        <ScanLine className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">1. Continuous Scan</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Agents scan the live state (SQL) for anomalies like <code>stock &lt; min</code> every cycle without human polling.
                     </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                        <BrainCircuit className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">2. Risk Reasoning</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        The Logic Engine evaluates anomalies against business rules, calculating a <strong>Risk Score (0-100)</strong> to determine safety.
                     </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors border border-slate-100">
                        <GitMerge className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">3. Decision Fork</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        <strong>Low Risk:</strong> Auto-Execute fix. <strong>High Risk:</strong> Halt & Draft a proposal for human review (Human-in-the-Loop).
                     </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-slate-100">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">4. Distributed Action</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Actions committed to the ledger, and dispatched to mobile endpoints for real-world field execution.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. AI VS HUMAN */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"><Users className="w-5 h-5" /></div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Symbiotic Operations Protocol</h3>
                  <p className="text-xs text-slate-500">Separation of concerns for maximum operational efficiency.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               
               <div className="bg-slate-50/50 p-8 border-b md:border-b-0 md:border-r border-slate-200 relative group hover:bg-purple-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Cpu className="w-24 h-24 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-purple-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div> The Neural Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles high-volume tasks where speed and precision are critical.
                  </p>
                  <ul className="space-y-4">
                     {[
                        { label: "SLA Guarding", desc: "Automated tracking of stock vs commitments" },
                        { label: "Math & Logic", desc: "Complex inventory allocation and routing" },
                        { label: "Continuous Audit", desc: "Verifying every chain-of-custody move" },
                        { label: "Draft Generation", desc: "Pre-writing clinical assessment summaries" }
                     ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-xs">
                           <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                           <div>
                              <strong className="text-slate-900">{item.label}</strong>
                              <span className="text-slate-500 block">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="bg-white p-8 relative group hover:bg-blue-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Users className="w-24 h-24 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div> The Human Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles high-context tasks requiring empathy and judgment.
                  </p>
                  <ul className="space-y-4">
                     {[
                        { label: "Clinical Judgement", desc: "Final approval of care plans and products" },
                        { label: "Exception Resolution", desc: "Solving unique blockers flagged by AI" },
                        { label: "Field Excellence", desc: "Face-to-face training and hardware setup" },
                        { label: "Strategic Oversight", desc: "Management of care organization partners" }
                     ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-xs">
                           <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-[10px] font-bold">H</div>
                           <div>
                              <strong className="text-slate-900">{item.label}</strong>
                              <span className="text-slate-500 block">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </section>

         {/* 3. UNIFIED DATA FABRIC */}
         <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><Server className="w-5 h-5" /></div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Unified Data Architecture</h3>
                   <p className="text-xs text-slate-500">Every persona, one source of truth.</p>
                </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none"></div>
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  
                  <div className="flex flex-col gap-4">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <Smartphone className="w-6 h-6 text-brand-400" />
                        <div>
                           <div className="text-xs font-bold text-white uppercase">Field Apps</div>
                           <div className="text-[10px] text-slate-500 font-mono">Mobile Node</div>
                        </div>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <Terminal className="w-6 h-6 text-purple-400" />
                        <div>
                           <div className="text-xs font-bold text-white uppercase">Orchestrator</div>
                           <div className="text-[10px] text-slate-500 font-mono">Logic Node</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                     <div className="w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center animate-pulse">
                        <Database className="w-10 h-10 text-brand-500" />
                     </div>
                     <div className="mt-4 text-center">
                        <div className="text-sm font-bold text-white tracking-widest uppercase">The Ledger</div>
                        <div className="text-[10px] text-slate-500 font-mono">Immutable Event Store</div>
                     </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 leading-relaxed shadow-inner">
                     <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="text-brand-400">EVENT_STREAM</span>
                        <span className="text-green-500">CONNECTED</span>
                     </div>
                     <div className="space-y-1">
                        <div className="flex gap-2"><span className="text-slate-600">09:41</span> <span className="text-blue-400">INTAKE_NEW</span> <span className="text-white">#C12</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:41</span> <span className="text-purple-400">AI_RISK_SCORE</span> <span className="text-white">82</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:42</span> <span className="text-green-400">STOCK_LOCK</span> <span className="text-white">#X99</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">09:43</span> <span className="text-brand-400">JOB_PUSH</span> <span className="text-white">#BOB</span></div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
         <p className="text-xs text-slate-500 font-medium">Confidential MobileCare Engineering Document • Internal Use Only</p>
         <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95">Close & Resume</button>
      </div>
    </div>
  </div>
);

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
      
      <div className="bg-slate-50 p-6 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
               <Workflow className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">End-to-End Operational Lifecycle</h2>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Standard Operating Procedure</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>AI Safeguards</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
         
         <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-brand-400" /> Secure Chain of Custody</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                   Every asset move is verified through multiple checkpoints. If a device moves from the warehouse to a client, 
                   the system requires a scan from the Installer and a digital signature from the Care Pro.
                </p>
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Human</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span> AI Oversight</div>
            </div>
         </div>

         <div className="p-12 max-w-5xl mx-auto">
            <div className="relative space-y-16">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-[1px]"></div>

                {/* 1. INTAKE */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-blue-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">1. Intake & Assessment</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Care organization nurse evaluates the patient at home, identifying risks like falls or isolation.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                            <User className="w-3.5 h-3.5" /> Nurse Submission
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-blue-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">01</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-50/30 transition-all">
                         <div className="flex items-start gap-4">
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                            <div>
                               <h5 className="text-sm font-bold text-white mb-2">Auditor Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Instantly scans clinical notes for risk keywords and flags high-priority cases.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. LOGISTICS */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-500/30 transition-all text-right">
                         <div className="flex items-start gap-4 justify-end">
                            <div className="text-right">
                               <h5 className="text-sm font-bold text-white mb-2">Logistics Optimizer</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Reserves stock and validates circular stock availability before fulfillment.
                               </p>
                            </div>
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-slate-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">02</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-slate-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-slate-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">2. Fulfillment & Allocation</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Operations approves the request and system locks specific serial numbers to the patient.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                            <Shield className="w-3.5 h-3.5" /> Ops Approval
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. FIELD */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-emerald-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">3. Field Installation</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Installer sets up hardware, conducts training, and performs photo verification.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                            <Truck className="w-3.5 h-3.5" /> Technician Stop
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-emerald-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">03</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-50/30 transition-all">
                         <div className="flex items-start gap-4">
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                            <div>
                               <h5 className="text-sm font-bold text-white mb-2">Verification Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Pings device API and checks photo GPS metadata to ensure signal is LIVE.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. MONITORING */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-16 order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl group-hover:border-purple-500/30 transition-all text-right">
                         <div className="flex items-start gap-4 justify-end">
                            <div className="text-right">
                               <h5 className="text-sm font-bold text-white mb-2">Watchdog Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Scans for signal drop-offs. Auto-creates support tickets if device is offline &gt; 24h.
                               </p>
                            </div>
                            <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                         </div>
                      </div>
                   </div>
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-amber-500 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2 text-[10px] font-bold">04</div>
                   <div className="md:w-1/2 md:pl-16 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-amber-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-amber-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">4. Active Service</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Patient lives safely with 24/7 monitoring while system maintains uptime.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                            <Activity className="w-3.5 h-3.5" /> Live Uptime
                         </div>
                      </div>
                   </div>
                </div>

            </div>
         </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
         <button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> All Systems Nominal
         </button>
      </div>
    </div>
  </div>
);

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [showProcess, setShowProcess] = useState(false);

  const handlePortalEnter = (userId: string, path: string) => {
    store.setUser(userId);
    navigate(path);
  };

  const portals = [
    {
      title: "Executive View",
      role: "CEO & Board",
      description: "Unified strategic command, utilization metrics, and tactical blocker oversight.",
      path: "/dashboard",
      userId: "u1",
      icon: Activity,
      color: "bg-slate-900 text-white",
      ring: "group-hover:ring-slate-400"
    },
    {
      title: "System Admin",
      role: "Admin & Configuration",
      description: "Full system control, AI agent configuration, and security settings.",
      path: "/dashboard", 
      userId: "u2",
      icon: Terminal,
      color: "bg-slate-800 text-white",
      ring: "group-hover:ring-slate-600"
    },
    {
      title: "Operations Manager",
      role: "Logistics & Stock",
      description: "Logistics command center, exception handling, and stock control.",
      path: "/ops-dashboard",
      userId: "u3",
      icon: Database,
      color: "bg-blue-600 text-white",
      ring: "group-hover:ring-blue-400"
    },
    {
      title: "Care Lead (Desktop)",
      role: "Care Organization",
      description: "Care planning, patient oversight, and new order approvals.",
      path: "/care-dashboard",
      userId: "u4",
      icon: Heart,
      color: "bg-rose-600 text-white",
      ring: "group-hover:ring-rose-400"
    },
    {
      title: "Care Nurse (Mobile)",
      role: "Field Nurse",
      description: "Patient visits, daily tasks, and quick reporting view.",
      path: "/care-dashboard",
      userId: "u5",
      icon: Smartphone, 
      color: "bg-rose-400 text-white",
      ring: "group-hover:ring-rose-300"
    },
    {
      title: "Field Installer (Mobile)",
      role: "Field Technician",
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
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white pt-24 pb-48 relative overflow-hidden">
        {/* Background Decorative Elements */}
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
              Select a persona below to enter their specialized operational environment.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button 
                onClick={() => setShowInfo(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-bold text-white transition-all shadow-xl hover:shadow-brand-500/20 active:scale-95"
              >
                <Info className="w-5 h-5 text-brand-400" />
                Architecture
              </button>
              
              <button 
                onClick={() => setShowProcess(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full text-sm font-bold transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                <Workflow className="w-5 h-5 text-blue-600" />
                Operational Process
              </button>
           </div>
        </div>
      </div>

      {/* PORTAL GRID */}
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
                     <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {p.role}
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                  
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

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white">MC</div>
               <span className="font-bold text-white tracking-tight">MobileCare Operations</span>
            </div>
            <div className="text-xs font-medium">
               &copy; {new Date().getFullYear()} MobileCare B.V. Internal Control Systems.
            </div>
         </div>
      </footer>

    </div>
  );
};
