import React, { useState } from 'react';
import {
    MessageSquare, Star, ThumbsUp, ThumbsDown,
    Quote, Search, User, CheckCircle, Plus, X,
    TrendingUp, Filter, Send, ChevronDown
} from 'lucide-react';

const INITIAL_REVIEWS = [
    {
        id: 1,
        name: "Suresh Kalmadi",
        area: "Ward 12",
        rating: 5,
        comment: "The water pipeline leak was fixed within 4 hours of reporting. Excellent coordination by the Ward 12 team!",
        date: "1h ago",
        resolvedBy: "Rahul Deshmukh",
        sentiment: "Positive",
        category: "Water Supply",
        likes: 14,
        likedByMe: false,
    },
    {
        id: 2,
        name: "Meera Bai",
        area: "Model Colony",
        rating: 2,
        comment: "Road repair started but left halfway. Very difficult for senior citizens to walk here.",
        date: "5h ago",
        resolvedBy: "Amit Shinde",
        sentiment: "Negative",
        category: "Roads",
        likes: 8,
        likedByMe: false,
    },
    {
        id: 3,
        name: "Rohan J.",
        area: "Shivaji Nagar",
        rating: 4,
        comment: "Prompt response on street light issue. Lights are back on.",
        date: "Yesterday",
        resolvedBy: "Sneha Patil",
        sentiment: "Positive",
        category: "Street Lights",
        likes: 6,
        likedByMe: false,
    },
    {
        id: 4,
        name: "Priya Nair",
        area: "Karve Nagar",
        rating: 3,
        comment: "Garbage collection improved but still inconsistent on weekends. Hope it gets better.",
        date: "2 days ago",
        resolvedBy: "Vijay Mane",
        sentiment: "Neutral",
        category: "Sanitation",
        likes: 3,
        likedByMe: false,
    },
    {
        id: 5,
        name: "Arvind Kulkarni",
        area: "Aundh",
        rating: 5,
        comment: "New park benches and lighting installed in our area. The team did a fantastic job in record time!",
        date: "3 days ago",
        resolvedBy: "Pooja Jadhav",
        sentiment: "Positive",
        category: "Parks",
        likes: 21,
        likedByMe: false,
    },
];

const CATEGORIES = ["All", "Water Supply", "Roads", "Street Lights", "Sanitation", "Parks", "Other"];
const AREAS = ["Ward 12", "Model Colony", "Shivaji Nagar", "Karve Nagar", "Aundh", "Kothrud", "Baner", "Deccan"];

const sentimentOf = (rating) => rating >= 4 ? "Positive" : rating === 3 ? "Neutral" : "Negative";

// ── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                size={22}
                fill={i <= value ? "#f59e0b" : "none"}
                color={i <= value ? "#f59e0b" : "#cbd5e1"}
                style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                onClick={() => onChange(i)}
            />
        ))}
    </div>
);

// ── Sentiment Card ───────────────────────────────────────────────────────────
const SentimentCard = ({ label, value, sub, color, icon: Icon }) => (
    <div style={{ background: '#fff', padding: '22px 24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon size={15} color={color} />
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: 5 }}>{sub}</div>
        </div>
        <div style={{ background: `${color}12`, borderRadius: 14, padding: 12 }}>
            <Icon size={20} color={color} />
        </div>
    </div>
);

// ── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, onLike }) => {
    const borderColor = review.sentiment === 'Negative' ? '#fee2e2' : review.sentiment === 'Neutral' ? '#fef3c7' : '#f1f5f9';
    const catColor = { "Water Supply": "#3b82f6", Roads: "#f59e0b", "Street Lights": "#8b5cf6", Sanitation: "#10b981", Parks: "#06b6d4", Other: "#94a3b8" };
    const cc = catColor[review.category] || '#94a3b8';

    return (
        <div style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: `1px solid ${borderColor}`, borderLeft: `3px solid ${review.sentiment === 'Negative' ? '#ef4444' : review.sentiment === 'Neutral' ? '#f59e0b' : '#10b981'}`, display: 'flex', flexDirection: 'column', gap: 12, transition: 'box-shadow 0.2s' }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#e2e8f0,#cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#64748b" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '13px' }}>{review.name}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>{review.area} · {review.date}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "#f59e0b" : "none"} color={i < review.rating ? "#f59e0b" : "#e2e8f0"} />
                        ))}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${cc}15`, color: cc }}>{review.category}</span>
                </div>
            </div>

            {/* Comment */}
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#475569', fontStyle: 'italic' }}>
                "{review.comment}"
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f0fdf4', borderRadius: 7, border: '1px solid #dcfce7' }}>
                    <CheckCircle size={11} color="#10b981" />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981' }}>Resolved by {review.resolvedBy}</span>
                </div>
                <button
                    onClick={() => onLike(review.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, border: `1px solid ${review.likedByMe ? '#bfdbfe' : '#e2e8f0'}`, background: review.likedByMe ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: review.likedByMe ? '#3b82f6' : '#94a3b8', transition: 'all 0.15s' }}
                >
                    <ThumbsUp size={11} fill={review.likedByMe ? '#3b82f6' : 'none'} color={review.likedByMe ? '#3b82f6' : '#94a3b8'} />
                    {review.likes}
                </button>
            </div>
        </div>
    );
};

// ── Add Feedback Modal ───────────────────────────────────────────────────────
const AddFeedbackModal = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState({ name: '', area: AREAS[0], rating: 0, comment: '', category: 'Other', resolvedBy: '' });
    const [submitted, setSubmitted] = useState(false);
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = () => {
        if (!form.name.trim() || !form.comment.trim() || form.rating === 0) return;
        onSubmit(form);
        setSubmitted(true);
        setTimeout(onClose, 1800);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: '#fff', width: 480, maxWidth: '95vw', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                {submitted ? (
                    <div style={{ padding: 48, textAlign: 'center' }}>
                        <CheckCircle size={48} color="#10b981" style={{ marginBottom: 12 }} />
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Thank you for your feedback!</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Your review has been submitted successfully.</div>
                    </div>
                ) : (<>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Share Your Experience</div>
                            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Submit Citizen Feedback</h2>
                        </div>
                        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={14} /></button>
                    </div>

                    <div style={{ padding: 20, maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Rating */}
                        <div>
                            <div style={fLabel}>Your Rating <span style={{ color: '#ef4444' }}>*</span></div>
                            <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                            {form.rating > 0 && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][form.rating]}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <div style={fLabel}>Your Name <span style={{ color: '#ef4444' }}>*</span></div>
                                <input style={fInput} value={form.name} onChange={set('name')} placeholder="e.g. Ramesh Patil" />
                            </div>
                            <div>
                                <div style={fLabel}>Your Area</div>
                                <select style={fInput} value={form.area} onChange={set('area')}>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <div style={fLabel}>Category</div>
                                <select style={fInput} value={form.category} onChange={set('category')}>
                                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <div style={fLabel}>Resolved By (optional)</div>
                                <input style={fInput} value={form.resolvedBy} onChange={set('resolvedBy')} placeholder="Officer name" />
                            </div>
                        </div>

                        <div>
                            <div style={fLabel}>Your Feedback <span style={{ color: '#ef4444' }}>*</span></div>
                            <textarea
                                style={{ ...fInput, resize: 'vertical', minHeight: 90, lineHeight: 1.6 }}
                                value={form.comment}
                                onChange={set('comment')}
                                placeholder="Describe your experience with the civic service…"
                            />
                        </div>
                    </div>

                    <div style={{ padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button onClick={onClose} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={!form.name.trim() || !form.comment.trim() || form.rating === 0}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: (!form.name.trim() || !form.comment.trim() || form.rating === 0) ? '#e2e8f0' : '#0f172a', color: (!form.name.trim() || !form.comment.trim() || form.rating === 0) ? '#94a3b8' : '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: (!form.name.trim() || !form.comment.trim() || form.rating === 0) ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                        >
                            <Send size={13} /> Submit Feedback
                        </button>
                    </div>
                </>)}
            </div>
        </div>
    );
};

// ── Main Component ───────────────────────────────────────────────────────────
const CitizenFeedback = () => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeCat, setActiveCat] = useState('All');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const handleLike = (id) => {
        setReviews(prev => prev.map(r => r.id === id
            ? { ...r, likedByMe: !r.likedByMe, likes: r.likedByMe ? r.likes - 1 : r.likes + 1 }
            : r
        ));
    };

    const handleSubmit = (form) => {
        const newReview = {
            id: Date.now(),
            name: form.name,
            area: form.area,
            rating: form.rating,
            comment: form.comment,
            date: 'Just now',
            resolvedBy: form.resolvedBy || 'Pending',
            sentiment: sentimentOf(form.rating),
            category: form.category,
            likes: 0,
            likedByMe: false,
        };
        setReviews(prev => [newReview, ...prev]);
    };

    const filtered = reviews
        .filter(r => {
            const ms = activeFilter === 'All' || r.sentiment === activeFilter;
            const mc = activeCat === 'All' || r.category === activeCat;
            const mq = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()) || r.area.toLowerCase().includes(search.toLowerCase());
            return ms && mc && mq;
        })
        .sort((a, b) => sortBy === 'highest' ? b.rating - a.rating : sortBy === 'lowest' ? a.rating - b.rating : sortBy === 'popular' ? b.likes - a.likes : b.id - a.id);

    const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    const positivePct = Math.round((reviews.filter(r => r.sentiment === 'Positive').length / reviews.length) * 100);
    const criticalPct = Math.round((reviews.filter(r => r.sentiment === 'Negative').length / reviews.length) * 100);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <SentimentCard label="Avg. Citizen Rating" value={avgRating} sub={`Based on ${reviews.length} reviews`} color="#f59e0b" icon={Star} />
                <SentimentCard label="Positive Sentiment" value={`${positivePct}%`} sub={`${reviews.filter(r => r.sentiment === 'Positive').length} happy citizens`} color="#10b981" icon={ThumbsUp} />
                <SentimentCard label="Critical Feedback" value={`${criticalPct}%`} sub="Requires attention" color="#ef4444" icon={ThumbsDown} />
            </div>

            {/* ── Feedback Stream ── */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontWeight: '800', fontSize: 17, display: 'flex', alignItems: 'center', gap: 10, color: '#0f172a' }}>
                        <Quote size={20} color="#3b82f6" /> Recent Citizen Testimonials
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b' }}>{reviews.length} total</span>
                    </h3>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                        <Plus size={14} /> Add Feedback
                    </button>
                </div>

                {/* Search + Filters */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '7px 12px', borderRadius: 9, border: '1px solid #e2e8f0', flex: '1', minWidth: 160 }}>
                        <Search size={13} color="#94a3b8" />
                        <input type="text" placeholder="Search feedback…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, width: '100%', fontFamily: 'inherit' }} />
                    </div>

                    {/* Sentiment filter */}
                    {['All', 'Positive', 'Neutral', 'Negative'].map(f => {
                        const colors = { Positive: '#10b981', Neutral: '#f59e0b', Negative: '#ef4444', All: '#3b82f6' };
                        const active = activeFilter === f;
                        return (
                            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1px solid ${active ? colors[f] + '60' : '#e2e8f0'}`, background: active ? `${colors[f]}10` : '#fff', color: active ? colors[f] : '#94a3b8', transition: 'all 0.15s' }}>
                                {f}
                            </button>
                        );
                    })}

                    {/* Sort */}
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#64748b', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                        <option value="popular">Most Liked</option>
                    </select>
                </div>

                {/* Category chips */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setActiveCat(c)} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: '1px solid transparent', background: activeCat === c ? '#0f172a' : '#f1f5f9', color: activeCat === c ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 13 }}>No reviews match your filters.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {filtered.map(r => <ReviewCard key={r.id} review={r} onLike={handleLike} />)}
                    </div>
                )}
            </div>

            {showModal && <AddFeedbackModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

// ── Shared form styles ────────────────────────────────────────────────────────
const fLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 5 };
const fInput = { width: '100%', padding: '9px 11px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#0f172a', background: '#fff' };

export default CitizenFeedback;