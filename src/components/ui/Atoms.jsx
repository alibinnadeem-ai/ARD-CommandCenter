'use client';
// ═══════════════════════════════════════════════════════════════
// ECC — Shared UI Atoms
// ═══════════════════════════════════════════════════════════════
import { C } from '@/lib/theme';
import { ROLE_CONFIG, STATUS_META, PRIORITY_META } from '@/lib/data';

// ─────────────────────────────────────────────
export const Avatar = ({ name = '?', size = 32, color = C.gold }) => {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg,${color}25,${color}40)`,
      border: `1.5px solid ${color}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 800, color,
      userSelect: 'none', letterSpacing: 0,
    }}>{initials}</div>
  );
};

// ─────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META['New'];
  return (
    <span style={{
      background: m.bg, color: m.color, border: `1px solid ${m.color}30`,
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 9 }}>{m.icon}</span> {status}
    </span>
  );
};

// ─────────────────────────────────────────────
export const PriorityBadge = ({ priority }) => {
  const m = PRIORITY_META[priority] || PRIORITY_META['Medium'];
  return (
    <span style={{ color: m.color, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
      {priority}
    </span>
  );
};

// ─────────────────────────────────────────────
export const RoleBadge = ({ role }) => {
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.Team;
  return (
    <span style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.color}30`, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {role}
    </span>
  );
};

// ─────────────────────────────────────────────
export const Tag = ({ children, color = C.blue }) => (
  <span style={{ background: `${color}12`, color, border: `1px solid ${color}25`, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────
export const Bar = ({ value = 0, status = 'New', height = 4 }) => {
  const col = status === 'Overdue' ? C.red : status === 'Completed' ? C.green : status === 'Review' ? C.yellow : C.blue;
  return (
    <div style={{ background: C.border, borderRadius: height, height, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%', background: `linear-gradient(90deg,${col}80,${col})`, borderRadius: height, transition: 'width .5s ease' }} />
    </div>
  );
};

// ─────────────────────────────────────────────
export const Divider = () => <div style={{ height: 1, background: C.border, margin: '14px 0' }} />;

// ─────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick, accent }) => (
  <div onClick={onClick} style={{
    background: C.surface, border: `1px solid ${accent || C.border}`,
    borderRadius: 10, padding: 18,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'border-color .15s, background .15s',
    ...style,
  }}
    onMouseEnter={onClick ? e => { e.currentTarget.style.borderColor = accent || C.goldBorder; e.currentTarget.style.background = C.surfaceHover; } : undefined}
    onMouseLeave={onClick ? e => { e.currentTarget.style.borderColor = accent || C.border; e.currentTarget.style.background = C.surface; } : undefined}
  >{children}</div>
);

// ─────────────────────────────────────────────
export const KPI = ({ label, value, sub, color = C.gold, icon }) => (
  <Card style={{ borderLeft: `3px solid ${color}`, padding: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 10, color: C.textSub, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 6, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 22, opacity: .5 }}>{icon}</span>
    </div>
  </Card>
);

// ─────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = 'primary', small, disabled, icon, full }) => {
  const V = {
    primary:   { bg: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: '#050810', border: 'none' },
    secondary: { bg: C.surfaceAlt,  color: C.textSub, border: `1px solid ${C.border}` },
    danger:    { bg: C.redDim,      color: C.red,     border: `1px solid ${C.red}40`     },
    success:   { bg: C.greenDim,    color: C.green,   border: `1px solid ${C.green}40`   },
    ghost:     { bg: 'transparent', color: C.textSub, border: `1px solid ${C.border}`    },
    warn:      { bg: C.yellowDim,   color: C.yellow,  border: `1px solid ${C.yellow}40`  },
  };
  const s = V[variant] || V.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: s.bg, color: s.color, border: s.border,
      padding: small ? '4px 11px' : '8px 16px',
      borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: small ? 11 : 13, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      opacity: disabled ? .45 : 1, transition: 'opacity .15s',
      whiteSpace: 'nowrap', width: full ? '100%' : 'auto', boxSizing: 'border-box',
    }}>
      {icon && <span style={{ fontSize: small ? 12 : 14 }}>{icon}</span>}
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
export const Field = ({ label, value, onChange, type = 'text', placeholder, required, as, options, rows = 3, disabled }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 11, color: C.textSub, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 5, fontWeight: 600 }}>
      {label}{required && <span style={{ color: C.red }}> *</span>}
    </label>}
    {as === 'select' ? (
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} style={{
        width: '100%', background: disabled ? C.bg : C.surfaceAlt, border: `1px solid ${C.border}`,
        borderRadius: 7, padding: '9px 12px', color: value ? C.text : C.textSub,
        fontSize: 13, outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .6 : 1, boxSizing: 'border-box',
      }}>
        <option value=''>— select —</option>
        {options?.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    ) : as === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{
        width: '100%', background: C.surfaceAlt, border: `1px solid ${C.border}`,
        borderRadius: 7, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none',
        resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
      }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{
        width: '100%', background: disabled ? C.bg : C.surfaceAlt, border: `1px solid ${C.border}`,
        borderRadius: 7, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none',
        boxSizing: 'border-box', opacity: disabled ? .6 : 1,
      }} />
    )}
  </div>
);

// ─────────────────────────────────────────────
export const Modal = ({ title, onClose, children, wide = false, danger = false }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, padding: 16, backdropFilter: 'blur(4px)',
  }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: C.surface, border: `1px solid ${danger ? C.red : C.border}`,
      borderRadius: 14, width: '100%', maxWidth: wide ? 800 : 500,
      maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 24px 80px rgba(0,0,0,.7)',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${danger ? C.red + '40' : C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: danger ? '#1a0505' : C.surface }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: danger ? C.red : C.text, fontFamily: "'Georgia',serif" }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px', borderRadius: 4 }}>✕</button>
      </div>
      <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1 }}>{children}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
export const DRow = ({ d, users, onClick, compact }) => {
  const { daysLeft, lastName } = require('@/lib/utils');
  const { STATUS_META } = require('@/lib/data');
  const days = daysLeft(d.deadline);
  const late = d.status === 'Overdue' || days < 0;
  const sm   = STATUS_META[d.status] || STATUS_META['New'];
  return (
    <Card onClick={onClick} style={{ padding: compact ? '11px 14px' : '15px 16px', marginBottom: 7, borderLeft: `3px solid ${sm.color}` }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: C.textMuted, fontFamily: 'monospace' }}>{d.directive_id}</span>
            <span style={{ fontSize: 10, color: C.textMuted }}>·</span>
            <span style={{ fontSize: 10, color: C.textSub }}>{d.dept}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.35, marginBottom: compact ? 5 : 9 }}>{d.title}</div>
          {!compact && <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.description}</div>}
          <Bar value={d.progress} status={d.status} />
          <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>{d.progress}%</span>
            <span style={{ fontSize: 10, color: late ? C.red : days <= 7 ? C.yellow : C.textMuted }}>
              {late ? `${Math.abs(days)}d overdue` : `${days}d left`}
            </span>
            <span style={{ fontSize: 10, color: C.textMuted }}>→ {lastName(users, d.delegated_to)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
          <StatusBadge status={d.status} />
          <PriorityBadge priority={d.priority} />
        </div>
      </div>
    </Card>
  );
};
