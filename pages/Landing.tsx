
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
  Stethoscope, Map, Radio, AlertOctagon, User
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
         
         {/* 1. THE AI LIFECYCLE (Horizontal Process Flow) */}
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
                        <Clock className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">1. Continuous Scan</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Agents run on cron schedules or event triggers. They scan the live state (SQL) for anomalies like <code className="bg-slate-100 px-1 rounded text-slate-700">stock &lt; min</code>.
                     </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                        <BrainCircuit className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">2. Risk Reasoning</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        The Logic Engine evaluates the anomaly against business rules. It calculates a <strong>Risk Score (0-100)</strong> to determine safety.
                     </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors border border-slate-100">
                        <GitMerge className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">3. Decision Fork</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        <strong>Low Risk:</strong> Auto-Execute fix.<br/>
                        <strong>High Risk:</strong> Halt & Draft proposal for human review (Human-in-the-Loop).
                     </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-slate-100">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">4. Execution</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Actions are committed to the ledger. Notifications are dispatched. The loop closes and waits for the next cycle.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. AI VS HUMAN (Comparison View) */}
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"><Users className="w-5 h-5" /></div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Symbiotic Operations Protocol</h3>
                  <p className="text-xs text-slate-500">Clear separation of concerns for maximum efficiency.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               
               {/* AI Side */}
               <div className="bg-slate-50/50 p-8 border-b md:border-b-0 md:border-r border-slate-200 relative group hover:bg-purple-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Cpu className="w-24 h-24 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-purple-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-purple-600"></div> The Neural Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles high-volume, low-context tasks. Optimizes for speed and consistency.
                  </p>
                  <ul className="space-y-3">
                     {[
                        { label: "24/7 Monitoring", desc: "Instantly detects SLA breaches" },
                        { label: "Math & Allocation", desc: "Perfect inventory balancing" },
                        { label: "Routine Logistics", desc: "Scheduling standard jobs" },
                        { label: "Drafting Comms", desc: "Pre-writing emails for humans" }
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

               {/* Human Side */}
               <div className="bg-white p-8 relative group hover:bg-blue-50/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Users className="w-24 h-24 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div> The Strategic Layer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                     Handles low-volume, high-context tasks. Optimizes for empathy and judgment.
                  </p>
                  <ul className="space-y-3">
                     {[
                        { label: "Exception Handling", desc: "Resolving complex blockers" },
                        { label: "Physical Care", desc: "Installing devices in homes" },
                        { label: "Patient Empathy", desc: "Understanding clinical needs" },
                        { label: "Final Approval", desc: "Signing off on high-risk actions" }
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

         {/* 3. UNIFIED DATA ARCHITECTURE */}
         <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><Server className="w-5 h-5" /></div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Unified Data Fabric</h3>
                   <p className="text-xs text-slate-500">Single Source of Truth across all apps.</p>
                </div>
            </div>
            
            <div className="bg-slate-900 rounded-xl p-1 shadow-lg overflow-hidden">
               <div className="bg-[#0f172a] rounded-lg p-6 border border-slate-800">
                  <div className="flex flex-col md:flex-row gap-8">
                     
                     {/* Diagram */}
                     <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div className="flex justify-center gap-4">
                           <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center w-24">
                              <Smartphone className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                              <span className="text-[10px] text-slate-300 font-bold">Nurse App</span>
                           </div>
                           <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center w-24">
                              <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                              <span className="text-[10px] text-slate-300 font-bold">Installer App</span>
                           </div>
                           <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center w-24">
                              <Activity className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                              <span className="text-[10px] text-slate-300 font-bold">Ops Dash</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                           <div className="h-8 w-px bg-slate-700"></div>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">API / Orchestration Layer</div>
                           <div className="flex justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></span>
                           </div>
                        </div>

                        <div className="flex items-center justify-center">
                           <div className="h-8 w-px bg-slate-700"></div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center justify-center gap-3">
                           <Database className="w-5 h-5 text-slate-400" />
                           <div className="text-left">
                              <div className="text-xs font-bold text-white">Unified State Machine</div>
                              <div className="text-[10px] text-slate-500">PostgreSQL + Event Store</div>
                           </div>
                        </div>
                     </div>

                     {/* Live Code Stream */}
                     <div className="flex-1 border-l border-slate-800 pl-8 hidden md:block">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Event Stream</span>
                           <span className="flex items-center gap-1 text-[9px] text-green-500 font-mono"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> CONNECTED</span>
                        </div>
                        <div className="space-y-2 font-mono text-[10px]">
                           <div className="flex gap-2 opacity-50"><span className="text-slate-500">10:00:01</span> <span className="text-blue-400">ORDER_CREATED</span> <span className="text-slate-600">#C123</span></div>
                           <div className="flex gap-2 opacity-75"><span className="text-slate-500">10:00:02</span> <span className="text-purple-400">AI_ALLOCATED</span> <span className="text-slate-600">#D555 &rarr; #C123</span></div>
                           <div className="flex gap-2"><span className="text-slate-500">10:00:03</span> <span className="text-purple-400">AI_JOB_CREATED</span> <span className="text-slate-600">Install @ Client</span></div>
                           <div className="flex gap-2"><span className="text-slate-500">14:20:00</span> <span className="text-emerald-400">JOB_COMPLETE</span> <span className="text-slate-600">Photo Verified</span></div>
                           <div className="flex gap-2"><span className="text-slate-500">14:20:01</span> <span className="text-green-400">ASSET_ACTIVE</span> <span className="text-slate-600">Billing Started</span></div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </section>

      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
         <p className="text-xs text-slate-500 font-medium">Confidential Architecture • Internal Use Only</p>
         <button 
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-xs transition-all shadow-md active:scale-95"
         >
            Close & Return to Simulation
         </button>
      </div>
    </div>
  </div>
);

const ProcessFlowModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
      
      {/* Header */}
      <div className="bg-slate-50 p-6 flex justify-between items-center shrink-0 border-b border-slate-200">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
               <Workflow className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">End-to-End Operational Process</h2>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Lifecycle Management</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>AI Oversight & Compliance</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      {/* Content - Modern Vertical Timeline */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
         
         {/* INTRO BANNER */}
         <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row gap-8 items-center border-b border-slate-800">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Network className="w-5 h-5 text-brand-400" /> The Orchestration Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                   MobileCare's platform isn't just a database; it's an active participant in the logistics chain. 
                   While Care Professionals initiate requests, our autonomous agents handle the complex logistics, 
                   inventory math, and safety monitoring in the background.
                </p>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Human Action</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> AI Agent</div>
            </div>
         </div>

         <div className="p-10 max-w-5xl mx-auto">
            <div className="relative space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-[1px]"></div>

                {/* STEP 1: INTAKE */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-12 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-blue-300 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">1. Intake & Clinical Triage</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Care Professional submits a request (e.g., "Fall Safety Package") via the portal.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                            <User className="w-3 h-3" /> Action: Nurse
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-blue-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2">
                      <span className="text-[10px] font-bold">01</span>
                   </div>

                   <div className="md:w-1/2 md:pl-12 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group-hover:shadow-blue-500/10 transition-all">
                         <div className="flex items-start gap-3">
                            <div className="mt-1"><Bot className="w-5 h-5 text-purple-400" /></div>
                            <div>
                               <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">AI Oversight</div>
                               <h5 className="text-sm font-bold text-white mb-2">Risk Analysis & Validation</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Agent scans clinical notes for keywords (e.g., "dizziness"). Suggests additional sensors if risk is high. Checks for duplicate active orders.
                               </p>
                            </div>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[9px] text-slate-500">
                            {`{ "risk_score": 85, "suggestions": ["FALL_SENSOR"] }`}
                         </div>
                      </div>
                   </div>
                </div>

                {/* STEP 2: LOGISTICS */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-12 text-right order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group-hover:shadow-purple-500/10 transition-all">
                         <div className="flex items-start gap-3 justify-end text-right">
                            <div>
                               <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">AI Oversight</div>
                               <h5 className="text-sm font-bold text-white mb-2">Stock Controller</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Calculates optimal stock source (Warehouse vs Circular Return). Reserves specific serial numbers. Generates route for installer.
                               </p>
                            </div>
                            <div className="mt-1"><Bot className="w-5 h-5 text-purple-400" /></div>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[9px] text-slate-500 text-right">
                            {`{ "allocated": "UNIT-X99", "source": "WAREHOUSE_A" }`}
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-indigo-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2">
                      <span className="text-[10px] font-bold">02</span>
                   </div>

                   <div className="md:w-1/2 md:pl-12 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-indigo-300 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-indigo-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">2. Allocation & Logistics</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            System instantly locks inventory to the order. No manual warehouse picking required for digital allocation.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                            <Box className="w-3 h-3" /> Action: System
                         </div>
                      </div>
                   </div>
                </div>

                {/* STEP 3: INSTALLATION */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-12 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-emerald-300 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">3. Field Installation</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Installer arrives at client home. Sets up hardware, trains the user, and takes photo proof of installation.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                            <Truck className="w-3 h-3" /> Action: Installer
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-emerald-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2">
                      <span className="text-[10px] font-bold">03</span>
                   </div>

                   <div className="md:w-1/2 md:pl-12 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group-hover:shadow-emerald-500/10 transition-all">
                         <div className="flex items-start gap-3">
                            <div className="mt-1"><Bot className="w-5 h-5 text-purple-400" /></div>
                            <div>
                               <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">AI Oversight</div>
                               <h5 className="text-sm font-bold text-white mb-2">Verification Agent</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Validates Installer GPS matches Client Address. Pings device API to ensure signal is LIVE before allowing job closure.
                               </p>
                            </div>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[9px] text-slate-500">
                            {`{ "gps_match": true, "signal": "STRONG" }`}
                         </div>
                      </div>
                   </div>
                </div>

                {/* STEP 4: MONITORING */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-12 text-right order-2 md:order-1">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group-hover:shadow-amber-500/10 transition-all">
                         <div className="flex items-start gap-3 justify-end text-right">
                            <div>
                               <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">AI Oversight</div>
                               <h5 className="text-sm font-bold text-white mb-2">Watchdog & SLA Monitor</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Continuously checks heartbeat. If device goes offline > 24h or battery low, auto-creates support ticket for Care Team.
                               </p>
                            </div>
                            <div className="mt-1"><Bot className="w-5 h-5 text-purple-400" /></div>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[9px] text-slate-500 text-right">
                            {`{ "heartbeat": "ONLINE", "battery": "98%" }`}
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-amber-500 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2">
                      <span className="text-[10px] font-bold">04</span>
                   </div>

                   <div className="md:w-1/2 md:pl-12 order-3">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-amber-300 transition-all relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-16 h-16 bg-amber-50 rounded-br-full -ml-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">4. Active Service</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Patient remains safe at home. Care organization responds to clinical alerts. MobileCare handles technical uptime.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                            <Activity className="w-3 h-3" /> Action: Monitoring
                         </div>
                      </div>
                   </div>
                </div>

                {/* STEP 5: RECOVERY */}
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start group">
                   <div className="md:w-1/2 md:pr-12 text-right order-2 md:order-1">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:border-slate-400 transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-bl-full -mr-8 -mt-8"></div>
                         <h4 className="text-lg font-bold text-slate-900 mb-2">5. Recovery & Refurbishment</h4>
                         <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Service ends. Device is retrieved, sanitized, data-wiped, and returned to stock for the next patient.
                         </p>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                            <RefreshCw className="w-3 h-3" /> Action: Logistics
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-8 md:left-1/2 -ml-4 w-8 h-8 rounded-full border-4 border-white bg-slate-600 shadow-md flex items-center justify-center text-white z-10 order-1 md:order-2">
                      <span className="text-[10px] font-bold">05</span>
                   </div>

                   <div className="md:w-1/2 md:pl-12 order-3">
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group-hover:shadow-slate-500/10 transition-all">
                         <div className="flex items-start gap-3">
                            <div className="mt-1"><Bot className="w-5 h-5 text-purple-400" /></div>
                            <div>
                               <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">AI Oversight</div>
                               <h5 className="text-sm font-bold text-white mb-2">Returns Recovery</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                  Auto-triggers return flow upon service end. Chases unreturned assets via SMS/Email after 7 days. Updates financial ledger.
                               </p>
                            </div>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[9px] text-slate-500">
                            {`{ "status": "RECOVERING", "chase_count": 1 }`}
                         </div>
                      </div>
                   </div>
                </div>

            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
         <button 
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
         >
            <CheckCircle className="w-4 h-4" /> Close Process View
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
      description: "Strategic oversight, financial metrics, and risk index reporting.",
      path: "/ceo-dashboard",
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
      
      {/* Modals */}
      {showInfo && <SystemArchitectureModal onClose={() => setShowInfo(false)} />}
      {showProcess && <ProcessFlowModal onClose={() => setShowProcess(false)} />}

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
           
           <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-bold text-white transition-all shadow-lg hover:shadow-brand-500/20"
              >
                <Info className="w-4 h-4 text-brand-400" />
                How the System Works
              </button>
              
              <button 
                onClick={() => setShowProcess(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl"
              >
                <Workflow className="w-4 h-4 text-blue-600" />
                How the Process Works
              </button>
           </div>
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
