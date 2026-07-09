// Usage: restrictTo("admin", "agent") -- only allows listed roles through
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of these roles: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { restrictTo };
