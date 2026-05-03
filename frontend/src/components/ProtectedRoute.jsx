import React from 'react';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
    // 1. Check if user is logged in
    if (!user) {
        return <div style={{ padding: '20px', color: 'red' }}>Access Denied: Please Login</div>;
    }

    // 2. Check if the user's role (from Postgres) is allowed for this view
    if (!allowedRoles.includes(user.role)) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>🚫 Restricted Access</h2>
                <p>Your account is registered as <strong>{user.role}</strong>.</p>
                <p>Only Admins can access this section of the Command Center.</p>
            </div>
        );
    }

    // 3. If all checks pass, show the content (children)
    return children;
};

export default ProtectedRoute;