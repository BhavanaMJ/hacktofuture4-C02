const BASE_URL = "http://localhost:8000/api";

export const apiRequest = async (endpoint, method, body) => {
    const token = localStorage.getItem("access_token");

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        credentials: 'include',
    };

    // Only attach body for non-GET requests
    if (method !== "GET" && body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        return { ...data, _error: true, _status: response.status };
    }

    return data;
};