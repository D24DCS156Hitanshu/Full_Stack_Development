import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await authService.login(email, password);
            localStorage.setItem('token', res.data.token);
            window.location = '/';
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="card auth-card">
            <div className="card-header">
                <h2 className="card-title">Welcome Back</h2>
                <p className="card-subtitle">Sign in to your account to continue</p>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}
                <form onSubmit={onSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            minLength="6"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="link">
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;