export interface Task {
    taskId?: number;
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
    projectId: number;
    sprintId?: number;
    teamId: number;
    createdBy: number;  // User ID reference
    assignedTo?: number; // User ID reference
    taskType: "BUG" | "FEATURE" | "IMPROVEMENT";
    storyPoints?: number;
    timeInProgress?: number;
    blocked?: boolean;
    dueDate?: string; // Format: YYYY-MM-DD
    createdAt?: string; // ISO timestamp format
    updatedAt?: string; // ISO timestamp format
}
