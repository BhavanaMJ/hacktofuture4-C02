import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "./Auth.css";

const OAUTH_CLIENT_ID = "xy0eCTbvimtPzOmlxBN3Wf9rGJezn4RZfDMkO63Z";
const OAUTH_REDIRECT_URI = "http://localhost:5173/callback";
const codeVerifier = localStorage.getItem("pkce_verifier");

console.log("codeVerifier", codeVerifier);

const Callback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Authenticating...");
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errParam = params.get("error");

        if (errParam) {
            setError(`OAuth error: ${errParam}`);
            setStatus("");
            return;
        }

        if (!code) {
            setError("No authorization code received.");
            setStatus("");
            return;
        }

        exchangeToken(code);
    }, []);

    const exchangeToken = async (code) => {
        setStatus("Exchanging token...");

        const res = await apiRequest("/oauth-callback/", "POST", {
            code,
            client_id: OAUTH_CLIENT_ID,
            redirect_uri: OAUTH_REDIRECT_URI,
            code_verifier: codeVerifier,
        });

        if (res.data && res.data.access_token) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("username", res.data.user_name);
            localStorage.setItem("role", res.data.role);

            setStatus("Login successful! Redirecting...");

            const target = res.data.role === "fraud_analyst" ? "/security" : "/dashboard";
            setTimeout(() => navigate(target), 1000);
        } else {
            setError(res.error || "Token exchange failed. Please try again.");
            setStatus("");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: "center" }}>
                <div className="auth-icon">🛡️</div>
                <h2>SecureShield</h2>

                {status && (
                    <div className="auth-success" style={{ marginTop: 20 }}>
                        <div className="callback-spinner" style={{ marginBottom: 8 }}></div>
                        {status}
                    </div>
                )}

                {error && (
                    <>
                        <div className="auth-error" style={{ marginTop: 20 }}>{error}</div>
                        <button
                            className="auth-btn"
                            style={{ marginTop: 16 }}
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Callback;
