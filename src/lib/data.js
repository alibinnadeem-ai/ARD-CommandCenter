// ═══════════════════════════════════════════════════════════════
// ECC — Seed Data & Constants
// ═══════════════════════════════════════════════════════════════

export const SEED_USERS = [
  { user_id:"U001", name:"Sheikh Khalid Al-Mansouri", email:"chairman@ecc.com", password:"demo", role:"Chairman", dept:"Executive", status:"Active", joined:"2020-01-01", phone:"+92-300-0000001" },
  { user_id:"U002", name:"Dr. Nadia Qureshi",         email:"ceo@ecc.com",      password:"demo", role:"CEO",      dept:"Executive", status:"Active", joined:"2020-03-15", phone:"+92-300-0000002" },
  { user_id:"U003", name:"Ahmed Al-Farsi",            email:"cfo@ecc.com",      password:"demo", role:"CFO",      dept:"Finance",   status:"Active", joined:"2021-01-10", phone:"+92-300-0000003" },
  { user_id:"U004", name:"Priya Sharma",              email:"cso@ecc.com",      password:"demo", role:"CSO",      dept:"Strategy",  status:"Active", joined:"2021-04-20", phone:"+92-300-0000004" },
  { user_id:"U005", name:"James Whitfield",           email:"ciso@ecc.com",     password:"demo", role:"CISO",     dept:"Investment",status:"Active", joined:"2021-06-01", phone:"+92-300-0000005" },
  { user_id:"U006", name:"Tariq Mahmood",             email:"coo@ecc.com",      password:"demo", role:"COO",      dept:"Operations",status:"Active", joined:"2020-09-01", phone:"+92-300-0000006" },
  { user_id:"U007", name:"Fatima Hassan",             email:"clo@ecc.com",      password:"demo", role:"CLO",      dept:"Legal",     status:"Active", joined:"2021-02-14", phone:"+92-300-0000007" },
  { user_id:"U008", name:"Omar Khalil",               email:"dir.fin@ecc.com",  password:"demo", role:"Director", dept:"Finance",   status:"Active", joined:"2022-01-05", phone:"+92-300-0000008" },
  { user_id:"U009", name:"Zara Ahmed",                email:"dir.ops@ecc.com",  password:"demo", role:"Director", dept:"Operations",status:"Active", joined:"2022-03-01", phone:"+92-300-0000009" },
];

export const SEED_DIRECTIVES = [
  {
    directive_id:"DIR-2026-001", title:"Q2 Capital Allocation & Investment Review",
    description:"Conduct comprehensive review of Q2 capital allocation across all portfolios. Identify underperforming assets, rebalance investment mix per the 2026 strategic framework. Submit revised allocation proposal with ROI projections by deadline.",
    issued_by:"U001", assigned_to:"U002", delegated_to:"U003", dept:"Finance",
    priority:"High", status:"In Progress", progress:65, deadline:"2026-03-28", created:"2026-03-01T09:00:00",
    tasks:[
      { task_id:"T001", title:"Portfolio performance analysis Q1",        status:"Completed",   assigned_to:"U008", due:"2026-03-10", progress:100 },
      { task_id:"T002", title:"Rebalancing proposal draft",               status:"In Progress", assigned_to:"U003", due:"2026-03-22", progress:70  },
      { task_id:"T003", title:"CFO board presentation preparation",       status:"Pending",     assigned_to:"U003", due:"2026-03-27", progress:0   },
    ],
    comments:[
      { comment_id:"C001", user_id:"U002", text:"Delegated to CFO Ahmed for immediate action. Priority escalation approved.", ts:"2026-03-01T11:30:00" },
      { comment_id:"C002", user_id:"U003", text:"Initial analysis underway. Portfolio data extraction in progress.", ts:"2026-03-02T08:15:00" },
    ],
    attachments:[{ name:"Portfolio_Q1_2026.xlsx", size:"2.4 MB", uploaded:"2026-03-05" }],
  },
  {
    directive_id:"DIR-2026-002", title:"MENA Regional Expansion — Phase 2 Strategy",
    description:"Develop comprehensive market entry strategy for Phase 2 MENA expansion targeting UAE, Saudi Arabia, and Egypt markets. Include competitive analysis, partnership frameworks, regulatory compliance roadmap, and 3-year financial projections.",
    issued_by:"U001", assigned_to:"U002", delegated_to:"U004", dept:"Strategy",
    priority:"High", status:"Accepted", progress:20, deadline:"2026-04-15", created:"2026-03-05T10:00:00",
    tasks:[
      { task_id:"T004", title:"Market research — UAE and KSA",    status:"In Progress", assigned_to:"U004", due:"2026-03-25", progress:45 },
      { task_id:"T005", title:"Regulatory requirements mapping",  status:"Pending",     assigned_to:"U007", due:"2026-04-01", progress:0  },
      { task_id:"T006", title:"Financial projection model",       status:"Pending",     assigned_to:"U003", due:"2026-04-10", progress:0  },
    ],
    comments:[
      { comment_id:"C003", user_id:"U004", text:"Directive accepted. Market research team mobilised. Initial data collection commenced.", ts:"2026-03-06T09:00:00" },
    ],
    attachments:[],
  },
  {
    directive_id:"DIR-2026-003", title:"Operational Cost Reduction — 15% Target FY2026",
    description:"Identify and implement operational cost reduction measures to achieve 15% reduction in FY2026 operating expenses versus FY2025 baseline. Focus on process automation, vendor renegotiation, and resource optimisation across all departments.",
    issued_by:"U002", assigned_to:"U006", delegated_to:"U006", dept:"Operations",
    priority:"Medium", status:"Review", progress:90, deadline:"2026-03-25", created:"2026-02-15T08:00:00",
    tasks:[
      { task_id:"T007", title:"Cost baseline analysis",           status:"Completed",   assigned_to:"U009", due:"2026-02-28", progress:100 },
      { task_id:"T008", title:"Vendor renegotiation round 1",     status:"Completed",   assigned_to:"U006", due:"2026-03-10", progress:100 },
      { task_id:"T009", title:"Automation implementation",        status:"Completed",   assigned_to:"U009", due:"2026-03-18", progress:100 },
      { task_id:"T010", title:"Final savings report compilation",  status:"In Progress", assigned_to:"U006", due:"2026-03-23", progress:80  },
    ],
    comments:[
      { comment_id:"C004", user_id:"U006", text:"Achieved 13.8% reduction so far. Final vendor contracts pending signature for remaining 1.2%.", ts:"2026-03-18T14:00:00" },
      { comment_id:"C005", user_id:"U002", text:"Good progress. Awaiting final report before marking complete.", ts:"2026-03-19T10:00:00" },
    ],
    attachments:[{ name:"Cost_Reduction_Progress.pdf", size:"1.1 MB", uploaded:"2026-03-18" }],
  },
  {
    directive_id:"DIR-2026-004", title:"Legal Compliance Audit FY2025 — Full Review",
    description:"Complete comprehensive legal compliance audit covering all business units for FY2025. Review contracts, regulatory filings, employment law compliance, and IP portfolio. Submit audit report with remediation plan.",
    issued_by:"U002", assigned_to:"U007", delegated_to:"U007", dept:"Legal",
    priority:"High", status:"Completed", progress:100, deadline:"2026-03-10", created:"2026-02-01T08:00:00",
    tasks:[
      { task_id:"T011", title:"Contract review — all BUs",  status:"Completed", assigned_to:"U007", due:"2026-02-20", progress:100 },
      { task_id:"T012", title:"Regulatory filing audit",    status:"Completed", assigned_to:"U007", due:"2026-02-28", progress:100 },
      { task_id:"T013", title:"Final compliance report",    status:"Completed", assigned_to:"U007", due:"2026-03-08", progress:100 },
    ],
    comments:[
      { comment_id:"C006", user_id:"U007", text:"Full audit complete. 3 minor remediation items identified. Report submitted to CEO.", ts:"2026-03-09T17:45:00" },
      { comment_id:"C007", user_id:"U002", text:"Report reviewed and approved. Directive completed successfully.", ts:"2026-03-10T09:00:00" },
    ],
    attachments:[{ name:"Legal_Audit_FY2025_Final.pdf", size:"4.7 MB", uploaded:"2026-03-09" }],
  },
  {
    directive_id:"DIR-2026-005", title:"Investment Portfolio Rebalancing Q1",
    description:"Execute Q1 portfolio rebalancing per the board-approved investment policy. Reduce exposure to volatile assets, increase allocation to infrastructure and sustainable investments by 8%.",
    issued_by:"U001", assigned_to:"U005", delegated_to:"U005", dept:"Investment",
    priority:"Medium", status:"Overdue", progress:40, deadline:"2026-03-08", created:"2026-02-10T09:00:00",
    tasks:[
      { task_id:"T014", title:"Volatility exposure analysis",     status:"Completed",   assigned_to:"U005", due:"2026-02-20", progress:100 },
      { task_id:"T015", title:"Infrastructure fund selection",    status:"In Progress", assigned_to:"U005", due:"2026-03-05", progress:60  },
      { task_id:"T016", title:"Execute rebalancing transactions", status:"Pending",     assigned_to:"U005", due:"2026-03-08", progress:0   },
    ],
    comments:[
      { comment_id:"C008", user_id:"U005", text:"Suitable infrastructure funds identified. Awaiting final approval from investment committee.", ts:"2026-03-07T15:00:00" },
    ],
    attachments:[],
  },
  {
    directive_id:"DIR-2026-006", title:"Digital HR Transformation Initiative",
    description:"Lead implementation of new HRMS platform across all 4 company locations. Includes data migration, staff training, and process redesign for recruitment, payroll, and performance management modules.",
    issued_by:"U002", assigned_to:"U006", delegated_to:"U006", dept:"Operations",
    priority:"Low", status:"Assigned", progress:0, deadline:"2026-06-01", created:"2026-03-12T10:00:00",
    tasks:[], comments:[], attachments:[],
  },
];

export const SEED_NOTIFICATIONS = [
  { notif_id:"N001", user_id:"U001", type:"overdue",       title:"Directive Overdue",    message:"DIR-2026-005: Investment Portfolio Rebalancing is 5 days overdue.", directive_id:"DIR-2026-005", read:false, ts:"2026-03-13T08:00:00" },
  { notif_id:"N002", user_id:"U002", type:"review_ready",  title:"Ready for Review",     message:"DIR-2026-003: Cost Reduction submitted for your review.", directive_id:"DIR-2026-003", read:false, ts:"2026-03-18T14:00:00" },
  { notif_id:"N003", user_id:"U001", type:"completed",     title:"Directive Completed",  message:"DIR-2026-004: Legal Compliance Audit has been completed.", directive_id:"DIR-2026-004", read:true,  ts:"2026-03-10T09:00:00" },
  { notif_id:"N004", user_id:"U003", type:"assigned",      title:"Directive Assigned",   message:"DIR-2026-001: Capital Allocation Review assigned to you.", directive_id:"DIR-2026-001", read:true,  ts:"2026-03-01T11:30:00" },
  { notif_id:"N005", user_id:"U002", type:"deadline",      title:"Deadline Approaching", message:"DIR-2026-001: Capital Allocation Review deadline in 15 days.", directive_id:"DIR-2026-001", read:false, ts:"2026-03-13T09:00:00" },
];

export const SEED_AUDIT = [
  { log_id:"L001", user_id:"U001",   directive_id:"DIR-2026-001", action:"directive_created",   prev:null,          next:"New",         ts:"2026-03-01T09:00:00", ip:"192.168.1.10" },
  { log_id:"L002", user_id:"U002",   directive_id:"DIR-2026-001", action:"task_assigned",        prev:"New",         next:"Assigned",    ts:"2026-03-01T11:30:00", ip:"192.168.1.11" },
  { log_id:"L003", user_id:"U003",   directive_id:"DIR-2026-001", action:"status_updated",       prev:"Assigned",    next:"Accepted",    ts:"2026-03-02T08:15:00", ip:"192.168.1.12" },
  { log_id:"L004", user_id:"U003",   directive_id:"DIR-2026-001", action:"status_updated",       prev:"Accepted",    next:"In Progress", ts:"2026-03-05T14:00:00", ip:"192.168.1.12" },
  { log_id:"L005", user_id:"U001",   directive_id:"DIR-2026-002", action:"directive_created",    prev:null,          next:"New",         ts:"2026-03-05T10:00:00", ip:"192.168.1.10" },
  { log_id:"L006", user_id:"U007",   directive_id:"DIR-2026-004", action:"directive_completed",  prev:"Review",      next:"Completed",   ts:"2026-03-09T17:45:00", ip:"192.168.1.17" },
  { log_id:"L007", user_id:"System", directive_id:"DIR-2026-005", action:"deadline_breach",      prev:"In Progress", next:"Overdue",     ts:"2026-03-09T00:00:00", ip:"system"       },
  { log_id:"L008", user_id:"U006",   directive_id:"DIR-2026-003", action:"status_updated",       prev:"In Progress", next:"Review",      ts:"2026-03-18T14:00:00", ip:"192.168.1.16" },
];

// ─────────────────────────────────────────────
// ROLE CONFIGURATION
// ─────────────────────────────────────────────
export const ROLE_CONFIG = {
  Chairman: { level:1, color:"#c9a227", bg:"#c9a22718", canViewAll:true,  canCreate:true,  canManageUsers:true,  canArchive:true,  canAudit:true,  depts:["all"] },
  CEO:      { level:2, color:"#e84393", bg:"#e8439318", canViewAll:true,  canCreate:true,  canManageUsers:false, canArchive:true,  canAudit:true,  depts:["all"] },
  CFO:      { level:3, color:"#3b82f6", bg:"#3b82f618", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Finance"]    },
  CSO:      { level:3, color:"#a78bfa", bg:"#a78bfa18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Strategy"]   },
  CISO:     { level:3, color:"#06b6d4", bg:"#06b6d418", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Investment"] },
  COO:      { level:3, color:"#22c55e", bg:"#22c55e18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Operations"] },
  CLO:      { level:3, color:"#f97316", bg:"#f9731618", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Legal"]      },
  Director: { level:4, color:"#94a3b8", bg:"#94a3b818", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["own"]        },
  Team:     { level:5, color:"#64748b", bg:"#64748b18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["own"]        },
};

export const STATUS_META = {
  "New":         { color:"#60a5fa", bg:"#0d1e3a", icon:"◈" },
  "Assigned":    { color:"#38bdf8", bg:"#0a1e30", icon:"◉" },
  "Accepted":    { color:"#22d3ee", bg:"#081e28", icon:"◎" },
  "In Progress": { color:"#22c55e", bg:"#0d2218", icon:"▶" },
  "Review":      { color:"#f59e0b", bg:"#221500", icon:"◷" },
  "Completed":   { color:"#4ade80", bg:"#081a0e", icon:"✓" },
  "Archived":    { color:"#64748b", bg:"#0d1420", icon:"▣" },
  "Overdue":     { color:"#ef4444", bg:"#200808", icon:"⚠" },
};

export const PRIORITY_META = {
  "High":   { color:"#ef4444", bg:"#200808" },
  "Medium": { color:"#f59e0b", bg:"#221500" },
  "Low":    { color:"#22c55e", bg:"#0d2218" },
};

export const STATUS_FLOW = {
  "New":         ["Assigned"],
  "Assigned":    ["Accepted"],
  "Accepted":    ["In Progress"],
  "In Progress": ["Review"],
  "Review":      ["Completed", "In Progress"],
  "Completed":   ["Archived"],
  "Archived":    [],
  "Overdue":     ["In Progress", "Review"],
};

export const DEPT_EXEC_MAP = {
  Finance: "U003", Strategy: "U004", Investment: "U005", Operations: "U006", Legal: "U007"
};

export const ALL_DEPTS    = ["Finance", "Strategy", "Investment", "Operations", "Legal"];
export const ALL_ROLES    = ["CEO","CFO","CSO","CISO","COO","CLO","Director","Team"];
export const ALL_STATUSES = ["New","Assigned","Accepted","In Progress","Review","Completed","Overdue","Archived"];
export const ALL_PRIORITIES = ["High","Medium","Low"];
