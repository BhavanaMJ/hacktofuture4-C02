import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Auth.css";

const Alerts = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/alerts/")
            .then((res) => res.json())
            .then((data) => { setAlerts(data); setLoading(false); })
            .catch((err) => { console.error(err); setLoading(false); });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const highRisk = alerts.filter(a => a.risk_score > 70).length;
    const mediumRisk = alerts.filter(a => a.risk_score > 40 && a.risk_score <= 70).length;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🛡️ SecureBank</h2>
                    <div className="sidebar-role">Fraud Analyst</div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/security" className="sidebar-link">
                        <span className="link-icon">📊</span>
                        <span>Sessions</span>
                    </Link>
                    <Link to="/alerts" className="sidebar-link active">
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
                    <h1>🚨 Security Alerts</h1>
                    <p>Review flagged activities and potential threats</p>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card accent-red">
                        <p className="stat-label">High Risk</p>
                        <p className="stat-value">{highRisk}</p>
                    </div>
                    <div className="stat-card accent-orange">
                        <p className="stat-label">Medium Risk</p>
                        <p className="stat-value">{mediumRisk}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Alerts</p>
                        <p className="stat-value">{alerts.length}</p>
                    </div>
                </div>

                {/* Alert List */}
                {loading ? (
                    <div className="dash-card">
                        <div className="empty-state">Loading alerts...</div>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="dash-card">
                        <div className="empty-state">✅ No security alerts — all clear!</div>
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <div className="alert-card" key={index}>
                            <p><b>User:</b> {alert.user}</p>
                            <p>
                                <b>Risk Score: </b>
                                <span className={
                                    alert.risk_score > 70 ? "risk-high" :
                                        alert.risk_score > 40 ? "risk-medium" : "risk-low"
                                }>{alert.risk_score}</span>
                            </p>
                            <p><b>Reason:</b> {alert.reason}</p>
                            <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: 6 }}>
                                {new Date(alert.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default Alerts;