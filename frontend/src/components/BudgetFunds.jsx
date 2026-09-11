import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Wallet, Landmark, ArrowUpRight, ArrowDownRight,
    BarChart3, PieChart, Plus, HardHat, FileText,
    AlertTriangle, CheckCircle, Search
} from 'lucide-react';

const BudgetFunds = () => {
    const [activeTab, setActiveTab] = useState('all'); // all, dpdc, mla, municipal

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get('/api/projects')
            .then(res => setProjects(res.data.projects))
            .catch(err => console.error(err));
    }, []);

    // --- Live KPI totals computed from real projects ---
    const totalSanctioned = projects.reduce((sum, p) => sum + (p.total || 0),
        0);
    const totalReleased = projects.reduce((sum, p) => sum + (p.released || 0),
        0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const atRiskCount = projects.filter(p => p.health === 'At Risk').length;

    // format rupees into Crores (1 Cr = 1,00,00,000)
    const toCr = (amount) => `₹${(amount / 10000000).toFixed(2)} Cr`;

    // --- Executive action: Add a new sanctioned project ---
    const handleAddSanction = async () => {
        const name = window.prompt("Project name?");
        if (!name) return;
        const total = Number(window.prompt("Sanctioned amount in ₹ (e.g. 1500000) ? ", "1000000")) || 0;
      const source = window.prompt("Fund source? (DPDC / MLA Fund / Municipal)", "DPDC") || "DPDC";
        try {
            const res = await api.post('/api/projects', {
                name, total, source, released: 0, spent: 0, status:
                    'Planning', health: 'Good',
            });
            setProjects(prev => [res.data.project, ...prev]); // show it instantly
        } catch (err) {
            alert(err.response?.data?.message || "Could not add sanction");
        }
    };

    const handleDownloadReport = () => {
        // 1. Column headers + one row per project (pulled from the data)
        const headers = ['Project', 'Source', 'Status', 'Sanctioned',
            'Released', 'Spent', 'Utilization %', 'Health'];
        const rows = projects.map(p => [
            p.name, p.source, p.status, p.total, p.released, p.spent,
            Math.round((p.spent / p.total) * 100),
            p.health,
        ]);

      // 2. Turn it into CSV text (wrap each cell in quotes so commas insideare safe)
        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

      // 3. Wrap the text in a Blob (an in-memory file) and make a temporary URL for it
      const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

      // 4. Create a hidden link pointing at that file, "click" it to trigger the download, then clean up
        const a = document.createElement('a');
        a.href = url;
        a.download = `funds-report-${new Date().toISOString().slice(0,
            10)}.csv`;
        a.click();
        URL.revokeObjectURL(url); // free the memory
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. FINANCIAL KPI ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <FinanceCard label="Total Sanctioned" value={toCr(totalSanctioned)} sub={`${projects.length} projects`} icon={Landmark} color="#3b82f6" />
                <FinanceCard label="Total Released" value={toCr(totalReleased)}  sub={`${totalSanctioned ? Math.round((totalReleased / totalSanctioned) * 100) : 0}% liquidity`} icon={Wallet} color="#10b981" />
                <FinanceCard label="Total Expenditure" value={toCr(totalSpent)}  sub={`${totalReleased ? Math.round((totalSpent / totalReleased) * 100) :   0}% of released`} icon={BarChart3} color="#f59e0b" />
                <FinanceCard label="At Risk Projects" value={atRiskCount} sub="Need attention" icon={FileText} color="#ef4444" />
            </div>

            {/* 2. PROJECT LEDGER & ANALYTICS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>

                {/* LEFT: DETAILED PROJECT TABLE (8 Columns) */}
                <div style={{ gridColumn: 'span 8', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '20px' }}>Project Expenditure Ledger</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={filterBtnStyle(true)}>All Funds</button>
                            <button style={filterBtnStyle(false)}>DPDC</button>
                            <button style={filterBtnStyle(false)}>MLA Fund</button>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}>Project Details</th>
                                <th style={thStyle}>Fund Source</th>
                                <th style={thStyle}>Budget Allocation</th>
                                <th style={thStyle}>Utilization</th>
                                <th style={thStyle}>Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(proj => (
                                <tr key={proj._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{proj.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{proj.status}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={tagStyle(proj.source)}>{proj.source}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '700' }}>₹{(proj.total / 100000).toFixed(1)}L</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>Rel: ₹{(proj.released / 100000).toFixed(1)}L</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ width: '100px', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '4px' }}>
                                            <div style={{ width: `${(proj.spent / proj.total) * 100}%`, height: '100%', background: '#3b82f6' }} />
                                        </div>
                                        <div style={{ fontSize: '11px', fontWeight: '700' }}>{Math.round((proj.spent / proj.total) * 100)}%</div>
                                    </td>
                                    <td style={tdStyle}>
                                        {proj.health === 'Good' ? <CheckCircle size={18} color="#10b981" /> : <AlertTriangle size={18} color="#ef4444" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RIGHT: BUDGET DISTRIBUTION (4 Columns) */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: '#0f172a', borderRadius: '24px', padding: '32px', color: '#fff' }}>
                        <h4 style={{ margin: '0 0 20px', fontSize: '16px' }}>Funding Distribution</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <DistributionItem label="DPDC Fund" percent={45} color="#3b82f6" />
                            <DistributionItem label="MLA Local Fund" percent={30} color="#10b981" />
                            <DistributionItem label="Municipal Corp" percent={25} color="#f59e0b" />
                        </div>
                        <button onClick={handleDownloadReport}  
                        style={{ width: '100%', marginTop: '32px', padding: '14px', borderRadius: '12px', border: '1px solid #334155', background: 'transparent', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                            Generate Audit Report
                        </button>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px' }}>
                        <h4 style={{ margin: '0 0- 16px', fontSize: '16px', fontWeight: '800' }}>Quick Actions</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <ActionBtn icon={Plus} label="Add Sanction" onClick={handleAddSanction} />
                            <ActionBtn icon={FileText} label="Log Expense" />
                            <ActionBtn icon={PieChart} label="Analytics" />
                            <ActionBtn icon={Search} label="Audit Log" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- STYLES & COMPONENTS ---

const FinanceCard = ({ label, value, sub, icon: Icon, color }) => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ background: `${color}10`, padding: '10px', borderRadius: '12px' }}><Icon size={22} color={color} /></div>
            <ArrowUpRight size={18} color="#94a3b8" />
        </div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0', color: '#1e293b' }}>{value}</div>
        <div style={{ fontSize: '11px', fontWeight: '600', color: color === '#ef4444' ? '#ef4444' : '#10b981' }}>{sub}</div>
    </div>
);

const DistributionItem = ({ label, percent, color }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ opacity: 0.8 }}>{label}</span>
            <span style={{ fontWeight: '700' }}>{percent}%</span>
        </div>
        <div style={{ height: '6px', background: '#ffffff20', borderRadius: '10px' }}>
            <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: '10px' }} />
        </div>
    </div>
);

const ActionBtn = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', flexDirection:
            'column', alignItems: 'center', gap: '8px', padding: '16px', borderRadius:
            '16px', border: '1px solid #f1f5f9', background: '#f8fafc', cursor:
            'pointer', transition: '0.2s'
    }}>
        <Icon size={20} color="#3b82f6" />
        <span style={{
            fontSize: '11px', fontWeight: '700', color:
                '#64748b'
        }}>{label}</span>
    </button>
);

const tagStyle = (source) => ({
    fontSize: '10px', fontWeight: '900', padding: '4px 8px', borderRadius: '6px',
    background: source === 'DPDC' ? '#eff6ff' : source === 'MLA Fund' ? '#ecfdf5' : '#fff7ed',
    color: source === 'DPDC' ? '#3b82f6' : source === 'MLA Fund' ? '#10b981' : '#f59e0b'
});

const filterBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '10px', border: 'none',
    background: active ? '#3b82f6' : '#f1f5f9',
    color: active ? '#fff' : '#64748b',
    fontWeight: '700', fontSize: '12px', cursor: 'pointer'
});

const thStyle = { padding: '16px 8px', color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' };
const tdStyle = { padding: '20px 8px' };

export default BudgetFunds;