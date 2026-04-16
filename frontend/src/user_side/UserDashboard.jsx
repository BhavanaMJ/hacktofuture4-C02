import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "../pages/Auth.css";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const username = localStorage.getItem("username") || "User";

    // Auto-fetch balance and transactions on load
    useEffect(() => {
        const fetchData = async () => {
            const balRes = await apiRequest("/balance/", "GET");
            if (balRes.data) setBalance(balRes.data.balance);

            const txRes = await apiRequest("/transactions/", "GET");
            if (txRes.data) setTransactions(txRes.data);
        };
        fetchData();
    }, []);

    const handleTransfer = async () => {
        setError(""); setMessage("");
        if (!amount || !receiver) { setError("Enter amount and receiver"); return; }

        const res = await apiRequest("/transfer/", "POST", { amount, receiver });
        if (res.error) {
            setError(res.error);
        } else {
            setMessage(res.message || "Transfer successful");
            if (res.data) setBalance(res.data.new_balance);
            // Refresh transactions
            const txRes = await apiRequest("/transactions/", "GET");
            if (txRes.data) setTransactions(txRes.data);
            setAmount("");
            setReceiver("");
        }
    };

    const handleAddBeneficiary = async () => {
        setError(""); setMessage("");
        if (!receiver) { setError("Enter receiver name"); return; }
        const res = await apiRequest("/add-beneficiary/", "POST", { receiver });
        if (res.error) { setError(res.error); }
        else { setMessage(res.message || "Beneficiary added"); }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🏦 SecureBank</h2>
                    <div className="sidebar-role">Customer</div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="sidebar-link active">
                        <span className="link-icon">📊</span>
                        <span>Dashboard</span>
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
                    <h1>Welcome, {username} 👋</h1>
                    <p>Manage your finances securely</p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
                {message && <div className="auth-success" style={{ marginBottom: 16 }}>{message}</div>}

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">Balance</p>
                        <p className="stat-value">{balance !== null ? `₹${balance}` : "—"}</p>
                    </div>
                    <div className="stat-card accent-green">
                        <p className="stat-label">Transactions</p>
                        <p className="stat-value">{transactions.length}</p>
                    </div>
                </div>

                {/* Transfer */}
                <div className="dash-card">
                    <h2>💸 Transfer Money</h2>
                    <div className="form-row">
                        <input className="dash-input" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <input className="dash-input" type="text" placeholder="Receiver username" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                        <button className="dash-btn dash-btn-primary" onClick={handleTransfer}>Transfer</button>
                    </div>
                </div>

                {/* Add Beneficiary */}
                <div className="dash-card">
                    <h2>👤 Add Beneficiary</h2>
                    <div className="form-row">
                        <input className="dash-input" type="text" placeholder="Beneficiary username" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                        <button className="dash-btn dash-btn-secondary" onClick={handleAddBeneficiary}>Add</button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="dash-card">
                    <h2>📋 Recent Transactions</h2>
                    {transactions.length === 0 ? (
                        <div className="empty-state">No transactions yet</div>
                    ) : (
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th>Receiver</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.receiver}</td>
                                        <td style={{ fontWeight: 600 }}>₹{t.amount}</td>
                                        <td><span className="mode-badge normal">{t.transaction_type}</span></td>
                                        <td>{new Date(t.timestamp).toLocaleString()}</td>
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

export default UserDashboard;