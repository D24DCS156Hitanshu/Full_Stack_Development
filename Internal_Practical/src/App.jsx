import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './App.css';

function App() {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location = '/';
    };

    return (
        <Router>
            <div className="App">
                <header className="header">
                    <div className="nav-container">
                        <Link to="/" className="logo">
                            AuthPortal
                        </Link>
                        <nav>
                            <ul className="nav-links">
                                <li>
                                    <Link to="/" className="nav-link">Dashboard</Link>
                                </li>
                                {token ? (
                                    <li>
                                        <button onClick={handleLogout} className="logout-btn">
                                            Sign Out
                                        </button>
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/login" className="nav-link">Sign In</Link>
                                        </li>
                                        <li>
                                            <Link to="/register" className="nav-link">Sign Up</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;