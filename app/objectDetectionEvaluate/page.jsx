"use client";
import React, { useEffect, useState } from "react";
import { fetchTestImages, runObjectDetectionTest } from "./utils";
import LoadingSpinner from "@/components/ODLoadingSpinner";
import MetricsDisplay from "@/components/evaluation_components/MetricsDisplayOD";
import ConfusionMatrixTable from "@/components/evaluation_components/ConfusionMatrixTableOD";
import DetailedResultsTable from "@/components/evaluation_components/DetailedResultsTableOD";
import {
  calculateMetrics,
  calculateConfusionMatrix,
} from "@/lib/objectDetectionMetrics";

export default function ObjectDetectionEvaluation() {
  const [loading, setLoading] = useState({ isLoading: true, progress: 0 });
  const [testImages, setTestImages] = useState([]);
  const [results, setResults] = useState({
    total: 0,
    truePositives: 0,
    falseNegatives: 0,
    falsePositives: 0,
    trueNegatives: 0,
    processingTime: 0,
    imageDetails: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Load ml5.js, detector, and test images on initial render
  const loadInitialData = async () => {
    console.log("Starting to load ml5.js...");
    setLoading({ isLoading: true, progress: 0 });

    const script = document.createElement("script");
    script.src = "https://unpkg.com/ml5@0.7.1/dist/ml5.min.js";
    script.async = true;
    script.onerror = () => {
      console.error("Failed to load ml5.js script.");
      setLoading({ isLoading: false, progress: 100 });
    };
    document.body.appendChild(script);

    script.onload = async () => {
      console.log("ml5.js script loaded successfully.");
      if (typeof ml5 === "undefined") {
        console.error("ml5 is not defined.");
        setLoading({ isLoading: false, progress: 100 });
        return;
      }

      console.log("Initializing COCO-SSD detector...");
      let detector;
      try {
        detector = await new Promise((resolve, reject) => {
          ml5.objectDetector("cocossd", (err, model) => {
            if (err) {
              console.error("Detector initialization failed:", err);
              reject(err);
              return;
            }
            console.log("Detector initialized successfully.");
            resolve(model);
          });
        });
      } catch (err) {
        setLoading({ isLoading: false, progress: 100 });
        return;
      }

      // Fetch test images
      const fetchedTestImages = await fetchTestImages();
      console.log("Fetched test images:", fetchedTestImages);
      setTestImages(fetchedTestImages);

      if (fetchedTestImages.length > 0) {
        const testResults = await runObjectDetectionTest(
          detector,
          fetchedTestImages,
          setLoading
        );
        setResults(testResults);
        console.log("Test results:", testResults);
      } else {
        console.log("No test images found.");
        setLoading({ isLoading: false, progress: 100 });
      }
    };

    return () => {
      const script = document.querySelector(
        `script[src="https://unpkg.com/ml5@0.7.1/dist/ml5.min.js"]`
      );
      if (script) script.remove();
    };
  };

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Re-run test with the same or refreshed test images
  const handleRerunTest = async () => {
    setLoading({ isLoading: true, progress: 0 });
    setCurrentPage(1);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/ml5@0.7.1/dist/ml5.min.js";
    script.async = true;
    script.onerror = () => {
      console.error("Failed to load ml5.js script on rerun.");
      setLoading({ isLoading: false, progress: 100 });
    };
    document.body.appendChild(script);

    script.onload = async () => {
      if (typeof ml5 === "undefined") {
        console.error("ml5 is not defined on rerun.");
        setLoading({ isLoading: false, progress: 100 });
        return;
      }

      let detector;
      try {
        detector = await new Promise((resolve, reject) => {
          ml5.objectDetector("cocossd", (err, model) => {
            if (err) {
              console.error("Detector initialization failed on rerun:", err);
              reject(err);
              return;
            }
            resolve(model);
          });
        });
      } catch (err) {
        setLoading({ isLoading: false, progress: 100 });
        return;
      }

      // Re-fetch test images to include new uploads
      const fetchedTestImages = await fetchTestImages();
      console.log("Re-fetched test images:", fetchedTestImages);
      setTestImages(fetchedTestImages);

      if (fetchedTestImages.length > 0) {
        const testResults = await runObjectDetectionTest(
          detector,
          fetchedTestImages,
          setLoading
        );
        setResults(testResults);
        console.log("Rerun test results:", testResults);
      } else {
        console.log("No test images found on rerun.");
        setLoading({ isLoading: false, progress: 100 });
      }
    };
  };

  if (loading.isLoading) {
    return <LoadingSpinner progress={loading.progress} />;
  }

  // Calculate metrics and confusion matrix
  const overallMetrics = calculateMetrics(results);
  const { confusionMatrix, allLabels } = calculateConfusionMatrix(results);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Object Detection Test Results
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 text-center">
          Processed{" "}
          <span className="font-semibold text-cyan-700 dark:text-cyan-500">
            {results.total}
          </span>{" "}
          images from test_set/
        </p>
        <MetricsDisplay overallMetrics={overallMetrics} results={results} />
        <ConfusionMatrixTable matrix={confusionMatrix} allLabels={allLabels} />
        <DetailedResultsTable
          imageDetails={results.imageDetails}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
        <div className="mt-8 text-center">
          <button
            onClick={handleRerunTest}
            className="px-6 py-3 bg-cyan-700 dark:bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 dark:hover:bg-cyan-700 transition-all duration-300"
          >
            Re-run Test
          </button>
        </div>
      </div>
    </div>
  );
}
