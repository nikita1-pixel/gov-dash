import React, { useState, useEffect, useCallback } from 'react';
import {
    RefreshCw, Twitter, Instagram, Facebook,
    ThumbsUp, ThumbsDown, Minus, TrendingUp,
    MessageCircle, Heart, Share2, Eye
} from 'lucide-react';

// ── Sentiment helper ──────────────────────────────────────
const getSentiment = (text = '') => {
    const pos = ['great', 'good', 'thank', 'success', 'proud', 'excellent', 'win', 'congratulations', 'well done', 'amazing'];
    const neg = ['bad', 'corrupt', 'fail', 'poor', 'problem', 'complaint', 'anger', 'worst', 'useless', 'pathetic'];
    const l = text.toLowerCase();
    if (pos.some(w => l.includes(w))) return 'positive';
    if (neg.some(w => l.includes(w))) return 'negative';
    return 'neutral';
};

const SentimentBadge = ({ text }) => {
    const s = getSentiment(text);
    const map = {
        positive: { bg: '#d1fae5', color: '#065f46', icon: <ThumbsUp size={10} />, label: 'Positive' },
        negative: { bg: '#fee2e2', color: '#991b1b', icon: <ThumbsDown size={10} />, label: 'Negative' },
        neutral: { bg: '#dbeafe', color: '#1e40af', icon: <Minus size={10} />, label: 'Neutral' },
    };
    const { bg, color, icon, label } = map[s];
    return (
        <span style={{
            background: bg, color, fontSize: '10px', fontWeight: '700',
            padding: '2px 8px', borderRadius: '20px', display: 'inline-flex',
            alignItems: 'center', gap: '4px'
        }}>
            {icon} {label}
        </span>
    );
};

const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Post Card ─────────────────────────────────────────────
const PostCard = ({ post, platform }) => {
    const borderColor = { twitter: '#1da1f2', facebook: '#3b5998', instagram: '#e1306c' }[platform];
    return (
        <div style={{
            border: '1px solid #e2e8f0', borderLeft: `4px solid ${borderColor}`,
            borderRadius: '10px', padding: '14px', marginBottom: '12px',
            backgroundColor: '#fff', transition: 'box-shadow 0.2s'
        }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <SentimentBadge text={post.text || post.message || post.caption || ''} />
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeAgo(post.created_at || post.timestamp)}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                {post.text || post.message || post.caption || <em>No caption</em>}
            </p>
            {post.media_url && (
                <img src={post.media_url} alt="post"
                    style={{ width: '100%', borderRadius: '8px', maxHeight: '160px', objectFit: 'cover', marginBottom: '10px' }} />
            )}
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={13} color="#ef4444" /> {post.likes || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={13} color="#3b82f6" /> {post.comments || post.replies || 0}
                </span>
                {post.retweets !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Share2 size={13} color="#10b981" /> {post.retweets}
                    </span>
                )}
            </div>
        </div>
    );
};

// ── Feed Panel ────────────────────────────────────────────
const FeedPanel = ({ title, icon: Icon, iconColor, feedKey, posts, loading, error, onRefresh, lastUpdated }) => (
    <div style={{
        backgroundColor: '#fff', borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
        {/* Panel Header */}
        <div style={{
            padding: '18px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#f8fafc'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={20} color={iconColor} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
                <span style={{
                    fontSize: '10px', background: '#10b981', color: '#fff',
                    padding: '2px 8px', borderRadius: '20px', fontWeight: '700'
                }}>LIVE</span>
            </div>
            <button onClick={onRefresh} style={{
                background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
                padding: '6px 10px', cursor: 'pointer', color: '#64748b',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px'
            }}>
                <RefreshCw size={13} /> Refresh
            </button>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
            <div style={{ padding: '6px 20px', fontSize: '11px', color: '#94a3b8', backgroundColor: '#fafafa' }}>
                Last updated: {lastUpdated}
            </div>
        )}

        {/* Posts */}
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto', maxHeight: '480px' }}>
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '12px', fontSize: '13px' }}>Fetching posts...</p>
                </div>
            )}
            {error && !loading && (
                <div style={{
                    textAlign: 'center', padding: '30px', color: '#ef4444',
                    background: '#fee2e2', borderRadius: '10px', fontSize: '13px'
                }}>
                    ⚠️ {error}
                </div>
            )}
            {!loading && !error && posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                    No posts found.
                </div>
            )}
            {!loading && !error && posts.map((post, i) => (
                <PostCard key={post.id || i} post={post} platform={feedKey} />
            ))}
        </div>
    </div>
);

// ── Summary Card ──────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, color, bg }) => (
    <div style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `4px solid ${color}`
    }}>
        <div style={{ backgroundColor: bg, padding: '10px', borderRadius: '10px' }}>
            <Icon size={22} color={color} />
        </div>
        <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>{value}</h3>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────
const MediaDashboard = () => {
    const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

    const [feeds, setFeeds] = useState({
        twitter: { posts: [], loading: true, error: null, lastUpdated: null },
        facebook: { posts: [], loading: true, error: null, lastUpdated: null },
        instagram: { posts: [], loading: true, error: null, lastUpdated: null },
    });

    const [summary, setSummary] = useState({ total: '—', positive: '—', negative: '—', reach: '—' });

    const token = localStorage.getItem('token');

    const fetchFeed = useCallback(async (platform) => {
        setFeeds(prev => ({ ...prev, [platform]: { ...prev[platform], loading: true, error: null } }));
        try {
            const res = await fetch(`http://localhost:5000/api/social/${platform}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setFeeds(prev => ({
                ...prev,
                [platform]: {
                    posts: data.posts || [],
                    loading: false,
                    error: null,
                    lastUpdated: new Date().toLocaleTimeString()
                }
            }));
        } catch (e) {
            setFeeds(prev => ({
                ...prev,
                [platform]: { ...prev[platform], loading: false, error: e.message }
            }));
        }
    }, [token]);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/social/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setSummary(data);
        } catch (_) { }
    }, [token]);

    const refreshAll = useCallback(() => {
        fetchFeed('twitter');
        fetchFeed('facebook');
        fetchFeed('instagram');
        fetchSummary();
    }, [fetchFeed, fetchSummary]);

    useEffect(() => {
        refreshAll();
        const interval = setInterval(refreshAll, REFRESH_MS);
        return () => clearInterval(interval);
    }, [refreshAll]);

    return (
        <div style={{ padding: '4px' }}>

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>
                        📣 Media & Public Image
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Live social media activity — auto-refreshes every 5 minutes
                    </p>
                </div>
                <button onClick={refreshAll} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontWeight: '700', fontSize: '14px'
                }}>
                    <RefreshCw size={16} /> Refresh All
                </button>
            </div>

            {/* Summary Bar */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px', marginBottom: '28px'
            }}>
                <SummaryCard label="Total Posts" value={summary.total} icon={TrendingUp} color="#3b82f6" bg="#dbeafe" />
                <SummaryCard label="Positive" value={summary.positive} icon={ThumbsUp} color="#10b981" bg="#d1fae5" />
                <SummaryCard label="Negative" value={summary.negative} icon={ThumbsDown} color="#ef4444" bg="#fee2e2" />
                <SummaryCard label="Est. Reach" value={summary.reach} icon={Eye} color="#f59e0b" bg="#fef3c7" />
            </div>

            {/* Three Feed Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <FeedPanel
                    title="Twitter / X" icon={Twitter} iconColor="#1da1f2" feedKey="twitter"
                    posts={feeds.twitter.posts} loading={feeds.twitter.loading}
                    error={feeds.twitter.error} lastUpdated={feeds.twitter.lastUpdated}
                    onRefresh={() => fetchFeed('twitter')}
                />
                <FeedPanel
                    title="Facebook" icon={Facebook} iconColor="#3b5998" feedKey="facebook"
                    posts={feeds.facebook.posts} loading={feeds.facebook.loading}
                    error={feeds.facebook.error} lastUpdated={feeds.facebook.lastUpdated}
                    onRefresh={() => fetchFeed('facebook')}
                />
                <FeedPanel
                    title="Instagram" icon={Instagram} iconColor="#e1306c" feedKey="instagram"
                    posts={feeds.instagram.posts} loading={feeds.instagram.loading}
                    error={feeds.instagram.error} lastUpdated={feeds.instagram.lastUpdated}
                    onRefresh={() => fetchFeed('instagram')}
                />
            </div>

            {/* Spinner animation */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default MediaDashboard;