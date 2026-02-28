import React, { useState } from 'react';
import { FileText, Download, Share2, FileCheck, Loader2, Mail } from 'lucide-react';

const ReportingModule = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = () => {
        setIsGenerating(true);
        // Simulate PDF Generation
        setTimeout(() => {
            setIsGenerating(false);
            alert("Report 'Constituency_Monthly_Feb2026.pdf' has been downloaded.");
        }, 2000);
    };

    return (
        <div style={reportCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px', fontWeight: '800', fontSize: '18px' }}>Monthly Status Report</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Generate a detailed PDF of all grievances, funds, and media updates.</p>
                </div>
                <div style={iconCircle}><FileText size={20} color="#3b82f6" /></div>
            </div>

            <div style={statsMiniGrid}>
                <div style={miniStat}>
                    <span style={miniLabel}>Report Period</span>
                    <span style={miniValue}>Feb 01 - Feb 28</span>
                </div>
                <div style={miniStat}>
                    <span style={miniLabel}>Data Points</span>
                    <span style={miniValue}>1,240 Entries</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                    onClick={handleExport}
                    disabled={isGenerating}
                    style={primaryBtn(isGenerating)}
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    {isGenerating ? "Generating..." : "Download PDF"}
                </button>

                <button style={secondaryBtn}>
                    <Mail size={18} />
                    Email to Dept.
                </button>
            </div>
        </div>
    );
};

// --- STYLES ---
const reportCardStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
};

const iconCircle = {
    background: '#eff6ff',
    padding: '12px',
    borderRadius: '12px'
};

const statsMiniGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '20px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px'
};

const miniStat = { display: 'flex', flexDirection: 'column', gap: '4px' };
const miniLabel = { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' };
const miniValue = { fontSize: '14px', fontWeight: '700', color: '#1e293b' };

const primaryBtn = (loading) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: loading ? '#94a3b8' : '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: '0.2s'
});

const secondaryBtn = {
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
};

export default ReportingModule;