import React, { useEffect, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SurveillanceCharts = () => {
  // FPS data for 60 seconds, 10-second intervals (static)
  const fpsData = [20, 22, 23, 24, 25, 21]; // Static FPS values for 10s, 20s, ..., 60s

  // Bar Chart Data: Accuracy Comparison with distinct colors
  const barData = useMemo(
    () => ({
      labels: ["FaceAPI.js", "COCO-SSD"],
      datasets: [
        {
          label: "Accuracy (%)",
          data: [86, 95],
          backgroundColor: ["rgba(34, 139, 34, 0.8)", "rgba(0, 120, 215, 0.8)"], // Green, Blue
          borderColor: ["rgba(21, 87, 21, 1)", "rgba(0, 80, 180, 1)"],
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: [
            "rgba(34, 139, 34, 1)",
            "rgba(0, 120, 215, 1)",
          ],
        },
      ],
    }),
    []
  );

  // Log the barData to debug
  useEffect(() => {
    console.log("Bar Chart Data:", barData);
  }, [barData]);

  // Bar Chart Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        grid: {
          color: () =>
            document.body.classList.contains("dark")
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(0, 0, 0, 0.2)",
        },
        title: {
          display: true,
          text: "Accuracy (%)",
          font: { size: 14, family: "Arial", weight: "bold" },
          color: () =>
            document.body.classList.contains("dark")
              ? "#ffffff" // Changed to white
              : "#1e293b",
        },
        ticks: {
          stepSize: 5,
          min: 0,
          max: 100,
          autoSkip: false,
          font: { size: 12, family: "Arial" },
          color: () =>
            document.body.classList.contains("dark") ? "#ffffff" : "#4a5568",
        },
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Model",
          font: { size: 14, family: "Arial", weight: "bold" },
          color: () =>
            document.body.classList.contains("dark")
              ? "#ffffff" // Changed to white
              : "#1e293b",
        },
        ticks: {
          font: { size: 12, family: "Arial" },
          color: () =>
            document.body.classList.contains("dark") ? "#ffffff" : "#4a5568",
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Accuracy Comparison",
        font: { size: 16, family: "Arial", weight: "bold" },
        color: () =>
          document.body.classList.contains("dark") ? "#ffffff" : "#1e293b",
        padding: { top: 10, bottom: 10 },
      },
      tooltip: {
        backgroundColor: () =>
          document.body.classList.contains("dark")
            ? "rgba(0, 30, 60, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        titleColor: () =>
          document.body.classList.contains("dark") ? "#ffffff" : "#1e293b",
        bodyColor: () =>
          document.body.classList.contains("dark")
            ? "#ffffff" // Changed to white
            : "#1e293b",
        titleFont: { size: 12, family: "Arial" },
        bodyFont: { size: 12, family: "Arial" },
        cornerRadius: 6,
      },
    },
  };

  // Line Chart Data: FPS for 60 seconds (static)
  const lineData = {
    labels: Array.from({ length: 6 }, (_, i) => `${(i + 1) * 10}s`), // 10s, 20s, ..., 60s
    datasets: [
      {
        label: "FPS",
        data: fpsData,
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(21, 128, 61, 1)",
        pointBorderColor: () =>
          document.body.classList.contains("dark") ? "#ffffff" : "#1e293b",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  // Line Chart Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        grid: {
          color: () =>
            document.body.classList.contains("dark")
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(0, 0, 0, 0.2)",
        },
        title: {
          display: true,
          text: "FPS",
          font: { size: 14, family: "Arial", weight: "bold" },
          color: () =>
            document.body.classList.contains("dark")
              ? "#ffffff" // Changed to white
              : "#1e293b",
        },
        ticks: {
          stepSize: 5,
          font: { size: 12, family: "Arial" },
          color: () =>
            document.body.classList.contains("dark") ? "#ffffff" : "#4a5568",
        },
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Time (Seconds)",
          font: { size: 14, family: "Arial", weight: "bold" },
          color: () =>
            document.body.classList.contains("dark")
              ? "#ffffff" // Changed to white
              : "#1e293b",
        },
        ticks: {
          font: { size: 12, family: "Arial" },
          color: () =>
            document.body.classList.contains("dark") ? "#ffffff" : "#4a5568",
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "FPS (1 Minute)",
        font: { size: 16, family: "Arial", weight: "bold" },
        color: () =>
          document.body.classList.contains("dark") ? "#ffffff" : "#1e293b",
        padding: { top: 10, bottom: 10 },
      },
      tooltip: {
        backgroundColor: () =>
          document.body.classList.contains("dark")
            ? "rgba(0, 30, 60, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        titleColor: () =>
          document.body.classList.contains("dark") ? "#ffffff" : "#1e293b",
        bodyColor: () =>
          document.body.classList.contains("dark")
            ? "#ffffff" // Changed to white
            : "#1e293b",
        titleFont: { size: 12, family: "Arial" },
        bodyFont: { size: 12, family: "Arial" },
        cornerRadius: 6,
      },
    },
  };

  // Animation variants for Framer Motion
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl">
      {/* Bar Chart */}
      <motion.div
        className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 chart-container"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Bar data={barData} options={barOptions} />
      </motion.div>
      {/* Line Chart */}
      <motion.div
        className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 chart-container"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Line data={lineData} options={lineOptions} />
      </motion.div>
    </div>
  );
};

export default SurveillanceCharts;
