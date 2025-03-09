import React from "react";

export default function MetricsDisplay({ overallMetrics, results }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Classification Metrics
      </h2>
      <table className="w-full text-left">
        <tbody>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Total Images
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {results.total}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              True Positives (TP)
            </td>
            <td className="py-2 text-green-600 dark:text-green-400">
              {results.truePositives}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              False Negatives (FN)
            </td>
            <td className="py-2 text-red-600 dark:text-red-400">
              {results.falseNegatives}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              False Positives (FP)
            </td>
            <td className="py-2 text-red-600 dark:text-red-400">
              {results.falsePositives}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              True Negatives (TN)
            </td>
            <td className="py-2 text-green-600 dark:text-green-400">
              {results.trueNegatives}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Accuracy
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.accuracy * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Precision
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.precision * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Recall
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.recall * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Specificity
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.specificity * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              False Negative Rate
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.falseNegativeRate * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Macro F1 Score
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {(overallMetrics.macroF1 * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600 dark:text-gray-300">
              Avg. Time per Image
            </td>
            <td className="py-2 text-blue-700 dark:text-blue-400">
              {overallMetrics.avgTimePerImage.toFixed(3)}s
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
