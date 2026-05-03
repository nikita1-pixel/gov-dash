import { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';


const GrievanceAnalytics = () => {
    // Mock data - In the next step, we'll fetch this from GrievanceService
    const analyticsData = [
        { category: "Water Supply", count: 45, color: "#3b82f6" },
        { category: "Street Lights", count: 28, color: "#f59e0b" },
        { category: "Garbage", count: 32, color: "#10b981" },
        { category: "Road Repairs", count: 12, color: "#ef4444" },
    ];
    // Add this state
    const [showAddForm, setShowAddForm] = useState(false);

    // Add this function
    const handleAddGrievance = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/grievances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const newGrievance = await response.json();
                setComplaints([newGrievance, ...complaints]); // Update list immediately
                setShowAddForm(false);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Category Breakdown */}
            <div style={cardStyle}>
                <div style={cardHeader}>
                    <BarChart3 size={20} color="#3b82f6" />
                    <h3 style={cardTitle}>Issues by Category</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    {analyticsData.map((item) => (
                        <div key={item.category}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={catLabel}>{item.category}</span>
                                <span style={catCount}>{item.count} reports</span>
                            </div>
                            <div style={barBg}>
                                <div style={{ ...barFill, width: `${(item.count / 50) * 100}%`, backgroundColor: item.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ward Performance Health */}
            <div style={cardStyle}>
                <div style={cardHeader}>
                    <TrendingUp size={20} color="#10b981" />
                    <h3 style={cardTitle}>Ward Resolution Efficiency</h3>
                </div>
                <table style={tableStyle}>
                    <thead>
                        <tr style={thRow}>
                            <th style={th}>Ward</th>
                            <th style={th}>Solved</th>
                            <th style={th}>Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>Ward 12</td>
                            <td style={td}>85%</td>
                            <td style={td}><span style={healthBadge('#dcfce7', '#166534')}>High</span></td>
                        </tr>
                        <tr>
                            <td style={td}>Ward 08</td>
                            <td style={td}>42%</td>
                            <td style={td}><span style={healthBadge('#fee2e2', '#991b1b')}>Critical</span></td>
                        </tr>
                    </tbody>
                </table>
                <div style={alertBox}>
                    <AlertTriangle size={18} color="#991b1b" />
                    <p style={{ margin: 0, fontSize: '13px', color: '#991b1b' }}>
                        <strong>Action Required:</strong> Ward 08 is falling behind the 72-hour SLA.
                    </p>
                </div>
            </div>

        </div>
    );
};

// --- Styles ---
const cardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' };
const cardHeader = { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' };
const cardTitle = { margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' };
const barBg = { width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' };
const barFill = { height: '100%', borderRadius: '4px', transition: 'width 1s ease-in-out' };
const catLabel = { fontSize: '14px', fontWeight: '600', color: '#475569' };
const catCount = { fontSize: '12px', fontWeight: '700', color: '#64748b' };
const tableStyle = { width: '100%', marginTop: '16px', borderCollapse: 'collapse' };
const thRow = { textAlign: 'left', borderBottom: '2px solid #f1f5f9' };
const th = { padding: '12px 8px', fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' };
const td = { padding: '16px 8px', fontSize: '14px', color: '#1e293b', fontWeight: '600' };
const healthBadge = (bg, text) => ({ backgroundColor: bg, color: text, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' });
const alertBox = { marginTop: '24px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #fee2e2' };

export default GrievanceAnalytics;