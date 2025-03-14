"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/model/User";
import { Project } from "@/model/Project";
import { getProjectsByUser } from "@/services/projectService";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                setUser(parsedUser);

                // Fetch user projects
                fetchUserProjects(parsedUser.userId);
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("user");
                router.push("/"); // Redirect to login if data is invalid
            }
        } else {
            router.push("/"); // Redirect to login if no session found
        }
    }, []);

    const fetchUserProjects = async (userId: number) => {
        const userProjects = await getProjectsByUser(userId);
        if (userProjects) {
            setProjects(userProjects);
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-[var(--oracle-light-gray)] p-6">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[var(--oracle-dark)] text-2xl font-bold">
                    Hey there, {user.name}
                    <p className="text-[var(--oracle-dark)] text-sm">({user.role})</p>
                </h1>
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

            {/* Projects Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[var(--oracle-dark)] text-lg font-semibold">Your Projects</h2>
                    {user.role === "MANAGER" && (
                        <Link href="/projects/create">
                            <button className="text-[var(--oracle-red)] font-bold hover:underline">
                                Create New Project →
                            </button>
                        </Link>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.projectId} className="h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                                <p className="text-[var(--oracle-dark)] font-bold">{project.projectName}</p>
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
                            <button className="text-[var(--oracle-red)] font-bold hover:underline">
                                Create New Sprint →
                            </button>
                        </Link>
                    )}
                </div>
                <div className="h-20 bg-gray-300 rounded-lg"></div>
            </section>

            {/* Tasks Section */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[var(--oracle-dark)] text-lg font-semibold">Your Tasks</h2>
                    <Link href="/tasks/create">
                        <button className="text-[var(--oracle-red)] font-bold hover:underline">
                            Create New Task →
                        </button>
                    </Link>
                </div>
                <div className="space-y-3">
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                </div>
            </section>
        </div>
    );
}
