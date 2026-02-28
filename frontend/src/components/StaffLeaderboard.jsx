import React, { useState } from 'react';
import {
    Trophy, Medal, Target, Zap,
    TrendingUp, Star, UserCheck, Timer
} from 'lucide-react';

const StaffLeaderboard = () => {
    const [staff] = useState([
        { id: 1, name: "Rahul Deshmukh", role: "Ward 12 Officer", resolved: 142, rating: 4.8, speed: "2.1 days" },
        { id: 2, name: "Sneha Patil", role: "Public Relations", resolved: 128, rating: 4.9, speed: "1.8 days" },
        { id: 3, name: "Amit Shinde", role: "Technical Dept", resolved: 98, rating: 4.5, speed: "3.5 days" },
        { id: 4, name: "Priya Kulkarni", role: "Health Dept", resolved: 85, rating: 4.2, speed: "4.1 days" },
    ]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* 1. TOP PERFORMER HIGHLIGHT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <PerformanceHero
                    title="Top Resolver"
                    name={staff[0].name}
                    stat={`${staff[0].resolved} Cases`}
                    icon={Trophy}
                    color="#f59e0b"
                />
                <PerformanceHero
                    title="Fastest Response"
                    name={staff[1].name}
                    stat={staff[1].speed}
                    icon={Zap}
                    color="#3b82f6"
                />
                <PerformanceHero
                    title="Highest Rated"
                    name={staff[1].name}
                    stat={`${staff[1].rating}/5.0`}
                    icon={Star}
                    color="#10b981"
                />
            </div>

            {/* 2. LEADERBOARD TABLE */}
            <div style={containerStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Target size={22} color="#3b82f6" /> Staff Performance Index
                    </h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>Current Month: February 2026</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {staff.map((member, index) => (
                        <div key={member.id} style={staffRowStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 2 }}>
                                <div style={rankBadge(index + 1)}>{index + 1}</div>
                                <div>
                                    <div style={{ fontWeight: '800', color: '#1e293b' }}>{member.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{member.role}</div>
                                </div>
                            </div>

                            <div style={statGroup}>
                                <UserCheck size={16} color="#3b82f6" />
                                <span style={statValue}>{member.resolved} Resolved</span>
                            </div>

                            <div style={statGroup}>
                                <Timer size={16} color="#6366f1" />
                                <span style={statValue}>{member.speed}</span>
                            </div>

                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ fontWeight: '900' }}>{member.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const PerformanceHero = ({ title, name, stat, icon: Icon, color }) => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: `${color}15`, padding: '15px', borderRadius: '16px' }}>
            <Icon size={28} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontWeight: '900', color: '#1e293b', fontSize: '16px', margin: '2px 0' }}>{name}</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color }}>{stat}</div>
        </div>
    </div>
);

// --- STYLES ---

const containerStyle = {
    background: '#fff',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
};

const staffRowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #f1f5f9'
};

const rankBadge = (rank) => ({
    width: '32px', height: '32px', borderRadius: '50%',
    background: rank === 1 ? '#fef3c7' : rank === 2 ? '#f1f5f9' : '#fff',
    border: `1px solid ${rank === 1 ? '#f59e0b' : '#e2e8f0'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '900', color: rank === 1 ? '#b45309' : '#64748b', fontSize: '13px'
});

const statGroup = { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 };
const statValue = { fontSize: '13px', fontWeight: '700', color: '#1e293b' };

export default StaffLeaderboard;