import { Task } from "@/model/Task";

const API_BASE_URL = "http://localhost:8080/api/v1/task";

// Fetch tasks assigned to a specific user
export const getTasksByUser = async (userId: number): Promise<Task[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch tasks.");
        return response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};
