"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./ui/ModeToggle";
import { useSession, signOut } from "next-auth/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CameraIcon,
  FolderIcon,
  BeakerIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    {
      href: "/facecapture",
      label: "Start Monitoring",
      icon: <CameraIcon className="w-5 h-5" />,
    },
    {
      href: "/management",
      label: "Data Management",
      icon: <FolderIcon className="w-5 h-5" />,
    },
    {
      href: "/test",
      label: "Face Recognition Evaluation",
      icon: <BeakerIcon className="w-5 h-5" />,
    },
    {
      href: "/objectDetectionEvaluate",
      label: "Object Detection Evaluation",
      icon: <CubeIcon className="w-5 h-5" />,
    },
  ];

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut", staggerChildren: 0.05 },
    },
  };

  // Animation for dropdown items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white dark:bg-gray-900 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-shrink-0 flex items-center space-x-3"
            >
              <Link
                href="/"
                className="text-cyan-700 dark:text-cyan-500 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity duration-200"
              >
                Home Security
              </Link>
              <div className="flex flex-col">
                {session?.user ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    Logged in as {session.user.email}
                  </motion.p>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Please sign in or sign up.
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Hamburger Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
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
                className="absolute right-0 md:right-8 w-full md:w-64 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:shadow-md md:rounded-b-lg"
              >
                <div className="px-4 pt-4 pb-3 space-y-2">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.href}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="text-sm font-medium"
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                          pathName === link.href
                            ? "text-cyan-700 dark:text-cyan-500 bg-gray-100 dark:bg-gray-700"
                            : "text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-all duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-gray-500 dark:text-gray-400">
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Divider */}
                  <hr className="border-t border-gray-200 dark:border-gray-600 my-2" />

                  {session?.user ? (
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-600 hover:text-white dark:hover:text-white transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span>Sign Out</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        href="/signin"
                        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        <span>Sign In</span>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    variants={itemVariants}
                    className="px-4 py-2 flex justify-start"
                  >
                    <ModeToggle />
                  </motion.div>
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
