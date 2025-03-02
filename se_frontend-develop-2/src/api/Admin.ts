import axios from "axios";
import { backendPort } from "./globalvariable";
interface AdminInfo {
  id: string;
  username: string;
}

interface ApprovalRequest {
  id: string;
  userId: string;
  userType: string;
  status: string;
  adminId: string;
}

export const fetchAdminInfo = async (): Promise<AdminInfo> => {
  try {
    const { data } = await axios.get<{ data: AdminInfo }>(
      `http://localhost:${backendPort}/api/admin/auth`,
      {
        withCredentials: true,
      }
    );
    console.log("Fetch admin info successful:", data);
    return data.data;
  } catch (error) {
    console.error("Fetch admin info failed:", error);
    throw error;
  }
};

export const fetchApprovalRequests = async (): Promise<ApprovalRequest[]> => {
  try {
    const { data } = await axios.get<{ data: ApprovalRequest[] }>(
      `http://localhost:${backendPort}/api/admin/approve`,
      {
        withCredentials: true,
      }
    );
    console.log("Fetch approval requests successful:", data);
    return data.data;
  } catch (error) {
    console.error("Fetch approval requests failed:", error);
    throw error;
  }
};

export const generateAdmin = async (): Promise<AdminInfo> => {
  try {
    const { data } = await axios.post<{ data: AdminInfo }>(
      `http://localhost:${backendPort}/api/admin`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          permission_key: "69duangjun69",
        },
        withCredentials: true,
      }
    );
    console.log("Generate admin successful:", data);
    return data.data;
  } catch (error) {
    console.error("Generate admin failed:", error);
    throw error;
  }
};

export const loginAdmin = async (
  name: string,
  password: string
): Promise<AdminInfo> => {
  try {
    const { data } = await axios.post<{ data: AdminInfo }>(
      `http://localhost:${backendPort}/api/admin/auth`,
      {
        nameEmail: name,
        password,
      },
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
    console.error("Login failed:", (error as any).response.data.msg);
    throw error;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/admin/auth`,
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

export const approveUser = async (
  userId: string,
  status: string
): Promise<ApprovalRequest> => {
  try {
    const { data } = await axios.post<{ data: ApprovalRequest }>(
      `http://localhost:${backendPort}/api/admin/approve`,
      { id: userId, status },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Approve user successful:", data);
    return data.data;
  } catch (error) {
    console.error("Approve user failed:", error);
    throw error;
  }
};
