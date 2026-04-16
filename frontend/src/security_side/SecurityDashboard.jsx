import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Auth.css";

const SecurityDashboard = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("username") || "Analyst";

    useEffect(() => {
        fetch("http://localhost:8000/api/sessions/")
            .then((res) => res.json())
            .then((data) => { setSessions(data); setLoading(false); })
            .catch((err) => { console.error(err); setLoading(false); });
    }, []);

    const getRiskClass = (risk) => {
        if (risk > 70) return "risk-high";
        if (risk > 40) return "risk-medium";
        return "risk-low";
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const activeSessions = sessions.filter(s => s.status === "active").length;
    const blockedSessions = sessions.filter(s => s.status === "blocked").length;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🛡️ SecureBank</h2>
                    <div className="sidebar-role">Fraud Analyst</div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/security" className="sidebar-link active">
                        <span className="link-icon">📊</span>
                        <span>Sessions</span>
                    </Link>
                    <Link to="/alerts" className="sidebar-link">
                        <span className="link-icon">🚨</span>
                        <span>Alerts</span>
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <button className="sidebar-link" onClick={handleLogout}>
                        <span className="link-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content">
                <div className="main-header">
                    <h1>Security Dashboard</h1>
                    <p>Monitor user sessions and detect anomalies</p>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">Total Sessions</p>
                        <p className="stat-value">{sessions.length}</p>
                    </div>
                    <div className="stat-card accent-green">
                        <p className="stat-label">Active</p>
                        <p className="stat-value">{activeSessions}</p>
                    </div>
                    <div className="stat-card accent-red">
                        <p className="stat-label">Blocked</p>
                        <p className="stat-value">{blockedSessions}</p>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="dash-card">
                    <h2>📡 Active Sessions</h2>
                    {loading ? (
                        <div className="empty-state">Loading sessions...</div>
                    ) : sessions.length === 0 ? (
                        <div className="empty-state">No sessions found</div>
                    ) : (
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Session ID</th>
                                    <th>IP Address</th>
                                    <th>Risk Score</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((s, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 600 }}>{s.user}</td>
                                        <td style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#64748b" }}>
                                            {s.session_id?.substring(0, 12)}...
                                        </td>
                                        <td>{s.ip_address}</td>
                                        <td className={getRiskClass(s.risk_score)}>{s.risk_score}</td>
                                        <td>
                                            <span className={`mode-badge ${s.status === "active" ? "normal" : "attack"}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td style={{ color: "#64748b", fontSize: "0.82rem" }}>
                                            {new Date(s.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SecurityDashboard;