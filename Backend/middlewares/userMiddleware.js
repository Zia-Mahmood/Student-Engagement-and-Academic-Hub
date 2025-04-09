const express = require('express');
const router = express.Router();

// Middleware to refresh session expiry on each request
router.use((req, res, next) => {
    if (req.session.user) {
        req.session.touch(); // Reset session expiration time
    }
    next();
});
