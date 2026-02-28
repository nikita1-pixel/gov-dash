import React, { useState } from 'react';
import {
    AlertCircle, CheckCircle, Clock, PieChart,
    Activity, Map as MapIcon, ChevronRight,
    UserPlus, PhoneCall, Calendar, ShieldAlert,
    FileText, Download, Loader2, Send
} from 'lucide-react';

const HomeDashboard = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert("Report 'Constituency_Summary_Feb2026.pdf' downloaded successfully.");
        }, 2000);
    };

    const metrics = [
        { label: 'Pending', value: '42', icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
        { label: 'In Progress', value: '18', icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Resolved', value: '127', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
        { label: 'Funds Utilized', value: '72%', icon: PieChart, color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Sentiment', value: '+8', icon: Activity, color: '#8b5cf6', bg: '#ede9fe' },
    ];

    return (
        <div className="dashboard-wrapper" style={{ padding: '20px', backgroundColor: '#f8fafc' }}>

            {/* 1. High-Level Command Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {metrics.map((m, i) => (
                    <div key={i} style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        borderLeft: `4px solid ${m.color}`
                    }}>
                        <div style={{ backgroundColor: m.bg, padding: '10px', borderRadius: '8px' }}>
                            <m.icon size={24} color={m.color} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{m.label}</p>
                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{m.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px'
            }}>

                {/* 2. Ward Development & AI Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Ward Development Analysis</h3>
                            <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                                View Map Details
                            </button>
                        </div>

                        <div style={{
                            height: '200px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed #cbd5e1',
                            marginBottom: '20px'
                        }}>
                            <MapIcon size={48} color="#94a3b8" strokeWidth={1} />
                            <p style={{ color: '#64748b', marginTop: '10px', fontSize: '14px' }}>AI Predictive Map: High Density Area Identified (Zone 4)</p>
                        </div>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            {[
                                { name: 'Road Resurfacing (Sector 7)', progress: 65, status: 'On Track' },
                                { name: 'Mainline Drainage Expansion', progress: 40, status: 'Delayed' },
                            ].map((p, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                                        <span style={{ color: '#1e293b', fontWeight: '500' }}>{p.name}</span>
                                        <span style={{ color: p.status === 'Delayed' ? '#ef4444' : '#10b981' }}>{p.status}</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${p.progress}%`,
                                            height: '100%',
                                            backgroundColor: p.status === 'Delayed' ? '#f59e0b' : '#3b82f6',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STEP 4: EMERGENCY BROADCAST PANEL */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #fee2e2'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <ShieldAlert color="#ef4444" size={24} />
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#b91c1c', margin: 0 }}>Emergency Broadcast Mode</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '15px' }}>
                            Instantly notify all Nodal Officers and Ward Staff via SMS and Push Notification.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Enter emergency message..."
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fca5a5', outline: 'none' }}
                            />
                            <button style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0 20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}>
                                <Send size={16} /> Broadcast
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Executive Quick Actions & Step 3: Reporting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* REPORTING MODULE (STEP 3) */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #3b82f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <FileText size={20} color="#3b82f6" />
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Constituency Report</h3>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Download the February 2026 detailed analytics for official documentation.</p>
                        <button
                            onClick={handleExport}
                            disabled={isGenerating}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: isGenerating ? '#94a3b8' : '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            {isGenerating ? 'Generating PDF...' : 'Download Full Report'}
                        </button>
                    </div>

                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>Executive Actions</h3>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <ActionButton icon={UserPlus} label="Assign Task" color="#3b82f6" />
                            <ActionButton icon={PhoneCall} label="Call Nodal Officer" color="#3b82f6" />
                            <ActionButton icon={Calendar} label="Schedule Ward Visit" color="#3b82f6" />
                            <ActionButton icon={ShieldAlert} label="Escalate to Dept" color="#ef4444" />
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        color: '#fff'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>System Health</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '14px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                            PostgreSQL Live & Synced
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, color }) => (
    <button style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = color}
        onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon size={18} color={color} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>{label}</span>
        </div>
        <ChevronRight size={16} color="#94a3b8" />
    </button>
);

export default HomeDashboard;