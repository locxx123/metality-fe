import axios from "./axios";

export interface ChatSession {
    id: string;
    title: string;
    lastMessageAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageResponse {
    success: boolean;
    statusCode: number;
    data: {
        userMessage: {
            id: string;
            message: string;
            sentiment: string;
            sentimentScore: number;
            isFromUser: boolean;
            createdAt: string;
            updatedAt: string;
        };
        aiMessage: {
            id: string;
            message: string;
            isFromUser: boolean;
            createdAt: string;
            updatedAt: string;
        };
        sentiment: {
            sentiment: string;
            score: number;
        };
    };
    msg: string;
}

export interface ConversationMessage {
    id: string;
    message: string;
    isFromUser: boolean;
    sentiment?: string;
    sentimentScore?: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetConversationResponse {
    success: boolean;
    statusCode: number;
    data: {
        messages: ConversationMessage[];
    };
    msg: string;
}

export interface GetSessionsResponse {
    success: boolean;
    statusCode: number;
    data: {
        sessions: ChatSession[];
    };
    msg: string;
}

export interface CreateSessionResponse {
    success: boolean;
    statusCode: number;
    data: ChatSession;
    msg: string;
}

export const sendMessage = async (message: string, sessionId: string): Promise<SendMessageResponse> => {
    const response = await axios.post("/chat/message", { message, sessionId });
    return response.data;
};

export const getConversation = async (sessionId: string): Promise<GetConversationResponse> => {
    const response = await axios.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
};

export const getSessions = async (): Promise<GetSessionsResponse> => {
    const response = await axios.get("/chat/sessions");
    return response.data;
};

export const createSession = async (): Promise<CreateSessionResponse> => {
    const response = await axios.post("/chat/sessions");
    return response.data;
};

