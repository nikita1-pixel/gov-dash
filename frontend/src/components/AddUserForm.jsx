/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react';
import { Loader2, User, Lock, ShieldCheck, Mail, MapPin, Check, X } from 'lucide-react';

const AddUserForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        ward: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- NEW: Password Strength Logic ---
    const calculateStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = useMemo(() => calculateStrength(formData.password), [formData.password]);

    const getStrengthColor = () => {
        if (strength <= 2) return '#ef4444'; // Red
        if (strength <= 4) return '#f59e0b'; // Orange
        return '#22c55e'; // Green
    };

    const getStrengthText = () => {
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 4) return 'Medium';
        return 'Strong';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation before fetch
        if (strength < 4) {
            return setError("Please provide a stronger password (must include uppercase, lowercase, and a number).");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return setError("Please enter a valid email address.");
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('User created successfully!');
                if (onSuccess) onSuccess();
            } else {
                setError(data.message || 'Failed to create user');
            }
        } catch (err) {
            setError("Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && (
                <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            {/* Name, Email fields (same as before) */}
            <div style={inputGroupStyle}>
                <User size={18} color="#94a3b8" />
                <input type="text" placeholder="Full Name" required style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div style={inputGroupStyle}>
                <Mail size={18} color="#94a3b8" />
                <input type="email" placeholder="Email Address" required style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            {/* Password Field with Meter */}
            <div>
                <div style={inputGroupStyle}>
                    <Lock size={18} color="#94a3b8" />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        style={inputStyle}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {/* Visual Strength Meter */}
                {formData.password && (
                    <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Strength: <strong>{getStrengthText()}</strong></span>
                        </div>
                        <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${(strength / 5) * 100}%`,
                                backgroundColor: getStrengthColor(),
                                transition: 'width 0.3s ease, background-color 0.3s ease'
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Ward and Role (same as before) */}
            {/* <div style={inputGroupStyle}>
                <MapPin size={18} color="#94a3b8" />
                <input type="text" placeholder="Ward" required style={inputStyle} value={formData.ward} onChange={(e) => setFormData({ ...formData, ward: e.target.value })} />
            </div> */}

            <div style={inputGroupStyle}>
                <ShieldCheck size={18} color="#94a3b8" />
                <select style={inputStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="staff">Staff Member</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" disabled={loading} style={submitBtnStyle}>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create User'}
                </button>
            </div>
        </form>
    );
};

// Styles (Simplified)
const inputGroupStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' };
const inputStyle = { border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' };
const cancelBtnStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' };
const submitBtnStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontWeight: '600', cursor: 'pointer' };

export default AddUserForm;