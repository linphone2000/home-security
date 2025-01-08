"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ModeToggle from "./ui/ModeToggle";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/facecapture", label: "Monitor" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white dark:bg-gray-900 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <Link
                href="/"
                className="text-cyan-700 dark:text-cyan-500 font-semibold text-xl tracking-tight hover:opacity-90"
              >
                Home Security
              </Link>
              {session?.user ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                >
                  Logged in as {session.user.email}
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                >
                  Please sign in or sign up.
                </motion.p>
              )}
            </motion.div>

            {/* Desktop Menu */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium"
                >
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md ${
                      pathName === link.href
                        ? "text-cyan-700 dark:text-cyan-500 border-b-2 border-cyan-700 dark:border-cyan-500"
                        : "text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Conditionally render auth links/buttons */}
              {session?.user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-2 py-1 rounded-md dark:text-white text-black text-sm font-medium hover:bg-red-600 hover:text-white dark:hover:text-black transition-colors"
                >
                  Sign Out
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signin"
                    className="px-4 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}

              {/* Theme Toggle */}
              <ModeToggle />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
