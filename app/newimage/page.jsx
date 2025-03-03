"use client";

import React, { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import LabelDashboard from "@/components/LabelDashboard";
import NewImageComponent from "@/components/NewImageComponent";
import { motion, AnimatePresence } from "framer-motion";

export default function NewImage() {
  const [activeComponent, setActiveComponent] = useState("newLabel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white dark:bg-gray-800 p-5 shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`text-2xl font-extrabold text-gray-900 dark:text-gray-200 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            Menu
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li
              onClick={() => setActiveComponent("newLabel")}
              className={`cursor-pointer ${
                activeComponent === "newLabel"
                  ? "text-cyan-500"
                  : "text-gray-600 dark:text-gray-400"
              } hover:text-cyan-500 dark:hover:text-cyan-400`}
            >
              🏷️ {isSidebarOpen && "Add New Label"}
            </li>
            <li
              onClick={() => setActiveComponent("manageLabels")}
              className={`cursor-pointer ${
                activeComponent === "manageLabels"
                  ? "text-cyan-500"
                  : "text-gray-600 dark:text-gray-400"
              } hover:text-cyan-500 dark:hover:text-cyan-400`}
            >
              📁 {isSidebarOpen && "Manage Labels"}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 mb-6 text-center">
          Label Management Dashboard
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
            ) : (
              <motion.div
                key="manageLabels"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <LabelDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
