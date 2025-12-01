import axios from "./axios"

export interface SupportResource {
  id: string
  title: string
  description: string
  icon: string
  duration?: string
  category?: string
  difficulty?: "easy" | "medium" | "hard"
}

export interface PersonalizedResourcesResponse {
  success: boolean
  statusCode: number
  data: {
    articles: SupportResource[]
    techniques: SupportResource[]
    resources: SupportResource[]
  }
  msg: string
}

export const getPersonalizedResources = async (): Promise<PersonalizedResourcesResponse> => {
  const response = await axios.get("/resources")
  return response.data
}


