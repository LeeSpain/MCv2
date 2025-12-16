
import { useState, useEffect } from 'react';
import { 
  MOCK_DEVICES, MOCK_CASES, MOCK_JOBS, MOCK_AGENTS, MOCK_EXCEPTIONS, 
  MOCK_USERS, MOCK_CLIENTS, MOCK_CARE_PLANS, MOCK_ASSESSMENTS, MOCK_TIMELINE, MOCK_MESSAGES,
  MOCK_PRODUCTS 
} from './mockData';
import { 
  User, Role, Agent, AgentStatus, AutonomyLevel, 
  CaseStatus, Client, CarePlan, Assessment, ClientTimelineEvent, Case, AiAnalysisSnapshot, Message 
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

  // --- AI INTAKE SIMULATION ---

  analyzeAssessment(text: string): AiAnalysisSnapshot {
    const t = (text || "").toLowerCase();

    // Always recommend monitoring service as baseline (you can change this later)
    const suggested_product_ids: string[] = ["svc-monitoring"];
    const risk_flags: string[] = [];
    let confidence = 0.72;

    // Helper: add unique IDs
    const add = (id: string) => {
      if (!suggested_product_ids.includes(id)) suggested_product_ids.push(id);
    };

    // Basic rules (v1)
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

    // Hub logic: if SOS recommended, ensure hub
    if (suggested_product_ids.includes("prod-sos") || suggested_product_ids.includes("prod-fall-sensor")) {
      add("prod-hub");
    }

    // Clamp confidence 0..0.95
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
    
    // If it's a draft, just save it
    if (assessment.status === 'DRAFT') {
      this.notify();
      return;
    }

    // If approved, log to timeline
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
      a.id === id ? { 
        ...a, 
        status: 'APPROVED', 
        recommended_product_ids: productIds
      } : a
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
    // Supersede old plans for this client
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
    const itemNames = this.getProductIdsToNames(newCase.product_ids).join(', ');
    this.logTimelineEvent({
      id: `tle-${Date.now()}`,
      client_id: newCase.client_id,
      event_type: 'ORDER',
      source: 'HUMAN',
      summary: `Order #${newCase.id} submitted for ${itemNames}`,
      timestamp: new Date().toISOString(),
      actor_name: this.currentUser.name
    });
    
    // Simulate AI handover
    setTimeout(() => {
       this.logTimelineEvent({
        id: `tle-ai-${Date.now()}`,
        client_id: newCase.client_id,
        event_type: 'SYSTEM',
        source: 'AI',
        summary: `Handover complete. Stock allocation in progress for Order #${newCase.id}`,
        timestamp: new Date().toISOString(),
        actor_name: 'STOCK_CONTROLLER'
      });
      this.notify();
    }, 1500);

    this.notify();
  }

  logTimelineEvent(event: ClientTimelineEvent) {
    this.timeline = [event, ...this.timeline];
    // No notify here to avoid double render if called from other actions, logic handled by parent action
  }

  // --- OPS ACTIONS ---

  approveCase(caseId: string) {
    this.cases = this.cases.map(c => 
      c.id === caseId ? { ...c, status: 'APPROVED' as any } : c
    );
    const c = this.cases.find(c => c.id === caseId);
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
    this.notify();
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

  runAgent(agentId: string) {
    if (this.killSwitch) return;
    this.agents = this.agents.map(a => {
      if (a.id === agentId) {
        let actionLog = '';
        const timestamp = new Date().toLocaleTimeString();
        if (a.autonomy === AutonomyLevel.AUTO_EXECUTE) {
           actionLog = `[AUTO] Executed safe actions: ${a.allowed_actions.auto_execute[0] || 'none'}`;
        } else if (a.autonomy === AutonomyLevel.DRAFT_ONLY) {
           actionLog = `[DRAFT] Created draft for: ${a.allowed_actions.draft_only[0] || 'none'}`;
        } else {
           actionLog = `[OBSERVE] Scanned system. No actions taken.`;
        }
        return { 
          ...a, 
          last_run: 'Just now',
          logs: [`${timestamp} ${actionLog}`, ...a.logs].slice(0, 15)
        };
      }
      return a;
    });
    this.notify();
  }

  addClient(client: Client) {
    this.clients = [...this.clients, client];
    this.notify();
  }

  confirmDevice(id: string, note?: string) {
    this.devices = this.devices.map(d => d.id === id ? { ...d, confirmation_needed: false, last_updated: 'Just now' } : d);
    this.notify();
  }

  confirmJob(id: string, note?: string) {
    this.jobs = this.jobs.map(j => j.id === id ? { ...j, confirmation_needed: false } : j);
    this.notify();
  }

  batchAcknowledgeWarnings() {
    this.exceptions = this.exceptions.map(e => e.severity === 'WARNING' && e.status === 'OPEN' ? { ...e, status: 'ACKNOWLEDGED', human_owner_user_id: this.currentUser.id } : e);
    this.notify();
  }

  sendReminders() {
    console.log("Sending reminders for scheduled jobs...");
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
    this.messages = this.messages.map(m => m.id === id ? { ...m, action_required: false, tags: [...m.tags, 'Approved'] } : m);
    // Logic to actually trigger the approved action would go here (e.g., executing the agent draft)
    this.notify();
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
