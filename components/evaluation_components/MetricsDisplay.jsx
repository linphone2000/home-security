export default function MetricsDisplay({ overallMetrics, results }) {
  const {
    accuracy,
    precision,
    recall,
    specificity,
    falseNegativeRate,
    macroF1,
    avgTimePerImage,
  } = overallMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Classification Metrics
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Total Images:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {results.total}
            </span>
          </p>
          <p>
            <span className="font-medium">True Positives (TP):</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              {results.truePositives}
            </span>
          </p>
          <p>
            <span className="font-medium">False Negatives (FN):</span>{" "}
            <span className="text-red-600 dark:text-red-400">
              {results.falseNegatives}
            </span>
          </p>
          <p>
            <span className="font-medium">False Positives (FP):</span>{" "}
            <span className="text-red-600 dark:text-red-400">
              {results.falsePositives}
            </span>
          </p>
          <p>
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
          <p>
            <span className="font-medium">Accuracy:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {(accuracy * 100).toFixed(2)}%
            </span>
          </p>
          <p>
            <span className="font-medium">Precision:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {(precision * 100).toFixed(2)}%
            </span>
          </p>
          <p>
            <span className="font-medium">Recall:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {(recall * 100).toFixed(2)}%
            </span>
          </p>
          <p>
            <span className="font-medium">Specificity:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {(specificity * 100).toFixed(2)}%
            </span>
          </p>
          <p>
            <span className="font-medium">False Negative Rate:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {(falseNegativeRate * 100).toFixed(2)}%
            </span>
          </p>
          <p>
            <span className="font-medium">F1 Score:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {macroF1.toFixed(4)}
            </span>
          </p>
          <p>
            <span className="font-medium">Avg. Time per Image:</span>{" "}
            <span className="text-cyan-700 dark:text-cyan-500">
              {avgTimePerImage.toFixed(3)}s
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
