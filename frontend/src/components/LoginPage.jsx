import React from 'react';

const Homepage = ({ onLoginClick }) => {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>AuthPortal</h1>
      <p style={subtitleStyle}>Adminsitrive management system</p>
      
      <div style={cardContainer}>
        {/* Admin Card */}
        <div style={cardStyle}>
          <div style={iconStyle}>🛡️</div>
          <h3>Admin Portal</h3>
          <p style={descStyle}>Full access to strategic data and project oversight.</p>
          <button 
            onClick={() => onLoginClick('admin')} 
            style={adminBtnStyle}
          >
            Login as Admin
          </button>
        </div>

        {/* Staff Card */}
        <div style={cardStyle}>
          <div style={iconStyle}>👥</div>
          <h3>Staff Portal</h3>
          <p style={descStyle}>Access for daily office logging and grievance tracking.</p>
          <button 
            onClick={() => onLoginClick('staff')} 
            style={staffBtnStyle} // This was the missing reference!
          >
            Login as User
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Add these Styles at the bottom ---

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#0f172a',
  color: '#fff',
  textAlign: 'center',
  padding: '20px'
};

const titleStyle = { fontSize: '2.5rem', marginBottom: '10px' };
const subtitleStyle = { color: '#94a3b8', marginBottom: '40px' };
const cardContainer = { display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' };

const cardStyle = {
  backgroundColor: '#1e293b',
  padding: '32px',
  borderRadius: '16px',
  width: '300px',
  border: '1px solid #334155'
};

const iconStyle = { fontSize: '40px', marginBottom: '16px' };
const descStyle = { fontSize: '14px', color: '#94a3b8', marginBottom: '24px' };

const adminBtnStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const staffBtnStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#1e293b',
  color: '#3b82f6',
  border: '1px solid #3b82f6',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Homepage;