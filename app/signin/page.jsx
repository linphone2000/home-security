"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const MIN_PASSWORD_LENGTH = 6;

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    email.trim() !== "" && password.length >= MIN_PASSWORD_LENGTH && !isLoading;

  async function handleSignIn(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result.error) {
        router.push("/");
      } else {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

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
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!signInResult.error) {
          router.push("/");
        } else {
          setMode("signin");
          toast({
            title: "Account created",
            description: "Please sign in with your new account.",
          });
        }
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
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
          <label htmlFor="signin-email" className="sr-only">
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            autoComplete="email"
            disabled={isLoading}
          />
          <label htmlFor="signin-password" className="sr-only">
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClassName} mb-6`}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
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
                {mode === "signin" ? "Signing in…" : "Creating account…"}
              </span>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-gray-700 dark:text-gray-300">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
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
                type="button"
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
