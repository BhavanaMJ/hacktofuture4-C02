import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, LogOut, ShieldCheck, 
    Sun, Moon, User, Bell, Settings, Users as UsersIcon
} from "lucide-react";
import "../pages/Dashboard.css";

const Users = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');

    const username = localStorage.getItem("username") || "Analyst";

    // Mock data (replace with API later)
    const [users] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@gmail.com",
            last_login: "2026-04-16 10:30",
            joined_at: "2026-01-10",
        },
        {
            id: 2,
            name: "Alice Smith",
            email: "alice@gmail.com",
            last_login: "2026-04-15 09:20",
            joined_at: "2026-02-05",
        },
    ]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const goToDetails = (user) => {
        navigate("/visual", { state: { user } });
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
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
                    <Link to="/users" className="sidebar-link active">
                        <UsersIcon size={20} className="link-icon" />
                        <span>Users</span>
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

            {/* Main Content */}
            <main className="main-content">
                <div className="main-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="h1">Bank Users</h1>
                        <p className="micro-label" style={{marginTop: '8px'}}>Customer Directory</p>
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

                <div className="dash-card">
                    <h2><UsersIcon size={20} style={{verticalAlign: 'middle', marginRight: '8px'}} /> Registered Customers</h2>
                    <table className="dash-table" style={{marginTop: '16px'}}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Last Login</th>
                                <th>Joined At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{u.last_login}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{u.joined_at}</td>
                                    <td>
                                        <button 
                                            className="dash-btn" 
                                            style={{ padding: '6px 12px', fontSize: '12px', background: '#3b82f6', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)', minWidth: '80px', margin: '0 auto' }}
                                            onClick={() => goToDetails(u)}
                                        >
                                            In-Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Users;
