import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { Shield, Lock, ShieldCheck } from "lucide-react";
import "./Auth.css";

const OAUTH_CLIENT_ID = "xy0eCTbvimtPzOmlxBN3Wf9rGJezn4RZfDMkO63Z";
const OAUTH_REDIRECT_URI = "http://localhost:5173/callback";

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const oauthError = searchParams.get("oauth_error");
        if (oauthError) {
            setError(oauthError);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const generatePKCE = async () => {
        const encoder = new TextEncoder();
        const randomBytes = crypto.getRandomValues(new Uint8Array(32));
        const codeVerifier = btoa(String.fromCharCode(...randomBytes))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);

        const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        return { codeVerifier, codeChallenge };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await apiRequest("/login/", "POST", form);
        setLoading(false);

        if (res.data && res.data.access) {
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("username", res.data.user_name);
            localStorage.setItem("role", res.data.role);
            setSuccess("Login successful! Redirecting...");

            const target = res.data.role === "fraud_analyst" ? "/security" : "/dashboard";
            setTimeout(() => navigate(target), 1000);
        } else if (res.error === "Account not verified") {
            setError("Account not verified. Redirecting to verification...");
            setTimeout(() => navigate("/verify", { state: { username: form.username } }), 1500);
        } else if (res.error === "account_locked" || res.detail === "account_locked" || res.locked === true) {
            setIsLocked(true);
        } else {
            setError(res.error || "Invalid credentials. Please try again.");
        }
    };

    const handleOAuthLogin = async () => {
        console.log("event handler triggered--------------->")
        if (!form.username || !form.password) {
            setError('Please enter username and password first.');
            return;
        }

        const { codeVerifier, codeChallenge } = await generatePKCE();

        localStorage.setItem("pkce_verifier (gen--->)", codeVerifier);

        const formEl = document.createElement('form');
        formEl.method = 'POST';
        formEl.action = 'http://localhost:8000/api/oauth-login/';

        const fields = {
            username: form.username,
            password: form.password,
            client_id: OAUTH_CLIENT_ID,
            redirect_uri: OAUTH_REDIRECT_URI,
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        };

        for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            formEl.appendChild(input);
        }

        document.body.appendChild(formEl);
        console.log("Verifier:", codeVerifier);
        console.log("Challenge:", codeChallenge);
        formEl.submit();
    };
    return (
        <div className="auth-page">

            {/* ── ACCOUNT LOCKED OVERLAY ── */}
            {isLocked && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(180, 0, 0, 0.88)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, textAlign: 'center', padding: '24px'
                }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
                    <h1 style={{
                        color: '#fff', fontSize: '28px', fontWeight: '700',
                        fontFamily: 'Inter, sans-serif', margin: '0 0 16px 0'
                    }}>
                        Account Locked
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.88)', fontSize: '16px',
                        maxWidth: '440px', lineHeight: '1.7', margin: '0 0 32px 0',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        Your account has been locked due to suspicious activity.<br />
                        Please go to <strong>Recovery Mode</strong> to recover your account.
                    </p>
                    <button
                        onClick={() => navigate('/recovery')}
                        style={{
                            backgroundColor: '#fff', color: '#b91c1c',
                            border: 'none', borderRadius: '10px',
                            padding: '14px 32px', fontSize: '15px',
                            fontWeight: '700', cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            transition: 'transform 0.15s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Go to Recovery Mode
                    </button>
                </div>
            )}

            <div className="auth-card">
                <div className="auth-icon"><Lock size={28} /></div>
                <h2>Secure Access</h2>
                <p className="auth-subtitle">Sign in to your SecureVault</p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`auth-btn${loading ? " loading" : ""}`}
                        disabled={loading}
                    >
                        Sign In
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or connect securely</span>
                </div>

                <button className="oauth-btn" onClick={handleOAuthLogin}>
                    <Shield size={20} className="text-secondary-blue" /> Login with SecureShield
                </button>

                <div className="auth-footer">
                    Not registered? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;