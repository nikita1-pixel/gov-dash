const router = require('express').Router();
const auth = require('../middleware/auth'); // Our JWT security guard

// GET /api/dashboard/stats
router.get('/stats', auth, (req, res) => {
    // In a later sprint, these will come from MongoDB/PostgreSQL
    const stats = {
        pendingComplaints: 42,
        inProgressIssues: 18,
        resolved: 127,
        fundsUtilized: 72,
        publicSentiment: 8
    };
    res.json(stats);
});

module.exports = router;