import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
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
            <div className="auth-card">
                <div className="auth-icon">🔐</div>
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>

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
                    <span>or</span>
                </div>

                <button className="oauth-btn" onClick={handleOAuthLogin}>
                    🛡️ Login with SecureShield
                </button>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;