import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'UPDATE_MENU_ITEM', 'DELETE_USER'
  resource: { type: String, required: true }, // e.g., 'MenuItem', 'User'
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed }, // JSON dump of changes
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
