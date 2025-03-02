import axios from "axios";
import { backendPort } from "./globalvariable";

interface CompanyInfo {
  id: string;
  username: string;
}

interface CompanyAuthResponse {
  id: string;
  type: string;
  isOauth: boolean;
}

interface JobPost {
  title: string;
  description: string;
  jobLocation: string;
  salary: number;
  workDates: string;
  workHoursRange: string;
  hiredAmount: number;
  skills: string[];
  jobCategories: string[];
  jobPostType: string;
  companyName: string | null;
}

interface JobPostPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CompanyJobPostsResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    jobPosts: JobPost[];
    pagination: JobPostPagination;
  };
}

interface JobPostResponse {
  success: boolean;
  msg: string;
  data: {
    id: string;
    title: string;
    description: string;
    jobLocation: string;
    salary: number;
    workDates: string;
    workHoursRange: string;
    status: string;
    hiredAmount: number;
    jobHirerType: string;
    employerId: string | null;
    oauthEmployerId: string | null;
    companyId: string;
    skills: { id: string; name: string }[];
    jobCategories: { id: string; name: string }[];
    createdAt: string;
    updatedAt: string;
  };
  status: number;
}

export const registerCompany = async (
  officialName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ id: string }> => {
  try {
    console.log("Registering company with:", {
      officialName,
      email,
      password,
      confirmPassword,
    });
    const { data } = await axios.post<{ data: { id: string } }>(
      `http://localhost:${backendPort}/api/user/company`,
      { officialName, email, password, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Registration successful:", data);
    return data.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const loginCompany = async (
  nameEmail: string,
  password: string
): Promise<CompanyAuthResponse> => {
  try {
    console.log("Attempting to login company with:", { nameEmail, password });
    const { data } = await axios.post<{ data: CompanyAuthResponse }>(
      `http://localhost:${backendPort}/api/user/company/auth`,
      { nameEmail, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Login successful:", data);
    return data.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const fetchCompanyInfo = async (): Promise<CompanyInfo> => {
  try {
    console.log("Fetching company info...");
    const { data } = await axios.get<{ data: CompanyInfo }>(
      `http://localhost:${backendPort}/api/user/company/auth`,
      {
        withCredentials: true,
      }
    );
    console.log("Fetch company info successful:", data);
    return data.data;
  } catch (error) {
    console.error("Fetch company info failed:", (error as any).message);
    throw error;
  }
};

export const logoutCompany = async (): Promise<void> => {
  try {
    console.log("Logging out company...");
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/user/company/auth`,
      {
        withCredentials: true,
      }
    );
    console.log("Logout successful:", data);
    return data.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const createJobPostCom = async (
  jobPost: JobPost
): Promise<JobPostResponse> => {
  try {
    console.log("Creating job post with:", jobPost);
    const { data } = await axios.post<{ data: JobPostResponse }>(
      `http://localhost:${backendPort}/api/post/job-posts/company`,
      jobPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Job post creation successful:", data);
    return data.data;
  } catch (error) {
    console.error("Job post creation failed:", error);
    throw error;
  }
};

export const getCompanyJobPosts =
  async (): Promise<CompanyJobPostsResponse> => {
    try {
      console.log("Fetching company job posts...");
      const { data } = await axios.get<{ data: CompanyJobPostsResponse }>(
        `http://localhost:${backendPort}/api/post/company/job-posts`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetch company job posts successful:", data);
      return data;
    } catch (error) {
      console.error("Fetch company job posts failed:", error);
      throw error;
    }
  };
