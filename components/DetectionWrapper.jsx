"use client";

export default function DetectionWrapper({ children }) {
  return (
    <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden max-w-[640px] max-h-[480px] mx-auto">
      {children}
    </div>
  );
}
