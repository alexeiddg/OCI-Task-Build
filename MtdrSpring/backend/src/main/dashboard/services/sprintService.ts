import { Sprint } from "@/model/Sprint";

// Create a Sprint
export const createSprint = async (sprint: Sprint) => {
    try {
        const response = await fetch("http://localhost:3000/api/sprints/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...sprint,
                startDate: new Date(sprint.startDate).toISOString(), // Ensure correct format
                endDate: new Date(sprint.endDate).toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create sprint");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating sprint:", error);
        return null;
    }
};

// Fetch projects (since a sprint needs to belong to one)
export const getProjects = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/projects");

        if (!response.ok) {
            throw new Error("Failed to fetch projects");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

