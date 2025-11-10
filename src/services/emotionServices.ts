import axios from "./axios";

export interface CreateEmotionPayload {
    emotion: string;
    intensity: number;
    description?: string;
    tags?: string[];
    emoji?: string;
}

export interface GetEmotionsQuery {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    emotionType?: string;
}

export interface GetTrendsQuery {
    period?: "week" | "month" | "year";
}

export const createEmotion = async (payload: CreateEmotionPayload) => {
    const response = await axios.post("/emotions", payload);
    return response.data;
};

export const getEmotions = async (params?: GetEmotionsQuery) => {
    const response = await axios.get("/emotions", { params });
    return response.data;
};

export const getTrends = async (params?: GetTrendsQuery) => {
    const response = await axios.get("/analytics/trends", { params });
    return response.data;
};


