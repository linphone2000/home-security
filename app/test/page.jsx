"use client";
import React, { useEffect, useState } from "react";
import { fetchLabels, fetchTestImages } from "./utils";
import { runRecognitionTest } from "./faceRecognition";
import LoadingSpinner from "@/components/LoadingSpinner";
import MetricsDisplay from "@/components/evaluation_components/MetricsDisplay";
import ConfusionMatrixTable from "@/components/evaluation_components/ConfusionMatrixTable";
import PerLabelMetricsTable from "@/components/evaluation_components/PerLabelMetricsTable";
import DetailedResultsTable from "@/components/evaluation_components/DetailedResultsTable";
import {
  calculateMetrics,
  calculateConfusionMatrix,
} from "@/lib/faceRecognitionMetrics";

export default function FaceRecognitionTest() {
  const [loading, setLoading] = useState({ isLoading: true, progress: 0 });
  const [labels, setLabels] = useState([]);
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

  useEffect(() => {
    const loadInitialData = async () => {
      const fetchedLabels = await fetchLabels();
      const fetchedTestImages = await fetchTestImages();
      setLabels(fetchedLabels);
      setTestImages(fetchedTestImages);

      if (fetchedLabels.length > 0) {
        const testResults = await runRecognitionTest(
          fetchedLabels,
          fetchedTestImages,
          setLoading
        );
        setResults(testResults);
        console.log(testResults);
      } else {
        setLoading({ isLoading: false, progress: 100 });
      }
    };
    loadInitialData();
  }, []);

  const handleRerunTest = async () => {
    const testResults = await runRecognitionTest(
      labels,
      testImages,
      setLoading
    );
    setResults(testResults);
    console.log(testResults);
    setCurrentPage(1);
  };

  if (loading.isLoading) {
    return <LoadingSpinner progress={loading.progress} />;
  }

  const overallMetrics = calculateMetrics(results, labels); // Pass labels here
  const { confusionMatrix, allLabels, metricsPerLabel } =
    calculateConfusionMatrix(results, labels);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Face Recognition Test Results
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 text-center">
          Processed{" "}
          <span className="font-semibold text-cyan-700 dark:text-cyan-500">
            {results.total}
          </span>{" "}
          images from test_images/
          <br />
          Known labels:{" "}
          <span className="font-semibold text-cyan-700 dark:text-cyan-500">
            {labels.join(", ") || "N/A"}
          </span>
        </p>

        <MetricsDisplay overallMetrics={overallMetrics} results={results} />
        <ConfusionMatrixTable matrix={confusionMatrix} allLabels={allLabels} />
        {/* <PerLabelMetricsTable metricsPerLabel={metricsPerLabel} /> */}
        <DetailedResultsTable
          imageDetails={results.imageDetails}
          knownLabels={labels}
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
