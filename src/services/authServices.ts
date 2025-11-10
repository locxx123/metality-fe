import axios from "./axios"

export const sendOtp = async (email: string) => {
    const response = await axios.post("/auth/send-otp", { email });
    return response.data;
}

export const verifyOtp = async (email: string, otp: string, name?: string, password?: string) => {
    const payload: any = { email, otp };
    if (name) payload.fullName = name;
    if (password) payload.password = password;
    const response = await axios.post("/auth/verify-otp", payload);
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

