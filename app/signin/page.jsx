"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result.error) {
      router.push("/");
    } else {
      alert("Failed to sign in: " + result.error);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.ok) {
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!signInResult.error) {
        router.push("/");
      } else {
        setMode("signin");
      }
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-900 shadow-md rounded-md">
        <h1 className="text-2xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />

          <button
            type="submit"
            className="w-full py-2 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="text-gray-700 dark:text-gray-300">
          {mode === "signin" ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setEmail("");
                  setPassword("");
                }}
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-transparent border-none cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("signin");
                  setEmail("");
                  setPassword("");
                }}
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
