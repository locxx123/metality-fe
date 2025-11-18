import axios from "./axios"

export const sendOtp = async (email: string) => {
    const response = await axios.post("/auth/send-otp", { email });
    return response.data;
}

export const sendResetOtp = async (email: string) => {
    const response = await axios.post("/auth/forgot-password/send-otp", { email });
    return response.data;
}

export const verifyOtp = async (email: string, otp: string, name?: string, password?: string) => {
    const payload: any = { email, otp };
    if (name) payload.fullName = name;
    if (password) payload.password = password;
    const response = await axios.post("/auth/verify-otp", payload);
    return response.data;
}

export const verifyResetOtp = async (email: string, otp: string) => {
    const response = await axios.post("/auth/forgot-password/verify-otp", { email, otp });
    return response.data;
}

export const resetPasswordWithToken = async (password: string, token: string) => {
    const response = await axios.post("/auth/forgot-password/reset", { password, token });
    return response.data;
}

export const updateProfile = async (data: any) => {
    const response = await axios.patch("/auth/update-profile", data);
    return response.data;
}

export const login = async (email: string, password: string) => {
    const response = await axios.post("/auth/login", { email, password });
    return response.data;
}

export const register = async (data: { name: string; email: string; password: string }) => {
    const response = await axios.post("/auth/register", data);
    return response.data;
}

export const getProfile = async () => {
    const response = await axios.get("/auth/me");
    return response.data;
}

export const logout = async () => {
    try {
        // Gọi API logout nếu có (tùy chọn)
        // const response = await axios.post("/auth/logout");
        // return response.data;
        
        // Xóa cookies bằng cách set expires trong quá khứ
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        return { success: true };
    } catch (error) {
        // Nếu API logout fail, vẫn xóa cookies
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return { success: true };
    }
}

export const loginWithGoogle = () => {
    // Use the same baseURL as axios instance
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
    window.location.href = `${baseURL}/auth/google`;
}

export const loginWithFacebook = () => {
    // Use the same baseURL as axios instance
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
    window.location.href = `${baseURL}/auth/facebook`;
}

