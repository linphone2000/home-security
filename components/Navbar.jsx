"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./ui/ModeToggle";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/facecapture", label: "Monitor" },
    { href: "/newimage", label: "New Image" }, // Longest label
    { href: "/test", label: "Test" },
  ];

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.3, ease: "easeIn" },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

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

            {/* Hamburger Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-8 w-full md:w-fit bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:shadow-md md:rounded-b-lg"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 md:min-w-[150px]">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-medium"
                    >
                      <Link
                        href={link.href}
                        className={`block px-3 py-2 rounded-md ${
                          pathName === link.href
                            ? "text-cyan-700 dark:text-cyan-500 bg-gray-100 dark:bg-gray-700"
                            : "text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {session?.user ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md dark:text-white text-black text-sm font-medium hover:bg-red-600 hover:text-white dark:hover:text-black transition-colors"
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
                        className="block px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  )}

                  <div className="px-3 py-2">
                    <ModeToggle />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
