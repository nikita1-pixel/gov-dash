import axios from "axios";

// ONE place that knows the backend address
const api = axios.create({
    baseURL: "http://localhost:10000",
});

// Auto-attach the token to EVERY request (no more manual headers)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;