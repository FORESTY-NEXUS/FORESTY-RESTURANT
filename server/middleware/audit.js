const AuditLog = require('../models/AuditLog');

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    // We capture the original send function to execute logic after response is sent
    const originalSend = res.send;
    
    res.send = async function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          let resourceId = req.params.id; // Usually ID is in params
          if (!resourceId && req.body && req.body._id) {
             resourceId = req.body._id;
          }
          
          await AuditLog.create({
            adminId: req.user._id,
            action,
            resource,
            resourceId,
            details: {
               body: req.body,
               query: req.query,
               params: req.params
            },
            ipAddress: req.ip
          });
        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      }
      originalSend.call(this, data);
    };
    next();
  };
};

module.exports = { auditLog };
