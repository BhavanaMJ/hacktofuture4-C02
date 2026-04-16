import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { CheckCircle, ShieldCheck } from "lucide-react";
import "./Auth.css";

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passedUsername = location.state?.username || "";

    const [username, setUsername] = useState(passedUsername);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await apiRequest("/verify/", "POST", {
            username,
            verification_code: code,
        });
        setLoading(false);

        if (res.message && !res._error) {
            setSuccess("Verification successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } else {
            setError(res.error || "Invalid verification code. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="secure-badge">
                    <ShieldCheck size={14} /> Identity Verify
                </div>
                <div className="auth-icon"><CheckCircle size={28} /></div>
                <h2>Awaiting Verification</h2>
                <p className="auth-subtitle">
                    Enter the offline security code sent to your endpoint
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="verify-username">Username</label>
                        <input
                            id="verify-username"
                            type="text"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="verify-code">Verification Code</label>
                        <input
                            id="verify-code"
                            type="text"
                            className="mono"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError("");
                            }}
                            maxLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`auth-btn${loading ? " loading" : ""}`}
                        disabled={loading}
                    >
                        Verify Identity
                    </button>
                </form>

                <div className="auth-footer">
                    Already verified? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Verify;