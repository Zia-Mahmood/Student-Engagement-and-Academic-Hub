// Checks whether the user is logged in (session exists)
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        // session is alive, proceed
        return next();
    }
    return res.status(401).json({ msg: "Unauthorized: Please log in." });
}

// require a minimum position/role
// e.g. only coordinators and admins can perform certain actions
function requireRole(...allowedPositions) {
    return (req, res, next) => {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized: Please log in." });
        }
        if (allowedPositions.includes(user.position)) {
            return next();
        }
        return res.status(403).json({ msg: "Forbidden: Insufficient permissions." });
    };
}

// Middleware to refresh session expiry on each request
function refreshSession(req, res, next) {
    if (req.session && req.session.user) {
        req.session.touch(); // Reset session expiration time
    }
    next();
}


module.exports = {
    requireAuth,
    requireRole,
    refreshSession,
};
