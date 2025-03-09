import React from "react";

export default function LoadingSpinner({ progress }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Processing Face Recognition...
        </h1>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-cyan-700 dark:bg-cyan-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Progress: {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
