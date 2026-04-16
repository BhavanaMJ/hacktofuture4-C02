import React, { createContext, useEffect, useState, useContext } from "react";
import CryptoJS from "crypto-js";

// Simple static API key used for encryption – replace with your real key in production
const API_KEY = "my_api_key_12345";

// Context that holds the encrypted access token and a helper to decrypt it when needed
const AuthContext = createContext({
  encryptedToken: "",
  getDecryptedToken: () => "",
});

export const AuthProvider = ({ children }) => {
  const [encryptedToken, setEncryptedToken] = useState("");

  // On mount, read the raw token from localStorage, encrypt it and store in state
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const ct = CryptoJS.AES.encrypt(token, API_KEY).toString();
      setEncryptedToken(ct);
    }
  }, []);

  // Helper to retrieve the original token (decrypted)
  const getDecryptedToken = () => {
    if (!encryptedToken) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, API_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Failed to decrypt token", e);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ encryptedToken, getDecryptedToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook for components
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
