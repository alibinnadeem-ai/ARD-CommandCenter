// ═══════════════════════════════════════════════════════════════
// ECC — Utility Functions
// ═══════════════════════════════════════════════════════════════

export const uid = () => Math.random().toString(36).substr(2, 8).toUpperCase();

export const fmt  = ts => new Date(ts).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
export const fmtS = ts => new Date(ts).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
export const fmtT = ts => new Date(ts).toLocaleString('en-GB',    { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });

export const daysLeft = d => Math.ceil((new Date(d) - new Date()) / 86400000);

export const byId     = (list, id) => list.find(x => x.user_id === id);
export const lastName = (users, id) => byId(users, id)?.name?.split(' ').slice(-1)[0] || id;

export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export const calcProgress = tasks => {
  if (!tasks?.length) return 0;
  const done = tasks.filter(t => t.status === 'Completed').length;
  return Math.round(done / tasks.length * 100);
};

export const isOverdue = directive =>
  directive.status === 'Overdue' || daysLeft(directive.deadline) < 0;
