export const createUser = async (name: string, username: string, role: string) => {
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, role }),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
};
