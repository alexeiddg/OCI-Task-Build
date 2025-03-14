"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/model/User";
import { Project } from "@/model/Project";
import { Sprint } from "@/model/Sprint";
import { Task } from "@/model/Task";
import { getProjectsByUser } from "@/services/projectService";
import { getTasksByUser } from "@/services/taskService";
import { SprintService } from "@/services/sprintService";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintData, setSprintData] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/"); // Redirect to login if no session
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserProjects(parsedUser.userId);
      fetchUserTasks(parsedUser.userId);
      fetchSprintData();
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user");
      router.push("/");
    }
  }, []);

  const fetchUserProjects = async (userId: number) => {
    const userProjects = await getProjectsByUser(userId);
    setProjects(userProjects || []);
  };

  const fetchUserTasks = async (userId: number) => {
    try {
      const tasks = await getTasksByUser(userId);
      setTasks(tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintData = async () => {
    try {
      const sprint = await SprintService.getSprintById(1);
      if (sprint) setSprintData(sprint);
    } catch (error) {
      console.error("Error fetching sprint metrics:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
      <div className="min-h-screen bg-[var(--oracle-light-gray)] p-6">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[var(--oracle-dark)] text-2xl font-bold">
            Hey there, {user.name}
            <p className="text-[var(--oracle-dark)] text-sm">({user.role})</p>
          </h1>
          <div className="flex items-center gap-4">
            <button
                onClick={() => router.push("/metrics")}
                className="text-[var(--oracle-blue)] font-bold hover:underline"
            >
              Go to Dashboard
            </button>
            <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/");
                }}
                className="text-[var(--oracle-red)] font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[var(--oracle-dark)] text-lg font-semibold">Your Projects</h2>
            {user.role === "MANAGER" && (
                <Link href="/projects/create">
                  <button className="text-[var(--oracle-red)] font-bold hover:underline">Create New Project →</button>
                </Link>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {projects.length > 0 ? (
                projects.map((project) => (
                    <div key={project.projectId} className="p-6 bg-gradient-to-r from-[var(--oracle-dark)] to-[var(--oracle-red)] rounded-lg shadow-lg flex flex-col space-y-4">
                      <p className="text-white font-bold text-sm">{project.projectName}</p>
                    </div>
                ))
            ) : (
                <p className="text-[var(--oracle-dark-gray)]">No projects found.</p>
            )}
          </div>
        </section>

        {/* Current Sprint Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[var(--oracle-dark)] text-lg font-semibold">Current Sprint</h2>
            {user.role === "MANAGER" && (
                <Link href="/sprints/create">
                  <button className="text-[var(--oracle-red)] font-bold hover:underline">Create New Sprint →</button>
                </Link>
            )}
          </div>

          {sprintData ? (
              <div className="p-6 bg-gradient-to-r from-[var(--oracle-dark)] to-[var(--oracle-red)] rounded-lg shadow-lg">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-white">{sprintData.sprintName}</h3>
                  <p className="text-sm text-white">{sprintData.project.projectName}</p>
                  <div className="flex justify-center gap-4">
                    <p className="text-sm text-gray-300">Start: {new Date(sprintData.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-300">End: {new Date(sprintData.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                  <div className="flex justify-between text-[var(--oracle-dark)]">
                    <span className="font-bold">Total Tasks:</span>
                    <span>{sprintData.totalTasks ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-[var(--oracle-dark)]">
                    <span className="font-bold">Completed Tasks:</span>
                    <span>{sprintData.completedTasks ?? "N/A"}</span>
                  </div>
                </div>
              </div>
          ) : (
              <p className="text-gray-600">No sprint data found.</p>
          )}
        </section>

        {/* Tasks Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[var(--oracle-dark)] text-lg font-semibold">Your Tasks</h2>
            <Link href="/tasks/create">
              <button className="text-[var(--oracle-red)] font-bold hover:underline">Create New Task →</button>
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
                <p className="text-gray-500">Loading tasks...</p>
            ) : tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task.taskId} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-[var(--oracle-dark)]">{task.title}</h3>
                        <p className="text-[var(--oracle-dark-gray)] text-sm">{task.status} | {task.priority}</p>
                      </div>
                      <Link href={`/tasks/${task.taskId}`}>
                        <button className="text-[var(--oracle-blue)] font-bold hover:underline">View</button>
                      </Link>
                    </div>
                ))
            ) : (
                <p className="text-[var(--oracle-dark-gray)]">No tasks assigned yet.</p>
            )}
          </div>
        </section>
      </div>
  );
}
