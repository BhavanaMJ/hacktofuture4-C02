import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../utils/api";
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
                <div className="auth-icon">📧</div>
                <h2>Verify Your Account</h2>
                <p className="auth-subtitle">
                    Enter the verification code sent to your email
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
                        Verify Account
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