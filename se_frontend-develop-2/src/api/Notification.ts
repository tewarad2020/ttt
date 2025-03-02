import axios from "axios";
import { backendPort } from "./globalvariable";
interface Notification {
  id: string;
  status: "all" | "READ" | "UNREAD";
  title: string;
  description: string;
  userType: string;
  jobSeekerId?: string;
  oauthJobSeekerId?: string;
  employerId?: string;
  oauthEmployerId?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  success: boolean;
  data: Notification[];
}
export const fetchNotifications = async (
  status: "all" | "READ" | "UNREAD" = "all"
): Promise<Notification[]> => {
  try {
    console.log("Fetching notifications with status:", status);
    const { data } = await axios.get<NotificationResponse>(
      `http://localhost:${backendPort}/api/notification`,
      {
        params: { status },
        withCredentials: true,
      }
    );
    console.log("Notifications fetched successfully:", data);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (
  id: string
): Promise<Notification> => {
  try {
    console.log("Marking notification as read with ID:", id);
    const { data } = await axios.post<{ data: Notification }>(
      `http://localhost:${backendPort}/api/notification/${id}/read`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Notification marked as read successfully:", data);
    return data.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<Notification[]> => {
  try {
    console.log("Marking all notifications as read...");
    const { data } = await axios.post<{ data: Notification[] }>(
      `http://localhost:${backendPort}/api/notification/mark-all-read`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("All notifications marked as read successfully:", data);
    // Fetch the updated notifications after marking all as read
    const updatedNotifications = await fetchNotifications();
    return updatedNotifications;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
};
