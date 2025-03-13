"use client";

import "./globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [username, setUsername] = useState("");
    const [isSignupMode, setIsSignupMode] = useState(false);
    const router = useRouter();

    const handleProceed = () => {
        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        if (isSignupMode) {
            router.push(`/users/signup?username=${encodeURIComponent(username)}`);
        } else {
            router.push(`/users/login?username=${encodeURIComponent(username)}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-4">
                    Welcome to Oracle Task Manager
                </h1>

                {/* Username Input */}
                <div className="flex flex-col">
                    <label className="text-[var(--oracle-dark-gray)] font-medium mb-1">
                        {isSignupMode ? "Enter a New Username" : "Enter Your Username"}
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleProceed()} // Handle Enter Key
                    />
                </div>

                {/* Login & Signup Buttons (Toggle Between Them) */}
                <div className="flex flex-col mt-4 space-y-2">
                    <button
                        className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white font-bold py-2 px-4 rounded-md"
                        onClick={handleProceed}
                    >
                        {isSignupMode ? "Sign Up" : "Login"}
                    </button>
                </div>

                {/* Toggle Between Login & Signup */}
                <div className="text-center mt-4">
                    <p className="text-[var(--oracle-dark)] text-sm">
                        {isSignupMode ? "Already have an account?" : "Don't have an account?"}
                        <button
                            className="text-[var(--oracle-red)] underline ml-1"
                            onClick={() => setIsSignupMode(!isSignupMode)}
                        >
                            {isSignupMode ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
