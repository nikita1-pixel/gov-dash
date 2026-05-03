import React, { useState } from 'react';
import axios from 'axios';

const UserLogin = ({ onBack, onSuccess, role }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Sending role along with credentials to ensure they log into the right portal
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: formData.username,
                password: formData.password,
                role: role // 'admin' or 'staff' passed from App.jsx
            });

            // Session Creation: Store the token
            localStorage.setItem('token', response.data.token);

            // Update global App state
            onSuccess(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized: Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper" style={containerStyle}>
            <div className="login-card" style={cardStyle}>
                <button onClick={onBack} style={backBtn}>← Back</button>
                <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>
                    {role === 'admin' ? 'Admin Login' : 'Staff Portal'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                    Please enter your credentials to access the command center.
                </p>

                {error && <div style={errorBox}>{error}</div>}

                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            style={inputStyle}
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            style={inputStyle}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={loginBtn}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Basic Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' };
const loginBtn = { width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
const errorBox = { padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fee2e2' };
const backBtn = { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '16px', fontWeight: '600' };
const inputGroup = { marginBottom: '16px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#475569' };
const formStyle = { textAlign: 'left' };

export default UserLogin;