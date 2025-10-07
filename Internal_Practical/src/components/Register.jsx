import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await authService.register(name, email, password);
            localStorage.setItem('token', res.data.token);
            window.location = '/';
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="card auth-card">
            <div className="card-header">
                <h2 className="card-title">Create Account</h2>
                <p className="card-subtitle">Join us today and get started</p>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}
                <form onSubmit={onSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your full name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
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
                            placeholder="Create a password (min 6 characters)"
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
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="link">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;