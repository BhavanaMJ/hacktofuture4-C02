import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, LogOut, ShieldCheck, 
    Sun, Moon, User, Bell, Fingerprint, KeyRound, Settings as SettingsIcon, Users as UsersIcon
} from "lucide-react";
import "../pages/Dashboard.css";

const Settings = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');
    const [message, setMessage] = useState("");

    const username = localStorage.getItem("username") || "Analyst";

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

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
                    <Link to="/alerts" className="sidebar-link">
                        <Bell size={20} className="link-icon" />
                        <span>Alerts</span>
                    </Link>
                    <Link to="/users" className="sidebar-link">
                        <UsersIcon size={20} className="link-icon" />
                        <span>Users</span>
                    </Link>
                    <Link to="/security-settings" className="sidebar-link active">
                        <SettingsIcon size={20} className="link-icon" />
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
                        <h1 className="h1">Account Settings</h1>
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

                {message && <div className="dash-success" style={{marginBottom: '24px'}}>{message}</div>}

                <div className="bento-grid">
                    <div className="bento-card col-span-8">
                        <h2><Fingerprint size={20} /> User Details</h2>
                        <div style={{ display: 'flex', gap: '48px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Username</label>
                                <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: '600', color: 'var(--primary-navy)' }}>{username}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Account Status</label>
                                <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-green)' }}>
                                    <ShieldCheck size={18} /> Verified Analyst
                                </p>
                            </div>
                        </div>
                        
                        <hr style={{ border: 'none', borderTop: '1px solid var(--input-bg)', margin: '0 0 24px 0' }} />
                        
                        <h2>Recovery & Notifications</h2>
                        <div style={{ maxWidth: '400px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Recovery Email Address</label>
                            <input 
                                className="dash-input" 
                                type="email" 
                                defaultValue="analyst.secure@domain.com" 
                                placeholder="Enter backup email"
                            />
                            <button className="dash-btn dash-btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '14px' }} onClick={() => setMessage("Recovery email updated successfully.")}>
                                Update Backup Email
                            </button>
                        </div>
                    </div>

                    <div className="bento-card col-span-8">
                        <h2><KeyRound size={20} /> Change Password</h2>
                        <div style={{ maxWidth: '400px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Current Password</label>
                                <input className="dash-input" type="password" placeholder="••••••••" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>New Password</label>
                                <input className="dash-input" type="password" placeholder="••••••••" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Confirm New Password</label>
                                <input className="dash-input" type="password" placeholder="••••••••" />
                            </div>
                            <button className="dash-btn" style={{ marginTop: '8px', padding: '12px' }} onClick={() => setMessage("Password updated successfully.")}>
                                Save New Password
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
