import React from "react";

export default function ConfusionMatrixTable({ matrix, allLabels }) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Confusion Matrix
      </h2>
      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                True \ Predicted
              </th>
              {allLabels.map((label) => (
                <th
                  key={label}
                  className="p-3 border-b border-gray-200 dark:border-gray-600"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allLabels.map((trueLabel) => (
              <tr
                key={trueLabel}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <td className="p-3 font-medium text-gray-700 dark:text-gray-300">
                  {trueLabel}
                </td>
                {allLabels.map((predLabel) => (
                  <td
                    key={predLabel}
                    className={`p-3 text-center ${
                      trueLabel === predLabel
                        ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {matrix[trueLabel][predLabel]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
