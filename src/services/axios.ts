import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const shouldRetry =
            error.response?.status === 401 &&
            !originalRequest._retry &&
            error.response.headers["x-token-refreshed"] === "true";

        if (shouldRetry) {
            originalRequest._retry = true;
            return instance(originalRequest); // retry 1 lần sau khi backend đã refresh token
        }

        return Promise.reject(error);
    }
);

export default instance;

