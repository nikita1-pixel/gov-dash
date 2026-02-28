import React, { useState } from 'react';
import {
    MessageSquare, Star, ThumbsUp, ThumbsDown,
    Quote, Filter, Search, User, CheckCircle
} from 'lucide-react';

const CitizenFeedback = () => {
    const [reviews] = useState([
        {
            id: 1,
            name: "Suresh Kalmadi",
            area: "Ward 12",
            rating: 5,
            comment: "The water pipeline leak was fixed within 4 hours of reporting. Excellent coordination by the Ward 12 team!",
            date: "1h ago",
            resolvedBy: "Rahul Deshmukh",
            sentiment: "Positive"
        },
        {
            id: 2,
            name: "Meera Bai",
            area: "Model Colony",
            rating: 2,
            comment: "Road repair started but left halfway. Very difficult for senior citizens to walk here.",
            date: "5h ago",
            resolvedBy: "Amit Shinde",
            sentiment: "Negative"
        },
        {
            id: 3,
            name: "Rohan J.",
            area: "Shivaji Nagar",
            rating: 4,
            comment: "Prompt response on street light issue. Lights are back on.",
            date: "Yesterday",
            resolvedBy: "Sneha Patil",
            sentiment: "Positive"
        }
    ]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* 1. SENTIMENT OVERVIEW BAR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <SentimentCard label="Avg. Citizen Rating" value="4.4" sub="Based on 1.2k reviews" color="#f59e0b" icon={Star} />
                <SentimentCard label="Positive Sentiment" value="82%" sub="+5% from last month" color="#10b981" icon={ThumbsUp} />
                <SentimentCard label="Critical Feedback" value="18%" sub="Requires attention" color="#ef4444" icon={ThumbsDown} />
            </div>

            {/* 2. FEEDBACK STREAM */}
            <div style={containerStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Quote size={22} color="#3b82f6" /> Recent Citizen Testimonials
                    </h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={filterBtn}>All</button>
                        <button style={filterBtn}>Critical Only</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {reviews.map(review => (
                        <div key={review.id} style={reviewCardStyle(review.sentiment)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={avatarStyle}><User size={16} color="#64748b" /></div>
                                    <div>
                                        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '14px' }}>{review.name}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>{review.area} • {review.date}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} color={i < review.rating ? "#f59e0b" : "#e2e8f0"} />
                                    ))}
                                </div>
                            </div>

                            <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: '1.6', color: '#475569', fontStyle: 'italic' }}>
                                "{review.comment}"
                            </p>

                            <div style={officerTag}>
                                <CheckCircle size={12} color="#10b981" />
                                <span style={{ fontSize: '11px', fontWeight: '700' }}>Resolved by: {review.resolvedBy}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- STYLES & COMPONENTS ---

const containerStyle = { background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' };

const SentimentCard = ({ label, value, sub, color, icon: Icon }) => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Icon size={18} color={color} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>{sub}</div>
    </div>
);

const reviewCardStyle = (sentiment) => ({
    padding: '24px',
    borderRadius: '20px',
    background: '#f8fafc',
    border: `1px solid ${sentiment === 'Negative' ? '#fee2e2' : '#f1f5f9'}`,
    position: 'relative'
});

const avatarStyle = { width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const officerTag = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' };

const filterBtn = { padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };

export default CitizenFeedback;