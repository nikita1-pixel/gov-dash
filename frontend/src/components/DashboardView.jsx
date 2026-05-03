import React from 'react';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldCheck, Map } from 'lucide-react';

const DashboardView = ({ user, onLogout }) => {
    // Fallback if user data hasn't loaded yet
    if (!user) return <div className="loading">Initializing Session...</div>;

    return (
        <div className="dashboard-container" style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <ShieldCheck size={32} color="#38bdf8" />
                    <h2 style={styles.logoText}>Command Center</h2>
                </div>

                <nav style={styles.nav}>
                    <div style={styles.navItem}><LayoutDashboard size={20} /> Overview</div>
                    <div style={styles.navItem}><Map size={20} /> Ward Map</div>
                    <div style={styles.navItem}><FileText size={20} /> Grievances</div>
                    {user.role === 'admin' && (
                        <div style={styles.navItem}><Users size={20} /> Staff Management</div>
                    )}
                </nav>

                <button onClick={onLogout} style={styles.logoutBtn}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.welcomeText}>Welcome back, {user.username}</h1>
                        <p style={styles.subText}>Role: <span style={styles.roleBadge}>{user.role.toUpperCase()}</span></p>
                    </div>
                </header>

                <section style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <h3>Active Grievances</h3>
                        <p style={styles.statNumber}>24</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>Resolved Today</h3>
                        <p style={styles.statNumber}>12</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>Ward Efficiency</h3>
                        <p style={styles.statNumber}>94%</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

// Simple Dark Theme Inline Styles
const styles = {
    container: { display: 'flex', height: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' },
    sidebar: { width: '260px', background: '#1e293b', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 10px' },
    logoText: { fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', color: '#94a3b8' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', fontWeight: 'bold' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
    header: { marginBottom: '30px' },
    welcomeText: { fontSize: '28px', marginBottom: '5px' },
    subText: { color: '#94a3b8' },
    roleBadge: { color: '#38bdf8', fontWeight: 'bold', fontSize: '12px', padding: '2px 8px', border: '1px solid #38bdf8', borderRadius: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
    statCard: { background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
    statNumber: { fontSize: '32px', fontWeight: 'bold', color: '#38bdf8', marginTop: '10px' }
};

export default DashboardView;