
import { useState, useEffect } from 'react';
import { 
  MOCK_DEVICES, MOCK_CASES, MOCK_JOBS, MOCK_AGENTS, MOCK_EXCEPTIONS, 
  MOCK_USERS, MOCK_CLIENTS, MOCK_CARE_PLANS, MOCK_ASSESSMENTS, MOCK_TIMELINE, MOCK_MESSAGES,
  MOCK_PRODUCTS 
} from './mockData';
import { 
  User, Role, Agent, AgentStatus, AutonomyLevel, 
  CaseStatus, Client, CarePlan, Assessment, ClientTimelineEvent, Case, AiAnalysisSnapshot, Message,
  DeviceStatus, Exception, Job, JobStatus, CaseLineItem,
  AgentPlan, AgentAction, AgentRunLog, AgentAutonomy, AgentActionKind, AgentRisk, Device, Product
} from '../types';

class Store {
  devices = [...MOCK_DEVICES];
  cases = [...MOCK_CASES];
  jobs = [...MOCK_JOBS];
  agents = [...MOCK_AGENTS];
  exceptions = [...MOCK_EXCEPTIONS];
  clients = [...MOCK_CLIENTS];
  carePlans = [...MOCK_CARE_PLANS];
  assessments = [...MOCK_ASSESSMENTS];
  timeline = [...MOCK_TIMELINE];
  messages = [...MOCK_MESSAGES];
  products = [...MOCK_PRODUCTS];
  currentUser: User = MOCK_USERS[0];
  killSwitch = false;
  agentRunLogs: AgentRunLog[] = [];

  listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  setUser(userId: string) {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.notify();
    }
  }

  toggleKillSwitch() {
    this.killSwitch = !this.killSwitch;
    if (this.killSwitch) {
      this.agents = this.agents.map(a => ({ ...a, status: AgentStatus.PAUSED }));
    }
    this.notify();
  }

  private uid(prefix = "id") {
    return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
  }

  // --- VIRTUAL PROPERTIES ---

  get confirmations() {
    return [
      ...this.devices.filter(d => d.confirmation_needed).map(d => ({ id: d.id, client_id: d.assigned_client_id, type: `Device Check: ${d.serial_number}`, status: 'PENDING' })),
      ...this.jobs.filter(j => j.confirmation_needed).map(j => ({ id: j.id, client_id: j.client_id, type: `Job Confirmation: ${j.type}`, status: 'PENDING' }))
    ];
  }

  // --- PRODUCT HELPERS ---

  getProduct(productId: string) {
    return this.products.find((p) => p.id === productId);
  }

  getProductName(productId: string) {
    return this.getProduct(productId)?.name ?? productId;
  }

  getProductIdsToNames(productIds: string[]) {
    return productIds.map((id) => this.getProductName(id));
  }

  addProduct(product: Product) {
    this.products = [...this.products, product];
    this.notify();
  }

  // --- AI INTAKE SIMULATION ---

  analyzeAssessment(text: string): AiAnalysisSnapshot {
    const t = (text || "").toLowerCase();
    const suggested_product_ids: string[] = ["svc-monitoring"];
    const risk_flags: string[] = [];
    let confidence = 0.72;

    const add = (id: string) => {
      if (!suggested_product_ids.includes(id)) suggested_product_ids.push(id);
    };

    if (t.includes("fall") || t.includes("fallen") || t.includes("dizzy") || t.includes("fainted")) {
      add("prod-sos");
      add("prod-fall-sensor");
      risk_flags.push("Fall risk");
      confidence += 0.06;
    }

    if (t.includes("medication") || t.includes("pills") || t.includes("forget") || t.includes("missed doses")) {
      add("prod-dosell");
      risk_flags.push("Medication adherence risk");
      confidence += 0.06;
    }

    if (t.includes("diabetes") || t.includes("glucose") || t.includes("sugar")) {
      add("prod-glucose");
      risk_flags.push("Diabetes monitoring");
      confidence += 0.06;
    }

    if (t.includes("alone") || t.includes("lonely") || t.includes("isolated")) {
      add("svc-wellness-calls");
      risk_flags.push("Social isolation risk");
      confidence += 0.04;
    }

    if (suggested_product_ids.includes("prod-sos") || suggested_product_ids.includes("prod-fall-sensor")) {
      add("prod-hub");
    }

    confidence = Math.min(0.95, Math.max(0.55, confidence));

    const reasoning: string[] = [];
    if (risk_flags.length === 0) reasoning.push("No strong risk keywords detected; baseline monitoring recommended.");
    if (risk_flags.includes("Fall risk")) reasoning.push("Detected fall/dizziness indicators; SOS & Fall Sensor support recommended.");
    if (risk_flags.includes("Medication adherence risk")) reasoning.push("Detected medication adherence concerns; dispenser recommended.");
    if (risk_flags.includes("Diabetes monitoring")) reasoning.push("Detected diabetes/glucose monitoring needs; glucose device recommended.");
    if (risk_flags.includes("Social isolation risk")) reasoning.push("Detected isolation indicators; wellness calls recommended.");
    if (suggested_product_ids.includes("prod-hub")) reasoning.push("Smart Hub included to support connected devices.");

    return {
      suggested_product_ids,
      risk_flags,
      confidence,
      reasoning,
    };
  }

  // --- CRM ACTIONS ---

  addAssessment(assessment: Assessment) {
    this.assessments = [assessment, ...this.assessments];
    if (assessment.status === 'DRAFT') {
      this.notify();
      return;
    }
    this.logTimelineEvent({
      id: `tle-${Date.now()}`,
      client_id: assessment.client_id,
      event_type: 'ASSESSMENT',
      source: 'HUMAN',
      summary: `${assessment.type} Assessment approved by Lead Nurse`,
      timestamp: new Date().toISOString(),
      actor_name: this.currentUser.name
    });
    this.notify();
  }

  approveAssessment(id: string, productIds: string[]) {
    this.assessments = this.assessments.map(a => 
      a.id === id ? { ...a, status: 'APPROVED', recommended_product_ids: productIds } : a
    );
    this.notify();
  }

  createCarePlanFromAssessment(assessmentId: string, overrides?: Partial<CarePlan>) {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    if (!assessment) return;

    const newPlan: CarePlan = {
      id: `cp-${Date.now()}`,
      client_id: assessment.client_id,
      assessment_id: assessment.id,
      goals: `Based on assessment: ${assessment.needs_summary.substring(0, 50)}...`,
      requirements: assessment.notes,
      agreed_product_ids: assessment.recommended_product_ids,
      review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      review_interval_days: 90,
      notes: 'Auto-generated from Approved Assessment',
      status: 'ACTIVE',
      created_at: new Date().toISOString().split('T')[0],
      created_by_name: this.currentUser.name,
      ...overrides
    };

    this.activateCarePlan(newPlan);
    return newPlan;
  }

  activateCarePlan(plan: CarePlan) {
    this.carePlans = this.carePlans.map(p => 
      p.client_id === plan.client_id && p.status === 'ACTIVE' 
        ? { ...p, status: 'SUPERSEDED' as const } 
        : p
    );
    this.carePlans = [plan, ...this.carePlans];
    
    this.logTimelineEvent({
      id: `tle-${Date.now()}`,
      client_id: plan.client_id,
      event_type: 'CARE_PLAN',
      source: 'HUMAN',
      summary: 'Care Plan activated',
      timestamp: new Date().toISOString(),
      actor_name: this.currentUser.name
    });
    this.notify();
  }

  createCase(newCase: Case) {
    this.cases = [newCase, ...this.cases];
    const itemNames = newCase.line_items.map(li => this.getProductName(li.product_id)).join(', ');
    this.logTimelineEvent({
      id: `tle-${Date.now()}`,
      client_id: newCase.client_id,
      event_type: 'ORDER',
      source: 'HUMAN',
      summary: `Order #${newCase.id} submitted for ${itemNames}`,
      timestamp: new Date().toISOString(),
      actor_name: this.currentUser.name
    });
    
    // Trigger auto-allocation via agent if enabled (mock delay)
    setTimeout(() => {
        const stockAgent = this.agents.find(a => a.code === 'STOCK_CONTROLLER');
        if(stockAgent && stockAgent.status === 'ENABLED') this.runAgent(stockAgent.id);
        
        // Also trigger the new auto-allocation specific agent if present
        const autoAllocAgent = this.agents.find(a => a.id === 'agent-auto-allocation');
        if(autoAllocAgent && autoAllocAgent.status === AgentStatus.ENABLED) this.runOpsAgent(autoAllocAgent.id);
    }, 2000);

    this.notify();
  }

  logTimelineEvent(event: ClientTimelineEvent) {
    this.timeline = [event, ...this.timeline];
  }

  // --- ALLOCATION ENGINE HELPERS ---

  getAvailableDevicesByProduct(productId: string) {
    return this.devices.filter(d => d.product_id === productId && d.status === DeviceStatus.IN_STOCK);
  }

  reserveDevices(deviceIds: string[], caseId: string, clientId: string) {
    this.devices = this.devices.map(d => {
      if (deviceIds.includes(d.id)) {
        return {
          ...d,
          status: DeviceStatus.RESERVED,
          assigned_case_id: caseId,
          assigned_client_id: clientId,
          current_custodian: 'Warehouse (Reserved)',
          last_updated: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    });
  }

  // --- MANUAL ACTIONS ---
  
  createDevice(device: Device) {
    this.devices = [device, ...this.devices];
    this.notify();
  }

  createJob(job: Job) {
    this.jobs = [job, ...this.jobs];
    this.notify();
  }

  // --- OPS ACTIONS & AUTOMATION ---

  approveCase(caseId: string) {
    this.cases = this.cases.map(c => 
      c.id === caseId ? { ...c, status: CaseStatus.APPROVED } : c
    );
    const c = this.cases.find(x => x.id === caseId);
    if (c) {
      this.logTimelineEvent({
        id: `tle-${Date.now()}`,
        client_id: c.client_id,
        event_type: 'ORDER',
        source: 'HUMAN',
        summary: `Order #${c.id} Approved`,
        timestamp: new Date().toISOString(),
        actor_name: this.currentUser.name
      });
    }
    
    this.exceptions = this.exceptions.filter(e => !(e.related_entity_type === 'CASE' && e.related_entity_id === caseId));
    
    // Trigger Agent Run directly
    setTimeout(() => {
        const stockAgent = this.agents.find(a => a.code === 'STOCK_CONTROLLER');
        if(stockAgent) this.runAgent(stockAgent.id);
        
        // Also trigger the new auto-allocation specific agent
        const autoAllocAgent = this.agents.find(a => a.id === 'agent-auto-allocation');
        if(autoAllocAgent) this.runOpsAgent(autoAllocAgent.id);
    }, 1000);
    this.notify();
  }

  allocateCase(caseId: string): boolean {
    const c = this.cases.find(x => x.id === caseId);
    if (!c) return false;

    let allAllocated = true;
    const newExceptions: Exception[] = [];
    const devicesToReserve: string[] = [];

    const updatedLineItems = c.line_items.map(li => {
        if (li.status === 'ALLOCATED') return li;

        const product = this.getProduct(li.product_id);
        
        if (!product || !product.is_device) {
            return { ...li, status: 'ALLOCATED' as const };
        }

        const qtyNeeded = li.requested_qty - li.allocated_device_ids.length;
        if (qtyNeeded <= 0) return { ...li, status: 'ALLOCATED' as const };

        const available = this.getAvailableDevicesByProduct(li.product_id);
        const trulyAvailable = available.filter(d => !devicesToReserve.includes(d.id));
        const toTake = trulyAvailable.slice(0, qtyNeeded);
        const toTakeIds = toTake.map(d => d.id);
        
        devicesToReserve.push(...toTakeIds);

        const newAllocatedIds = [...li.allocated_device_ids, ...toTakeIds];
        let newStatus: CaseLineItem['status'] = 'REQUESTED';

        if (newAllocatedIds.length === li.requested_qty) {
            newStatus = 'ALLOCATED';
        } else if (newAllocatedIds.length > 0) {
            newStatus = 'PARTIAL';
            allAllocated = false;
        } else {
            newStatus = 'OUT_OF_STOCK';
            allAllocated = false;
        }

        if (newStatus !== 'ALLOCATED') {
            // FIX: Check if exception already exists before creating a new one
            const alreadyExists = this.exceptions.some(e => 
                e.related_entity_type === 'CASE' && 
                e.related_entity_id === c.id && 
                e.title.includes(product.name) && // specific to product shortage
                e.status !== 'RESOLVED'
            );

            if (!alreadyExists) {
                const severity = newStatus === 'OUT_OF_STOCK' ? 'INCIDENT' : 'WARNING';
                newExceptions.push({
                    id: `ex-${Date.now()}-${li.id}`,
                    severity: severity,
                    title: `Stock shortage: ${product.name}`,
                    description: `Case #${c.id} requires ${li.requested_qty} units. Only ${newAllocatedIds.length} allocated. Status: ${newStatus}.`,
                    related_entity_type: 'CASE',
                    related_entity_id: c.id,
                    created_by: 'STOCK_CONTROLLER',
                    human_owner_role: 'WAREHOUSE',
                    status: 'OPEN',
                    recommended_action: 'Order stock immediately or check for returns.',
                    created_at: new Date().toISOString()
                });
            }
        }

        return { ...li, allocated_device_ids: newAllocatedIds, status: newStatus };
    });

    if (devicesToReserve.length > 0) {
        this.reserveDevices(devicesToReserve, c.id, c.client_id);
    }

    if (newExceptions.length > 0) {
        this.exceptions = [...newExceptions, ...this.exceptions];
    }

    const nextStatus = allAllocated ? CaseStatus.STOCK_ALLOCATED : CaseStatus.APPROVED;
    this.cases = this.cases.map(x => x.id === caseId ? { 
        ...x, 
        line_items: updatedLineItems,
        status: nextStatus
    } : x);

    this.logTimelineEvent({
        id: `tle-alloc-${Date.now()}`,
        client_id: c.client_id,
        event_type: 'SYSTEM',
        source: 'AI',
        summary: allAllocated 
            ? `Stock allocation complete. ${devicesToReserve.length} devices reserved.` 
            : `Allocation attempted. Stock shortage detected. Exceptions raised.`,
        timestamp: new Date().toISOString(),
        actor_name: 'Stock Controller'
    });

    this.notify();
    return allAllocated;
  }

  createInstallJobsFromAllocation(caseId: string) {
      const c = this.cases.find(x => x.id === caseId);
      if(!c) return;

      const existingJob = this.jobs.find(j => j.case_id === caseId && j.type === 'INSTALL');
      if (existingJob) return;

      const newJob: Job = {
          id: `j-${Date.now()}`,
          type: 'INSTALL',
          status: JobStatus.NEEDS_SCHEDULING,
          client_name: c.client_name,
          client_id: c.client_id,
          case_id: c.id,
          confirmation_needed: false
      };
      
      this.jobs = [newJob, ...this.jobs];
      
      this.cases = this.cases.map(x => x.id === caseId ? { ...x, status: CaseStatus.INSTALLATION_PENDING } : x);

      this.logTimelineEvent({
            id: `tle-job-${Date.now()}`,
            client_id: c.client_id,
            event_type: 'ORDER',
            source: 'AI',
            summary: `Installation Job #${newJob.id} created based on allocation. Awaiting scheduling.`,
            timestamp: new Date().toISOString(),
            actor_name: 'Install Logistics'
      });
      this.notify();
  }

  // --- HELPER METHODS FOR AI EXECUTOR ---

  createException(params: any) {
    const ex: Exception = {
        id: this.uid('ex'),
        severity: params.severity,
        title: params.title,
        description: params.description,
        related_entity_type: params.related_entity_type,
        related_entity_id: params.related_entity_id,
        created_by: 'AI_AGENT',
        human_owner_role: 'MC_ADMIN',
        status: 'OPEN',
        recommended_action: 'Investigate.',
        created_at: new Date().toISOString()
    };
    this.exceptions = [ex, ...this.exceptions];
    this.notify();
  }

  addTimelineEvent(clientId: string, message: string) {
     this.logTimelineEvent({
        id: this.uid('tle'),
        client_id: clientId,
        event_type: 'SYSTEM',
        source: 'AI',
        summary: message,
        timestamp: new Date().toISOString()
     });
  }

  // --- AI OPERATION LAYER (SAFE EXECUTION ENGINE) ---

  mapAutonomy(l: AutonomyLevel): AgentAutonomy {
    if (l === AutonomyLevel.AUTO_EXECUTE) return "AUTO";
    if (l === AutonomyLevel.DRAFT_ONLY) return "DRAFT";
    return "OBSERVE";
  }

  runAgent(agentId: string) {
    this.runOpsAgent(agentId);
  }

  runOpsAgent(agent_id: string, autonomyOverride?: AgentAutonomy) {
    const agent = this.agents.find((a: any) => a.id === agent_id);
    const autonomy = autonomyOverride || this.mapAutonomy(agent?.autonomy || AutonomyLevel.OBSERVE_ONLY);
  
    const run_id = this.uid("run");
    const started_at = new Date().toISOString();
  
    const plan: AgentPlan = {
      agent_id,
      run_id,
      created_at: started_at,
      notes: [],
      actions: [],
    };
  
    // --- Agent: Orchestrator Brain ---
    if (agent?.code === 'ORCHESTRATOR') {
       const blockers = this.exceptions.filter(e => e.severity === 'BLOCKER' && e.status === 'OPEN');
       
       if (blockers.length > 0) {
          plan.actions.push({
             id: this.uid("act"),
             kind: "CREATE_EXCEPTION",
             risk: "HIGH",
             summary: `Orchestrator Alert: ${blockers.length} Blockers detected`,
             payload: {
               severity: "INCIDENT",
               title: "System Health Alert",
               description: `Orchestrator scan found ${blockers.length} active blockers. Escalating to Operations Lead.`,
               related_entity_type: "SYSTEM",
               related_entity_id: "SYS-GLOBAL"
             }
          });
       } else {
          // PROACTIVE ORCHESTRATION: If new cases exist, trigger Stock Controller
          const newCases = this.cases.filter(c => c.status === CaseStatus.NEW);
          if (newCases.length > 0) {
             const stockAgent = this.agents.find(a => a.code === 'STOCK_CONTROLLER');
             if (stockAgent && stockAgent.status === AgentStatus.ENABLED) {
                 // Trigger in next tick to avoid recursion depth issues in mock
                 setTimeout(() => this.runOpsAgent(stockAgent.id), 500); 
             }
          }

          plan.actions.push({
             id: this.uid("act"),
             kind: "ADD_TIMELINE_EVENT",
             risk: "LOW",
             summary: "System Scan Nominal",
             payload: { client_id: "SYS", message: "Orchestrator heartbeat: No blockers found. Delegated tasks." }
          });
       }
    }

    // --- Agent: Auto Allocation & Jobs ---
    if (agent_id === "agent-auto-allocation" || agent?.code === "AUTO_ALLOCATION" || agent?.code === "STOCK_CONTROLLER") {
      const pending = this.cases.filter((c: any) => c.status === "NEW" || c.status === "APPROVED" || c.status === "PROCESSING" || c.status === "STOCK_ALLOCATED");
  
      for (const c of pending) {
        const needsAlloc = (c.line_items || []).some((li: any) => li.status === "REQUESTED" || li.status === "PARTIAL" || li.status === "OUT_OF_STOCK");
        if (needsAlloc) {
          plan.actions.push({
            id: this.uid("act"),
            kind: "ALLOCATE_CASE",
            risk: "LOW",
            summary: `Allocate inventory for case ${c.id}`,
            payload: { case_id: c.id },
          });
        }
  
        const isAllocated = (c.line_items || []).every((li: any) => li.status === "ALLOCATED");
        const hasJob = this.jobs.some(j => j.case_id === c.id);
        
        if ((isAllocated || needsAlloc) && !hasJob) {
          plan.actions.push({
            id: this.uid("act"),
            kind: "CREATE_INSTALL_JOBS",
            risk: "LOW",
            summary: `Create install jobs for case ${c.id}`,
            payload: { case_id: c.id },
          });
        }
      }
    }
  
    // --- Agent: SLA / Stock Shortage Watch ---
    if (agent_id === "agent-stock-shortage-watch" || agent?.code === "STOCK_SHORTAGE_WATCH" || agent?.code === "STOCK_CONTROLLER") {
      for (const p of this.products) {
        if (!p.is_device) continue;
        const inStock = this.devices.filter((d: any) => d.product_id === p.id && d.status === "IN_STOCK").length;
        const threshold = 2;
        
        const exists = this.exceptions.some(e => e.related_entity_id === p.id && e.status === 'OPEN');

        if (inStock <= threshold && !exists) {
          plan.actions.push({
            id: this.uid("act"),
            kind: "CREATE_EXCEPTION",
            risk: "LOW",
            summary: `Low stock warning for ${p.name}`,
            payload: {
              severity: "WARNING",
              title: `Low stock: ${p.name}`,
              description: `IN_STOCK count is ${inStock} (threshold ${threshold}).`,
              related_entity_type: "PRODUCT",
              related_entity_id: p.id,
            },
          });
        }
      }
    }
  
    // --- Agent: Confirmation Reminders & Status Confirmation ---
    if (agent_id === "agent-confirmation-reminders" || agent?.code === "CONFIRMATION_REMINDERS" || agent?.code === "STATUS_CONFIRMATION") {
      // 1. Process Existing Pending Confirmations
      const pendingConf = this.confirmations?.filter((x: any) => x.status === "PENDING") || [];
      for (const conf of pendingConf) {
        plan.actions.push({
          id: this.uid("act"),
          kind: "SEND_REMINDER",
          risk: "LOW",
          summary: `Reminder for confirmation ${conf.id}`,
          payload: {
            client_id: conf.client_id,
            message: `Please complete confirmation: ${conf.type}`,
          },
        });
      }

      // 2. Scan for "Dormant" risks (Mocking > 90 days inactive)
      if (agent?.code === 'STATUS_CONFIRMATION') {
         // Mock: Simply pick one active device to flag as a demo
         const activeDevices = this.devices.filter(d => d.status === DeviceStatus.INSTALLED_ACTIVE && !d.confirmation_needed);
         if (activeDevices.length > 0) {
             const target = activeDevices[0];
             plan.actions.push({
                 id: this.uid("act"),
                 kind: "FLAG_DEVICE_CONFIRMATION", // CORRECTED ACTION KIND
                 risk: "LOW",
                 summary: `Flagged device ${target.serial_number} for status check (90 days).`,
                 payload: { 
                     device_id: target.id,
                     client_id: target.assigned_client_id || 'SYS', 
                     message: `Routine Status Check initiated for device ${target.serial_number}. Confirmation requested from care company.` 
                 }
             });
         }
      }
    }

    // --- Agent: Install Logistics ---
    if (agent?.code === 'INSTALL_LOGISTICS') {
       const needsScheduling = this.jobs.filter(j => j.status === 'NEEDS_SCHEDULING');
       for (const job of needsScheduling) {
          plan.actions.push({
             id: this.uid("act"),
             kind: "SEND_REMINDER",
             risk: "MEDIUM",
             summary: `Scheduling outreach for Job #${job.id}`,
             payload: { client_id: job.client_id, message: "Scheduling request sent to client/installer." }
          });
          
          // AUTO-ASSIGNMENT LOGIC FOR DEMO
          if (!job.installer_name) {
             plan.actions.push({
               id: this.uid("act"),
               kind: "CREATE_INSTALL_JOBS", // Reuse this kind to trigger assignment logic in apply
               risk: "LOW",
               summary: `Auto-assign installer for Job #${job.id}`,
               payload: { job_id: job.id, installer: "Bob Builder" }
             });
          }
       }
    }

    // --- Agent: Returns Recovery ---
    if (agent?.code === 'RETURNS_RECOVERY') {
       // 1. Check for dormant devices that need return
       const dormantDevices = this.devices.filter(d => d.status === DeviceStatus.DORMANT && !this.jobs.some(j => j.type === 'RETURN' && j.client_id === d.assigned_client_id));
       
       for (const d of dormantDevices) {
           // Create actual return jobs for dormant devices
           plan.actions.push({
               id: this.uid("act"),
               kind: "CREATE_RETURN_JOB",
               risk: "LOW",
               summary: `Create Return Job for dormant device ${d.serial_number}`,
               payload: {
                   device_id: d.id,
                   client_id: d.assigned_client_id,
                   client_name: d.current_custodian.replace('Client: ', '')
               }
           });
       }

       // 2. Chase pending returns
       const returnsPending = this.jobs.filter(j => j.type === 'RETURN' && j.status === 'NEEDS_SCHEDULING');
       if (returnsPending.length > 0) {
          plan.actions.push({
             id: this.uid("act"),
             kind: "SEND_REMINDER",
             risk: "LOW",
             summary: `Generated return labels for ${returnsPending.length} pending returns.`,
             payload: { client_id: "SYS", message: "Return labels generated." }
          });
       }
    }

    // --- Agent: Comms Agent (Mock Logic) ---
    if (agent?.code === 'COMMS_AGENT') {
       const highPriority = this.messages.filter(m => m.priority === 'HIGH' && !m.is_read);
       if (highPriority.length > 0) {
          plan.actions.push({
             id: this.uid("act"),
             kind: "ADD_TIMELINE_EVENT",
             risk: "LOW",
             summary: "Urgent Message Escalation",
             payload: { client_id: "SYS", message: `Escalated ${highPriority.length} high priority messages to Ops channel.` }
          });
       }
    }

    // --- Agent: Compliance Audit (Mock Logic) ---
    if (agent?.code === 'COMPLIANCE_AUDIT') {
       const auditIssues = this.devices.filter(d => !d.current_custodian);
       if (auditIssues.length > 0) {
          plan.actions.push({
             id: this.uid("act"),
             kind: "CREATE_EXCEPTION",
             risk: "HIGH",
             summary: "Audit Failed: Missing Custodian",
             payload: {
               severity: "BLOCKER",
               title: "Compliance Audit Failure",
               description: `Found ${auditIssues.length} devices with undefined custody.`,
               related_entity_type: "SYSTEM",
               related_entity_id: "AUDIT-001"
             }
          });
       }
    }

    // --- Agent: Reporting Agent (Mock Logic) ---
    if (agent?.code === 'REPORTING_AGENT') {
       plan.actions.push({
          id: this.uid("act"),
          kind: "ADD_TIMELINE_EVENT",
          risk: "LOW",
          summary: "Daily Report Generated",
          payload: { client_id: "SYS", message: "Daily accountability report generated and emailed to CEO." }
       });
    }
  
    // Execute if allowed
    const applied_actions = this.applyAgentPlan(plan, autonomy);
  
    const finished_at = new Date().toISOString();
  
    const runLog: AgentRunLog = {
      id: run_id,
      agent_id,
      started_at,
      finished_at,
      autonomy,
      kill_switch: this.killSwitch,
      plan,
      applied_actions,
    };

    this.agentRunLogs.unshift(runLog);
  
    // Update agent last_run & logs for UI
    if (agent) {
      agent.last_run = 'Just now';
      if (applied_actions.length > 0) {
          agent.logs = [...applied_actions.map(act => `[${act.status}] ${act.message || 'Action processed'}`), ...agent.logs].slice(0, 50);
      } else {
          agent.logs = [`[OK] Scan complete. No actions needed.`, ...agent.logs].slice(0, 50);
      }
    }
    
    this.notify();
    return { plan, applied_actions };
  }

  applyAgentPlan(plan: AgentPlan, autonomy: AgentAutonomy) {
    const applied: { action_id: string; status: "APPLIED" | "SKIPPED" | "FAILED"; message?: string }[] = [];
  
    const isAutoAllowed = (action: AgentAction) => {
      if (autonomy !== "AUTO") return false;
      return action.risk === "LOW";
    };
  
    for (const action of plan.actions) {
      try {
        if (this.killSwitch) {
          applied.push({ action_id: action.id, status: "SKIPPED", message: "Kill switch enabled" });
          continue;
        }
  
        if (autonomy === "OBSERVE") {
          applied.push({ action_id: action.id, status: "SKIPPED", message: "Observe mode" });
          continue;
        }
  
        if (autonomy === "DRAFT") {
          applied.push({ action_id: action.id, status: "SKIPPED", message: "Draft mode" });
          const agent = this.agents.find(a => a.id === plan.agent_id);
          if (agent) this.createDraftTask(agent, action);
          continue;
        }
  
        if (!isAutoAllowed(action)) {
          applied.push({ action_id: action.id, status: "SKIPPED", message: "Risk too high for AUTO" });
          const agent = this.agents.find(a => a.id === plan.agent_id);
          if (agent) this.createDraftTask(agent, action);
          continue;
        }
  
        // Execute actions
        switch (action.kind) {
          case "CREATE_EXCEPTION": {
            const p = action.payload;
            this.createException({
              severity: p.severity,
              title: p.title,
              description: p.description,
              related_entity_type: p.related_entity_type,
              related_entity_id: p.related_entity_id,
            });
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          case "ACK_EXCEPTION": {
            this.acknowledgeException(action.payload.exception_id, 'AI_AUTO');
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          case "RESOLVE_EXCEPTION": {
            this.resolveException(action.payload.exception_id, action.payload.resolution_note || "Resolved by AI automation");
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          case "ALLOCATE_CASE": {
            this.allocateCase(action.payload.case_id);
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          case "CREATE_INSTALL_JOBS": {
            if (action.payload.job_id && action.payload.installer) {
               // Special logic for assignment
               this.jobs = this.jobs.map(j => j.id === action.payload.job_id ? { ...j, installer_name: action.payload.installer } : j);
            } else {
               this.createInstallJobsFromAllocation(action.payload.case_id);
            }
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }

          case "CREATE_RETURN_JOB": {
            const p = action.payload;
            this.createJob({
                id: this.uid('j'),
                type: 'RETURN',
                status: JobStatus.NEEDS_SCHEDULING,
                client_name: p.client_name || 'Unknown',
                client_id: p.client_id,
                confirmation_needed: false,
                installer_name: 'Bob Builder' // AUTO ASSIGN FOR DEMO VISIBILITY
            });
            // Update device status to indicate return flow started
            this.devices = this.devices.map(d => d.id === p.device_id ? { ...d, status: DeviceStatus.AWAITING_RETURN } : d);
            
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }

          case "FLAG_DEVICE_CONFIRMATION": {
            const p = action.payload;
            // Actually update device state to trigger UI
            this.devices = this.devices.map(d => d.id === p.device_id ? { ...d, confirmation_needed: true } : d);
            // Also log the event
            this.addTimelineEvent(p.client_id, p.message);
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          case "SEND_REMINDER": {
            this.addTimelineEvent(action.payload.client_id, `Reminder sent: ${action.payload.message}`);
            applied.push({ action_id: action.id, status: "APPLIED", message: "Logged reminder (v1)" });
            break;
          }
  
          case "ADD_TIMELINE_EVENT": {
            this.addTimelineEvent(action.payload.client_id, action.payload.message);
            applied.push({ action_id: action.id, status: "APPLIED" });
            break;
          }
  
          default:
            applied.push({ action_id: action.id, status: "SKIPPED", message: "Unknown action kind" });
        }
      } catch (err: any) {
        applied.push({ action_id: action.id, status: "FAILED", message: err?.message || "Unknown error" });
      }
    }
  
    return applied;
  }

  startAgentLoop() {
    if ((this as any)._agentLoop) return;
  
    (this as any)._agentLoop = setInterval(() => {
      if (this.killSwitch) return;
  
      for (const a of this.agents) {
        if (a.status !== AgentStatus.ENABLED) continue;
        if (a.autonomy === AutonomyLevel.AUTO_EXECUTE) {
          try { this.runOpsAgent(a.id); } catch {}
        }
      }
    }, 60_000);
  }

  createDraftTask(agent: Agent, action: AgentAction) {
     const msg: Message = {
        id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        category: 'SYSTEM_NOTIFICATION',
        sender_type: 'AI',
        sender_name: agent.name,
        sender_role: 'AGENT',
        recipient_group: 'MC_ADMIN',
        subject: `Approval Needed: ${action.kind}`,
        preview: action.summary,
        body: `I propose to execute: ${action.kind}\nSummary: ${action.summary}\n\nRisk Level: ${action.risk}\nPayload: ${JSON.stringify(action.payload, null, 2)}`,
        priority: action.risk === 'HIGH' ? 'HIGH' : 'NORMAL',
        is_read: false,
        timestamp: new Date().toLocaleTimeString(),
        tags: ['Draft', 'Approval'],
        action_required: true
     };
     this.sendMessage(msg);
  }

  updateAgent(agentId: string, updates: Partial<Agent>) {
    this.agents = this.agents.map(a => 
      a.id === agentId ? { ...a, ...updates } : a
    );
    this.notify();
  }

  acknowledgeException(id: string, userId: string) {
    this.exceptions = this.exceptions.map(e => 
      e.id === id ? { ...e, status: 'ACKNOWLEDGED', human_owner_user_id: userId } : e
    );
    this.notify();
  }

  resolveException(id: string, note: string) {
    this.exceptions = this.exceptions.map(e => 
      e.id === id ? { ...e, status: 'RESOLVED', resolved_at: new Date().toISOString() } : e
    );
    console.log(`Exception ${id} resolved with note: ${note}`);
    this.notify();
  }

  addClient(client: Client) {
    this.clients = [...this.clients, client];
    this.notify();
  }

  createClient(partialClient: Partial<Client>) {
    const newClient: Client = {
        id: `cl-${Date.now()}`,
        full_name: partialClient.full_name || 'Unnamed',
        dob: partialClient.dob || 'Unknown',
        care_company_name: partialClient.care_company_name || 'Unknown',
        care_company_id: partialClient.care_company_id || 'unknown',
        status: 'ACTIVE',
        address: partialClient.address || 'Unknown',
        phone: partialClient.phone,
        email: partialClient.email,
        emergency_contacts: [],
        risk_level: 'LOW',
        ...partialClient
    };
    this.clients = [...this.clients, newClient];
    this.notify();
    return newClient;
  }

  updateClient(id: string, updates: Partial<Client>) {
    this.clients = this.clients.map(c => 
        c.id === id ? { ...c, ...updates } : c
    );
    this.notify();
  }

  confirmDevice(id: string, note?: string) {
    this.devices = this.devices.map(d => d.id === id ? { ...d, confirmation_needed: false, last_updated: 'Just now' } : d);
    this.notify();
  }

  rescheduleJob(id: string, newDate: string) {
    this.jobs = this.jobs.map(j => j.id === id ? { ...j, scheduled_for: newDate, status: JobStatus.SCHEDULED } : j);
    this.notify();
  }

  // UPDATED: Confirm Schedule (Care Company Side)
  confirmJobSchedule(id: string, note?: string) {
    this.jobs = this.jobs.map(j => j.id === id ? { ...j, confirmation_needed: false, status: JobStatus.CONFIRMED } : j);
    this.notify();
  }

  // UPDATED: Complete Job (Installer Side) + Auto-Status Update
  completeJob(id: string, note?: string) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) return;

    // 1. Mark Job Completed
    this.jobs = this.jobs.map(j => j.id === id ? { ...j, confirmation_needed: false, status: JobStatus.COMPLETED } : j);

    // 2. Auto-Update Device Status
    if (job.case_id) {
        // Find devices allocated to this case
        this.devices = this.devices.map(d => {
            if (d.assigned_case_id === job.case_id) {
                // For Install Job -> Move to INSTALLED_ACTIVE
                if (job.type === 'INSTALL') {
                    return { ...d, status: DeviceStatus.INSTALLED_ACTIVE, current_custodian: `Client: ${job.client_name}`, last_updated: 'Just now' };
                }
                // For Return Job -> Move to IN_TRANSIT
                if (job.type === 'RETURN') {
                    return { ...d, status: DeviceStatus.IN_TRANSIT, current_custodian: 'Logistics Partner', last_updated: 'Just now' };
                }
            }
            return d;
        });
        
        // 3. Update Case Status if all jobs done
        const caseJobs = this.jobs.filter(j => j.case_id === job.case_id && j.id !== job.id);
        const allDone = caseJobs.every(j => j.status === JobStatus.COMPLETED);
        if (allDone) {
            if (job.type === 'INSTALL') {
                this.cases = this.cases.map(c => c.id === job.case_id ? { ...c, status: CaseStatus.ACTIVE_SERVICE } : c);
            }
        }
    } else if (job.type === 'RETURN') {
        // Handle Return jobs without case_id (adhoc) - logic usually tries to find device by client
        // Simplified for this scope
    }

    this.notify();
  }

  batchAcknowledgeWarnings() {
    this.exceptions = this.exceptions.map(e => e.severity === 'WARNING' && e.status === 'OPEN' ? { ...e, status: 'ACKNOWLEDGED', human_owner_user_id: this.currentUser.id } : e);
    this.notify();
  }

  sendReminders() {
    console.log("Sending reminders for scheduled jobs...");
  }

  endClientService(clientId: string) {
    // 1. Mark Client as ENDED
    this.clients = this.clients.map(c => c.id === clientId ? { ...c, status: 'ENDED' } : c);

    // 2. Mark assigned devices as DORMANT to trigger Returns Recovery agent
    this.devices = this.devices.map(d => {
      if (d.assigned_client_id === clientId && d.status === DeviceStatus.INSTALLED_ACTIVE) {
        return { ...d, status: DeviceStatus.DORMANT, current_custodian: 'Client (Service Ended)' };
      }
      return d;
    });

    // 3. Log Event
    this.logTimelineEvent({
      id: `tle-${Date.now()}`,
      client_id: clientId,
      event_type: 'SYSTEM',
      source: 'HUMAN',
      summary: 'Service Ended by Lead Nurse. Devices marked Dormant for recovery.',
      timestamp: new Date().toISOString(),
      actor_name: this.currentUser.name
    });

    // 4. Close any open cases
    this.cases = this.cases.map(c => c.client_id === clientId && c.status !== CaseStatus.CLOSED ? { ...c, status: CaseStatus.CLOSED } : c);

    // Trigger AI run
    const returnsAgent = this.agents.find(a => a.code === 'RETURNS_RECOVERY');
    if (returnsAgent) this.runOpsAgent(returnsAgent.id);

    this.notify();
  }

  // --- MESSAGING ---

  markMessageRead(id: string) {
    this.messages = this.messages.map(m => m.id === id ? { ...m, is_read: true } : m);
    this.notify();
  }

  sendMessage(msg: Message) {
    this.messages = [msg, ...this.messages];
    this.notify();
  }

  approveMessageAction(id: string) {
    const msg = this.messages.find(m => m.id === id);
    if (msg && msg.action_required) {
       this.messages = this.messages.map(m => m.id === id ? { ...m, action_required: false, tags: [...m.tags, 'Approved'] } : m);
       this.notify();
    }
  }
}

export const store = new Store();

export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    return store.subscribe(() => setTick(t => t + 1));
  }, []);
  return store;
}
