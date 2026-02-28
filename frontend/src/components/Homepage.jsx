import React from 'react';
import { ShieldCheck, Users, Landmark } from 'lucide-react';

const Homepage = ({ onSelectPortal }) => {
    return (
        <div className="homepage-hero">
            <div className="hero-content">
                <Landmark size={60} color="#3b82f6" />
                <h1>Management System</h1>
                <p>Secure Portal for Corporator Kunal Tilak</p>
            </div>

            <div className="portal-grid">
                <div className="portal-card admin" onClick={() => onSelectPortal('admin')}>
                    <ShieldCheck size={40} />
                    <h3>Admin Portal</h3>
                    <p>Full access to strategic data, budget management, and project oversight.</p>
                    <button>Login as Admin</button>
                </div>

                <div className="portal-card staff" onClick={() => onSelectPortal('user')}>
                    <Users size={40} />
                    <h3>Staff Portal</h3>
                    <p>Access for daily office logging, grievance tracking, and field updates.</p>
                    <button>Login as User</button>
                </div>
            </div>
        </div>
    );
};

export default Homepage;