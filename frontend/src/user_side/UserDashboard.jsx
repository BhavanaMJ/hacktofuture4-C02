import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { 
    LayoutDashboard, Send, Fingerprint, LogOut, ArrowRight, 
    ShieldCheck, Activity, KeyRound, CircleDollarSign, Settings,
    Sun, Moon, User
} from "lucide-react";
import "../pages/Dashboard.css";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');

    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    const username = localStorage.getItem("username") || "User";

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const fetchData = async () => {
            const balRes = await apiRequest("/balance/", "GET");
            if (balRes.data) setBalance(balRes.data.balance);

            const txRes = await apiRequest("/transactions/", "GET");
            if (txRes.data && Array.isArray(txRes.data)) setTransactions(txRes.data);
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const safeTransactions = Array.isArray(transactions) ? transactions : [];

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
                    <Link to="/dashboard" className="sidebar-link active">
                        <LayoutDashboard size={20} className="link-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/user-transfers" className="sidebar-link">
                        <Send size={20} className="link-icon" />
                        <span>Transfers</span>
                    </Link>
                    <Link to="/user-settings" className="sidebar-link">
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
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={toggleTheme} className="dash-btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: 'none', backgroundColor: 'var(--input-bg)', cursor: 'pointer' }}>
                            {theme === 'light' ? <Moon size={20} color="var(--primary-navy)" /> : <Sun size={20} color="var(--primary-navy)" />}
                        </button>
                        <Link to="/user-settings" style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 16px 6px 6px', borderRadius: '30px', backgroundColor: 'var(--input-bg)', transition: 'all 0.2s' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={18} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{username}</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="bento-grid">
                    <div className="bento-card col-span-12 balance-card">
                        <h2><Activity size={20} /> Secure Vault Balance</h2>
                        <div className="balance-amount">{balance !== null ? `₹${balance}` : "—"}</div>
                        
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', marginBottom: '24px' }}>
                            <Link to="/user-transfers" className="dash-btn" style={{ width: 'fit-content', padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={18} /> Transfer Money
                            </Link>
                            <Link to="/user-settings" className="dash-btn dash-btn-secondary" style={{ width: 'fit-content', padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <Settings size={18} /> Account Settings
                            </Link>
                        </div>

                        <h3 className="h3" style={{marginTop: '16px', marginBottom: '16px', fontSize: '15px'}}>Recent Activity</h3>
                        <div className="tx-list">
                            {safeTransactions.length === 0 ? (
                                <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>No transactions yet.</p>
                            ) : (
                                safeTransactions.slice(0, 10).map((t) => (
                                    <div className="tx-item" key={t.id}>
                                        <div className="tx-info">
                                            <div className="tx-icon">
                                                <CircleDollarSign size={20} />
                                            </div>
                                            <div className="tx-details">
                                                <p>Transfer to {t.receiver}</p>
                                                <span>{new Date(t.timestamp).toLocaleString()} • {t.transaction_type}</span>
                                            </div>
                                        </div>
                                        <div className="tx-amount negative">
                                            -₹{t.amount}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;