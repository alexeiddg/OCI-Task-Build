import { Project } from "@/model/Project";

const API_URL = "http://localhost:8080/api/v1/project";

// Fetch projects assigned to a specific user
export const getProjectsByUser = async (userId: number): Promise<Project[] | null> => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch projects");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return null;
    }
};
