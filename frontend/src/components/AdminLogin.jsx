import React, { useState } from 'react';
import { ArrowLeft, Lock, User, ShieldCheck } from 'lucide-react';


const Login = ({ role, onSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In Sprint 2, we will validate these with the Node.js backend
        console.log(`Logging in as ${role}`);
        onSuccess();
    };

    return (
        <div className="login-overlay">
            <div className="login-modal">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="login-header">
                    <div className={`role-badge ${role}`}>
                        {role === 'admin' ? <ShieldCheck size={24} /> : <User size={24} />}
                    </div>
                    <h2>{role === 'admin' ? 'Admin Access' : 'Staff Login'}</h2>
                    <p>Please enter your credentials to access the secure enclave.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Authorize & Enter
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by 256-bit AES Encryption</p>
                </div>
            </div>
        </div>
    );
};

export default Login;