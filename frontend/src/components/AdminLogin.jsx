import React, { useState } from 'react';
import { ArrowLeft, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
// "admin@gmail.com" ==== Admin123

const Login = ({ role, onSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password: password }),
            });
            // ... inside your fetch logic
            const data = await response.json();

            if (response.ok) {
                // We need to go one level deeper into the 'user' object
                const { token, user } = data;

                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);

                // Call onSuccess with the name and role from the nested user object
                onSuccess({
                    username: user.name,
                    role: user.role
                });

                console.log("Login successful for role:", user.role);
            } else {
                alert(data.message || "Invalid Credentials");
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Could not connect to the server.");
        }
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

                <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                    <div className="input-group">
                        <User className="input-icon" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // 'new-password' tells the browser this isn't a standard login field
                            autoComplete="new-password"
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
                            // 'new-password' is the most effective way to block autofill
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            style={eyeButtonStyle}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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

const eyeButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0'
};

export default Login;