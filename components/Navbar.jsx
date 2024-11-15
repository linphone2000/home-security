"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ModeToggle from "./ui/ModeToggle"; // Ensure the correct path to your ModeToggle component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/facecapture", label: "Save Faces" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-sky-500 shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-white font-bold text-xl hover:text-gray-200"
              >
                Home Security
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      usePathname() === link.href
                        ? "bg-sky-700 text-white"
                        : "text-white hover:bg-sky-600 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Theme Toggle */}
              <div className="ml-4">
                <ModeToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    usePathname() === link.href
                      ? "bg-sky-700 text-white"
                      : "text-white hover:bg-sky-600 hover:text-white"
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              {/* Theme Toggle in Mobile Menu */}
              <div className="px-3 py-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Add Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
