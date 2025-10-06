import React, { useState, useEffect } from 'react';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload.user);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
                <p className="dashboard-subtitle">
                    Manage your account and access all features from your personalized dashboard.
                    Your security and privacy are our top priorities.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🔐</div>
                    <h3 className="stat-title">Secure Authentication</h3>
                    <p className="stat-description">
                        Your account is protected with industry-standard JWT authentication 
                        and encrypted password storage.
                    </p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <h3 className="stat-title">High Performance</h3>
                    <p className="stat-description">
                        Built with React and Node.js for lightning-fast performance 
                        and seamless user experience.
                    </p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛡️</div>
                    <h3 className="stat-title">Data Protection</h3>
                    <p className="stat-description">
                        Your personal information is encrypted and stored securely 
                        with MongoDB and follows best security practices.
                    </p>
                </div>
            </div>

            {user && (
                <div className="user-info">
                    <h3>Account Information</h3>
                    <div className="user-detail">
                        <span className="user-label">User ID</span>
                        <span className="user-value">{user.id}</span>
                    </div>
                    <div className="user-detail">
                        <span className="user-label">Account Status</span>
                        <span className="status-badge">
                            ✓ Active & Verified
                        </span>
                    </div>
                    <div className="user-detail">
                        <span className="user-label">Session</span>
                        <span className="user-value">Authenticated</span>
                    </div>
                    <div className="user-detail">
                        <span className="user-label">Security Level</span>
                        <span className="user-value">High</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;