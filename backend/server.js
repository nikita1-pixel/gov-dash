const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // This defines authRoutes!

const app = express();
const grievanceRoutes = require('./routes/Grievances');
const socialRoutes = require('./routes/social'); 
app.use('/api/social', socialRoutes);
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// This tells the app: "For any URL starting with /api/auth, use the routes in auth.js"
app.use('/api/auth', authRoutes);
// This tells the app: "For any URL starting with /api/grievances, use the routes in grievances.js"
app.use('/api/grievances', grievanceRoutes);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 SERVER IS ALIVE ON PORT ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Auto-refresh Instagram token every 7 days
setInterval(async () => {
    try {
        const r = await fetch(
            `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        );
        const data = await r.json();
        console.log('Instagram token refreshed, expires in:', data.expires_in, 'seconds');
    } catch (e) {
        console.error('Token refresh failed:', e);
    }
}, 7 * 24 * 60 * 60 * 1000);