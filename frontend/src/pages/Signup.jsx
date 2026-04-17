import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { UserPlus, ShieldCheck, User, ShieldAlert, Copy, CheckCheck } from "lucide-react";
import "./Auth.css";

const RecoveryCodeModal = ({ code, onDismiss }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
    };

    return (
        <div className="recovery-modal-overlay">
            <div className="recovery-modal">
                <div className="recovery-modal-icon">🔑</div>
                <h2>Save Your Recovery Code</h2>
                <p className="recovery-modal-subtitle">
                    This code is displayed <strong>only once</strong>. Store it safely —
                    you'll need it for step-up verification.
                </p>
                <div className="recovery-code-display">
                    <code>{code}</code>
                    <button
                        className="copy-btn"
                        onClick={handleCopy}
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
                <p className="recovery-modal-warning">
                    ⚠️ You will not be able to view this code again. Please copy it now.
                </p>
                <button
                    className="auth-btn"
                    onClick={onDismiss}
                    disabled={!copied}
                    style={{ marginTop: "1rem", width: "100%", opacity: copied ? 1 : 0.5 }}
                >
                    {copied ? "I've saved it — Continue" : "Copy the code to continue"}
                </button>
            </div>
        </div>
    );
};

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "customer",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [recoveryCode, setRecoveryCode] = useState(null);
    const [pendingUsername, setPendingUsername] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const res = await apiRequest("/register/", "POST", form);
        setLoading(false);

        if (res.message && !res._error) {
            // Show the one-time recovery code modal before navigating
            if (res.data && res.data.recovery_code) {
                setRecoveryCode(res.data.recovery_code);
                setPendingUsername(form.username);
            } else {
                // No recovery code in response (shouldn't happen) — proceed directly
                setSuccess("Account created! Check your email for the verification code.");
                setTimeout(() => navigate("/verify", { state: { username: form.username } }), 2000);
            }
        } else {
            if (res.error && typeof res.error === "object") {
                const messages = Object.entries(res.error)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                    .join(". ");
                setError(messages);
            } else {
                setError(res.error || "Signup failed. Please try again.");
            }
        }
    };

    const handleModalDismiss = () => {
        setRecoveryCode(null);
        navigate("/verify", { state: { username: pendingUsername } });
    };

    return (
        <div className="auth-page">
            {recoveryCode && (
                <RecoveryCodeModal code={recoveryCode} onDismiss={handleModalDismiss} />
            )}

            <div className="auth-card">
                <div className="auth-icon"><UserPlus size={28} /></div>
                <h2>Sign up</h2>
                <p className="auth-subtitle">Create your SecureVault credentials</p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="signup-role">Access Clearance</label>
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={`role-option${form.role === "customer" ? " active" : ""}`}
                                onClick={() => setForm({ ...form, role: "customer" })}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <User size={16} /> Customer
                                </span>
                            </button>
                            <button
                                type="button"
                                className={`role-option${form.role === "fraud_analyst" ? " active" : ""}`}
                                onClick={() => setForm({ ...form, role: "fraud_analyst" })}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <ShieldAlert size={16} /> Analyst
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-confirm">Confirm Password</label>
                        <input
                            id="signup-confirm"
                            name="confirm_password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`auth-btn${loading ? " loading" : ""}`}
                        disabled={loading}
                    >
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    Already initialized? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;