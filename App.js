import React, { useState } from 'react';
import DashboardView from './components/DashboardView';
import LoginView from './components/LoginView';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            {!token ? (
                <LoginView onLogin={handleLogin} />
            ) : (
                <DashboardView onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;