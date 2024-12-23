"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import ModeToggle from "./ui/ModeToggle";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/facecapture", label: "Monitor" },
    { href: "/objectdetection", label: "Object Detection"}
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-white dark:text-gray-200 font-extrabold text-2xl tracking-wide hover:opacity-90"
              >
                Home Security
              </Link>
              {session?.user ? (
                <p className="text-sm text-gray-100 mt-1">
                  You are logged in as {session.user.email}.
                </p>
              ) : (
                <p className="text-sm text-gray-200 mt-1">
                  Please sign in or sign up.
                </p>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold ${
                    pathName === link.href
                      ? "text-white dark:text-gray-100 underline decoration-2 underline-offset-4"
                      : "text-gray-200 dark:text-gray-400 hover:text-white dark:hover:text-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Conditionally render auth links/buttons */}
              {session?.user ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-200 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 font-semibold"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="text-sm text-gray-200 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 font-semibold"
                >
                  Sign In
                </Link>
              )}

              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Add Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
