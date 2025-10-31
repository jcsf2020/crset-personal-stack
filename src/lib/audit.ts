export type AuditPayload = Record<string, any>;
export function makeAuditPayload(p: AuditPayload) { return p; }
export async function auditLog(_p: AuditPayload): Promise<void> { /* no-op */ }
