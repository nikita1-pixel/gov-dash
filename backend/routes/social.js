const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // npm install node-fetch@2

// ── In-memory cache ───────────────────────────────────────
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;
const isFresh = (key) => cache[key] && (Date.now() - cache[key].time < CACHE_TTL);

// ── Auth middleware (reuse your existing pattern) ─────────
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ── Twitter ───────────────────────────────────────────────
router.get('/twitter', authMiddleware, async (req, res) => {
    if (isFresh('twitter')) return res.json(cache['twitter'].data);
    try {
        const r = await fetch(
            `https://api.twitter.com/2/users/${process.env.TWITTER_USER_ID}/tweets?tweet.fields=created_at,public_metrics&max_results=5`,
            { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
        );
        const raw = await r.json();
        const posts = (raw.data || []).map(t => ({
            id: t.id,
            text: t.text,
            created_at: t.created_at,
            likes: t.public_metrics?.like_count || 0,
            retweets: t.public_metrics?.retweet_count || 0,
            replies: t.public_metrics?.reply_count || 0,
        }));
        const data = { posts };
        cache['twitter'] = { data, time: Date.now() };
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Twitter fetch failed', posts: [] });
    }
});

// ── Facebook ──────────────────────────────────────────────
router.get('/facebook', authMiddleware, async (req, res) => {
    if (isFresh('facebook')) return res.json(cache['facebook'].data);
    try {
        const r = await fetch(
            `https://graph.facebook.com/v18.0/${process.env.FB_PAGE_ID}/posts?fields=message,full_picture,created_time,likes.summary(true),comments.summary(true),shares&access_token=${process.env.FB_ACCESS_TOKEN}&limit=5`
        );
        const raw = await r.json();
        const posts = (raw.data || []).map(p => ({
            id: p.id,
            message: p.message,
            media_url: p.full_picture,
            created_at: p.created_time,
            likes: p.likes?.summary?.total_count || 0,
            comments: p.comments?.summary?.total_count || 0,
        }));
        const data = { posts };
        cache['facebook'] = { data, time: Date.now() };
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Facebook fetch failed', posts: [] });
    }
});

// ── Instagram ─────────────────────────────────────────────
router.get('/instagram', authMiddleware, async (req, res) => {
    if (isFresh('instagram')) return res.json(cache['instagram'].data);
    try {
        const r = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp,like_count,comments_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}&limit=5`
        );
        const raw = await r.json();
        const posts = (raw.data || []).map(p => ({
            id: p.id,
            caption: p.caption,
            media_url: p.media_type === 'IMAGE' ? p.media_url : null,
            timestamp: p.timestamp,
            likes: p.like_count || 0,
            comments: p.comments_count || 0,
        }));
        const data = { posts };
        cache['instagram'] = { data, time: Date.now() };
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Instagram fetch failed', posts: [] });
    }
});

// ── Summary ───────────────────────────────────────────────
router.get('/summary', authMiddleware, (req, res) => {
    const tw = cache['twitter']?.data?.posts || [];
    const fb = cache['facebook']?.data?.posts || [];
    const ig = cache['instagram']?.data?.posts || [];
    const allText = [
        ...tw.map(p => p.text),
        ...fb.map(p => p.message),
        ...ig.map(p => p.caption)
    ].filter(Boolean);

    const posWords = ['great', 'good', 'thank', 'success', 'proud', 'excellent', 'win', 'congratulations'];
    const negWords = ['bad', 'corrupt', 'fail', 'poor', 'problem', 'complaint', 'anger', 'worst'];
    let positive = 0, negative = 0;
    allText.forEach(t => {
        const l = t.toLowerCase();
        if (posWords.some(w => l.includes(w))) positive++;
        else if (negWords.some(w => l.includes(w))) negative++;
    });

    const reach = [...tw, ...fb, ...ig].reduce((s, p) => s + (p.likes || 0) + (p.comments || 0), 0) * 12;
    res.json({ total: allText.length, positive, negative, reach: reach.toLocaleString() });
});

module.exports = router;