'use client';
import { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// EXECUTIVE COMMAND CENTER — v2.0  (Full System + Tested)
// Chairman → CEO → C-Suite Directive Governance Platform
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  bg: "#06090d", surface: "#0c1018", surfaceAlt: "#101620",
  surfaceHover: "#141c26", border: "#1a2332", borderLight: "#243040",
  gold: "#c9a227", goldLight: "#e8c547", goldDim: "#c9a22715",
  goldBorder: "#c9a22730",
  text: "#e8ecf1", textSub: "#6e8299", textMuted: "#3d5166",
  green: "#22c55e", greenDim: "#0d2218",
  red: "#ef4444", redDim: "#200808",
  yellow: "#f59e0b", yellowDim: "#221500",
  blue: "#3b82f6", blueDim: "#0a1830",
  purple: "#a78bfa", purpleDim: "#160e30",
  cyan: "#06b6d4", pink: "#e84393",
  white: "#ffffff",
};

const STATUS_META = {
  "New":         { color: "#60a5fa", bg: "#0d1e3a", icon: "◈", label: "New" },
  "Assigned":    { color: "#38bdf8", bg: "#0a1e30", icon: "◉", label: "Assigned" },
  "Accepted":    { color: "#22d3ee", bg: "#081e28", icon: "◎", label: "Accepted" },
  "In Progress": { color: "#22c55e", bg: "#0d2218", icon: "▶", label: "In Progress" },
  "Review":      { color: "#f59e0b", bg: "#221500", icon: "◷", label: "Review" },
  "Completed":   { color: "#4ade80", bg: "#081a0e", icon: "✓", label: "Completed" },
  "Archived":    { color: "#64748b", bg: "#0d1420", icon: "▣", label: "Archived" },
  "Overdue":     { color: "#ef4444", bg: "#200808", icon: "⚠", label: "Overdue" },
};

const PRIORITY_META = {
  "High":   { color: "#ef4444", bg: "#200808", dot: "#ef4444" },
  "Medium": { color: "#f59e0b", bg: "#221500", dot: "#f59e0b" },
  "Low":    { color: "#22c55e", bg: "#0d2218", dot: "#22c55e" },
};

const ROLE_CONFIG = {
  Chairman: { level:1, color:"#c9a227", bg:"#c9a22718", canViewAll:true,  canCreate:true,  canManageUsers:true,  canArchive:true,  canAudit:true,  depts:["all"] },
  CEO:      { level:2, color:"#e84393", bg:"#e8439318", canViewAll:true,  canCreate:true,  canManageUsers:false, canArchive:true,  canAudit:true,  depts:["all"] },
  CFO:      { level:3, color:"#3b82f6", bg:"#3b82f618", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Finance"] },
  CSO:      { level:3, color:"#a78bfa", bg:"#a78bfa18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Strategy"] },
  CISO:     { level:3, color:"#06b6d4", bg:"#06b6d418", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Investment"] },
  COO:      { level:3, color:"#22c55e", bg:"#22c55e18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Operations"] },
  CLO:      { level:3, color:"#f97316", bg:"#f9731618", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["Legal"] },
  Director: { level:4, color:"#94a3b8", bg:"#94a3b818", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["own"] },
  Team:     { level:5, color:"#64748b", bg:"#64748b18", canViewAll:false, canCreate:false, canManageUsers:false, canArchive:false, canAudit:false, depts:["own"] },
};

const STATUS_FLOW = {
  "New": ["Assigned"],
  "Assigned": ["Accepted"],
  "Accepted": ["In Progress"],
  "In Progress": ["Review"],
  "Review": ["Completed", "In Progress"],
  "Completed": ["Archived"],
  "Archived": [],
  "Overdue": ["In Progress", "Review"],
};

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
// Seed data removed — all data is now fetched from the database via API routes

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).substr(2, 8).toUpperCase();
const fmt  = ts => new Date(ts).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
const fmtS = ts => new Date(ts).toLocaleDateString("en-GB", { day:"numeric", month:"short" });
const fmtT = ts => new Date(ts).toLocaleString("en-GB",    { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
const daysLeft = d => Math.ceil((new Date(d) - new Date()) / 86400000);
const byId = (list, id) => list.find(x => x.user_id === id);
const lastName = (users, id) => byId(users, id)?.name?.split(" ").slice(-1)[0] || id;

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
const Avatar = ({ name="?", size=32, color=C.gold }) => {
  const initials = name.split(" ").map(w=>w[0]).filter(Boolean).slice(0,2).join("");
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:`linear-gradient(135deg,${color}25,${color}40)`,
      border:`1.5px solid ${color}50`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.36, fontWeight:800, color, letterSpacing:0, userSelect:"none"
    }}>{initials}</div>
  );
};

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META["New"];
  return (
    <span style={{
      background:m.bg, color:m.color, border:`1px solid ${m.color}30`,
      padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700,
      display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap"
    }}>
      <span style={{fontSize:9}}>{m.icon}</span> {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const m = PRIORITY_META[priority] || PRIORITY_META["Medium"];
  return (
    <span style={{ color:m.color, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:m.color,display:"inline-block" }} />
      {priority}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.Team;
  return <span style={{ background:rc.bg, color:rc.color, border:`1px solid ${rc.color}30`, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{role}</span>;
};

const Tag = ({ children, color=C.blue }) => (
  <span style={{ background:`${color}12`, color, border:`1px solid ${color}25`, padding:"1px 7px", borderRadius:20, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{children}</span>
);

const Bar = ({ value=0, status="New", height=4 }) => {
  const col = status==="Overdue"?C.red:status==="Completed"?C.green:status==="Review"?C.yellow:C.blue;
  return (
    <div style={{ background:C.border, borderRadius:height, height, overflow:"hidden", width:"100%" }}>
      <div style={{ width:`${Math.min(100,Math.max(0,value))}%`, height:"100%", background:`linear-gradient(90deg,${col}80,${col})`, borderRadius:height, transition:"width .5s ease" }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// LAYOUT PRIMITIVES
// ─────────────────────────────────────────────
const Card = ({ children, style={}, onClick, accent }) => (
  <div onClick={onClick} style={{
    background:C.surface, border:`1px solid ${accent||C.border}`,
    borderRadius:10, padding:18,
    cursor:onClick?"pointer":"default",
    transition:"border-color .15s,background .15s",
    ...style,
  }}
    onMouseEnter={onClick?e=>{e.currentTarget.style.borderColor=accent||C.goldBorder;e.currentTarget.style.background=C.surfaceHover;}:undefined}
    onMouseLeave={onClick?e=>{e.currentTarget.style.borderColor=accent||C.border;e.currentTarget.style.background=C.surface;}:undefined}
  >{children}</div>
);

const Divider = () => <div style={{ height:1, background:C.border, margin:"14px 0" }} />;

const Modal = ({ title, onClose, children, wide=false, danger=false }) => (
  <div style={{
    position:"fixed", inset:0, background:"rgba(0,0,0,0.82)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:2000, padding:16, backdropFilter:"blur(4px)"
  }} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{
      background:C.surface, border:`1px solid ${danger?C.red:C.border}`,
      borderRadius:14, width:"100%", maxWidth:wide?800:500,
      maxHeight:"90vh", overflow:"hidden",
      display:"flex", flexDirection:"column",
      boxShadow:`0 24px 80px rgba(0,0,0,.7)`
    }}>
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${danger?C.red+"40":C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:danger?"#1a0505":C.surface }}>
        <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:danger?C.red:C.text, fontFamily:"'Georgia',serif" }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 6px", borderRadius:4 }}>✕</button>
      </div>
      <div style={{ padding:"18px 20px", overflowY:"auto", flex:1 }}>{children}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// FORM CONTROLS
// ─────────────────────────────────────────────
const Field = ({ label, value, onChange, type="text", placeholder, required, as, options, rows=3, disabled }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", fontSize:11, color:C.textSub, textTransform:"uppercase", letterSpacing:.8, marginBottom:5, fontWeight:600 }}>
      {label}{required&&<span style={{color:C.red}}> *</span>}
    </label>}
    {as==="select" ? (
      <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{
        width:"100%", background:disabled?C.bg:C.surfaceAlt, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"9px 12px", color:value?C.text:C.textSub, fontSize:13, outline:"none", cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?.6:1, boxSizing:"border-box"
      }}>
        <option value="">— select —</option>
        {options?.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
      </select>
    ) : as==="textarea" ? (
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{
        width:"100%", background:C.surfaceAlt, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"9px 12px", color:C.text, fontSize:13, outline:"none",
        resize:"vertical", boxSizing:"border-box", fontFamily:"inherit"
      }} />
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{
        width:"100%", background:disabled?C.bg:C.surfaceAlt, border:`1px solid ${C.border}`,
        borderRadius:7, padding:"9px 12px", color:C.text, fontSize:13, outline:"none",
        boxSizing:"border-box", opacity:disabled?.6:1
      }} />
    )}
  </div>
);

const Btn = ({ children, onClick, variant="primary", small, disabled, icon, full }) => {
  const V = {
    primary: { bg:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:"#050810", border:"none" },
    secondary:{ bg:C.surfaceAlt, color:C.textSub, border:`1px solid ${C.border}` },
    danger:   { bg:C.redDim, color:C.red, border:`1px solid ${C.red}40` },
    success:  { bg:C.greenDim, color:C.green, border:`1px solid ${C.green}40` },
    ghost:    { bg:"transparent", color:C.textSub, border:`1px solid ${C.border}` },
    warn:     { bg:C.yellowDim, color:C.yellow, border:`1px solid ${C.yellow}40` },
  };
  const s = V[variant]||V.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:s.bg, color:s.color, border:s.border,
      padding:small?"4px 11px":"8px 16px",
      borderRadius:7, cursor:disabled?"not-allowed":"pointer",
      fontSize:small?11:13, fontWeight:700,
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5,
      opacity:disabled?.45:1, transition:"opacity .15s",
      whiteSpace:"nowrap", width:full?"100%":"auto",
      boxSizing:"border-box"
    }}>
      {icon&&<span style={{fontSize:small?12:14}}>{icon}</span>}
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────
const KPI = ({ label, value, sub, color=C.gold, icon }) => (
  <Card style={{ borderLeft:`3px solid ${color}`, padding:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:.8, marginBottom:6, fontWeight:600 }}>{label}</div>
        <div style={{ fontSize:30, fontWeight:900, color, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{value}</div>
        {sub&&<div style={{ fontSize:11, color:C.textMuted, marginTop:5 }}>{sub}</div>}
      </div>
      <span style={{ fontSize:22, opacity:.5 }}>{icon}</span>
    </div>
  </Card>
);

// ─────────────────────────────────────────────
// DIRECTIVE ROW
// ─────────────────────────────────────────────
const DRow = ({ d, users, onClick, compact }) => {
  const days = daysLeft(d.deadline);
  const late = d.status==="Overdue"||days<0;
  const sm = STATUS_META[d.status]||STATUS_META["New"];
  return (
    <Card onClick={onClick} style={{ padding:compact?"11px 14px":"15px 16px", marginBottom:7, borderLeft:`3px solid ${sm.color}` }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:C.textMuted, fontFamily:"monospace" }}>{d.directive_id}</span>
            <span style={{ fontSize:10, color:C.textMuted }}>·</span>
            <span style={{ fontSize:10, color:C.textSub }}>{d.dept}</span>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.35, marginBottom:compact?5:9 }}>{d.title}</div>
          {!compact&&<div style={{ fontSize:12, color:C.textSub, lineHeight:1.5, marginBottom:8, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{d.description}</div>}
          <Bar value={d.progress} status={d.status} />
          <div style={{ display:"flex", gap:10, marginTop:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:C.textMuted }}>{d.progress}%</span>
            <span style={{ fontSize:10, color:late?C.red:days<=7?C.yellow:C.textMuted }}>
              {late?`${Math.abs(days)}d overdue`:`${days}d left`}
            </span>
            <span style={{ fontSize:10, color:C.textMuted }}>→ {lastName(users, d.delegated_to)}</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end", flexShrink:0 }}>
          <StatusBadge status={d.status} />
          <PriorityBadge priority={d.priority} />
        </div>
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════

// ── LOGIN ──────────────────────────────────────
const Login = ({ onLogin }) => {
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const tryLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const u = await res.json();
        setError("");
        onLogin(u);
      } else {
        setError("Invalid credentials. Use a demo account below.");
      }
    } catch (e) {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const DEMOS = ["chairman","ceo","cfo","coo","cso","clo"].map(r=>({
    role:r.toUpperCase()==="CSO"?"CSO":r.toUpperCase()==="CLO"?"CLO":r.charAt(0).toUpperCase()+r.slice(1),
    email:`${r}@ecc.com`
  }));

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16, position:"relative", overflow:"hidden" }}>
      {/* Grid bg */}
      <div style={{ position:"absolute", inset:0, opacity:.025, backgroundImage:"linear-gradient(#c9a227 1px,transparent 1px),linear-gradient(90deg,#c9a227 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
      <div style={{ position:"absolute", top:"15%", left:"8%", width:500, height:500, background:`radial-gradient(circle,${C.gold}06,transparent 65%)`, borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"5%", width:360, height:360, background:`radial-gradient(circle,${C.pink}05,transparent 65%)`, borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:58, height:58, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, marginBottom:16, fontSize:26 }}>⚡</div>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:24, fontWeight:900, color:C.text, letterSpacing:3, lineHeight:1.1 }}>EXECUTIVE</div>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:24, fontWeight:900, color:C.gold, letterSpacing:3 }}>COMMAND CENTER</div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:6, letterSpacing:3, textTransform:"uppercase" }}>Directive Governance Platform</div>
        </div>

        <Card style={{ boxShadow:"0 24px 80px rgba(0,0,0,.6)" }}>
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="name@ecc.com" />
          <Field label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
          {error && <div style={{ color:C.red, fontSize:12, marginBottom:12, padding:"8px 12px", background:C.redDim, borderRadius:6, border:`1px solid ${C.red}30` }}>{error}</div>}
          <Btn full onClick={tryLogin} disabled={loading||!email}>{loading?"Authenticating…":"Sign In to Command Center"}</Btn>

          <Divider />
          <div style={{ fontSize:10, color:C.textMuted, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Quick Demo Access</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {DEMOS.map(d=>(
              <button key={d.role} onClick={()=>{setEmail(d.email);setPass("demo");}} style={{
                background:C.surfaceAlt, border:`1px solid ${C.border}`, color:C.textSub,
                padding:"4px 10px", borderRadius:6, fontSize:11, cursor:"pointer", fontWeight:600,
                transition:"border-color .15s"
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.goldBorder}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
              >{d.role}</button>
            ))}
          </div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:7 }}>Click a role to prefill → Sign In (any password)</div>
        </Card>
      </div>
    </div>
  );
};

// ── CHAIRMAN DASHBOARD ────────────────────────
const ChairmanDash = ({ directives, users, onPick }) => {
  const total     = directives.length;
  const active    = directives.filter(d=>!["Completed","Archived"].includes(d.status)).length;
  const completed = directives.filter(d=>d.status==="Completed").length;
  const overdue   = directives.filter(d=>d.status==="Overdue").length;

  const deptRows = ["Finance","Strategy","Investment","Operations","Legal"].map(dept=>{
    const ds   = directives.filter(d=>d.dept===dept);
    const comp = ds.filter(d=>d.status==="Completed").length;
    const over = ds.filter(d=>d.status==="Overdue").length;
    const rate = ds.length?Math.round(comp/ds.length*100):0;
    return { dept, total:ds.length, comp, over, rate };
  });

  const execRows = users.filter(u=>["CFO","CSO","CISO","COO","CLO"].includes(u.role)).map(u=>{
    const ds   = directives.filter(d=>d.delegated_to===u.user_id);
    const comp = ds.filter(d=>d.status==="Completed").length;
    const over = ds.filter(d=>d.status==="Overdue").length;
    const rate = ds.length?Math.round(comp/ds.length*100):0;
    return { ...u, assigned:ds.length, comp, over, rate };
  });

  return (
    <div>
      <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>Chairman Overview</h2>
      <p style={{ margin:"0 0 22px", color:C.textSub, fontSize:13 }}>Full system visibility · {fmt(new Date())}</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
        <KPI label="Total Directives" value={total} icon="📋" color={C.gold}   sub="All time" />
        <KPI label="Active"           value={active} icon="⚡" color={C.blue}   sub="Ongoing" />
        <KPI label="Completed"        value={completed} icon="✅" color={C.green} sub="This quarter" />
        <KPI label="Overdue"          value={overdue} icon="⚠️" color={C.red}    sub="Needs action" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:22 }}>
        {/* Dept performance */}
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Department Performance</div>
          {deptRows.map(r=>(
            <div key={r.dept} style={{ marginBottom:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:C.text, fontWeight:600 }}>{r.dept}</span>
                <span style={{ fontSize:11, fontWeight:700, color:r.rate>=70?C.green:r.rate>=40?C.yellow:C.red }}>{r.rate}%</span>
              </div>
              <div style={{ background:C.border, borderRadius:3, height:5 }}>
                <div style={{ width:`${r.rate}%`, height:5, background:r.rate>=70?C.green:r.rate>=40?C.yellow:C.red, borderRadius:3 }} />
              </div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>{r.total} directives · {r.over} overdue</div>
            </div>
          ))}
        </Card>

        {/* Executive scoreboard */}
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Executive Scoreboard</div>
          {execRows.map(e=>{
            const rc = ROLE_CONFIG[e.role]||ROLE_CONFIG.Director;
            return (
              <div key={e.user_id} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
                <Avatar name={e.name} size={34} color={rc.color} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{e.name.split(" ").slice(-1)[0]}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{e.role} · {e.assigned} directives</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:900, color:e.rate>=70?C.green:e.rate>=40?C.yellow:C.red }}>{e.rate}%</div>
                  {e.over>0&&<div style={{ fontSize:10, color:C.red }}>{e.over} overdue</div>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Active Directives</div>
      {directives.filter(d=>!["Completed","Archived"].includes(d.status)).map(d=>(
        <DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} compact />
      ))}
    </div>
  );
};

// ── CEO DASHBOARD ─────────────────────────────
const CEODash = ({ directives, users, onPick }) => {
  const pendReview = directives.filter(d=>d.status==="Review");
  const overdue    = directives.filter(d=>d.status==="Overdue");
  return (
    <div>
      <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>CEO Overview</h2>
      <p style={{ margin:"0 0 22px", color:C.textSub, fontSize:13 }}>All directives · Execution visibility</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
        <KPI label="From Chairman" value={directives.filter(d=>d.issued_by==="U001").length} icon="📥" color={C.gold} />
        <KPI label="Delegated"     value={directives.filter(d=>d.assigned_to==="U002"&&d.delegated_to!=="U002").length} icon="📤" color={C.blue} />
        <KPI label="Pending Review" value={pendReview.length} icon="👁️" color={C.yellow} />
        <KPI label="Overdue"       value={overdue.length} icon="⚠️" color={C.red} />
      </div>
      {pendReview.length>0&&(
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.yellow, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>⚡ Awaiting Your Review</div>
          {pendReview.map(d=><DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} />)}
        </div>
      )}
      <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>All Directives</div>
      {directives.map(d=><DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} compact />)}
    </div>
  );
};

// ── EXEC DASHBOARD ────────────────────────────
const ExecDash = ({ currentUser, directives, users, onPick }) => {
  const rc = ROLE_CONFIG[currentUser.role];
  const mine = directives.filter(d=>
    rc?.depts?.includes("all")||rc?.depts?.includes(d.dept)||
    d.delegated_to===currentUser.user_id||d.assigned_to===currentUser.user_id
  );
  return (
    <div>
      <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>{currentUser.role} Dashboard</h2>
      <p style={{ margin:"0 0 22px", color:C.textSub, fontSize:13 }}>{currentUser.dept} · {currentUser.name}</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
        <KPI label="Assigned"    value={mine.length} icon="📋" color={rc?.color||C.gold} />
        <KPI label="In Progress" value={mine.filter(d=>d.status==="In Progress").length} icon="▶" color={C.blue} />
        <KPI label="Overdue"     value={mine.filter(d=>d.status==="Overdue").length} icon="⚠️" color={C.red} />
        <KPI label="Completed"   value={mine.filter(d=>d.status==="Completed").length} icon="✅" color={C.green} />
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>My Directives</div>
      {mine.length===0
        ? <Card style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:28, marginBottom:8 }}>📭</div><div style={{ color:C.textSub }}>No directives assigned to your department</div></Card>
        : mine.map(d=><DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} />)
      }
    </div>
  );
};

// ── DIRECTIVE DETAIL ──────────────────────────
const Detail = ({ d: initD, users, currentUser, allDirectives, onUpdate, onBack, logAction, pushNotif }) => {
  const [d, setD]             = useState(initD);
  const [tab, setTab]         = useState("overview");
  const [comment, setComment] = useState("");
  const [progress, setProgress] = useState(initD.progress);
  const [showStatus, setShowStatus] = useState(false);
  const [showTask,   setShowTask]   = useState(false);
  const [newStatus,  setNewStatus]  = useState("");
  const [task,       setTask]       = useState({ title:"", assigned_to:"", due:"" });

  const rc     = ROLE_CONFIG[currentUser.role];
  const canEdit = rc?.canViewAll || d.delegated_to===currentUser.user_id || d.assigned_to===currentUser.user_id;
  const nexts  = STATUS_FLOW[d.status] || [];
  const days   = daysLeft(d.deadline);

  const save = updated => {
    setD(updated);
    onUpdate(updated);
  };

  const postComment = () => {
    if (!comment.trim()) return;
    const newComment = { comment_id:"C"+uid(), user_id:currentUser.user_id, text:comment.trim(), ts:new Date().toISOString() };
    const updated = { ...d, comments:[...d.comments, newComment] };
    save(updated);
    logAction(currentUser.user_id, d.directive_id, "comment_added");
    setComment("");
    fetch(`/api/directives/${d.directive_id}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newComment) }).catch(console.error);
  };

  const changeStatus = () => {
    if (!newStatus) return;
    const updated = { ...d, status:newStatus, progress:newStatus==="Completed"?100:d.progress };
    save(updated);
    logAction(currentUser.user_id, d.directive_id, "status_updated", d.status, newStatus);
    pushNotif(d.issued_by, newStatus==="Completed"?"completed":"status_change", `${d.directive_id} moved to ${newStatus}`, d.directive_id);
    setShowStatus(false);
    setNewStatus("");
  };

  const saveProgress = () => {
    save({ ...d, progress });
    logAction(currentUser.user_id, d.directive_id, "progress_updated", d.progress+"%", progress+"%");
  };

  const addTask = () => {
    if (!task.title.trim()) return;
    const newTask = { task_id:"T"+uid(), title:task.title.trim(), assigned_to:task.assigned_to||currentUser.user_id, due:task.due, status:"Pending", progress:0 };
    const updated = { ...d, tasks:[...d.tasks, newTask] };
    save(updated);
    logAction(currentUser.user_id, d.directive_id, "task_created");
    setShowTask(false);
    setTask({ title:"", assigned_to:"", due:"" });
    fetch(`/api/directives/${d.directive_id}/tasks`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newTask) }).catch(console.error);
  };

  const toggleTask = taskId => {
    const toggled = d.tasks.find(t=>t.task_id===taskId);
    const newStatus = toggled?.status==="Completed"?"Pending":"Completed";
    const newProgress = toggled?.status==="Completed"?0:100;
    const updated = { ...d, tasks:d.tasks.map(t=>t.task_id===taskId?{...t,status:newStatus,progress:newProgress}:t) };
    const done  = updated.tasks.filter(t=>t.status==="Completed").length;
    updated.progress = updated.tasks.length ? Math.round(done/updated.tasks.length*100) : d.progress;
    setProgress(updated.progress);
    save(updated);
    fetch(`/api/tasks/${taskId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:newStatus, progress:newProgress }) }).catch(console.error);
  };

  const deptUsers = users.filter(u=>u.dept===d.dept||["Chairman","CEO"].includes(u.role));

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6, padding:0 }}>← Back</button>

      {/* Header */}
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", marginBottom:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:C.textMuted, fontFamily:"monospace", marginBottom:3 }}>{d.directive_id}</div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:C.text, lineHeight:1.3, fontFamily:"'Georgia',serif" }}>{d.title}</h2>
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
            <StatusBadge status={d.status} />
            <PriorityBadge priority={d.priority} />
            <Tag color={C.blue}>{d.dept}</Tag>
            <span style={{ fontSize:11, color:days<0?C.red:days<=7?C.yellow:C.textMuted }}>
              📅 {days<0?`${Math.abs(days)}d overdue`:`${days}d remaining`} · {fmtS(d.deadline)}
            </span>
          </div>
        </div>
        {canEdit && nexts.length>0 && <Btn onClick={()=>setShowStatus(true)} icon="↗">Update Status</Btn>}
      </div>

      {/* Progress */}
      <Card style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7, flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:C.textSub, fontWeight:600 }}>Overall Progress</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {canEdit&&<input type="range" min={0} max={100} value={progress} onChange={e=>setProgress(Number(e.target.value))} style={{ width:100, accentColor:C.gold }} />}
            <span style={{ fontSize:17, fontWeight:900, color:C.gold, fontVariantNumeric:"tabular-nums" }}>{progress}%</span>
            {canEdit&&progress!==d.progress&&<Btn small onClick={saveProgress}>Save</Btn>}
          </div>
        </div>
        <Bar value={progress} status={d.status} height={7} />
      </Card>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, marginBottom:14, overflowX:"auto" }}>
        {["overview","tasks","comments","attachments"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"9px 14px", border:"none", background:"transparent",
            color:tab===t?C.gold:C.textSub,
            borderBottom:tab===t?`2px solid ${C.gold}`:"2px solid transparent",
            fontSize:12, cursor:"pointer", fontWeight:tab===t?700:400,
            textTransform:"capitalize", whiteSpace:"nowrap"
          }}>
            {t} {t==="tasks"?`(${d.tasks.length})`:t==="comments"?`(${d.comments.length})`:""}
          </button>
        ))}
      </div>

      {/* overview */}
      {tab==="overview"&&(
        <div>
          <Card style={{ marginBottom:10 }}>
            <p style={{ margin:0, fontSize:13, color:C.textSub, lineHeight:1.7 }}>{d.description}</p>
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[
              ["Issued By", byId(users,d.issued_by)?.name],
              ["Assigned To", byId(users,d.assigned_to)?.name],
              ["Executing", byId(users,d.delegated_to)?.name],
              ["Department", d.dept],
              ["Deadline", fmt(d.deadline)],
              ["Created", fmtT(d.created)],
            ].map(([k,v])=>(
              <div key={k} style={{ padding:"11px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:.7, marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v||"—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* tasks */}
      {tab==="tasks"&&(
        <div>
          {canEdit&&<div style={{ marginBottom:12 }}><Btn small icon="+" onClick={()=>setShowTask(true)}>Add Task</Btn></div>}
          {d.tasks.length===0
            ? <Card style={{ textAlign:"center", padding:30 }}><div style={{ color:C.textSub, fontSize:13 }}>No tasks yet.</div></Card>
            : d.tasks.map(t=>(
              <div key={t.task_id} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"11px 13px", background:C.surfaceAlt, borderRadius:8, marginBottom:7, border:`1px solid ${t.status==="Completed"?C.green+"35":C.border}` }}>
                <div onClick={()=>canEdit&&toggleTask(t.task_id)} style={{ width:17,height:17,borderRadius:4,border:`2px solid ${t.status==="Completed"?C.green:C.border}`,background:t.status==="Completed"?C.greenDim:"transparent",cursor:canEdit?"pointer":"default",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.green }}>
                  {t.status==="Completed"?"✓":""}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.status==="Completed"?C.textSub:C.text, textDecoration:t.status==="Completed"?"line-through":"none" }}>{t.title}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>→ {lastName(users,t.assigned_to)}{t.due&&` · Due ${fmtS(t.due)}`}</div>
                </div>
                <StatusBadge status={t.status==="Pending"?"New":t.status} />
              </div>
            ))
          }
        </div>
      )}

      {/* comments */}
      {tab==="comments"&&(
        <div>
          {d.comments.map(c=>{
            const u = byId(users,c.user_id);
            const rc2 = ROLE_CONFIG[u?.role]||ROLE_CONFIG.Team;
            return (
              <div key={c.comment_id} style={{ display:"flex", gap:10, marginBottom:14 }}>
                <Avatar name={u?.name||"?"} size={32} color={rc2.color} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"baseline", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{u?.name?.split(" ").slice(-1)[0]||"Unknown"}</span>
                    <span style={{ fontSize:11, color:rc2.color }}>{u?.role}</span>
                    <span style={{ fontSize:10, color:C.textMuted }}>{fmtT(c.ts)}</span>
                  </div>
                  <div style={{ fontSize:13, color:C.textSub, background:C.surfaceAlt, padding:"9px 13px", borderRadius:8, lineHeight:1.6, border:`1px solid ${C.border}` }}>{c.text}</div>
                </div>
              </div>
            );
          })}
          {d.comments.length===0&&<div style={{ color:C.textSub, fontSize:13, marginBottom:12 }}>No comments yet.</div>}
          {canEdit&&(
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment…" style={{ flex:1, background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", resize:"none", height:68, fontFamily:"inherit" }} />
              <Btn onClick={postComment} disabled={!comment.trim()}>Post</Btn>
            </div>
          )}
        </div>
      )}

      {/* attachments */}
      {tab==="attachments"&&(
        <div>
          {d.attachments.length===0
            ? <Card style={{ textAlign:"center", padding:30 }}><div style={{ fontSize:26, marginBottom:6 }}>📎</div><div style={{ color:C.textSub, fontSize:13 }}>No attachments</div></Card>
            : d.attachments.map((a,i)=>(
              <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"11px 13px", background:C.surfaceAlt, borderRadius:8, marginBottom:7, border:`1px solid ${C.border}` }}>
                <span style={{ fontSize:20 }}>📄</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{a.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{a.size} · {a.uploaded}</div>
                </div>
                <Btn variant="ghost" small>Download</Btn>
              </div>
            ))
          }
        </div>
      )}

      {/* Status modal */}
      {showStatus&&(
        <Modal title="Update Status" onClose={()=>{setShowStatus(false);setNewStatus("");}}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, color:C.textSub, marginBottom:10 }}>Current: <StatusBadge status={d.status} /></div>
            <div style={{ fontSize:11, color:C.textSub, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Move to:</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {nexts.map(s=>(
                <button key={s} onClick={()=>setNewStatus(s)} style={{
                  padding:"8px 16px", borderRadius:8, cursor:"pointer",
                  background:newStatus===s?(STATUS_META[s]?.bg||C.surfaceAlt):C.surfaceAlt,
                  border:`1px solid ${newStatus===s?(STATUS_META[s]?.color||C.border):C.border}`,
                  color:newStatus===s?(STATUS_META[s]?.color||C.text):C.textSub,
                  fontSize:13, fontWeight:newStatus===s?700:400
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={()=>{setShowStatus(false);setNewStatus("");}}>Cancel</Btn>
            <Btn onClick={changeStatus} disabled={!newStatus}>Confirm</Btn>
          </div>
        </Modal>
      )}

      {/* Task modal */}
      {showTask&&(
        <Modal title="Add Task" onClose={()=>setShowTask(false)}>
          <Field label="Task Title" value={task.title} onChange={v=>setTask({...task,title:v})} placeholder="Describe the task…" required />
          <Field label="Assign To" value={task.assigned_to} onChange={v=>setTask({...task,assigned_to:v})} as="select"
            options={deptUsers.map(u=>({value:u.user_id,label:`${u.name} (${u.role})`}))} />
          <Field label="Due Date" value={task.due} onChange={v=>setTask({...task,due:v})} type="date" />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={()=>setShowTask(false)}>Cancel</Btn>
            <Btn onClick={addTask} disabled={!task.title.trim()}>Add Task</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── ALL DIRECTIVES ────────────────────────────
const AllDirectives = ({ directives, users, currentUser, onPick, onNew }) => {
  const [f, setF] = useState({ status:"", priority:"", dept:"", q:"" });
  const rc = ROLE_CONFIG[currentUser.role];
  const visible = directives.filter(d=>{
    if (!rc?.canViewAll&&!rc?.depts?.includes("all")&&!rc?.depts?.includes(d.dept)&&d.delegated_to!==currentUser.user_id) return false;
    if (f.status && d.status!==f.status) return false;
    if (f.priority && d.priority!==f.priority) return false;
    if (f.dept && d.dept!==f.dept) return false;
    if (f.q && !d.title.toLowerCase().includes(f.q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>Directives</h2>
          <p style={{ margin:"3px 0 0", color:C.textSub, fontSize:13 }}>{visible.length} matching</p>
        </div>
        {rc?.canCreate&&<Btn onClick={onNew} icon="＋">New Directive</Btn>}
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
        <input value={f.q} onChange={e=>setF({...f,q:e.target.value})} placeholder="🔍 Search…" style={{ flex:1, minWidth:160, background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
        {[
          {key:"status", opts:["New","Assigned","Accepted","In Progress","Review","Completed","Overdue","Archived"]},
          {key:"priority",opts:["High","Medium","Low"]},
          {key:"dept",   opts:["Finance","Strategy","Investment","Operations","Legal"]},
        ].map(({key,opts})=>(
          <select key={key} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 10px", color:f[key]?C.text:C.textSub, fontSize:12, outline:"none", cursor:"pointer" }}>
            <option value="">All {key}s</option>
            {opts.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
      {visible.length===0
        ? <Card style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:28, marginBottom:8 }}>🔍</div><div style={{ color:C.textSub }}>No directives match filters</div></Card>
        : visible.map(d=><DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} />)
      }
    </div>
  );
};

// ── CREATE DIRECTIVE ──────────────────────────
const CreateDirective = ({ users, currentUser, onSave, onCancel }) => {
  const [form, setForm] = useState({ title:"", description:"", assigned_to:"U002", dept:"Finance", priority:"Medium", deadline:"" });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = () => {
    if (!form.title.trim()||!form.deadline) return;
    const DEPT_EXEC = { Finance:"U003", Strategy:"U004", Investment:"U005", Operations:"U006", Legal:"U007" };
    onSave({
      directive_id:"DIR-2026-"+String(Math.floor(Math.random()*900+100)),
      ...form, title:form.title.trim(), description:form.description.trim(),
      issued_by:currentUser.user_id,
      delegated_to:form.assigned_to==="U002"?(DEPT_EXEC[form.dept]||form.assigned_to):form.assigned_to,
      status:"New", progress:0,
      created:new Date().toISOString(),
      tasks:[], comments:[], attachments:[],
    });
  };

  const execs = users.filter(u=>["CEO","CFO","CSO","CISO","COO","CLO"].includes(u.role))
    .map(u=>({value:u.user_id, label:`${u.name} (${u.role})`}));

  return (
    <div>
      <button onClick={onCancel} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6, padding:0 }}>← Cancel</button>
      <h2 style={{ margin:"0 0 18px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>Issue New Directive</h2>
      <Card>
        <Field label="Directive Title" value={form.title} onChange={v=>f("title",v)} placeholder="Clear, action-oriented title…" required />
        <Field label="Description / Brief" value={form.description} onChange={v=>f("description",v)} as="textarea" placeholder="Detailed directive brief, expected outcomes, and context…" rows={4} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Assign To" value={form.assigned_to} onChange={v=>f("assigned_to",v)} as="select" options={execs} />
          <Field label="Department" value={form.dept} onChange={v=>f("dept",v)} as="select" options={["Finance","Strategy","Investment","Operations","Legal"]} />
          <Field label="Priority" value={form.priority} onChange={v=>f("priority",v)} as="select" options={["High","Medium","Low"]} />
          <Field label="Deadline" value={form.deadline} onChange={v=>f("deadline",v)} type="date" required />
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:6 }}>
          <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
          <Btn onClick={submit} disabled={!form.title.trim()||!form.deadline} icon="📋">Issue Directive</Btn>
        </div>
      </Card>
    </div>
  );
};

// ── AUDIT LOG ────────────────────────────────
const AuditLog = ({ auditLog, users, directives }) => {
  const ACTION = {
    directive_created:  { label:"Created",          icon:"📋", color:C.blue },
    task_assigned:      { label:"Task Assigned",     icon:"📤", color:C.gold },
    status_updated:     { label:"Status Updated",    icon:"↗",  color:C.yellow },
    directive_completed:{ label:"Completed",         icon:"✅", color:C.green },
    deadline_breach:    { label:"Deadline Breach",   icon:"⚠️", color:C.red },
    comment_added:      { label:"Comment Added",     icon:"💬", color:C.purple },
    progress_updated:   { label:"Progress Updated",  icon:"▶",  color:C.cyan },
    task_created:       { label:"Task Created",      icon:"✚",  color:C.blue },
    user_created:       { label:"User Created",      icon:"👤", color:C.green },
    user_updated:       { label:"User Updated",      icon:"✏️", color:C.yellow },
    user_deleted:       { label:"User Deleted",      icon:"🗑️", color:C.red },
    user_suspended:     { label:"User Suspended",    icon:"🔒", color:C.red },
    password_reset:     { label:"Password Reset",    icon:"🔑", color:C.purple },
  };
  return (
    <div>
      <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>Audit Trail</h2>
      <p style={{ margin:"0 0 18px", color:C.textSub, fontSize:13 }}>Immutable activity log · {auditLog.length} events</p>
      <Card>
        {[...auditLog].reverse().map((log,i)=>{
          const u   = log.user_id==="System"?{name:"System",role:"Automated"}:byId(users,log.user_id);
          const am  = ACTION[log.action]||{ label:log.action, icon:"◈", color:C.textSub };
          const dir = directives.find(d=>d.directive_id===log.directive_id);
          return (
            <div key={log.log_id} style={{ display:"flex", gap:10, padding:"11px 0", borderBottom:i<auditLog.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:30,height:30,borderRadius:"50%",background:`${am.color}15`,border:`1px solid ${am.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>{am.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:7, alignItems:"baseline", flexWrap:"wrap" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{u?.name?.split(" ").slice(-1)[0]||"Unknown"}</span>
                  <span style={{ fontSize:11, color:am.color, fontWeight:600 }}>{am.label}</span>
                  {log.directive_id&&<span style={{ fontSize:10, color:C.textMuted, fontFamily:"monospace" }}>{log.directive_id}</span>}
                </div>
                {dir&&<div style={{ fontSize:11, color:C.textSub, marginTop:1 }}>{dir.title}</div>}
                {log.prev&&log.next&&<div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}><span style={{color:C.textSub}}>{log.prev}</span> → <span style={{color:am.color}}>{log.next}</span></div>}
                <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{fmtT(log.ts)} · IP {log.ip}</div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

// ── ARCHIVE ───────────────────────────────────
const Archive = ({ directives, users, onPick }) => {
  const [q, setQ]   = useState("");
  const [dept, setDept] = useState("");
  const pool    = directives.filter(d=>["Completed","Archived"].includes(d.status));
  const visible = pool.filter(d=>{
    if (dept&&d.dept!==dept) return false;
    if (q&&!d.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <div>
      <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>Archive</h2>
      <p style={{ margin:"0 0 16px", color:C.textSub, fontSize:13 }}>{pool.length} completed directives</p>
      <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search archive…" style={{ flex:1, minWidth:160, background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
        <select value={dept} onChange={e=>setDept(e.target.value)} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 10px", color:dept?C.text:C.textSub, fontSize:12, outline:"none" }}>
          <option value="">All Departments</option>
          {["Finance","Strategy","Investment","Operations","Legal"].map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {visible.length===0
        ? <Card style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:28, marginBottom:8 }}>📦</div><div style={{ color:C.textSub }}>No archived directives found</div></Card>
        : visible.map(d=><DRow key={d.directive_id} d={d} users={users} onClick={()=>onPick(d)} />)
      }
    </div>
  );
};

// ── USER MANAGEMENT (CHAIRMAN FULL CONTROL) ───
const Users = ({ users, currentUser, onUpdateUsers, logAction, toast }) => {
  const [modal, setModal]       = useState(null); // null | "add" | "edit" | "delete" | "suspend" | "reset"
  const [target, setTarget]     = useState(null);
  const [search, setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm]         = useState({ name:"", email:"", role:"Director", dept:"Finance", status:"Active", phone:"" });
  const [resetPwd, setResetPwd] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const isChairman = currentUser.role==="Chairman";

  const visible = users.filter(u=>{
    if (search&&!u.name.toLowerCase().includes(search.toLowerCase())&&!u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRole&&u.role!==filterRole) return false;
    if (filterStatus&&u.status!==filterStatus) return false;
    return true;
  });

  const openAdd = () => {
    setTarget(null);
    setForm({ name:"", email:"", role:"Director", dept:"Finance", status:"Active", phone:"" });
    setModal("add");
  };

  const openEdit = u => {
    setTarget(u);
    setForm({ name:u.name, email:u.email, role:u.role, dept:u.dept, status:u.status, phone:u.phone||"" });
    setModal("edit");
  };

  const openDelete = u => { setTarget(u); setDeleteConfirm(""); setModal("delete"); };
  const openSuspend = u => { setTarget(u); setModal("suspend"); };
  const openReset = u => { setTarget(u); setResetPwd(""); setModal("reset"); };

  const saveUser = () => {
    if (!form.name.trim()||!form.email.trim()) return;
    const newUser = { user_id:"U"+uid(), ...form, name:form.name.trim(), email:form.email.trim(), joined:new Date().toISOString().split("T")[0] };
    onUpdateUsers([...users, newUser]);
    logAction(currentUser.user_id, null, "user_created", null, form.email);
    toast("User created: "+form.name.trim());
    setModal(null);
    fetch('/api/users', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newUser) }).catch(console.error);
  };

  const updateUser = () => {
    if (!form.name.trim()||!form.email.trim()) return;
    onUpdateUsers(users.map(u=>u.user_id===target.user_id?{...u,...form,name:form.name.trim(),email:form.email.trim()}:u));
    logAction(currentUser.user_id, null, "user_updated", target.email, form.email);
    toast("User updated: "+form.name.trim());
    setModal(null);
    fetch(`/api/users/${target.user_id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,name:form.name.trim(),email:form.email.trim()}) }).catch(console.error);
  };

  const deleteUser = () => {
    if (deleteConfirm.trim().toLowerCase()!=="delete") return;
    onUpdateUsers(users.filter(u=>u.user_id!==target.user_id));
    logAction(currentUser.user_id, null, "user_deleted", target.email, "removed");
    toast("User removed: "+target.name, "warn");
    setModal(null);
    fetch(`/api/users/${target.user_id}`, { method:'DELETE' }).catch(console.error);
  };

  const toggleSuspend = () => {
    const newStatus = target.status==="Suspended"?"Active":"Suspended";
    onUpdateUsers(users.map(u=>u.user_id===target.user_id?{...u,status:newStatus}:u));
    logAction(currentUser.user_id, null, target.status==="Suspended"?"user_updated":"user_suspended", target.status, newStatus);
    toast(`${target.name} ${newStatus==="Suspended"?"suspended":"reinstated"}`);
    setModal(null);
    fetch(`/api/users/${target.user_id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...target,status:newStatus}) }).catch(console.error);
  };

  const doReset = () => {
    if (!resetPwd.trim()||resetPwd.length<4) return;
    logAction(currentUser.user_id, null, "password_reset", target.email, "password changed");
    toast("Password reset for "+target.name);
    setModal(null);
  };

  const closeModal = () => { setModal(null); setTarget(null); };

  const allRoles = [...new Set(users.map(u=>u.role))];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:C.text, fontFamily:"'Georgia',serif" }}>User Management</h2>
          <p style={{ margin:"3px 0 0", color:C.textSub, fontSize:13 }}>
            {users.length} users · {users.filter(u=>u.status==="Active").length} active · {users.filter(u=>u.status==="Suspended").length} suspended
          </p>
        </div>
        {isChairman&&<Btn onClick={openAdd} icon="＋">Add User</Btn>}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name or email…" style={{ flex:1, minWidth:180, background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
        <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 10px", color:filterRole?C.text:C.textSub, fontSize:12, outline:"none" }}>
          <option value="">All Roles</option>
          {allRoles.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 10px", color:filterStatus?C.text:C.textSub, fontSize:12, outline:"none" }}>
          <option value="">All Status</option>
          {["Active","Inactive","Suspended"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {visible.length===0
        ? <Card style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:28, marginBottom:8 }}>👥</div><div style={{ color:C.textSub }}>No users match search</div></Card>
        : visible.map(u=>{
          const rc = ROLE_CONFIG[u.role]||ROLE_CONFIG.Team;
          const isSelf = u.user_id===currentUser.user_id;
          const isProtected = ["Chairman"].includes(u.role)&&!isSelf;
          return (
            <Card key={u.user_id} style={{ padding:"14px 16px", marginBottom:7, opacity:u.status==="Suspended"?.65:1 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                <Avatar name={u.name} size={42} color={u.status==="Suspended"?C.textMuted:rc.color} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:u.status==="Suspended"?C.textSub:C.text }}>{u.name}</span>
                    {isSelf&&<Tag color={C.gold}>You</Tag>}
                    {u.status==="Suspended"&&<Tag color={C.red}>Suspended</Tag>}
                  </div>
                  <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{u.email}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>
                    {u.phone&&<span>{u.phone} · </span>}Joined {fmt(u.joined)}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <RoleBadge role={u.role} />
                  <Tag color={C.blue}>{u.dept}</Tag>
                  <Tag color={u.status==="Active"?C.green:u.status==="Suspended"?C.red:C.textMuted}>{u.status}</Tag>
                </div>
                {isChairman&&!isSelf&&(
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    <Btn variant="ghost" small onClick={()=>openEdit(u)} icon="✏️">Edit</Btn>
                    <Btn variant="ghost" small onClick={()=>openReset(u)} icon="🔑">Reset</Btn>
                    <Btn variant={u.status==="Suspended"?"success":"warn"} small onClick={()=>openSuspend(u)}>
                      {u.status==="Suspended"?"Reinstate":"Suspend"}
                    </Btn>
                    {!isProtected&&<Btn variant="danger" small onClick={()=>openDelete(u)} icon="🗑️">Delete</Btn>}
                  </div>
                )}
              </div>
            </Card>
          );
        })
      }

      {/* ── ADD USER MODAL ── */}
      {modal==="add"&&(
        <Modal title="Add New User" onClose={closeModal}>
          <Field label="Full Name"  value={form.name}   onChange={v=>f("name",v)}  placeholder="Full name" required />
          <Field label="Email"      value={form.email}  onChange={v=>f("email",v)} type="email" placeholder="user@ecc.com" required />
          <Field label="Phone"      value={form.phone}  onChange={v=>f("phone",v)} placeholder="+92-300-0000000" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label="Role" value={form.role} onChange={v=>f("role",v)} as="select"
              options={["CEO","CFO","CSO","CISO","COO","CLO","Director","Team"]} />
            <Field label="Department" value={form.dept} onChange={v=>f("dept",v)} as="select"
              options={["Executive","Finance","Strategy","Investment","Operations","Legal"]} />
          </div>
          <Field label="Status" value={form.status} onChange={v=>f("status",v)} as="select" options={["Active","Inactive"]} />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={closeModal}>Cancel</Btn>
            <Btn onClick={saveUser} disabled={!form.name.trim()||!form.email.trim()} icon="＋">Add User</Btn>
          </div>
        </Modal>
      )}

      {/* ── EDIT USER MODAL ── */}
      {modal==="edit"&&target&&(
        <Modal title={`Edit — ${target.name}`} onClose={closeModal}>
          <div style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, marginBottom:16, border:`1px solid ${C.border}` }}>
            <Avatar name={target.name} size={36} color={(ROLE_CONFIG[target.role]||ROLE_CONFIG.Team).color} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{target.name}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{target.email} · Since {fmt(target.joined)}</div>
            </div>
          </div>
          <Field label="Full Name"  value={form.name}   onChange={v=>f("name",v)}  required />
          <Field label="Email"      value={form.email}  onChange={v=>f("email",v)} type="email" required />
          <Field label="Phone"      value={form.phone}  onChange={v=>f("phone",v)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label="Role" value={form.role} onChange={v=>f("role",v)} as="select"
              options={["CEO","CFO","CSO","CISO","COO","CLO","Director","Team"]} />
            <Field label="Department" value={form.dept} onChange={v=>f("dept",v)} as="select"
              options={["Executive","Finance","Strategy","Investment","Operations","Legal"]} />
          </div>
          <Field label="Status" value={form.status} onChange={v=>f("status",v)} as="select" options={["Active","Inactive","Suspended"]} />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={closeModal}>Cancel</Btn>
            <Btn onClick={updateUser} disabled={!form.name.trim()||!form.email.trim()} icon="✓">Save Changes</Btn>
          </div>
        </Modal>
      )}

      {/* ── SUSPEND / REINSTATE MODAL ── */}
      {modal==="suspend"&&target&&(
        <Modal title={target.status==="Suspended"?"Reinstate User":"Suspend User"} onClose={closeModal} danger={target.status!=="Suspended"}>
          <div style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, marginBottom:16, border:`1px solid ${C.border}` }}>
            <Avatar name={target.name} size={36} color={(ROLE_CONFIG[target.role]||ROLE_CONFIG.Team).color} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{target.name}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{target.role} · {target.dept}</div>
            </div>
          </div>
          {target.status==="Suspended"
            ? <p style={{ color:C.textSub, fontSize:13, margin:"0 0 16px" }}>Reinstating this user will restore their access to the system. They will be able to log in and perform their role functions again.</p>
            : <p style={{ color:C.textSub, fontSize:13, margin:"0 0 16px" }}>Suspending this user will immediately revoke their system access. They will not be able to log in until reinstated. All their directives and history will be preserved.</p>
          }
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={closeModal}>Cancel</Btn>
            <Btn variant={target.status==="Suspended"?"success":"warn"} onClick={toggleSuspend}>
              {target.status==="Suspended"?"✓ Reinstate User":"Suspend User"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── DELETE USER MODAL ── */}
      {modal==="delete"&&target&&(
        <Modal title="Delete User" onClose={closeModal} danger>
          <div style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", background:C.redDim, borderRadius:8, marginBottom:16, border:`1px solid ${C.red}30` }}>
            <Avatar name={target.name} size={36} color={C.red} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{target.name}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{target.role} · {target.email}</div>
            </div>
          </div>
          <div style={{ background:C.redDim, border:`1px solid ${C.red}30`, borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:5 }}>⚠ This action is permanent and cannot be undone.</div>
            <div style={{ fontSize:12, color:C.textSub }}>The user will be permanently removed from the system. Directives assigned to them will remain but may lose assignee context.</div>
          </div>
          <Field label='Type "delete" to confirm' value={deleteConfirm} onChange={setDeleteConfirm} placeholder="delete" />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={closeModal}>Cancel</Btn>
            <Btn variant="danger" onClick={deleteUser} disabled={deleteConfirm.trim().toLowerCase()!=="delete"} icon="🗑️">Permanently Delete</Btn>
          </div>
        </Modal>
      )}

      {/* ── RESET PASSWORD MODAL ── */}
      {modal==="reset"&&target&&(
        <Modal title={`Reset Password — ${target.name}`} onClose={closeModal}>
          <div style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, marginBottom:16, border:`1px solid ${C.border}` }}>
            <Avatar name={target.name} size={36} color={(ROLE_CONFIG[target.role]||ROLE_CONFIG.Team).color} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{target.name}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{target.email}</div>
            </div>
          </div>
          <Field label="New Password (min 4 chars)" value={resetPwd} onChange={setResetPwd} type="password" placeholder="New password…" required />
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:14 }}>In production, a secure reset link would be sent to the user's registered email address.</div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={closeModal}>Cancel</Btn>
            <Btn onClick={doReset} disabled={resetPwd.length<4} icon="🔑">Set New Password</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── NOTIFICATIONS PANEL ───────────────────────
const NotifsPanel = ({ notifs, currentUser, onRead, onReadAll, onClose }) => {
  const mine = notifs.filter(n=>n.user_id===currentUser.user_id);
  const TYPE = {
    overdue:     { icon:"⚠️", color:C.red },
    completed:   { icon:"✅", color:C.green },
    assigned:    { icon:"📥", color:C.blue },
    deadline:    { icon:"⏰", color:C.yellow },
    review_ready:{ icon:"👁️", color:C.purple },
    status_change:{ icon:"↗", color:C.gold },
  };
  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:490 }} onClick={onClose} />
      <div style={{ position:"fixed", top:56, right:12, width:340, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, boxShadow:"0 20px 60px rgba(0,0,0,.7)", zIndex:500, overflow:"hidden", maxHeight:"65vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"13px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Notifications</span>
          <div style={{ display:"flex", gap:8 }}>
            {mine.some(n=>!n.read)&&<button onClick={e=>{e.stopPropagation();onReadAll();}} style={{ background:"none",border:"none",color:C.textSub,fontSize:11,cursor:"pointer" }}>Mark all read</button>}
            <button onClick={onClose} style={{ background:"none",border:"none",color:C.textSub,cursor:"pointer",fontSize:16,lineHeight:1 }}>✕</button>
          </div>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {mine.length===0
            ? <div style={{ padding:30, textAlign:"center", color:C.textSub, fontSize:13 }}>No notifications</div>
            : [...mine].reverse().map(n=>{
              const tm = TYPE[n.type]||{icon:"◈",color:C.textSub};
              return (
                <div key={n.notif_id} onClick={()=>onRead(n.notif_id)} style={{ padding:"11px 15px", borderBottom:`1px solid ${C.border}`, cursor:"pointer", background:n.read?"transparent":`${C.gold}08`, display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>{tm.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:n.read?400:700, color:n.read?C.textSub:C.text }}>{n.title}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:2, lineHeight:1.4 }}>{n.message}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{fmtT(n.ts)}</div>
                  </div>
                  {!n.read&&<div style={{ width:6,height:6,borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:3 }} />}
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════
export default function ECCApp() {
  const [user,        setUser]        = useState(null);
  const [directives,  setDirectives]  = useState([]);
  const [users,       setUsers]       = useState([]);
  const [notifs,      setNotifs]      = useState([]);
  const [auditLog,    setAuditLog]    = useState([]);
  const [view,        setView]        = useState("dashboard");
  const [selDir,      setSelDir]      = useState(null);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [sidebar,     setSidebar]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type="success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(()=>setToast(null), 3200);
  }, []);

  // Fetch all data from database
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users.filter(u => u.user_id !== 'System'));
        setDirectives(data.directives);
        setNotifs(data.notifications);
        setAuditLog(data.auditLog);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
    setDataLoading(false);
  }, []);

  const logAction = useCallback((userId, directiveId, action, prev=null, next=null) => {
    const logEntry = { log_id:"L"+uid(), user_id:userId, directive_id:directiveId, action, prev, next, ts:new Date().toISOString(), ip:"192.168.1.1" };
    setAuditLog(p => [...p, logEntry]);
    fetch('/api/audit', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(logEntry) }).catch(console.error);
  }, []);

  const pushNotif = useCallback((userId, type, message, directiveId) => {
    const TITLES = { completed:"Directive Completed", assigned:"Directive Assigned", status_change:"Status Update", overdue:"Directive Overdue" };
    const notifEntry = { notif_id:"N"+uid(), user_id:userId, type, title:TITLES[type]||"Notification", message, directive_id:directiveId, read:false, ts:new Date().toISOString() };
    setNotifs(prev=>[...prev, notifEntry]);
    fetch('/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(notifEntry) }).catch(console.error);
  }, []);

  const updateDirective = useCallback(updated => {
    setDirectives(prev=>prev.map(d=>d.directive_id===updated.directive_id?updated:d));
    setSelDir(updated);
    showToast("Directive updated");
    fetch(`/api/directives/${updated.directive_id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status: updated.status, progress: updated.progress }) }).catch(console.error);
  }, [showToast]);

  const createDirective = directive => {
    setDirectives(prev=>[...prev, directive]);
    logAction(user.user_id, directive.directive_id, "directive_created", null, "New");
    showToast("Directive issued successfully");
    setView("directives");
    fetch('/api/directives', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(directive) }).catch(console.error);
  };

  const pickDirective = d => { setSelDir(d); setView("detail"); };

  const handleLogin = async (u) => {
    if (u.status==="Suspended") { alert("Your account has been suspended. Contact the Chairman."); return; }
    setUser(u);
    setView("dashboard");
    await loadData();
    showToast(`Welcome, ${u.name.split(" ")[0]}`);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (dataLoading) return (
    <div style={{ minHeight:"100vh", background:"#06090d", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⚡</div>
        <div style={{ color:"#c9a227", fontSize:14, fontWeight:700, letterSpacing:2 }}>LOADING COMMAND CENTER…</div>
      </div>
    </div>
  );

  const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.Team;
  const unread = notifs.filter(n=>n.user_id===user.user_id&&!n.read).length;

  const NAV = [
    { id:"dashboard",  icon:"⊞", label:"Dashboard" },
    { id:"directives", icon:"📋", label:"Directives" },
    ...(rc.canCreate ? [{ id:"create", icon:"＋", label:"New Directive" }] : []),
    { id:"archive", icon:"📦", label:"Archive" },
    ...(rc.canAudit ? [{ id:"audit", icon:"🔒", label:"Audit Log" }] : []),
    ...(rc.canManageUsers ? [{ id:"users", icon:"👥", label:"Users" }] : []),
  ];

  const pageTitle = view==="detail"&&selDir ? selDir.title : (NAV.find(n=>n.id===view)?.label||"Dashboard");

  const renderView = () => {
    if (view==="detail"&&selDir)
      return <Detail d={selDir} users={users} currentUser={user} allDirectives={directives} onUpdate={updateDirective} onBack={()=>setView("directives")} logAction={logAction} pushNotif={pushNotif} />;
    if (view==="create")
      return <CreateDirective users={users} currentUser={user} onSave={createDirective} onCancel={()=>setView("directives")} />;
    if (view==="directives")
      return <AllDirectives directives={directives} users={users} currentUser={user} onPick={pickDirective} onNew={()=>setView("create")} />;
    if (view==="archive")
      return <Archive directives={directives} users={users} onPick={pickDirective} />;
    if (view==="audit")
      return <AuditLog auditLog={auditLog} users={users} directives={directives} />;
    if (view==="users")
      return <Users users={users} currentUser={user} onUpdateUsers={setUsers} logAction={logAction} toast={showToast} />;
    // dashboards
    if (user.role==="Chairman") return <ChairmanDash directives={directives} users={users} onPick={pickDirective} />;
    if (user.role==="CEO")      return <CEODash directives={directives} users={users} onPick={pickDirective} />;
    return <ExecDash currentUser={user} directives={directives} users={users} onPick={pickDirective} />;
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:"hidden", color:C.text }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:sidebar?216:56, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width .25s ease", flexShrink:0, overflow:"hidden" }}>
        {/* Brand */}
        <div style={{ padding:"16px 12px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:32,height:32,borderRadius:8,flexShrink:0,background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>⚡</div>
          {sidebar&&(
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:900, color:C.text, letterSpacing:1, whiteSpace:"nowrap" }}>ECC</div>
              <div style={{ fontSize:9, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>Command Center</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 6px", overflowY:"auto" }}>
          {NAV.map(item=>{
            const active = view===item.id||(view==="detail"&&item.id==="directives");
            return (
              <button key={item.id} onClick={()=>{ if(item.id!=="detail") setView(item.id); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:9,
                padding:"9px 9px", borderRadius:7, marginBottom:2,
                background:active?C.goldDim:"transparent",
                border:active?`1px solid ${C.goldBorder}`:"1px solid transparent",
                color:active?C.gold:C.textSub, cursor:"pointer",
                fontSize:13, textAlign:"left", transition:"all .12s"
              }}
                onMouseEnter={e=>{ if(!active){e.currentTarget.style.background=C.surfaceHover;} }}
                onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";} }}
              >
                <span style={{ fontSize:15,flexShrink:0,width:20,textAlign:"center" }}>{item.icon}</span>
                {sidebar&&<span style={{ fontWeight:active?700:400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding:"10px 6px", borderTop:`1px solid ${C.border}` }}>
          {sidebar ? (
            <div style={{ padding:"8px 8px" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                <Avatar name={user.name} size={28} color={rc.color} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name.split(" ").slice(-1)[0]}</div>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <button onClick={()=>setUser(null)} style={{ width:"100%", background:"none", border:`1px solid ${C.border}`, color:C.textSub, padding:"6px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600 }}>Sign Out</button>
            </div>
          ) : (
            <button onClick={()=>setUser(null)} style={{ width:"100%", background:"none", border:"none", color:C.textSub, cursor:"pointer", padding:8, fontSize:15, borderRadius:7 }}>⏻</button>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Top bar */}
        <div style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px", flexShrink:0, gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setSidebar(!sidebar)} style={{ background:"none",border:"none",color:C.textSub,cursor:"pointer",fontSize:17,padding:"3px 6px",borderRadius:6,lineHeight:1 }}>☰</button>
            <span style={{ fontSize:12, color:C.textMuted, maxWidth:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pageTitle}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Bell */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>setShowNotifs(!showNotifs)} style={{ background:showNotifs?C.goldDim:"none", border:"none", color:C.textSub, cursor:"pointer", fontSize:17, padding:"4px 8px", borderRadius:6 }}>🔔</button>
              {unread>0&&<div style={{ position:"absolute",top:-1,right:-1,width:15,height:15,borderRadius:"50%",background:C.red,color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center" }}>{unread>9?"9+":unread}</div>}
            </div>
            <RoleBadge role={user.role} />
            <span style={{ fontSize:11, color:C.textMuted }}>{fmtS(new Date())}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>
          {renderView()}
        </div>
      </div>

      {/* Notifications */}
      {showNotifs&&(
        <NotifsPanel notifs={notifs} currentUser={user}
          onRead={id=>{ setNotifs(p=>p.map(n=>n.notif_id===id?{...n,read:true}:n)); fetch(`/api/notifications/${id}`,{method:'PUT'}).catch(console.error); }}
          onReadAll={()=>{ setNotifs(p=>p.map(n=>n.user_id===user.user_id?{...n,read:true}:n)); fetch('/api/notifications/read-all',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:user.user_id})}).catch(console.error); }}
          onClose={()=>setShowNotifs(false)}
        />
      )}

      {/* Toast */}
      {toast&&(
        <div style={{
          position:"fixed", bottom:22, right:20,
          background:toast.type==="warn"?C.yellowDim:toast.type==="error"?C.redDim:C.greenDim,
          border:`1px solid ${toast.type==="warn"?C.yellow:toast.type==="error"?C.red:C.green}40`,
          color:toast.type==="warn"?C.yellow:toast.type==="error"?C.red:C.green,
          padding:"10px 16px", borderRadius:10, fontSize:13, fontWeight:600,
          zIndex:3000, boxShadow:"0 8px 30px rgba(0,0,0,.5)",
          display:"flex", alignItems:"center", gap:7,
          animation:"slideUp .2s ease"
        }}>
          <span>{toast.type==="warn"?"⚠":toast.type==="error"?"✕":"✓"}</span>
          {toast.msg}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.borderLight}; }
        select option { background: ${C.surfaceAlt}; color: ${C.text}; }
        @keyframes slideUp { from { transform: translateY(10px); opacity:0; } to { transform: translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}
