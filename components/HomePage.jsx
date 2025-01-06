"use client";
import React from "react";
import { Terminal, Camera, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <motion.section
        className="flex-grow py-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 dark:from-gray-800 dark:via-gray-900 dark:to-black flex flex-col items-center justify-center text-center px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white dark:text-gray-200"
          variants={fadeInUp}
        >
          Intelligent Home Surveillance System
        </motion.h2>
        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-50 dark:text-gray-200 max-w-2xl tracking-wide leading-7"
          variants={fadeInUp}
        >
          Real-time face recognition and object detection powered by
          TensorFlow.js and Next.js for enhanced privacy and security—right in
          your browser.
        </motion.p>
        <motion.p
          className="mt-3 text-base md:text-lg text-gray-300 dark:text-gray-400 max-w-2xl tracking-wide leading-6"
          variants={fadeInUp}
        >
          Dynamic switching between object detection and face recognition
          ensures efficient performance without external hardware.
        </motion.p>
        <motion.div className="mt-6 flex space-x-4" variants={fadeInUp}>
          <Link href="/facecapture">
            <Button>Learn More</Button>
          </Link>
          <Link href="/facecapture">
            <Button variant="outline">Get Started</Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl font-bold text-center mb-8 dark:text-white"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Key Features
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <Camera className="mx-auto mb-4 h-12 w-12 text-blue-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold dark:text-white">
                Real-Time Detection
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Detect and identify faces instantly with fast, browser-based AI
                processing.
              </p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-blue-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold dark:text-white">
                Enhanced Accuracy
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Reliable recognition with advanced models, minimizing false
                positives for secure performance.
              </p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <UserCheck className="mx-auto mb-4 h-12 w-12 text-blue-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold dark:text-white">
                Seamless Usability
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and monitor with ease using a clean and intuitive
                dashboard.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl font-bold text-center mb-8 dark:text-white"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            How It Works
          </motion.h3>
          <motion.div
            className="flex flex-col md:flex-row items-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div
              className="md:w-1/3 text-center md:pr-6"
              variants={fadeInUp}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Webcam Input"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold dark:text-white">
                1. Capture Input
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Use your webcam to provide a live video feed for face and object
                detection.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              className="md:w-1/3 text-center md:px-6"
              variants={fadeInUp}
            >
              <img
                src="https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2022/10/dataprocessing-scaled.jpg"
                alt="Data Processing"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold dark:text-white">
                2. Analyze Input
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Real-time analysis using TensorFlow.js to detect objects and
                recognize faces efficiently.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              className="md:w-1/3 text-center md:pl-6"
              variants={fadeInUp}
            >
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Results Display"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold dark:text-white">
                3. Get Results
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View real-time notifications and detailed outputs on detected
                faces and objects.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="py-12 bg-blue-600 text-white text-center dark:bg-gray-900 dark:text-gray-200"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Security?
          </h3>
          <p className="mb-6">
            Protect your home with real-time face recognition and object
            detection. Stay informed and secure, all within your browser.
          </p>
          <Link href={"https://lpmz-portfolio.vercel.app/"}>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white">
              Get Started Now
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-800 text-white py-6 dark:bg-black"
      >
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Lin Phone Myint Zaw. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="/contact" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
