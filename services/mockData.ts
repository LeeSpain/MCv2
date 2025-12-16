import { Role, DeviceStatus, CaseStatus, JobStatus, AgentStatus, AutonomyLevel, Device, Case, Job, Agent, Exception, Client, CarePlan, Assessment, ClientTimelineEvent } from '../types';

// Helper for dynamic dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const lastMonth = new Date(today);
lastMonth.setDate(lastMonth.getDate() - 30);

const fmtDate = (d: Date, time = '') => `${d.toISOString().split('T')[0]}${time ? ' ' + time : ''}`;

export const MOCK_USERS = [
  { id: 'u1', name: 'Martijn (CEO)', role: Role.CEO },
  { id: 'u2', name: 'Admin Ops (Sysadmin)', role: Role.MC_ADMIN },
  { id: 'u3', name: 'Sarah (Operations)', role: Role.MC_OPERATIONS },
  { id: 'u4', name: 'Nurse Joy (Lead)', role: Role.CARE_COMPANY_LEAD_NURSE, care_company_id: 'cc1' },
  { id: 'u5', name: 'Nurse Ann (Care)', role: Role.CARE_COMPANY_NURSE, care_company_id: 'cc1' },
  { id: 'u6', name: 'Bob Builder (Installer)', role: Role.INSTALLER },
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'cl1', 
    full_name: 'Jan Jansen', 
    dob: '1945-03-12',
    care_company_name: 'Thuiszorg West', 
    care_company_id: 'cc1', 
    status: 'ACTIVE', 
    address: 'Dorpsstraat 1, 1234 AB, Amsterdam',
    email: 'jan.jansen@example.com',
    phone: '06-12345678',
    emergency_contacts: [
      { name: 'Maria Jansen (Daughter)', relation: 'Daughter', phone: '06-87654321' }
    ],
    risk_level: 'MEDIUM'
  },
  { 
    id: 'cl2', 
    full_name: 'Gerrit Groot', 
    dob: '1950-11-22',
    care_company_name: 'Zorg & Co', 
    care_company_id: 'cc2', 
    status: 'ACTIVE', 
    address: 'Hoofdweg 99, 4321 XY, Rotterdam',
    phone: '010-9876543',
    emergency_contacts: [],
    risk_level: 'LOW'
  },
  { 
    id: 'cl3', 
    full_name: 'Maria Klein', 
    dob: '1938-05-05',
    care_company_name: 'Thuiszorg West', 
    care_company_id: 'cc1', 
    status: 'ACTIVE', 
    address: 'Kerkplein 4, 5678 CD, Utrecht',
    emergency_contacts: [],
    risk_level: 'HIGH'
  },
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'as1',
    client_id: 'cl1',
    performed_by_name: 'Nurse Joy',
    assessment_date: '2023-01-09',
    type: 'INITIAL',
    risk_level: 'MEDIUM',
    needs_summary: 'Client lives alone, experiencing mild balance issues. Has history of falls. Cognitive function is good.',
    recommended_services: ['24/7 Monitoring'],
    recommended_devices: ['Smart Hub', 'Fall Sensor'],
    notes: 'Prioritize fall detection installation.',
    status: 'APPROVED',
    created_at: '2023-01-09'
  }
];

export const MOCK_CARE_PLANS: CarePlan[] = [
  { 
    id: 'cp1', 
    client_id: 'cl1', 
    assessment_id: 'as1',
    goals: 'Maintain independence at home safely. Reduce anxiety for family.', 
    requirements: 'Fall detection, Daily activity monitoring',
    agreed_services: ['24/7 Monitoring'],
    agreed_devices: ['Smart Hub', 'Fall Sensor'],
    review_date: fmtDate(tomorrow), 
    review_interval_days: 90,
    notes: 'Client is hard of hearing. Installer to use visual aids during demo.', 
    status: 'ACTIVE',
    created_at: '2023-01-10',
    created_by_name: 'Nurse Joy'
  },
  { 
    id: 'cp3', 
    client_id: 'cl3', 
    goals: 'Medication adherence support.', 
    requirements: 'Smart pill dispenser', 
    agreed_services: ['Medication Support'],
    agreed_devices: ['Med Dispenser'],
    review_date: '2024-02-01', 
    review_interval_days: 180,
    notes: 'Family visits weekly.', 
    status: 'ACTIVE',
    created_at: '2023-10-25',
    created_by_name: 'Nurse Joy'
  },
];

export const MOCK_TIMELINE: ClientTimelineEvent[] = [
  { id: 'tle1', client_id: 'cl1', event_type: 'ASSESSMENT', source: 'HUMAN', summary: 'Initial Assessment completed by Nurse Joy', timestamp: '2023-01-09T10:00:00Z', actor_name: 'Nurse Joy' },
  { id: 'tle2', client_id: 'cl1', event_type: 'CARE_PLAN', source: 'HUMAN', summary: 'Care Plan CP1 created and approved', timestamp: '2023-01-10T09:30:00Z', actor_name: 'Nurse Joy' },
  { id: 'tle3', client_id: 'cl1', event_type: 'ORDER', source: 'HUMAN', summary: 'Case #C1 created based on Care Plan', timestamp: '2023-01-10T09:45:00Z', actor_name: 'Nurse Joy' },
  { id: 'tle4', client_id: 'cl1', event_type: 'SYSTEM', source: 'AI', summary: 'Stock allocated for Case #C1', timestamp: '2023-01-11T08:00:00Z', actor_name: 'STOCK_CONTROLLER' },
  { id: 'tle5', client_id: 'cl1', event_type: 'DEVICE', source: 'HUMAN', summary: 'Smart Hub (MC-2024-001) Installed', timestamp: '2023-01-15T14:30:00Z', actor_name: 'Bob Builder' },
];

export const MOCK_DEVICES: Device[] = [
  { id: 'd1', serial_number: 'MC-2024-001', product_name: 'Smart Hub', status: DeviceStatus.INSTALLED_ACTIVE, current_custodian: 'Client: Jan Jansen', assigned_client_id: 'cl1', last_updated: fmtDate(yesterday), confirmation_needed: true },
  { id: 'd2', serial_number: 'MC-2024-002', product_name: 'Smart Hub', status: DeviceStatus.IN_STOCK, current_custodian: 'Warehouse', last_updated: fmtDate(today) },
  { id: 'd3', serial_number: 'MC-2024-003', product_name: 'Fall Sensor', status: DeviceStatus.AWAITING_RETURN, current_custodian: 'Client: Piet Puk', last_updated: '2023-10-01', sla_breach: true },
  { id: 'd4', serial_number: 'MC-2024-004', product_name: 'Smart Hub', status: DeviceStatus.WITH_INSTALLER, current_custodian: 'Installer: Bob', last_updated: fmtDate(today) },
  { id: 'd5', serial_number: 'MC-2024-005', product_name: 'Med Dispenser', status: DeviceStatus.DORMANT, current_custodian: 'Client: Sara Lee', last_updated: '2023-09-15', sla_breach: true },
  { id: 'd6', serial_number: 'MC-2024-006', product_name: 'Med Dispenser', status: DeviceStatus.INSTALLED_ACTIVE, current_custodian: 'Client: Gerrit Groot', assigned_client_id: 'cl2', last_updated: fmtDate(yesterday) },
];

export const MOCK_CASES: Case[] = [
  { id: 'c1', client_id: 'cl1', client_name: 'Jan Jansen', care_company_id: 'cc1', status: CaseStatus.ACTIVE_SERVICE, created_at: '2023-10-01', items: ['Smart Hub'] },
  { id: 'c2', client_id: 'cl2', client_name: 'Gerrit Groot', care_company_id: 'cc2', status: CaseStatus.NEW, created_at: fmtDate(today), items: ['Med Dispenser', 'Fall Sensor'] },
  { id: 'c3', client_id: 'cl3', client_name: 'Maria Klein', care_company_id: 'cc1', status: CaseStatus.INSTALLATION_PENDING, created_at: fmtDate(yesterday), items: ['Smart Hub'] },
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', type: 'INSTALL', status: JobStatus.SCHEDULED, client_name: 'Maria Klein', client_id: 'cl3', scheduled_for: fmtDate(today, '14:00'), installer_name: 'Bob Builder', confirmation_needed: true },
  { id: 'j2', type: 'RETURN', status: JobStatus.NEEDS_SCHEDULING, client_name: 'Piet Puk', scheduled_for: undefined },
  { id: 'j3', type: 'INSTALL', status: JobStatus.MISSED, client_name: 'Gerrit Groot', client_id: 'cl2', scheduled_for: fmtDate(yesterday, '10:00'), installer_name: 'Bob Builder' },
];

export const MOCK_AGENTS: Agent[] = [
  { 
    id: 'a0', 
    name: 'Orchestrator Brain', 
    code: 'ORCHESTRATOR', 
    description: 'Coordinates specialist agents. Monitors system events and prioritizes next actions.',
    owner_team: 'Operations',
    status: AgentStatus.ENABLED, 
    autonomy: AutonomyLevel.OBSERVE_ONLY, 
    risk_level: 'HIGH',
    schedule_type: 'INTERVAL',
    schedule_value: '10m',
    data_scope: 'ALL',
    system_instructions: 'You are the Orchestrator Brain. Your job is coordination only. Do not execute core actions directly. Delegate to specialist agents.',
    behavior_rules: '1) Scan for flags, overdue SLA. 2) Prioritize BLOCKER > INCIDENT > WARNING. 3) Delegate to specialists.',
    allowed_actions: {
      observe: ["scan_flags","scan_overdue_sla","scan_jobs","scan_returns","generate_run_summary"],
      draft_only: ["create_tasks","create_draft_messages"],
      auto_execute: ["trigger_agent_run"]
    },
    restricted_actions: { never: ["delete_any_data","set_device_status","advance_case_status"] },
    escalation_policy: 'BLOCKER: Assign human owner immediately. INCIDENT: Assign within 24h.',
    examples: ['If devices overdue in WITH_INSTALLER → trigger INSTALL_LOGISTICS'],
    languages: ["NL","EN"],
    last_run: '10 mins ago', 
    logs: [] 
  },
  // ... other agents
];

export const MOCK_EXCEPTIONS: Exception[] = [
  { 
    id: 'e1', 
    severity: 'BLOCKER', 
    title: 'Unknown Device Custody', 
    description: 'Device serial MC-2024-005 marked DORMANT but no return requested and no contact with client "Sara Lee". Custody chain broken.',
    related_entity_type: 'DEVICE',
    related_entity_id: 'd5',
    created_by: 'STOCK_CONTROLLER',
    human_owner_role: 'OPERATIONS',
    status: 'OPEN',
    recommended_action: 'Contact Care Company Lead immediately to verify location.',
    created_at: '2 hours ago'
  },
];
