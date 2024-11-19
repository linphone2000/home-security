"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import ModeToggle from "./ui/ModeToggle"; // Ensure the correct path to your ModeToggle component

const Navbar = () => {
  const pathName = usePathname();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/facecapture", label: "Save Faces" },
  ];

  return (
    <>
      {/* Navbar */}
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

              {/* Theme Toggle */}
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
