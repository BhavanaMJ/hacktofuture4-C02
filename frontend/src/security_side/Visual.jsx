import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, LogOut, ShieldCheck, 
    Sun, Moon, User, Bell, Settings, Users as UsersIcon,
    ArrowLeft, Activity, Server, Smartphone, Globe, List
} from "lucide-react";
import "../pages/Dashboard.css";

const Visual = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');

    const username = localStorage.getItem("username") || "Analyst";

    // Mock analytics data
    const [data] = useState({
        requests_per_day: 120,
        avg_packets: 45,
        frequency: "Every 2 mins",

        top_ips: [
            { ip: "1.1.1.1", count: 20 },
            { ip: "6.5.4.5", count: 12 },
        ],

        endpoints: [
            { name: "/login", count: 50 },
            { name: "/transfer", count: 30 },
        ],

        devices: [
            { name: "Mobile", count: 60 },
            { name: "Desktop", count: 40 },
        ],

        logs: [
            {
                user_id: user?.id || 1,
                ip: "1.1.1.1",
                device: "Mobile",
                endpoint: "/login",
                risk: 20,
                time: "2026-04-16 10:30",
            },
            {
                user_id: user?.id || 1,
                ip: "6.5.4.5",
                device: "Desktop",
                endpoint: "/transfer",
                risk: 75,
                time: "2026-04-16 10:35",
            },
        ],
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="dashboard-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '16px' }}>No user selected</h2>
                    <button className="dash-btn" onClick={() => navigate("/users")}>Go back to Users</button>
                </div>
            </div>
        )
    }

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                            onClick={() => navigate("/users")} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="h1">{user.name}</h1>
                            <p className="micro-label" style={{marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600'}}>
                                User Analytics • {user.email}
                            </p>
                        </div>
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

                {/* KPI Cards Row */}
                <div className="stats-row">
                    <div className="stat-card accent-green">
                        <p className="stat-label">Requests / Day</p>
                        <p className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={24} color="var(--success-green)" /> 
                            {data.requests_per_day}
                        </p>
                    </div>
                    <div className="stat-card accent-orange">
                        <p className="stat-label">Avg Packets / Request</p>
                        <p className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Server size={24} color="#f59e0b" /> 
                            {data.avg_packets}
                        </p>
                    </div>
                    <div className="stat-card accent-red">
                        <p className="stat-label">Frequency Use Interval</p>
                        <p className="stat-value" style={{ fontSize: '24px', color: 'var(--alert-red)' }}>
                            {data.frequency}
                        </p>
                    </div>
                </div>

                {/* Top Statistics Lists */}
                <div className="bento-grid" style={{ marginBottom: '24px' }}>
                    <div className="bento-card col-span-4">
                        <h3 className="h3" style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Globe size={18} /> Top IPs
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.top_ips.map((ip, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--input-bg)', borderRadius: '6px' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ip.ip}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{ip.count} reqs</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bento-card col-span-4">
                        <h3 className="h3" style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Server size={18} /> Most Used Endpoints
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.endpoints.map((e, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--input-bg)', borderRadius: '6px' }}>
                                    <span style={{ fontFamily: 'monospace', color: 'var(--primary-navy)' }}>{e.name}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{e.count} reqs</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bento-card col-span-4">
                        <h3 className="h3" style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Smartphone size={18} /> Most Used Devices
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.devices.map((d, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--input-bg)', borderRadius: '6px' }}>
                                    <span style={{ fontWeight: 600 }}>{d.name}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{d.count} sessions</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Logs */}
                <div className="dash-card">
                    <h2><List size={20} style={{verticalAlign: 'middle', marginRight: '8px'}} /> System Logs History</h2>
                    <table className="dash-table" style={{marginTop: '16px'}}>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>IP Address</th>
                                <th>Device</th>
                                <th>Endpoint</th>
                                <th>Risk Score</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.logs.map((log, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{log.user_id}</td>
                                    <td style={{ fontFamily: "monospace" }}>{log.ip}</td>
                                    <td>{log.device}</td>
                                    <td style={{ fontFamily: "monospace", color: "var(--primary-navy)" }}>{log.endpoint}</td>
                                    <td>
                                        <span className={`mode-badge ${log.risk > 70 ? "attack" : log.risk > 40 ? "warning" : "normal"}`} style={{ padding: '2px 8px', borderRadius: '12px' }}>
                                            {log.risk}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{log.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Visual;
