/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';
import GrievanceList from './components/GrievanceList';
import DailyOffice from './components/DailyOffice';
import BudgetFunds from './components/BudgetFunds';
import GrievanceAnalytics from './components/GrievanceAnalytics';
import CitizenFeedback from './components/CitizenFeedback';

import {
  LayoutDashboard, Users, Calendar, Wallet,
  Megaphone, ShieldAlert, LogOut, Search, Bell, X, CheckCircle, Filter, ChevronRight
} from 'lucide-react';

// --- Sidebar Link Component ---
const SidebarLink = ({ icon: Icon, label, active, onClick, color = '#94a3b8' }) => (
  <button onClick={onClick} style={{
    width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
    padding: '14px 20px', borderRadius: '12px', border: 'none',
    backgroundColor: active ? '#3b82f6' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    cursor: 'pointer', transition: 'all 0.2s ease',
    textAlign: 'left', marginBottom: '4px'
  }}>
    <Icon size={20} color={active ? '#fff' : (label === 'Emergency Mode' ? '#ef4444' : color)} strokeWidth={active ? 2.5 : 2} />
    <span style={{ fontSize: '14px', fontWeight: active ? '700' : '500', flex: 1 }}>{label}</span>
    {active && <ChevronRight size={14} />}
  </button>
);

function App() {
  const [view, setView] = useState('home');
  const [userRole, setUserRole] = useState(null);

  // --- Global Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("All Wards");

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Critical: Water Leakage in Ward 12", time: "2 mins ago", type: "emergency", read: false },
    { id: 2, text: "Budget Approved for School Reno", time: "1 hour ago", type: "success", read: false },
    { id: 3, text: "Staff Meeting at 4:30 PM", time: "3 hours ago", type: "info", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (view === 'home') return <Homepage onSelectPortal={(role) => { setUserRole(role); setView('login'); }} />;
  if (view === 'login') return <Login role={userRole} onSuccess={() => setView('dashboard')} onBack={() => setView('home')} />;

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={logoIcon}>KT</div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Kunal Tilak</h2>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>● Command Center</span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px' }}>
          <SidebarLink icon={LayoutDashboard} label="Home Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <SidebarLink icon={Users} label="Citizen Grievances" active={view === 'grievances'} onClick={() => setView('grievances')} />
          <SidebarLink icon={Calendar} label="Grievance Analytics" active={view === 'analytics'} onClick={() => setView('analytics')} />
          <SidebarLink icon={Calendar} label="Daily Office" active={view === 'office'} onClick={() => setView('office')} />
          <SidebarLink icon={Wallet} label="Budget & Funds" active={view === 'budget'} onClick={() => setView('budget')} />
          <SidebarLink icon={Users} label="Citizen Feedback" active={view === 'feedback'} onClick={() => setView('feedback')} />
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
          <SidebarLink icon={ShieldAlert} label="Emergency Mode" active={view === 'emergency'} onClick={() => setView('emergency')} />
          <button onClick={() => setView('home')} style={logoutBtn}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '280px', flex: 1 }}>

        {/* TOP BAR */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={searchWrapper}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search across constituency..."
                style={topSearchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={wardBadge}>
              <Filter size={14} color="#64748b" />
              <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} style={wardSelect}>
                <option>All Wards</option>
                <option>Ward 12</option>
                <option>Ward 08</option>
                <option>Ward 14</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={22} color="#64748b" cursor="pointer" onClick={() => setShowNotifications(!showNotifications)} />
              {unreadCount > 0 && <span style={notifBadge}>{unreadCount}</span>}

              {showNotifications && (
                <div style={notifDropdown}>
                  <div style={notifHeader}>
                    <span style={{ fontWeight: '800' }}>Alerts Center</span>
                    <button onClick={markAllRead} style={readAllBtn}>Mark read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ ...notifItem, backgroundColor: n.read ? '#fff' : '#f0f7ff' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{n.text}</div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={userProfile}>
              <div style={userAvatar}>KT</div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: '32px' }}>
          {view === 'dashboard' && <HomeDashboard searchTerm={searchTerm} ward={selectedWard} />}
          {view === 'grievances' && <GrievanceList searchTerm={searchTerm} ward={selectedWard} />}
          {view === 'analytics' && <GrievanceAnalytics />}
          {view === 'office' && <DailyOffice />}
          {view === 'budget' && <BudgetFunds />}
          {view === 'feedback' && <CitizenFeedback />}

          {view === 'emergency' && (
            <div style={emergencyContainer}>
              <ShieldAlert size={48} color="#ef4444" />
              <h2 style={{ margin: '16px 0 8px 0', color: '#1e293b' }}>Emergency Broadcast Mode</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Dispatch critical alerts to all 12 Wards and 48 Officers instantly.</p>
              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px' }}>
                <input type="text" placeholder="Enter emergency message..." style={emInput} />
                <button style={emBtn}>Broadcast</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- CSS-IN-JS OBJECTS ---
const sidebarStyle = { width: '280px', backgroundColor: '#0f172a', height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 1000 };
const logoIcon = { width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' };
const logoutBtn = { width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: 'transparent', border: '1px solid #1e293b', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' };
const headerStyle = { height: '80px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 900 };
const searchWrapper = { display: 'flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', padding: '10px 16px', borderRadius: '12px', width: '350px' };
const topSearchInput = { background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%' };
const wardBadge = { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px' };
const wardSelect = { border: 'none', background: 'transparent', fontWeight: '700', fontSize: '13px', outline: 'none', cursor: 'pointer' };
const notifBadge = { position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' };
const userProfile = { display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0' };
const userAvatar = { width: '38px', height: '38px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };

// Notif Dropdown
const notifDropdown = { position: 'absolute', top: '40px', right: '0', width: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' };
const notifHeader = { padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const readAllBtn = { border: 'none', background: 'transparent', color: '#3b82f6', fontWeight: '700', fontSize: '12px', cursor: 'pointer' };
const notifItem = { padding: '16px', borderBottom: '1px solid #f1f5f9' };

// Emergency Mode
const emergencyContainer = { height: '60vh', background: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #fca5a5' };
const emInput = { flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' };
const emBtn = { padding: '14px 28px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' };

export default App;