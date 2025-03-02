import axios from "axios";
import { backendPort } from "./globalvariable";

interface Skill {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillResponse {
  success: boolean;
  status: number;
  msg: string;
  data: Skill[];
}

const api = axios.create({
  baseURL: `http://localhost:${backendPort}/api/skill`,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const getAllSkills = async (): Promise<SkillResponse> => {
  try {
    const { data } = await api.get<SkillResponse>("/");
    console.log("Fetched skills:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    throw error;
  }
};

export const createSkill = async (skill: {
  name: string;
  description: string;
}): Promise<SkillResponse> => {
  try {
    const { data } = await api.post<SkillResponse>("/", skill);
    console.log("Created skill:", data);
    return data;
  } catch (error) {
    console.error("Failed to create skill:", error);
    throw error;
  }
};

export const getSkillById = async (id: string): Promise<SkillResponse> => {
  try {
    const { data } = await api.get<SkillResponse>(`/${id}`);
    console.log("Fetched skill:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch skill:", error);
    throw error;
  }
};

export const updateSkill = async (
  id: string,
  skill: { name: string; description: string }
): Promise<SkillResponse> => {
  try {
    const { data } = await api.put<SkillResponse>(`/${id}`, skill);
    console.log("Updated skill:", data);
    return data;
  } catch (error) {
    console.error("Failed to update skill:", error);
    throw error;
  }
};

export const deleteSkill = async (id: string): Promise<SkillResponse> => {
  try {
    const { data } = await api.delete<SkillResponse>(`/${id}`);
    console.log("Deleted skill:", data);
    return data;
  } catch (error) {
    console.error("Failed to delete skill:", error);
    throw error;
  }
};
