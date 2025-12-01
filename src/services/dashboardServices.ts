import axios from "./axios";

export interface DashboardStats {
    todayEmotion: string;
    journalEntries: number;
    goodDaysThisWeek: number;
    chatSessions: number;
}

export interface RecentActivity {
    action: string;
    time: string;
    timestamp: string;
}

export interface GetDashboardStatsResponse {
    success: boolean;
    statusCode: number;
    data: {
        stats: DashboardStats;
    };
    msg: string;
}

export interface GetRecentActivitiesResponse {
    success: boolean;
    statusCode: number;
    data: {
        activities: RecentActivity[];
    };
    msg: string;
}

export const getDashboardStats = async (): Promise<GetDashboardStatsResponse> => {
    const response = await axios.get("/dashboard/stats");
    return response.data;
};

export interface DashboardGreetingResponse {
    success: boolean;
    statusCode: number;
    data: {
        greetingMessage: string;
    };
    msg: string;
}

export const getDashboardGreeting = async (): Promise<DashboardGreetingResponse> => {
    const response = await axios.get("/dashboard/greeting");
    return response.data;
};

export const getRecentActivities = async (limit?: number): Promise<GetRecentActivitiesResponse> => {
    const response = await axios.get("/dashboard/activities", {
        params: { limit },
    });
    return response.data;
};

