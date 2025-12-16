
import { Role, DeviceStatus, CaseStatus, JobStatus, AgentStatus, AutonomyLevel, Device, Case, Job, Agent, Exception, Client, CarePlan, Assessment, ClientTimelineEvent, Message, Product, ProductCategory } from '../types';

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

export const MOCK_PRODUCTS: Product[] = [
  // Core “platform” items
  {
    id: "prod-hub",
    name: "Smart Hub",
    category: ProductCategory.HOME_MONITORING,
    supplier: "MobileCare",
    is_device: true,
    is_active: true,
    requires_subscription: true,
  },

  // Safety
  {
    id: "prod-sos",
    name: "SOS Pendant",
    category: ProductCategory.SAFETY,
    supplier: "MobileCare",
    is_device: true,
    is_active: true,
    requires_hub: true,
  },
  
  // Extra safety
  {
    id: "prod-fall-sensor",
    name: "Fall Sensor",
    category: ProductCategory.SAFETY,
    supplier: "Vivago",
    is_device: true,
    is_active: true,
    requires_hub: true
  },

  // Medication
  {
    id: "prod-dosell",
    name: "Dosell Medication Dispenser",
    category: ProductCategory.MEDICATION,
    supplier: "Dosell",
    is_device: true,
    is_active: true,
    requires_subscription: true,
  },

  // Vitals
  {
    id: "prod-glucose",
    name: "Glucose Monitor",
    category: ProductCategory.VITALS,
    supplier: "MobileCare",
    is_device: true,
    is_active: true,
    requires_subscription: true,
  },

  // Services (non-device)
  {
    id: "svc-monitoring",
    name: "24/7 Monitoring",
    category: ProductCategory.SERVICE,
    supplier: "MobileCare",
    is_device: false,
    is_active: true,
  },
  {
    id: "svc-wellness-calls",
    name: "Wellness Check Calls",
    category: ProductCategory.SERVICE,
    supplier: "MobileCare",
    is_device: false,
    is_active: true,
  },
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
    recommended_product_ids: ['svc-monitoring', 'prod-hub', 'prod-fall-sensor'],
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
    agreed_product_ids: ['svc-monitoring', 'prod-hub', 'prod-fall-sensor'],
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
    agreed_product_ids: ['svc-monitoring', 'prod-dosell'],
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
  // C1: Assigned to Jan
  { id: 'd1', serial_number: 'MC-2024-001', product_id: 'prod-hub', status: DeviceStatus.INSTALLED_ACTIVE, current_custodian: 'Client: Jan Jansen', assigned_client_id: 'cl1', assigned_case_id: 'c1', last_updated: fmtDate(yesterday), confirmation_needed: true },
  
  // Free Stock
  { id: 'd2', serial_number: 'MC-2024-002', product_id: 'prod-hub', status: DeviceStatus.IN_STOCK, current_custodian: 'Warehouse', last_updated: fmtDate(today) },
  
  // Return Flow
  { id: 'd3', serial_number: 'MC-2024-003', product_id: 'prod-fall-sensor', status: DeviceStatus.AWAITING_RETURN, current_custodian: 'Client: Piet Puk', last_updated: '2023-10-01', sla_breach: true },
  
  // C3: Allocated to Maria (With Installer)
  { id: 'd4', serial_number: 'MC-2024-004', product_id: 'prod-hub', status: DeviceStatus.WITH_INSTALLER, current_custodian: 'Installer: Bob', assigned_client_id: 'cl3', assigned_case_id: 'c3', last_updated: fmtDate(today) },
  
  // Dormant/Lost
  { id: 'd5', serial_number: 'MC-2024-005', product_id: 'prod-dosell', status: DeviceStatus.DORMANT, current_custodian: 'Client: Sara Lee', last_updated: '2023-09-15', sla_breach: true },
  
  // Assigned to Gerrit (Installed)
  { id: 'd6', serial_number: 'MC-2024-006', product_id: 'prod-dosell', status: DeviceStatus.INSTALLED_ACTIVE, current_custodian: 'Client: Gerrit Groot', assigned_client_id: 'cl2', last_updated: fmtDate(yesterday) },

  // Free Stock (For partial allocation testing)
  { id: 'd7', serial_number: 'MC-2024-007', product_id: 'prod-fall-sensor', status: DeviceStatus.IN_STOCK, current_custodian: 'Warehouse', last_updated: fmtDate(today) },
];

export const MOCK_CASES: Case[] = [
  // Case 1: Fully Active (Historic)
  { 
    id: 'c1', 
    client_id: 'cl1', 
    client_name: 'Jan Jansen', 
    care_company_id: 'cc1', 
    status: CaseStatus.ACTIVE_SERVICE, 
    created_at: '2023-10-01', 
    product_ids: ['prod-hub'], // Deprecated but kept
    line_items: [
      { id: 'li1', product_id: 'prod-hub', requested_qty: 1, allocated_device_ids: ['d1'], status: 'ALLOCATED' }
    ]
  },
  
  // Case 2: New Request (Requires Dosell + Fall Sensor).
  // Note: We have 1 Fall Sensor IN_STOCK (d7), but 0 Dosell IN_STOCK.
  // This allows demonstrating "Partial Allocation" or "Out of Stock" exception.
  { 
    id: 'c2', 
    client_id: 'cl2', 
    client_name: 'Gerrit Groot', 
    care_company_id: 'cc2', 
    status: CaseStatus.NEW, 
    created_at: fmtDate(today), 
    product_ids: ['prod-dosell', 'prod-fall-sensor'], 
    line_items: [
      { id: 'li2', product_id: 'prod-dosell', requested_qty: 1, allocated_device_ids: [], status: 'REQUESTED' },
      { id: 'li3', product_id: 'prod-fall-sensor', requested_qty: 1, allocated_device_ids: [], status: 'REQUESTED' }
    ]
  },
  
  // Case 3: Installation Pending (Allocated)
  { 
    id: 'c3', 
    client_id: 'cl3', 
    client_name: 'Maria Klein', 
    care_company_id: 'cc1', 
    status: CaseStatus.INSTALLATION_PENDING, 
    created_at: fmtDate(yesterday), 
    product_ids: ['prod-hub'],
    line_items: [
      { id: 'li4', product_id: 'prod-hub', requested_qty: 1, allocated_device_ids: ['d4'], status: 'ALLOCATED' }
    ]
  },
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', type: 'INSTALL', status: JobStatus.SCHEDULED, client_name: 'Maria Klein', client_id: 'cl3', case_id: 'c3', scheduled_for: fmtDate(today, '14:00'), installer_name: 'Bob Builder', confirmation_needed: true },
  { id: 'j2', type: 'RETURN', status: JobStatus.NEEDS_SCHEDULING, client_name: 'Piet Puk', scheduled_for: undefined },
  { id: 'j3', type: 'INSTALL', status: JobStatus.MISSED, client_name: 'Gerrit Groot', client_id: 'cl2', case_id: 'c2', scheduled_for: fmtDate(yesterday, '10:00'), installer_name: 'Bob Builder' },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-auto-allocation",
    name: "Auto Allocation & Job Creation",
    code: "AUTO_ALLOCATION",
    description: "Allocates devices to approved cases and creates install jobs when fully allocated.",
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    status: AgentStatus.ENABLED,
    last_run: 'Never',
    owner_team: 'Operations',
    risk_level: 'LOW',
    schedule_type: 'INTERVAL',
    schedule_value: '5m',
    data_scope: 'CASES',
    system_instructions: 'Allocate stock. Create jobs.',
    behavior_rules: 'Allocation -> Job Creation',
    allowed_actions: { auto_execute: ['ALLOCATE_CASE', 'CREATE_INSTALL_JOBS'] },
    restricted_actions: {},
    escalation_policy: 'None',
    examples: [],
    languages: ['EN'],
    logs: []
  },
  {
    id: "agent-stock-shortage-watch",
    name: "Stock Shortage Watch",
    code: "STOCK_SHORTAGE_WATCH",
    description: "Monitors IN_STOCK thresholds per product and raises low-stock warnings.",
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    status: AgentStatus.ENABLED,
    last_run: 'Never',
    owner_team: 'Warehouse',
    risk_level: 'LOW',
    schedule_type: 'INTERVAL',
    schedule_value: '1h',
    data_scope: 'DEVICES',
    system_instructions: 'Monitor stock levels.',
    behavior_rules: 'Stock < 2 -> Warning',
    allowed_actions: { auto_execute: ['CREATE_EXCEPTION'] },
    restricted_actions: {},
    escalation_policy: 'None',
    examples: [],
    languages: ['EN'],
    logs: []
  },
  {
    id: "agent-confirmation-reminders",
    name: "Confirmation Reminders",
    code: "CONFIRMATION_REMINDERS",
    description: "Sends reminders (logged to timeline in v1) for pending confirmations.",
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    status: AgentStatus.ENABLED,
    last_run: 'Never',
    owner_team: 'Support',
    risk_level: 'LOW',
    schedule_type: 'CRON',
    schedule_value: '0 9 * * *',
    data_scope: 'MESSAGES',
    system_instructions: 'Send reminders for pending tasks.',
    behavior_rules: 'Pending > 2 days -> Remind',
    allowed_actions: { auto_execute: ['SEND_REMINDER'] },
    restricted_actions: {},
    escalation_policy: 'None',
    examples: [],
    languages: ['EN'],
    logs: []
  },
  { 
    id: 'a0', 
    name: 'Orchestrator Brain', 
    code: 'ORCHESTRATOR', 
    description: 'Coordinates specialist agents. Monitors system events and prioritizes next actions.',
    owner_team: 'Operations',
    status: AgentStatus.ENABLED, 
    autonomy: AutonomyLevel.AUTO_EXECUTE, // CHANGED: To allow proactive triggering
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
  {
    id: 'a1',
    name: 'Stock Controller',
    code: 'STOCK_CONTROLLER',
    description: 'Manages inventory levels, reserves stock for new orders, and tracks warehouse movements.',
    owner_team: 'Warehouse',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    risk_level: 'MEDIUM',
    schedule_type: 'INTERVAL',
    schedule_value: '5m',
    data_scope: 'DEVICES',
    system_instructions: 'Ensure stock accountability. Reserve devices for approved cases immediately. Flag missing inventory.',
    behavior_rules: '1) If Case APPROVED -> Reserve Stock. 2) If Stock < Threshold -> Alert Admin.',
    allowed_actions: {
      observe: ["check_stock_levels", "scan_new_cases"],
      draft_only: ["order_restock"],
      auto_execute: ["reserve_device", "update_device_status"]
    },
    restricted_actions: { never: ["delete_stock", "modify_serial_numbers"] },
    escalation_policy: 'WARNING: If stock low. BLOCKER: If stock empty for approved case.',
    examples: ['Case #123 Approved -> Device #555 Reserved'],
    languages: ["EN"],
    last_run: '2 mins ago',
    logs: []
  },
  {
    id: 'a2',
    name: 'Install Logistics',
    code: 'INSTALL_LOGISTICS',
    description: 'Manages installation scheduling, installer assignments, and job confirmations.',
    owner_team: 'Operations',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.AUTO_EXECUTE, // CHANGED: To allow auto-scheduling/assigning for demo
    risk_level: 'MEDIUM',
    schedule_type: 'INTERVAL',
    schedule_value: '15m',
    data_scope: 'JOBS',
    system_instructions: 'Coordinate installation logistics. Ensure all "Ready" devices get an appointment scheduled.',
    behavior_rules: '1) If Stock Allocated -> Create Job (Needs Scheduling). 2) If Job Scheduled -> Request Confirmation.',
    allowed_actions: {
      observe: ["scan_unassigned_jobs", "check_overdue_installs"],
      draft_only: ["propose_schedule", "send_confirmation_request"],
      auto_execute: ["assign_installer", "set_scheduled_status"] // ADDED capability
    },
    restricted_actions: { never: ["cancel_job_without_reason"] },
    escalation_policy: 'INCIDENT: Job missed or installer no-show.',
    examples: ['Job #999 needs scheduling -> Draft message to Client'],
    languages: ["NL", "EN"],
    last_run: '15 mins ago',
    logs: []
  },
  {
    id: 'a3',
    name: 'Returns Recovery',
    code: 'RETURNS_RECOVERY',
    description: 'Handles the end-of-service flow, return requests, and chasing overdue returns.',
    owner_team: 'Operations',
    status: AgentStatus.ENABLED, // CHANGED: From PAUSED to ENABLED
    autonomy: AutonomyLevel.AUTO_EXECUTE, // CHANGED: From OBSERVE_ONLY to AUTO_EXECUTE
    risk_level: 'LOW',
    schedule_type: 'CRON',
    schedule_value: '0 9 * * *',
    data_scope: 'RETURNS',
    system_instructions: 'Recover assets efficiently. Chase clients/partners for returns if service ended.',
    behavior_rules: '1) If Case Closed -> Create Return Request. 2) If Return Overdue -> Send Reminder.',
    allowed_actions: {
      observe: ["scan_closed_cases", "check_return_sla"],
      draft_only: ["draft_chase_email"],
      auto_execute: ["create_return_request"] // Moved to auto
    },
    restricted_actions: { never: ["mark_lost_without_approval"] },
    escalation_policy: 'WARNING: Return overdue > 7 days.',
    examples: ['Client deceased -> Schedule pickup immediately'],
    languages: ["NL", "EN"],
    last_run: 'Yesterday',
    logs: []
  },
  {
    id: 'a4',
    name: 'Status Confirmation',
    code: 'STATUS_CONFIRMATION',
    description: 'Periodically verifies that "Active" devices are actually in use to prevent dormancy.',
    owner_team: 'Compliance',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    risk_level: 'LOW',
    schedule_type: 'CRON',
    schedule_value: '0 9 * * 1',
    data_scope: 'DEVICES',
    system_instructions: 'Prevent ghost devices. Ask care companies to confirm active status periodically.',
    behavior_rules: '1) If Device Active > 90 days -> Send Verification Request.',
    allowed_actions: {
      observe: ["scan_device_age"],
      draft_only: [],
      auto_execute: ["flag_confirmation_needed"]
    },
    restricted_actions: { never: ["deactivate_service"] },
    escalation_policy: 'None.',
    examples: ['Device active 6 months -> Flag for check'],
    languages: ["NL"],
    last_run: '3 days ago',
    logs: []
  },
  {
    id: 'a5',
    name: 'Comms Agent',
    code: 'COMMS_AGENT',
    description: 'Centralized messaging bot. Handles reminders, notifications, and translations.',
    owner_team: 'Support',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    risk_level: 'LOW',
    schedule_type: 'MANUAL',
    schedule_value: 'Event Trigger',
    data_scope: 'MESSAGES',
    system_instructions: 'Deliver clear, polite, multilingual communications. Use templates.',
    behavior_rules: '1) If Triggered -> Select Template -> Translate -> Send.',
    allowed_actions: {
      observe: [],
      draft_only: ["draft_broadcast"],
      auto_execute: ["send_email", "send_sms", "send_push"]
    },
    restricted_actions: { never: ["send_unapproved_broadcast"] },
    escalation_policy: 'WARNING: Bounce rate high.',
    examples: ['Send appointment reminder (NL)'],
    languages: ["NL", "EN", "DE", "FR"],
    last_run: '1 min ago',
    logs: []
  },
  {
    id: 'a6',
    name: 'Compliance Audit',
    code: 'COMPLIANCE_AUDIT',
    description: 'Ensures chain of custody is complete. Flags missing data or broken processes.',
    owner_team: 'Legal',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.OBSERVE_ONLY,
    risk_level: 'HIGH',
    schedule_type: 'CRON',
    schedule_value: '0 2 * * *',
    data_scope: 'ALL',
    system_instructions: 'Audit every transaction. Ensure every device move has a source and destination.',
    behavior_rules: '1) Scan Chain of Custody. 2) If gap found -> Create Blocker Exception.',
    allowed_actions: {
      observe: ["audit_ledger", "verify_users"],
      draft_only: ["create_compliance_report"],
      auto_execute: ["create_exception"]
    },
    restricted_actions: { never: ["modify_ledger"] },
    escalation_policy: 'BLOCKER: Custody gap found.',
    examples: ['Device moved Stock->Client without Installer record -> Flag'],
    languages: ["EN"],
    last_run: 'Last night',
    logs: []
  },
  {
    id: 'a7',
    name: 'Reporting Agent',
    code: 'REPORTING_AGENT',
    description: 'Generates daily executive summaries and operational reports.',
    owner_team: 'Data',
    status: AgentStatus.ENABLED,
    autonomy: AutonomyLevel.AUTO_EXECUTE,
    risk_level: 'LOW',
    schedule_type: 'CRON',
    schedule_value: '0 7 * * *',
    data_scope: 'ANALYTICS',
    system_instructions: 'Synthesize daily data into readable reports for CEO/Admin.',
    behavior_rules: '1) Aggregate stats. 2) Generate PDF/JSON. 3) Email to stakeholders.',
    allowed_actions: {
      observe: ["query_all_stats"],
      draft_only: [],
      auto_execute: ["publish_report"]
    },
    restricted_actions: { never: [] },
    escalation_policy: 'None.',
    examples: ['Generate Daily CEO Report'],
    languages: ["EN"],
    last_run: 'Today 07:00',
    logs: []
  }
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

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    category: 'SYSTEM_NOTIFICATION',
    sender_type: 'AI',
    sender_name: 'Stock Controller',
    sender_role: 'AGENT',
    recipient_group: 'OPERATIONS',
    subject: 'Inventory Allocation Confirmed',
    preview: 'Stock reserved for Case #C2 (Gerrit Groot).',
    body: 'I have successfully reserved 2 items (Med Dispenser, Fall Sensor) for Case #C2. Warehouse pick-list updated. Installation scheduling is now unblocked.',
    priority: 'NORMAL',
    is_read: false,
    timestamp: '10 mins ago',
    tags: ['Stock', 'Auto-Action'],
    action_required: false,
    related_entity_type: 'CASE',
    related_entity_id: 'c2'
  },
  {
    id: 'm2',
    category: 'DIRECT_MESSAGE',
    sender_type: 'HUMAN',
    sender_name: 'Nurse Joy',
    sender_role: 'Lead Nurse',
    recipient_group: 'OPERATIONS',
    subject: 'Urgent: Replacement needed for Client #CL1',
    preview: 'Smart Hub power adapter seems faulty.',
    body: 'Hi Ops team, regarding Jan Jansen (CL1). The Smart Hub power adapter is flickering. Can we schedule a replacement? The client relies on this for fall detection.',
    priority: 'HIGH',
    is_read: true,
    timestamp: '2 hours ago',
    tags: ['Maintenance', 'Urgent'],
    action_required: true
  },
  {
    id: 'm3',
    category: 'DIRECT_MESSAGE',
    sender_type: 'AI',
    sender_name: 'Comms Agent',
    sender_role: 'AGENT',
    recipient_group: 'OPERATIONS',
    subject: 'Approval Needed: Broadcast Message',
    preview: 'Draft created for "Holiday Service Schedule".',
    body: 'I have drafted a broadcast message regarding the upcoming holiday service schedule changes. Translation to NL/EN completed. Please review and approve for distribution to all Care Partners.',
    priority: 'NORMAL',
    is_read: false,
    timestamp: '3 hours ago',
    tags: ['Approval', 'Draft'],
    action_required: true
  },
  {
    id: 'm4',
    category: 'SYSTEM_NOTIFICATION',
    sender_type: 'SYSTEM',
    sender_name: 'System Monitor',
    sender_role: 'SYSTEM',
    recipient_group: 'OPERATIONS',
    subject: 'Workflow State Change: Case #C3',
    preview: 'Case moved to INSTALLATION_PENDING.',
    body: 'Case #C3 for Maria Klein has advanced from STOCK_ALLOCATED to INSTALLATION_PENDING. Install Logistics Agent has been triggered to schedule an appointment.',
    priority: 'LOW',
    is_read: true,
    timestamp: 'Yesterday',
    tags: ['Workflow', 'Auto'],
    related_entity_type: 'CASE',
    related_entity_id: 'c3'
  },
  {
    id: 'm5',
    category: 'DIRECT_MESSAGE',
    sender_type: 'HUMAN',
    sender_name: 'Bob Builder',
    sender_role: 'Installer',
    recipient_group: 'OPERATIONS',
    subject: 'Install Complete: #J1',
    preview: 'Successfully installed at Maria Klein.',
    body: 'Job #J1 is done. Photo proof uploaded. Client was happy with the demo. Returning to HQ.',
    priority: 'LOW',
    is_read: true,
    timestamp: 'Yesterday',
    tags: ['Job', 'Success'],
    related_entity_type: 'JOB',
    related_entity_id: 'j1'
  },
  {
    id: 'm6',
    category: 'SYSTEM_NOTIFICATION',
    sender_type: 'AI',
    sender_name: 'Reporting Agent',
    sender_role: 'AGENT',
    recipient_group: 'OPERATIONS',
    subject: 'Daily Report Generated',
    preview: 'Report #8921 available for review.',
    body: 'The daily accountability report for 24-Oct has been generated and archived. Accountability Score: 99.8%.',
    priority: 'LOW',
    is_read: true,
    timestamp: 'Yesterday',
    tags: ['Report', 'Auto'],
  },
  {
    id: 'm7',
    category: 'SYSTEM_NOTIFICATION',
    sender_type: 'SYSTEM',
    sender_name: 'Security Guard',
    sender_role: 'SYSTEM',
    recipient_group: 'MC_ADMIN',
    subject: 'Login from New Device',
    preview: 'User u3 (Sarah) logged in from unknown IP.',
    body: 'Security Alert: A login detected for Sarah from IP 192.168.1.55. Device fingerprint match: 40%.',
    priority: 'HIGH',
    is_read: true,
    timestamp: '2 days ago',
    tags: ['Security'],
  },
  // --- NEW MESSAGES FOR INSTALLER VIEW CHECK ---
  {
    id: 'm8',
    category: 'DIRECT_MESSAGE',
    sender_type: 'HUMAN',
    sender_name: 'Sarah (Operations)',
    sender_role: 'Ops Manager',
    recipient_group: 'INSTALLER',
    subject: 'Route Update: Amsterdam Area',
    preview: 'Please prioritize job #J1 today.',
    body: 'Hey Bob, client for #J1 requested an earlier slot. If you can make it before 2pm, that would be great. Thanks!',
    priority: 'NORMAL',
    is_read: false,
    timestamp: '1 hour ago',
    tags: ['Route', 'Update'],
  },
  {
    id: 'm9',
    category: 'SYSTEM_NOTIFICATION',
    sender_type: 'AI',
    sender_name: 'Install Logistics',
    sender_role: 'AGENT',
    recipient_group: 'INSTALLER',
    subject: 'New Job Assigned: #J3',
    preview: 'Added to your queue.',
    body: 'You have been assigned a new installation job for client Gerrit Groot. Scheduled for tomorrow at 10:00.',
    priority: 'LOW',
    is_read: false,
    timestamp: '30 mins ago',
    tags: ['Assignment', 'Auto'],
    related_entity_type: 'JOB',
    related_entity_id: 'j3'
  }
];
