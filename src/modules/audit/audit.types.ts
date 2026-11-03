export interface AuditLogEntry {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  previousValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

