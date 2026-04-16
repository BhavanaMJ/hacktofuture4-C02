import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, LogOut, ShieldCheck, 
    Sun, Moon, User, Bell, Settings
} from "lucide-react";
import "../pages/Dashboard.css";

const Alerts = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');

    const username = localStorage.getItem("username") || "Analyst";

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

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
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2><ShieldCheck size={28} /> SecureVault</h2>
                    <div className="sidebar-role" style={{ color: 'var(--text-secondary)' }}>
                        {localStorage.getItem("role") === "fraud_analyst" ? "Fraud Analyst" : "Customer"} Access
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/security" className="sidebar-link">
                        <LayoutDashboard size={20} className="link-icon" />
                        <span>Sessions</span>
                    </Link>
                    <Link to="/alerts" className="sidebar-link active">
                        <Bell size={20} className="link-icon" />
                        <span>Alerts</span>
                    </Link>
                    <Link to="/security-settings" className="sidebar-link">
                        <Settings size={20} className="link-icon" />
                        <span>Settings</span>
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <button className="sidebar-link" onClick={handleLogout}>
                        <LogOut size={20} className="link-icon" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="main-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="h1">Welcome, {username}.</h1>
                        <p className="micro-label" style={{marginTop: '8px'}}>Security Incident Alerts</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={toggleTheme} className="dash-btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: 'none', backgroundColor: 'var(--input-bg)', cursor: 'pointer' }}>
                            {theme === 'light' ? <Moon size={20} color="var(--primary-navy)" /> : <Sun size={20} color="var(--primary-navy)" />}
                        </button>
                        <Link to="/security-settings" style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 16px 6px 6px', borderRadius: '30px', backgroundColor: 'var(--input-bg)', transition: 'all 0.2s' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={18} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{username}</span>
                            </div>
                        </Link>
                    </div>
                </div>

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
                        <div className="alert-card" key={index} style={{ marginBottom: '16px', background: 'var(--surface-card)', padding: '24px', borderRadius: 'var(--radius-soft)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Incident Alert</h3>
                            <p style={{ margin: '4px 0' }}><b>User:</b> {alert.user}</p>
                            <p style={{ margin: '4px 0' }}>
                                <b>Risk Score: </b>
                                <span className={
                                    alert.risk_score > 70 ? "risk-high" :
                                        alert.risk_score > 40 ? "risk-medium" : "risk-low"
                                } style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{alert.risk_score}</span>
                            </p>
                            <p style={{ margin: '4px 0' }}><b>Reason:</b> {alert.reason}</p>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: '12px', marginBottom: 0 }}>
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