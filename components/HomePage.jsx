"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Hero from "./sub components/Hero";
import Features from "./sub components/Features";
import HowItWorks from "./sub components/HowItWorks";
import CallToAction from "./sub components/CallToAction";
import Footer from "./sub components/Footer";

const HomePage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Global Subtle Animated Blobs */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-blue-400 dark:bg-blue-600 
               rounded-full opacity-10 blur-xl z-0"
        animate={{
          x: [0, 60, 0, -60, 0],
          y: [0, 30, 0, -30, 0],
          rotate: [0, 45, 90, 45, 0],
          scale: [1, 1.05, 1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-0 w-72 h-72 bg-cyan-400 dark:bg-cyan-600 
               rounded-full opacity-10 blur-xl z-0"
        animate={{
          x: [0, -60, 0, 60, 0],
          y: [0, -30, 0, 30, 0],
          rotate: [0, -45, -90, -45, 0],
          scale: [1, 1.03, 1, 1.03, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Feature Global Subtle Animated Blobs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500 dark:bg-cyan-700 
               rounded-full opacity-10 blur-xl z-0"
        animate={{
          x: [0, -60, 0, 60, 0],
          y: [0, -30, 0, 30, 0],
          rotate: [0, -45, -90, -45, 0],
          scale: [1, 1.03, 1, 1.03, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* How it Works Global Subtle Animated Blobs */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400 dark:bg-blue-600 
               rounded-full opacity-10 blur-xl z-0"
        animate={{
          x: [0, -60, 0, 60, 0],
          y: [0, -30, 0, 30, 0],
          rotate: [0, -45, -90, -45, 0],
          scale: [1, 1.03, 1, 1.03, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Contact Global Subtle Animated Blobs */}
      <motion.div
        className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-400 dark:bg-blue-600 
             rounded-full opacity-10 blur-xl z-0"
        animate={{
          x: [-30, 30, -30], // Subtle horizontal movement
          rotate: [0, -45, -90, -45, 0], // Rotation animation
          scale: [1, 1.03, 1, 1.03, 1], // Scaling animation
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Call to Action Section */}
        <CallToAction />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
