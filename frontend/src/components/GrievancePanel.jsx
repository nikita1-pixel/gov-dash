/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
    MapPin, Clock, CheckCircle2, Search, ArrowUpRight,
    X, ChevronRight, AlertCircle, Loader2, Plus
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ─── Fix Leaflet default icon ────────────────────────────────────────────────
L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom colored marker icons
const coloredIcon = (color) => L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    className: '',
});

const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const STATUS_COLORS = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };

// ─── RecenterMap helper ──────────────────────────────────────────────────────
const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.flyTo(coords, 15, { duration: 0.8 });
    }, [coords, map]);
    return null;
};

// ─── MOCK DATA (fallback) ────────────────────────────────────────────────────
const MOCK_ISSUES = [
    { id: 1, title: 'Main Road Pothole', location: 'Ward 12, Sector 4', status: 'Pending', priority: 'High', latitude: 18.5195, longitude: 73.8551, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 2, title: 'Pothole on XYZ Road', location: 'Ward 12, Sector 4', status: 'In Progress', priority: 'High', latitude: 18.5213, longitude: 73.8540, created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 3, title: 'Broken Street Light', location: 'Kothrud', status: 'Resolved', priority: 'Medium', latitude: 18.5074, longitude: 73.8077, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 4, title: 'Drainage Blockage', location: 'Karve Nagar', status: 'Pending', priority: 'High', latitude: 18.4913, longitude: 73.8215, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
    { id: 5, title: 'Garbage Not Collected', location: 'Aundh', status: 'Pending', priority: 'Medium', latitude: 18.5590, longitude: 73.8078, created_at: new Date(Date.now() - 3600000 * 6).toISOString() },
    { id: 6, title: 'Water Supply Disruption', location: 'Baner', status: 'In Progress', priority: 'High', latitude: 18.5590, longitude: 73.7868, created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
];

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso);
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

// ─── Grievance Modal ─────────────────────────────────────────────────────────
const GrievanceModal = ({ issue, onClose, onSave }) => {
    const [form, setForm] = useState(null);
    useEffect(() => { if (issue) setForm({ ...issue }); }, [issue]);
    if (!issue || !form) return null;

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    return (
        <div style={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={s.modalBox}>
                {/* Header */}
                <div style={s.modalHdr}>
                    <div>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                            {issue.isNew ? 'New Grievance' : `Issue #${issue.id}`}
                        </div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {issue.isNew ? 'Report a Grievance' : 'Issue Details'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={s.closeBtn}><X size={16} /></button>
                </div>

                {/* Body */}
                <div style={s.modalBody}>
                    <div style={s.fieldGroup}>
                        <label style={s.fieldLabel}>Title</label>
                        <input style={s.fieldInput} value={form.title || ''} onChange={set('title')} placeholder="e.g. Broken streetlight" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Location</label>
                            <input style={s.fieldInput} value={form.location || ''} onChange={set('location')} placeholder="e.g. Karve Nagar" />
                        </div>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Priority</label>
                            <select style={s.fieldInput} value={form.priority || 'Medium'} onChange={set('priority')}>
                                <option>Low</option><option>Medium</option><option>High</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Status</label>
                            <select style={s.fieldInput} value={form.status || 'Pending'} onChange={set('status')}>
                                <option>Pending</option><option>In Progress</option><option>Resolved</option>
                            </select>
                        </div>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Reported By</label>
                            <input style={s.fieldInput} value={form.reporter || ''} onChange={set('reporter')} placeholder="Citizen name" />
                        </div>
                    </div>
                    <div style={s.fieldGroup}>
                        <label style={s.fieldLabel}>Description</label>
                        <textarea style={{ ...s.fieldInput, resize: 'vertical', minHeight: 72 }} value={form.desc || ''} onChange={set('desc')} placeholder="Describe the issue..." />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Latitude</label>
                            <input style={s.fieldInput} type="number" step="0.0001" value={form.latitude || ''} onChange={set('latitude')} placeholder="18.5204" />
                        </div>
                        <div style={s.fieldGroup}>
                            <label style={s.fieldLabel}>Longitude</label>
                            <input style={s.fieldInput} type="number" step="0.0001" value={form.longitude || ''} onChange={set('longitude')} placeholder="73.8567" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={s.modalFtr}>
                    <button onClick={onClose} style={s.btnSecondary}>Cancel</button>
                    <button onClick={() => onSave(form)} style={s.btnPrimary}>
                        {issue.isNew ? 'Add Issue' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Detail Drawer ───────────────────────────────────────────────────────────
const DetailDrawer = ({ issue, onClose, onStatusChange, onEdit }) => {
    if (!issue) return null;
    const statusColor = STATUS_COLORS[issue.status] || '#94a3b8';
    const priorityColor = PRIORITY_COLORS[issue.priority] || '#94a3b8';

    return (
        <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 260,
            background: '#fff', borderLeft: '1px solid #e2e8f0', zIndex: 400,
            display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.06)',
            transform: issue ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.2s ease',
        }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Issue #{issue.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{issue.title}</div>
                </div>
                <button onClick={onClose} style={s.closeBtn}><X size={14} /></button>
            </div>

            <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span style={{ ...s.badge, background: `${priorityColor}15`, color: priorityColor }}>{issue.priority} Priority</span>
                    <span style={{ ...s.badge, background: `${statusColor}15`, color: statusColor }}>{issue.status}</span>
                </div>

                <div style={s.drawerSection}>
                    <div style={s.drawerLabel}>Location</div>
                    <div style={s.drawerVal}><MapPin size={11} style={{ marginRight: 4 }} />{issue.location}</div>
                </div>

                {issue.reporter && (
                    <div style={s.drawerSection}>
                        <div style={s.drawerLabel}>Reported By</div>
                        <div style={s.drawerVal}>{issue.reporter}</div>
                    </div>
                )}

                {issue.desc && (
                    <div style={s.drawerSection}>
                        <div style={s.drawerLabel}>Description</div>
                        <div style={{ ...s.drawerVal, color: '#64748b', lineHeight: 1.5 }}>{issue.desc}</div>
                    </div>
                )}

                <div style={s.drawerSection}>
                    <div style={s.drawerLabel}>Reported</div>
                    <div style={s.drawerVal}>{new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {timeAgo(issue.created_at)}</div>
                </div>

                <div style={s.drawerSection}>
                    <div style={s.drawerLabel}>Update Status</div>
                    <select
                        style={{ ...s.fieldInput, marginTop: 4, fontSize: 12 }}
                        value={issue.status}
                        onChange={e => onStatusChange(issue.id, e.target.value)}
                    >
                        <option>Pending</option><option>In Progress</option><option>Resolved</option>
                    </select>
                </div>

                {issue.latitude && (
                    <div style={s.drawerSection}>
                        <div style={s.drawerLabel}>Coordinates</div>
                        <div style={{ ...s.drawerVal, fontFamily: 'monospace', fontSize: 11, color: '#10b981' }}>
                            {Number(issue.latitude).toFixed(4)}, {Number(issue.longitude).toFixed(4)}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => onEdit(issue)} style={{ ...s.btnPrimary, width: '100%', justifyContent: 'center' }}>
                    Edit Full Details
                </button>
            </div>
        </div>
    );
};

// ─── Main GrievancePanel ─────────────────────────────────────────────────────
const GrievancePanel = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrievance, setSelectedGrievance] = useState(null); // modal
    const [detailIssue, setDetailIssue] = useState(null);           // drawer
    const [activeCoords, setActiveCoords] = useState(null);
    const [nextId, setNextId] = useState(100);

    useEffect(() => {
        fetch('http://localhost:5000/api/grievances')
            .then(r => r.json())
            .then(data => { setComplaints(data); setLoading(false); })
            .catch(() => { setComplaints(MOCK_ISSUES); setLoading(false); });
    }, []);

    const filtered = complaints.filter(item => {
        const ms = statusFilter === 'All' || item.status === statusFilter;
        const mq = item.title.toLowerCase().includes(searchQuery.toLowerCase())
            || item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return ms && mq;
    });

    const handleSave = useCallback(async (data) => {
        if (data.isNew || !data.id) {
            const newIssue = { ...data, id: nextId, isNew: false, created_at: new Date().toISOString() };
            setNextId(n => n + 1);
            setComplaints(prev => [newIssue, ...prev]);
        } else {
            setComplaints(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
            if (detailIssue?.id === data.id) setDetailIssue(d => ({ ...d, ...data }));
        }
        setSelectedGrievance(null);
    }, [nextId, detailIssue]);

    const handleStatusChange = useCallback((id, status) => {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        setDetailIssue(d => d?.id === id ? { ...d, status } : d);
    }, []);

    const handleCardClick = (item) => {
        setDetailIssue(item);
        if (item.latitude && item.longitude)
            setActiveCoords([parseFloat(item.latitude), parseFloat(item.longitude)]);
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, gap: 10, color: '#64748b' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Loading grievances…</span>
        </div>
    );

    const liveCount = complaints.filter(c => c.status !== 'Resolved').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Section Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Citizen Grievances</h2>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                        Real-time issue tracking across your constituency
                    </p>
                </div>
                <button
                    style={s.addBtn}
                    onClick={() => setSelectedGrievance({ isNew: true, title: '', location: '', priority: 'Medium', status: 'Pending', desc: '', reporter: '' })}
                >
                    <Plus size={14} />
                    <span>Add Issue</span>
                </button>
            </div>

            {/* ── Stat Pills ── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {[
                    { label: 'Live Issues', value: liveCount, color: '#f59e0b', icon: Clock, filter: 'Pending' },
                    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, color: '#3b82f6', icon: AlertCircle, filter: 'In Progress' },
                    { label: 'Resolved', value: resolvedCount, color: '#10b981', icon: CheckCircle2, filter: 'Resolved' },
                ].map(({ label, value, color, icon: Icon, filter }) => (
                    <div
                        key={label}
                        onClick={() => setStatusFilter(statusFilter === filter ? 'All' : filter)}
                        style={{
                            flex: 1, background: statusFilter === filter ? `${color}12` : '#fff',
                            border: `1px solid ${statusFilter === filter ? color + '40' : '#f1f5f9'}`,
                            borderRadius: 12, padding: '10px 14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 1 }}>{value}</div>
                        </div>
                        <div style={{ background: `${color}15`, padding: 8, borderRadius: 10 }}>
                            <Icon size={16} color={color} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Split Panel: Feed + Map ── */}
            <div style={{ display: 'flex', gap: 0, border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff', height: 520, position: 'relative' }}>

                {/* Feed */}
                <div style={{ width: 320, display: 'flex', flexDirection: 'column', borderRight: '1px solid #f1f5f9', flexShrink: 0 }}>
                    {/* Search + Filter */}
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={s.searchBox}>
                            <Search size={13} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search issues…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={s.searchInput}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                            {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    style={{
                                        padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                        cursor: 'pointer', border: '1px solid transparent',
                                        background: statusFilter === f ? '#0f172a' : 'transparent',
                                        color: statusFilter === f ? '#fff' : '#94a3b8',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
                        {filtered.length === 0
                            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 13 }}>No issues found</div>
                            : filtered.map(item => {
                                const pc = PRIORITY_COLORS[item.priority] || '#94a3b8';
                                const sc = STATUS_COLORS[item.status] || '#94a3b8';
                                const isActive = detailIssue?.id === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleCardClick(item)}
                                        style={{
                                            background: isActive ? '#f8faff' : '#fff',
                                            border: `1px solid ${isActive ? '#3b82f620' : '#f1f5f9'}`,
                                            borderLeft: `3px solid ${pc}`,
                                            borderRadius: 10, padding: '10px 12px', marginBottom: 6,
                                            cursor: 'pointer', transition: 'all 0.15s',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.title}</span>
                                                <span style={{ ...s.badge, background: `${pc}15`, color: pc }}>{item.priority}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <MapPin size={10} />{item.location}
                                                </span>
                                                <span style={{ ...s.badge, background: `${sc}12`, color: sc, fontSize: 9 }}>{item.status}</span>
                                            </div>
                                            <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 3, fontWeight: 600 }}>{timeAgo(item.created_at)}</div>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); setSelectedGrievance(item); }}
                                            style={{ ...s.iconBtn, marginLeft: 6 }}
                                        >
                                            <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* Map */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <MapContainer
                        center={[18.5204, 73.8567]}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                        <RecenterMap coords={activeCoords} />
                        {filtered.map(g => {
                            const lat = parseFloat(g.latitude) || 18.5204;
                            const lng = parseFloat(g.longitude) || 73.8567;
                            const color = g.status === 'Resolved' ? '#10b981' : PRIORITY_COLORS[g.priority] || '#3b82f6';
                            return (
                                <Marker key={g.id} position={[lat, lng]} icon={coloredIcon(color)}>
                                    <Popup>
                                        <div style={{ minWidth: 150, fontFamily: 'inherit' }}>
                                            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{g.title}</div>
                                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{g.location}</div>
                                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Status: {g.status}</div>
                                            <button
                                                onClick={() => { setDetailIssue(g); }}
                                                style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* Map legend */}
                    <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 5 }}>Priority</div>
                        {[['High', '#ef4444'], ['Medium', '#f59e0b'], ['Low / Resolved', '#10b981']].map(([label, color]) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', marginBottom: 3 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Issue count badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#64748b', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                        {filtered.length} of {complaints.length} shown
                    </div>

                    {/* Detail Drawer (overlaps the map from the right) */}
                    <DetailDrawer
                        issue={detailIssue}
                        onClose={() => setDetailIssue(null)}
                        onStatusChange={handleStatusChange}
                        onEdit={(issue) => { setSelectedGrievance(issue); setDetailIssue(null); }}
                    />
                </div>
            </div>

            {/* Modal */}
            <GrievanceModal
                issue={selectedGrievance}
                onClose={() => setSelectedGrievance(null)}
                onSave={handleSave}
            />

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
                .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; border: 1px solid #e2e8f0 !important; }
            `}</style>
        </div>
    );
};

// ─── Styles object ────────────────────────────────────────────────────────────
const s = {
    // Stat / layout
    badge: { display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' },
    addBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10,
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
    },
    searchBox: { display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '7px 10px', borderRadius: 8, border: '1px solid #e2e8f0' },
    searchInput: { border: 'none', outline: 'none', fontSize: 12, background: 'transparent', width: '100%', fontFamily: 'inherit' },
    iconBtn: { padding: 5, borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

    // Drawer
    drawerSection: { marginBottom: 12 },
    drawerLabel: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 3 },
    drawerVal: { fontSize: 12, color: '#1e293b', display: 'flex', alignItems: 'center', fontWeight: 500 },

    // Modal
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalBox: { background: '#fff', width: 460, maxWidth: '95vw', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    modalHdr: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalBody: { padding: 20, maxHeight: '60vh', overflowY: 'auto' },
    modalFtr: { padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 8 },
    closeBtn: { width: 28, height: 28, borderRadius: 7, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },

    // Form
    fieldGroup: { marginBottom: 12 },
    fieldLabel: { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', marginBottom: 5 },
    fieldInput: { width: '100%', padding: '9px 11px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#0f172a' },

    // Buttons
    btnPrimary: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
    btnSecondary: { padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b', fontWeight: 600 },
};

export default GrievancePanel;