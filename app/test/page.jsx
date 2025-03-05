"use client";
import React, { useEffect, useState } from "react";
import { fetchLabels, fetchTestImages } from "./utils";
import { runRecognitionTest } from "./faceRecognition";

export default function FaceRecognitionTest() {
  const [loading, setLoading] = useState(true);
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
      } else {
        setLoading(false);
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="flex items-center space-x-4">
          <svg
            className="animate-spin h-8 w-8 text-cyan-700 dark:text-cyan-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg">
            Loading models and processing test images...
          </p>
        </div>
      </div>
    );
  }

  const accuracy =
    (results.total > 0
      ? (results.truePositives + results.trueNegatives) / results.total
      : 0) * 100;
  const precision =
    (results.truePositives + results.falsePositives > 0
      ? results.truePositives / (results.truePositives + results.falsePositives)
      : 0) * 100;
  const recall =
    (results.truePositives + results.falseNegatives > 0
      ? results.truePositives / (results.truePositives + results.falseNegatives)
      : 0) * 100;
  const falseNegativeRate =
    (results.truePositives + results.falseNegatives > 0
      ? results.falseNegatives /
        (results.truePositives + results.falseNegatives)
      : 0) * 100;
  const avgTimePerImage = results.processingTime / results.total || 0;

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

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Classification Metrics
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Total Images:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {results.total}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">True Positives (TP):</span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {results.truePositives}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">False Negatives (FN):</span>{" "}
                <span className="text-red-600 dark:text-red-400">
                  {results.falseNegatives}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">False Positives (FP):</span>{" "}
                <span className="text-red-600 dark:text-red-400">
                  {results.falsePositives}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">True Negatives (TN):</span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {results.trueNegatives}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Performance Metrics
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Accuracy:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {accuracy.toFixed(2)}%
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Precision:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {precision.toFixed(2)}%
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Recall:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {recall.toFixed(2)}%
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">False Negative Rate:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {falseNegativeRate.toFixed(2)}%
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Total Processing Time:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {results.processingTime.toFixed(2)}s
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Avg. Time per Image:</span>{" "}
                <span className="text-cyan-700 dark:text-cyan-500">
                  {avgTimePerImage.toFixed(3)}s
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Detailed Results
        </h2>
        <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                  Image
                </th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                  True Label
                </th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                  Predicted Label
                </th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {results.imageDetails.map((detail, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="p-3">
                    <img
                      src={`/test_images/${detail.filename}`}
                      alt={detail.filename}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {detail.trueLabel}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {detail.predictedLabel}
                  </td>
                  <td className="p-3">
                    {detail.isCorrect ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        True
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        False
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Re-run Button */}
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
