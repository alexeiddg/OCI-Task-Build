"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/model/User";
import { Sprint } from "@/model/Sprint";
import { SprintService } from "@/services/sprintService";

export default function MetricsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [sprintData, setSprintData] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch sprint metrics once user data is available
  useEffect(() => {
    if (user) {
      const fetchMetrics = async () => {
        setLoading(true);
        try {
          const sprintData = await SprintService.getSprintById(1);
          console.log("SprintData: ", sprintData);

          if (sprintData !== null) {
            setSprintData(sprintData);
          } else {
            console.error("Failed to fetch sprint metrics.");
          }
        } catch (error) {
          console.error("Error fetching sprint metrics:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMetrics();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found. Redirecting...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--oracle-light-gray)] p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[var(--oracle-dark)] text-2xl font-bold">
          Productivity Metrics
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[var(--oracle-blue)] font-bold hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Sprint Metrics Section */}
      <div className="mb-6">
        {/* Title Section */}
        <h2 className="text-2xl font-bold text-[var(--oracle-dark)] mb-4">
          Sprint Metrics Overview
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          This section provides an overview of the sprint metrics, including the
          sprint velocity and the completion rate.
        </p>

        {/* Sprint Information */}
        {sprintData && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[var(--oracle-dark)]">
              Sprint Name: {sprintData.sprintName}
            </h3>
            <p className="text-sm text-gray-600">
              Start Date:{" "}
              {sprintData.startDate
                ? new Date(sprintData.startDate).toLocaleDateString()
                : "N/A"}{" "}
              - End Date:{" "}
              {sprintData.endDate
                ? new Date(sprintData.endDate).toLocaleDateString()
                : "N/A"}{" "}
            </p>
          </div>
        )}

        {/* Grid Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Sprint Velocity */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[var(--oracle-dark)]">
              Sprint Velocity
            </h3>
            <p className="text-4xl font-bold text-[var(--oracle-blue)]">
              {sprintData!.sprintVelocity} pts
            </p>
            <p className="text-sm text-gray-600">Story points per sprint</p>
          </div>

          {/* Sprint Completion Rate */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[var(--oracle-dark)]">
              Sprint Completion Rate
            </h3>
            <p className="text-4xl font-bold text-[var(--oracle-green)]">
              {sprintData!.completionRate}%
            </p>
            <p className="text-sm text-gray-600">
              Percentage of completed tasks per sprint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
