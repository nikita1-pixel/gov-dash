import React, { useState, useEffect } from 'react';
import {
    Calendar, Users, Clock, Plus, TrendingUp,
    Wallet, HardHat, Image as ImageIcon, MessageSquare,
    ExternalLink, Play, BarChart
} from 'lucide-react';

const DailyOffice = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        setAppointments([
            { id: 1, title: "Review Ward 12 Drainage Proposal", time: "10:30 AM", type: "Internal", priority: "High" },
            { id: 2, title: "Meeting with Municipal Commissioner", time: "12:00 PM", type: "Official", priority: "Medium" },
            { id: 3, title: "Call: Health Secretary", time: "02:30 PM", type: "Urgent Call", priority: "High" },
        ]);
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ROW 1: FULL-WIDTH STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard label="Daily Efficiency" value="94%" icon={TrendingUp} color="#10b981" />
                <StatCard label="Active Budget" value="₹5.00 Cr" icon={Wallet} color="#3b82f6" />
                <StatCard label="Staff Online" value="14" icon={Users} color="#6366f1" />
                <StatCard label="New Grievances" value="28" icon={MessageSquare} color="#f59e0b" />
            </div>

            {/* ROW 2: THE MAIN BENTO GRID (12 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', width: '100%' }}>

                {/* LEFT: LIVE SCHEDULE (7 Columns) */}
                <div style={cardStyle('span 7')}>
                    <SectionHeader title="Today's Live Schedule" icon={Clock} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {appointments.map(apt => (
                            <ScheduleItem key={apt.id} apt={apt} />
                        ))}
                    </div>
                </div>

                {/* RIGHT: PROJECT FUNDS (5 Columns) */}
                <div style={cardStyle('span 5')}>
                    <SectionHeader title="Development Funds" icon={HardHat} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <ProjectProgress name="Ghole Road Asphaltation" percent={67} budget="₹45.0L" />
                        <ProjectProgress name="Shivaji Nagar School Reno" percent={25} budget="₹85.0L" />
                        <ProjectProgress name="Model Colony Garden" percent={100} budget="₹12.0L" color="#10b981" />
                    </div>
                </div>

                {/* BOTTOM: LIVE MEDIA & PRESS FEED (Full 12 Columns) */}
                <div style={cardStyle('span 12')}>
                    <SectionHeader title="Live Media & Social Updates" icon={ImageIcon} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        <MediaCard title="Inauguration Ceremony" date="2h ago" platform="Instagram" />
                        <MediaCard title="Ward 4 Inspection" date="5h ago" platform="Twitter" type="Video" />
                        <MediaCard title="Press Release: New Water Line" date="Yesterday" platform="Local News" />
                        <MediaCard title="Public Meeting Highlights" date="Feb 27" platform="Facebook" />
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const cardStyle = (span) => ({
    gridColumn: span,
    background: '#fff',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
});

const SectionHeader = ({ title, icon: Icon }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon size={22} color="#3b82f6" /> {title}
        </h3>
        <ExternalLink size={18} color="#94a3b8" cursor="pointer" />
    </div>
);

const ScheduleItem = ({ apt }) => (
    <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ fontWeight: '900', color: '#3b82f6', width: '70px' }}>{apt.time}</div>
            <div>
                <div style={{ fontWeight: '800', color: '#1e293b' }}>{apt.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.type}</div>
            </div>
        </div>
        {apt.priority === 'High' && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '20px' }}>URGENT</span>}
    </div>
);

const ProjectProgress = ({ name, percent, budget, color = '#3b82f6' }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>{name}</span>
            <span style={{ fontWeight: '900', color }}>{budget}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px' }}>
            <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: '10px' }} />
        </div>
    </div>
);

const MediaCard = ({ title, date, platform, type = 'Image' }) => (
    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #f1f5f9' }}>
        <div style={{ height: '120px', background: '#e2e8f0', borderRadius: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            {type === 'Video' ? <Play size={32} /> : <ImageIcon size={32} />}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>
            <span>{platform}</span>
            <span>{date}</span>
        </div>
    </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: `${color}15`, padding: '10px', borderRadius: '10px' }}><Icon size={24} color={color} /></div>
        <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>{value}</div>
        </div>
    </div>
);

export default DailyOffice;