import React, { useState, useEffect } from 'react';
import {
    MapPin, Clock, CheckCircle2, ListChecks, AlertCircle,
    BarChart3, X, Search, Filter, UserCog, MoreHorizontal, ArrowUpRight
} from 'lucide-react';

// --- Helper: Calculate Time Difference ---
const calculateTimeDiff = (createdAt, resolvedAt) => {
    const start = new Date(createdAt);
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const diffInMs = Math.abs(end - start);
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
};

// --- StatCard Component ---

const StatCard = ({ label, value, color, icon: Icon, trend }) => (
    <div style={{
        backgroundColor: '#fff', padding: '24px', borderRadius: '20px',
        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
        <div>
            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
            <div style={{ color: '#1e293b', fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{value}</div>
            {trend && <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>↑ {trend} from yesterday</div>}
        </div>
        <div style={{ backgroundColor: `${color}15`, padding: '12px', borderRadius: '14px' }}>
            <Icon size={24} color={color} />
        </div>
    </div>
);

// --- GrievanceModal Component ---
const GrievanceModal = ({ issue, onClose, onResolve }) => {
    if (!issue) return null;
    return (
        <div style={modalOverlay}>
            <div style={modalContent}>
                <div style={modalHeader}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6' }}>ID: {issue.id}</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: '#1e293b' }}>{issue.title}</h2>
                    </div>
                    <button onClick={onClose} style={closeBtn}><X size={20} /></button>
                </div>
                <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <h4 style={sectionLabel}>Timeline & Logs</h4>
                        <div style={logItem}>
                            <div style={logDot} />
                            <div>
                                <p style={logText}>Grievance Filed by Citizen</p>
                                <p style={logTime}>{new Date(issue.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                        <div style={logItem}>
                            <div style={{ ...logDot, backgroundColor: '#3b82f6' }} />
                            <div>
                                <p style={logText}>Assigned to Ward Officer</p>
                                <p style={logTime}>Automated Assignment</p>
                            </div>
                        </div>
                    </div>
                    <div style={mapPlaceholder}>
                        <MapPin size={32} />
                        <span style={{ fontWeight: '700', marginTop: '8px' }}>GPS: {issue.location}</span>
                    </div>
                </div>
                <div style={modalFooter}>
                    <button onClick={onClose} style={secondaryBtn}>Cancel</button>
                    {issue.status !== 'Resolved' && (
                        <button onClick={() => { onResolve(issue.id, 'Resolved'); onClose(); }} style={primaryBtn}>
                            Close Case
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const GrievanceList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrievance, setSelectedGrievance] = useState(null);

    useEffect(() => {
        // Mocking the fetch for display purposes, but keeping your API logic
        fetch('http://localhost:5000/api/grievances')
            .then(res => res.json())
            .then(data => { setComplaints(data); setLoading(false); })
            .catch(() => {
                // Fallback for demo
                setComplaints([
                    { id: 'GR-102', title: 'Drainage Blockage', location: 'Karve Nagar', status: 'Pending', priority: 'High', created_at: new Date().toISOString() },
                    { id: 'GR-103', title: 'Street Light Issue', location: 'Kothrud', status: 'Resolved', priority: 'Medium', created_at: new Date().toISOString(), resolved_at: new Date().toISOString() }
                ]);
                setLoading(false);
            });
    }, []);
    

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/grievances/${id}/resolve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, resolved_at: newStatus === 'Resolved' ? new Date().toISOString() : null })
            });
            if (response.ok) {
                setComplaints(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, resolved_at: newStatus === 'Resolved' ? new Date().toISOString() : null } : item));
            }
        } catch (err) { console.error(err); }
    };

    const filteredComplaints = complaints.filter(item => {
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Synchronizing with Server...</div>;

    return (
        <div style={{ padding: '10px' }}>
            <div style={statsGrid}>
                <StatCard label="Total Feed" value={complaints.length} color="#3b82f6" icon={BarChart3} trend="12%" />
                <StatCard label="Live Issues" value={complaints.filter(c => c.status !== 'Resolved').length} color="#f59e0b" icon={Clock} />
                <StatCard label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} color="#10b981" icon={CheckCircle2} />
                <StatCard label="Avg. Response" value="4.2h" color="#8b5cf6" icon={ListChecks} />
            </div>

            <div style={filterHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontWeight: '800', fontSize: '24px', color: '#1e293b' }}>Constituency Feed</h2>
                    <span style={countBadge}>{filteredComplaints.length} results</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={searchBox}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Filter by keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={searchInput} />
                    </div>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle}>
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                    </select>
                    <button style={filterBtn}><Filter size={16} /> Filters</button>
                </div>
            </div>

            <div style={listContainer}>
                {filteredComplaints.map((item) => (
                    <div key={item.id} style={listItem}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={statusIcon(item.status)}>
                                {item.status === 'Resolved' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h4 style={itemTitle}>{item.title}</h4>
                                    <span style={priorityTag(item.priority)}>{item.priority}</span>
                                </div>
                                <div style={itemSubtext}>
                                    <MapPin size={12} /> {item.location} • <Clock size={12} /> {calculateTimeDiff(item.created_at, item.resolved_at)}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setSelectedGrievance(item)} style={actionBtn}>
                                Details <ArrowUpRight size={14} />
                            </button>
                            <button style={assignBtn}><UserCog size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <GrievanceModal issue={selectedGrievance} onClose={() => setSelectedGrievance(null)} onResolve={handleStatusUpdate} />
        </div>
    );
};

// --- STYLES ---
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' };
const filterHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const countBadge = { background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' };
const searchBox = { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' };
const searchInput = { border: 'none', outline: 'none', fontSize: '14px', width: '180px' };
const selectStyle = { padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', outline: 'none' };
const filterBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };
const listContainer = { display: 'grid', gap: '12px' };
const listItem = { background: '#fff', borderRadius: '16px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' };
const itemTitle = { margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' };
const itemSubtext = { marginTop: '4px', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' };
const actionBtn = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '700', cursor: 'pointer', color: '#475569' };
const assignBtn = { padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' };
const statusIcon = (status) => ({ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: status === 'Resolved' ? '#d1fae5' : '#fff7ed', color: status === 'Resolved' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const priorityTag = (p) => ({ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', background: p === 'High' ? '#fee2e2' : '#f1f5f9', color: p === 'High' ? '#ef4444' : '#64748b' });

// Modal Styles
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 };
const modalContent = { backgroundColor: '#fff', width: '90%', maxWidth: '700px', borderRadius: '24px', overflow: 'hidden' };
const modalHeader = { padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtn = { background: '#f8fafc', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' };
const sectionLabel = { color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px' };
const logItem = { display: 'flex', gap: '16px', marginBottom: '16px' };
const logDot = { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1', marginTop: '6px' };
const logText = { margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const logTime = { margin: 0, fontSize: '12px', color: '#94a3b8' };
const mapPlaceholder = { height: '100%', background: '#eff6ff', borderRadius: '20px', border: '2px dashed #3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' };
const modalFooter = { padding: '24px 32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' };
const primaryBtn = { padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' };
const secondaryBtn = { padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' };

export default GrievanceList;