import axios from "axios";
import { backendPort } from "./globalvariable";

interface JobCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface JobCategoryResponse {
  success: boolean;
  status: number;
  msg: string;
  data: JobCategory[];
}

const api = axios.create({
  baseURL: `http://localhost:${backendPort}/api/category`,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const getAllCategories = async (): Promise<JobCategoryResponse> => {
  try {
    const { data } = await api.get<JobCategoryResponse>("/");
    console.log("Fetched categories:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export const createCategory = async (category: {
  name: string;
  description: string;
}): Promise<JobCategoryResponse> => {
  try {
    const { data } = await api.post<JobCategoryResponse>("/", category);
    console.log("Created category:", data);
    return data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
};

export const getCategoryById = async (
  id: string
): Promise<JobCategoryResponse> => {
  try {
    const { data } = await api.get<JobCategoryResponse>(`/${id}`);
    console.log("Fetched category:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  category: { name: string; description: string }
): Promise<JobCategoryResponse> => {
  try {
    const { data } = await api.put<JobCategoryResponse>(`/${id}`, category);
    console.log("Updated category:", data);
    return data;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
};

export const deleteCategory = async (
  id: string
): Promise<JobCategoryResponse> => {
  try {
    const { data } = await api.delete<JobCategoryResponse>(`/${id}`);
    console.log("Deleted category:", data);
    return data;
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
};
