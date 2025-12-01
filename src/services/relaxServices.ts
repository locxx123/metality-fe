import axios from "./axios";

export interface RelaxVideo {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail: string;
}

export interface GetRelaxVideosResponse {
  success: boolean;
  statusCode: number;
  data: {
    message: string;
    videos: RelaxVideo[];
  };
  msg: string;
}

export const getRelaxVideos = async (): Promise<GetRelaxVideosResponse> => {
  const response = await axios.get("/relax/videos");
  return response.data;
};

