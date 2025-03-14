"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/model/User";

export default function MetricsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  // Mock Data
  const sprintVelocity = 72; // Example: 72 story points completed per sprint
  const sprintCompletionRate = 85; // Example: 85% of planned tasks completed

  return (
    <div className="min-h-screen bg-[var(--oracle-light-gray)] p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[var(--oracle-dark)] text-2xl font-bold">
          Sprint Metrics
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[var(--oracle-blue)] font-bold hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sprint Velocity */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[var(--oracle-dark)]">
            Sprint Velocity
          </h2>
          <p className="text-4xl font-bold text-[var(--oracle-blue)]">
            {sprintVelocity} pts
          </p>
          <p className="text-sm text-gray-600">Story points per sprint</p>
        </div>

        {/* Sprint Completion Rate */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[var(--oracle-dark)]">
            Sprint Completion Rate
          </h2>
          <p className="text-4xl font-bold text-[var(--oracle-green)]">
            {sprintCompletionRate}%
          </p>
          <p className="text-sm text-gray-600">
            Percentage of completed tasks per sprint
          </p>
        </div>
      </div>
    </div>
  );
}
