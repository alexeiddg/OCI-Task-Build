import { NextRequest, NextResponse } from "next/server";
import { getTasksByUser } from "@/services/taskService";
import { Task } from "@/model/Task";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userId = params.userId;

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    try {
        const tasks: Task[] = await getTasksByUser(Number(userId));
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
