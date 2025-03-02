import axios from "axios";
import { backendPort } from "./globalvariable";

interface JobSeekerInfo {
  id: string;
  username: string;
}

interface JobSeekerAuthResponse {
  id: string;
  type: string;
  isOauth: boolean;
}

interface JobFindingPost {
  title: string;
  description: string;
  jobLocation: string;
  expectedSalary: number;
  workDates: string;
  workHoursRange: string;
  jobPostType: "FULLTIME" | "PARTTIME" | "FREELANCE";
  jobSeekerType: "NORMAL" | "OAUTH";
  skills: string[];
  jobCategories: string[];
}

interface JobFindingPostResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    id: string;
    title: string;
    description: string;
    jobLocation: string;
    expectedSalary: number;
    workDates: string;
    workHoursRange: string;
    status: string;
    jobPostType: string;
    jobSeekerType: string;
    jobSeekerId: string;
    oauthJobSeekerId: string | null;
    createdAt: string;
    updatedAt: string;
    skills: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[];
    jobCategories: {
      id: string;
      name: string;
      description: string;
    }[];
  };
}

interface JobFindingPostPaginationResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    jobPosts: {
      id: string;
      title: string;
      description: string;
      jobLocation: string;
      expectedSalary: number;
      workDates: string;
      workHoursRange: string;
      status: string;
      jobPostType: string;
      jobSeekerType: string;
      jobSeekerId: string;
      oauthJobSeekerId: string | null;
      createdAt: string;
      updatedAt: string;
      skills: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
      }[];
      jobCategories: {
        id: string;
        name: string;
        description: string;
      }[];
    }[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface JobPostDetailResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    jobLocation: string;
    expectedSalary: number;
    workDates: string;
    workHoursRange: string;
    status: string;
    jobPostType: string;
    jobSeekerType: string;
    jobSeekerId: string | null;
    oauthJobSeekerId: string | null;
    createdAt: string;
    updatedAt: string;
    skills: {
      id: string;
      name: string;
      description: string;
    }[];
    jobCategories: {
      id: string;
      name: string;
      description: string;
    }[];
  };
  message: string;
}

interface UserJobFindingPostResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    jobPosts: {
      id: string;
      title: string;
      description: string;
      jobLocation: string;
      expectedSalary: number;
      workDates: string;
      workHoursRange: string;
      status: string;
      jobPostType: string;
      jobSeekerType: string;
      jobSeekerId: string;
      oauthJobSeekerId: string | null;
      createdAt: string;
      updatedAt: string;
      skills: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
      }[];
      jobCategories: {
        id: string;
        name: string;
        description: string;
      }[];
    }[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  aboutMe: string;
  address: string;
  email: string;
  contact: string;
}

export const registerJobSeeker = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ id: string }> => {
  try {
    console.log("Registering job seeker with:", {
      name,
      email,
      password,
      confirmPassword,
    });
    const { data } = await axios.post<{ data: { id: string } }>(
      `http://localhost:${backendPort}/api/user/job-seeker`,
      { name, email, password, confirmPassword },
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

export const loginJobSeeker = async (
  nameEmail: string,
  password: string
): Promise<JobSeekerAuthResponse> => {
  try {
    console.log("Attempting to login job seeker with:", {
      nameEmail,
      password,
    });
    const { data } = await axios.post<{ data: JobSeekerAuthResponse }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
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

export const logoutJobSeeker = async (): Promise<void> => {
  try {
    console.log("Logging out job seeker...");
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
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

export const fetchJobSeekerInfo = async (): Promise<JobSeekerInfo> => {
  try {
    console.log("Fetching job seeker info...");
    const { data } = await axios.get<{ data: JobSeekerInfo }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Fetch job seeker info successful:", data);
    return data.data;
  } catch (error) {
    console.error("Fetch job seeker info failed:", (error as any).message);
    throw error;
  }
};

export const createJobFindingPost = async (
  jobFindingPost: JobFindingPost
): Promise<JobFindingPostResponse> => {
  try {
    console.log("Creating job finding post with:", jobFindingPost);
    const { data } = await axios.post<{ data: JobFindingPostResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts`,
      jobFindingPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Job finding post creation successful:", data);
    return data.data;
  } catch (error) {
    console.error("Job finding post creation failed:", error);
    throw error;
  }
};

export const getAllJobFindingPosts = async (
  filters: {
    title?: string;
    provinces?: string[];
    jobCategories?: string[];
    salaryRange?: number;
    sortBy?: "asc" | "desc";
    salarySort?: "high-low" | "low-high";
    page?: number;
  } = {}
): Promise<JobFindingPostPaginationResponse> => {
  try {
    console.log("Fetching all job finding posts with filters:", filters);
    const { data } = await axios.get<JobFindingPostPaginationResponse>(
      `http://localhost:${backendPort}/api/post/finding-posts`,
      {
        params: filters,
        withCredentials: true,
      }
    );
    console.log("Job finding posts fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch job finding posts:", error);
    throw error;
  }
};

export const updateJobFindingPost = async (
  id: string,
  jobFindingPost: JobFindingPost
): Promise<JobFindingPostResponse> => {
  try {
    console.log(
      "Updating job finding post with ID:",
      id,
      "and data:",
      jobFindingPost
    );
    const { data } = await axios.put<{ data: JobFindingPostResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      jobFindingPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Job finding post update successful:", data);
    return data.data;
  } catch (error) {
    console.error("Job finding post update failed:", error);
    throw error;
  }
};

export const deleteJobFindingPost = async (id: string): Promise<void> => {
  try {
    console.log("Deleting job finding post with ID:", id);
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      {
        withCredentials: true,
      }
    );
    console.log("Job finding post deletion successful:", data);
  } catch (error) {
    console.error("Job finding post deletion failed:", error);
    throw error;
  }
};

export const getJobFindingPostById = async (id: string): Promise<any> => {
  try {
    console.log("Fetching job finding post with ID:", id);
    const { data } = await axios.get<{ data: JobPostDetailResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      {
        withCredentials: true,
      }
    );
    console.log("Job finding post fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch job finding post:", error);
    throw error;
  }
};

export const getUserJobFindingPosts =
  async (): Promise<UserJobFindingPostResponse> => {
    try {
      console.log("Fetching user's job finding posts...");
      const { data } = await axios.get<UserJobFindingPostResponse>(
        `http://localhost:${backendPort}/api/post/user/finding-posts`,
        {
          withCredentials: true,
        }
      );
      console.log("User's job finding posts fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch user's job finding posts:", error);
      throw error;
    }
  };

export const updateUserProfile = async (
  profileData: UpdateUserProfileRequest
): Promise<void> => {
  try {
    console.log("Updating user profile with:", profileData);

    console.log("Updating full name...");
    const fullNameResponse = await axios.put<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/full-name`,
      { firstName: profileData.firstName, lastName: profileData.lastName },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Full name update response:", fullNameResponse);

    console.log("Updating about me...");
    const aboutResponse = await axios.put<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/about`,
      { about: profileData.aboutMe },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("About me update response:", aboutResponse);

    console.log("Updating address...");
    const addressResponse = await axios.put<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/address`,
      { address: profileData.address, provinceAddress: "XD" },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Address update response:", addressResponse);

    console.log("Updating email...");
    const emailResponse = await axios.put<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/email`,
      { email: profileData.email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Email update response:", emailResponse);

    console.log("Updating contact...");
    const contactResponse = await axios.put<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/contact`,
      { contact: profileData.contact },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Contact update response:", contactResponse);

    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

export const updateJobSeekerUsername = async (
  username: string,
  password: string
): Promise<{ userId: string; username: string }> => {
  try {
    console.log("Updating job seeker's username with:", { username, password });
    const { data } = await axios.put<{
      data: { userId: string; username: string };
    }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/username`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Username update successful:", data);
    return data.data;
  } catch (error) {
    console.error("Username update failed:", error);
    throw error;
  }
};

export const updateJobSeekerPassword = async (
  password: string,
  oldPassword: string
): Promise<{ userId: string }> => {
  try {
    console.log("Updating job seeker's password with:", {
      password,
      oldPassword,
    });
    const { data } = await axios.put<{ data: { userId: string } }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/edit/password`,
      { password, oldPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Password update successful:", data);
    return data.data;
  } catch (error) {
    console.error("Password update failed:", error);
    throw error;
  }
};

export const uploadProfileImage = async (
  formData: FormData
): Promise<{ approvalId: string; url: string }> => {
  try {
    console.log("Uploading profile image...");

    const { data } = await axios.post<{
      data: { approvalId: string; url: string };
    }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log("Profile image upload successful:", data);
    return data.data;
  } catch (error) {
    console.error("Profile image upload failed:", error);
    throw error;
  }
};
