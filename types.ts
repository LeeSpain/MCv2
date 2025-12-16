export enum Role {
  MC_ADMIN = 'MC_ADMIN',
  MC_OPERATIONS = 'MC_OPERATIONS',
  CEO = 'CEO',
  CARE_COMPANY_LEAD_NURSE = 'CARE_COMPANY_LEAD_NURSE',
  CARE_COMPANY_NURSE = 'CARE_COMPANY_NURSE',
  INSTALLER = 'INSTALLER'
}

export enum DeviceStatus {
  IN_STOCK = 'IN_STOCK',
  RESERVED = 'RESERVED',
  WITH_INSTALLER = 'WITH_INSTALLER',
  SHIPPED = 'SHIPPED',
  INSTALLATION_SCHEDULED = 'INSTALLATION_SCHEDULED',
  INSTALLED_ACTIVE = 'INSTALLED_ACTIVE',
  DORMANT = 'DORMANT',
  AWAITING_RETURN = 'AWAITING_RETURN',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  REFURBISHING = 'REFURBISHING',
  RETIRED = 'RETIRED'
}

export enum CaseStatus {
  NEW = 'NEW',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  STOCK_ALLOCATED = 'STOCK_ALLOCATED',
  INSTALLATION_PENDING = 'INSTALLATION_PENDING',
  INSTALLED = 'INSTALLED',
  ACTIVE_SERVICE = 'ACTIVE_SERVICE',
  RETURN_PENDING = 'RETURN_PENDING',
  CLOSED = 'CLOSED'
}

export enum JobStatus {
  NEEDS_SCHEDULING = 'NEEDS_SCHEDULING',
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  RESCHEDULE_REQUIRED = 'RESCHEDULE_REQUIRED'
}

export enum AgentStatus {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED'
}

export enum AutonomyLevel {
  OBSERVE_ONLY = 'OBSERVE_ONLY',
  DRAFT_ONLY = 'DRAFT_ONLY',
  AUTO_EXECUTE = 'AUTO_EXECUTE'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  care_company_id?: string;
}

export interface Client {
  id: string;
  full_name: string;
  dob: string;
  care_company_name: string;
  care_company_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ENDED' | 'DECEASED';
  address: string;
  email?: string;
  phone?: string;
  emergency_contacts: { name: string; relation: string; phone: string }[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AiAnalysisSnapshot {
  suggested_devices: string[];
  suggested_services: string[];
  risk_flags: string[];
  reasoning: string;
  confidence_score: number;
}

export interface Assessment {
  id: string;
  client_id: string;
  performed_by_name: string;
  assessment_date: string;
  type: 'INITIAL' | 'REVIEW' | 'CHANGE_OF_CONDITION';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  needs_summary: string;
  recommended_services: string[];
  recommended_devices: string[];
  notes: string;
  status: 'DRAFT' | 'APPROVED';
  created_at: string;
  ai_analysis?: AiAnalysisSnapshot;
}

export interface CarePlan {
  id: string;
  client_id: string;
  assessment_id?: string;
  goals: string;
  requirements: string;
  agreed_services: string[];
  agreed_devices: string[];
  review_date: string;
  review_interval_days: number;
  notes: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'CLOSED';
  created_at: string;
  created_by_name: string;
}

export interface ClientTimelineEvent {
  id: string;
  client_id: string;
  event_type: 'ASSESSMENT' | 'CARE_PLAN' | 'ORDER' | 'DEVICE' | 'SYSTEM';
  source: 'AI' | 'HUMAN';
  summary: string;
  timestamp: string;
  actor_name?: string;
  related_entity_id?: string;
}

export interface Device {
  id: string;
  serial_number: string;
  product_name: string;
  status: DeviceStatus;
  current_custodian: string;
  last_updated: string;
  sla_breach?: boolean;
  confirmation_needed?: boolean;
  assigned_client_id?: string;
}

export interface Case {
  id: string;
  client_id: string;
  client_name: string;
  status: CaseStatus;
  created_at: string;
  items: string[]; 
  care_company_id?: string;
  care_plan_id?: string;
}

export interface Job {
  id: string;
  type: 'INSTALL' | 'RETURN';
  status: JobStatus;
  client_name: string;
  client_id?: string;
  scheduled_for?: string;
  installer_name?: string;
  confirmation_needed?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  code: string;
  description: string;
  owner_team: string;
  status: AgentStatus;
  autonomy: AutonomyLevel;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  schedule_type: 'INTERVAL' | 'CRON' | 'MANUAL';
  schedule_value: string;
  data_scope: string;
  system_instructions: string;
  behavior_rules: string;
  allowed_actions: Record<string, string[]>;
  restricted_actions: Record<string, string[]>;
  escalation_policy: string;
  examples: string[]; 
  languages: string[];
  last_run: string;
  logs: string[];
}

export interface Exception {
  id: string;
  severity: 'WARNING' | 'INCIDENT' | 'BLOCKER';
  title: string;
  description: string;
  related_entity_type: 'DEVICE' | 'CASE' | 'JOB' | 'RETURN';
  related_entity_id: string;
  created_by: string; 
  human_owner_role: string;
  human_owner_user_id?: string; 
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  recommended_action: string;
  created_at: string;
  resolved_at?: string;
}