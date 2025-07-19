"use client";

import React, { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import {
  TagIcon,
  FolderIcon,
  CameraIcon,
  PhotoIcon,
  CubeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import LabelDashboard from "@/components/LabelDashboard";
import NewImageComponent from "@/components/NewImageComponent";
import CaptureTestImages from "@/components/CaptureTestImages";
import CaptureTestImagesOD from "@/components/CaptureTestImagesOD";
import TestDataDashboard from "@/components/evaluation_components/TestDataDashboard";
import TestDataDashboardOD from "@/components/evaluation_components/TestDataDashboardOD";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "@/components/Chart";

export default function NewImage() {
  const [activeComponent, setActiveComponent] = useState("newLabel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sidebar menu items
  const menuItems = [
    {
      id: "newLabel",
      label: "Add New Face",
      icon: <TagIcon className="w-5 h-5" />,
    },
    {
      id: "manageLabels",
      label: "Manage Faces",
      icon: <FolderIcon className="w-5 h-5" />,
    },
    {
      id: "captureTest",
      label: "Capture Test Face Images",
      icon: <CameraIcon className="w-5 h-5" />,
    },
    {
      id: "manageTestData",
      label: "Manage Test Faces Data",
      icon: <PhotoIcon className="w-5 h-5" />,
    },
    {
      id: "captureTestOD",
      label: "Capture Test Objects Images",
      icon: <CubeIcon className="w-5 h-5" />,
    },
    {
      id: "manageTestDataOD",
      label: "Manage Test Objects Data",
      icon: <PhotoIcon className="w-5 h-5" />,
    },
    {
      id: "viewCharts",
      label: "View Performance Charts",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <motion.aside
        className="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300"
        animate={{ width: isSidebarOpen ? 256 : 64 }}
        initial={{ width: isSidebarOpen ? 256 : 64 }}
      >
        <div className="flex items-center justify-between p-5">
          <h1
            className={`text-2xl font-extrabold text-gray-900 dark:text-gray-200 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Menu
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-50"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <li
                  onClick={() => setActiveComponent(item.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeComponent === item.id
                      ? "bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span
                    className={`${
                      activeComponent === item.id
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-gray-500 dark:text-gray-400"
                    } transition-colors duration-200`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-sm font-medium transition-opacity duration-300 ${
                      isSidebarOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
                {(index === 1 || index === 3 || index === 5) &&
                  isSidebarOpen && (
                    <hr className="border-t border-gray-200 dark:border-gray-600 my-2 mx-3" />
                  )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 mb-6 text-center">
          Data Management Dashboard
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <AnimatePresence mode="wait">
            {activeComponent === "newLabel" ? (
              <motion.div
                key="newLabel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <NewImageComponent />
              </motion.div>
            ) : activeComponent === "manageLabels" ? (
              <motion.div
                key="manageLabels"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <LabelDashboard />
              </motion.div>
            ) : activeComponent === "manageTestData" ? (
              <motion.div
                key="manageTestData"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <TestDataDashboard />
              </motion.div>
            ) : activeComponent === "captureTestOD" ? (
              <motion.div
                key="captureTestOD"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <CaptureTestImagesOD />
              </motion.div>
            ) : activeComponent === "manageTestDataOD" ? (
              <motion.div
                key="manageTestDataOD"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <TestDataDashboardOD />
              </motion.div>
            ) : activeComponent === "captureTest" ? (
              <motion.div
                key="captureTest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <CaptureTestImages />
              </motion.div>
            ) : (
              <motion.div
                key="viewCharts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Chart />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
