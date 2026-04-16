import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { 
    LayoutDashboard, Send, LogOut, ArrowRight, 
    ShieldCheck, KeyRound, Settings,
    Sun, Moon, User
} from "lucide-react";
import "../pages/Dashboard.css";

const UserTransfers = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');
    
    const [selectedUser, setSelectedUser] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [sortCode, setSortCode] = useState("");
    const [amount, setAmount] = useState("");
    
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const username = localStorage.getItem("username") || "User";

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        
        let targetReceiver = selectedUser || recipientName;
        if (!amount || !targetReceiver) { setError("Please select a user or enter recipient details and amount."); return; }

        const res = await apiRequest("/transfer/", "POST", { amount, receiver: targetReceiver });
        if (res.error) {
            setError(res.error);
        } else {
            setMessage(res.message || "Transfer successful");
            setAmount("");
            setSelectedUser("");
            setRecipientName("");
            setAccountNumber("");
            setSortCode("");
        }
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
                    <Link to="/dashboard" className="sidebar-link">
                        <LayoutDashboard size={20} className="link-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/user-transfers" className="sidebar-link active">
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
                        <h1 className="h1">Secure Transfers</h1>
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

                {error && <div className="dash-error">{error}</div>}
                {message && <div className="dash-success">{message}</div>}

                <div className="bento-grid">
                    <div className="bento-card col-span-8">
                        <h2><Send size={20} /> Transfer Funds</h2>
                        <form onSubmit={handleTransfer}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Select Available User</label>
                                <select 
                                    className="dash-input" 
                                    value={selectedUser} 
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    style={{ appearance: 'auto' }}
                                >
                                    <option value="">-- Choose a user --</option>
                                    <option value="john_doe">John Doe</option>
                                    <option value="alice_smith">Alice Smith</option>
                                    <option value="robert_k">Robert K.</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--input-bg)' }} />
                                <span style={{ padding: '0 12px' }}>OR Add New Recipient</span>
                                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--input-bg)' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Recipient Name</label>
                                    <input 
                                        className="dash-input" 
                                        type="text" 
                                        placeholder="Enter recipient username" 
                                        value={recipientName} 
                                        onChange={(e) => setRecipientName(e.target.value)} 
                                        disabled={selectedUser !== ""}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Account Number</label>
                                    <input 
                                        className="dash-input" 
                                        type="text" 
                                        placeholder="e.g. 12345678" 
                                        value={accountNumber} 
                                        onChange={(e) => setAccountNumber(e.target.value)} 
                                        disabled={selectedUser !== ""}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Bank Sort Code</label>
                                    <input 
                                        className="dash-input" 
                                        type="text" 
                                        placeholder="e.g. 11-22-33" 
                                        value={sortCode} 
                                        onChange={(e) => setSortCode(e.target.value)} 
                                        disabled={selectedUser !== ""}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Amount (₹)</label>
                                    <input 
                                        className="dash-input" 
                                        type="number" 
                                        placeholder="Enter amount" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="dash-btn" style={{ marginTop: '16px' }}>
                                Send Money <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserTransfers;
