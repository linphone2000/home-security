"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = email.trim() !== "" && password.trim() !== "" && !isLoading;

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

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-cyan-400 dark:focus:bg-slate-800 dark:focus:ring-cyan-400/20";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.2) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-2xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/40 dark:shadow-black/20">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Get started with Home Security in seconds
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-11`}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-11`}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-600 hover:to-teal-600 hover:shadow-cyan-500/30 disabled:opacity-70"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2
                    className="h-5 w-5 animate-spin shrink-0"
                    aria-hidden
                  />
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700/50">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
