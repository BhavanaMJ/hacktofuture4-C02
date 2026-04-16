import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { UserPlus, ShieldCheck, User, ShieldAlert } from "lucide-react";
import "./Auth.css";

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
            setSuccess("Account created! Check your email for the verification code.");
            setTimeout(() => {
                navigate("/verify", { state: { username: form.username } });
            }, 2000);
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

    return (
        <div className="auth-page">
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
                                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
                                    <User size={16} /> Customer
                                </span>
                            </button>
                            <button
                                type="button"
                                className={`role-option${form.role === "fraud_analyst" ? " active" : ""}`}
                                onClick={() => setForm({ ...form, role: "fraud_analyst" })}
                            >
                                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
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