import AuditLog from './models/AuditLog';

/**
 * Creates an audit log entry in the database.
 * Used internally within API routes since there's no Express middleware next() chain.
 */
export async function logAudit(adminId, action, resource, resourceId = null, details = {}, ipAddress = null) {
  try {
    await AuditLog.create({
      adminId,
      action,
      resource,
      resourceId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
}
