import React from "react";

export default function ConfusionMatrixTable({ matrix, allLabels }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Confusion Matrix
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Actual \ Predicted
              </th>
              {allLabels.map((label) => (
                <th
                  key={label}
                  className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allLabels.map((actual) => (
              <tr key={actual}>
                <td className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 font-medium text-gray-600 dark:text-gray-300">
                  {actual}
                </td>
                {allLabels.map((predicted) => (
                  <td
                    key={predicted}
                    className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {matrix[actual][predicted]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
