"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const MIN_PASSWORD_LENGTH = 6;

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    email.trim() !== "" && password.length >= MIN_PASSWORD_LENGTH && !isLoading;

  async function handleSignUp(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Account created",
          description: "You can now sign in with your new account.",
        });
        router.push("/signin");
      } else {
        toast({
          title: "Sign up failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClassName =
    "w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-900 shadow-md rounded-md">
        <h1 className="text-2xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
          Sign Up
        </h1>

        <form onSubmit={handleSignUp}>
          <label htmlFor="signup-email" className="sr-only">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            autoComplete="email"
            disabled={isLoading}
          />
          <label htmlFor="signup-password" className="sr-only">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClassName} mb-6`}
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full mb-4 h-10"
            disabled={!canSubmit}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Oval
                  height={20}
                  width={20}
                  color="currentColor"
                  ariaLabel="loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
                Creating account…
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-gray-700 dark:text-gray-300">
          <p>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
