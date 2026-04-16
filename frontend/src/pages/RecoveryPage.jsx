import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { KeyRound, ShieldAlert } from "lucide-react";
import "./Auth.css";

const RecoveryPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!code.trim()) { setError("Please enter your recovery code."); return; }

        setLoading(true);
        setError("");
        setSuccess("");

        const res = await apiRequest("/recovery/verify/", "POST", { code });
        setLoading(false);

        if (res.data && res.data.access) {
            // Backend unlocked and returned a new token
            localStorage.setItem("access_token", res.data.access);
            if (res.data.refresh)  localStorage.setItem("refresh_token", res.data.refresh);
            if (res.data.user_name) localStorage.setItem("username", res.data.user_name);
            if (res.data.role)     localStorage.setItem("role", res.data.role);

            setSuccess("Identity verified. Redirecting to your dashboard...");
            const target = res.data.role === "fraud_analyst" ? "/security" : "/dashboard";
            setTimeout(() => navigate(target), 1200);
        } else if (res.success) {
            setSuccess("Identity verified. Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1200);
        } else {
            setError(res.error || "Invalid recovery code. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Icon */}
                <div className="auth-icon" style={{ backgroundColor: "rgba(220,38,38,0.1)" }}>
                    <ShieldAlert size={28} color="#dc2626" />
                </div>

                <h2 style={{ color: "#0f172a" }}>Account Recovery</h2>
                <p className="auth-subtitle">
                    Enter the recovery code you received when you first logged in.
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form className="auth-form" onSubmit={handleVerify}>
                    <div className="input-group">
                        <label htmlFor="recovery-code">Recovery Code</label>
                        <input
                            id="recovery-code"
                            type="text"
                            placeholder="Enter your recovery code"
                            value={code}
                            onChange={(e) => { setCode(e.target.value); setError(""); }}
                            autoComplete="off"
                            style={{ letterSpacing: "0.1em", fontFamily: "JetBrains Mono, monospace" }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-btn${loading ? " loading" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify & Recover Account"}
                    </button>
                </form>

                <div className="auth-footer">
                    Remember your password? <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default RecoveryPage;
