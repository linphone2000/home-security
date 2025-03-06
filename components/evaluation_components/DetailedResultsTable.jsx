import PaginationControls from "./PaginationControls";
import { useState } from "react";

export default function DetailedResultsTable({
  imageDetails,
  knownLabels,
  currentPage,
  setCurrentPage,
}) {
  const [resultFilter, setResultFilter] = useState("All"); // Filter for isCorrect: "All", "True", "False"
  const [labelFilter, setLabelFilter] = useState("All"); // Filter for known/unknown: "All", "Known", "Unknown"

  // Filter imageDetails based on both filters
  const filteredImageDetails = imageDetails.filter((detail) => {
    const resultMatch =
      resultFilter === "All" ||
      (resultFilter === "True" && detail.isCorrect) ||
      (resultFilter === "False" && !detail.isCorrect);
    const labelMatch =
      labelFilter === "All" ||
      (labelFilter === "Known" && knownLabels.includes(detail.trueLabel)) ||
      (labelFilter === "Unknown" && !knownLabels.includes(detail.trueLabel));
    return resultMatch && labelMatch;
  });

  // Get unique trueLabels (persons) from filtered data
  const uniqueTrueLabels = [
    ...new Set(filteredImageDetails.map((detail) => detail.trueLabel)),
  ];
  const totalPages = uniqueTrueLabels.length;

  // Ensure currentPage stays within bounds
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  // Get the current person's label and their items
  const currentLabel = uniqueTrueLabels[validCurrentPage - 1] || "";
  const paginatedImageDetails = filteredImageDetails.filter(
    (detail) => detail.trueLabel === currentLabel
  );

  // Reset to page 1 when either filter changes
  const handleFilterChange = (setFilter) => (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Detailed Results
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="result-filter"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Result:
            </label>
            <select
              id="result-filter"
              value={resultFilter}
              onChange={handleFilterChange(setResultFilter)}
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <option value="All">All Results</option>
              <option value="True">Correct (True)</option>
              <option value="False">Incorrect (False)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="label-filter"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Label Type:
            </label>
            <select
              id="label-filter"
              value={labelFilter}
              onChange={handleFilterChange(setLabelFilter)}
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <option value="All">All Labels</option>
              <option value="Known">Known Labels</option>
              <option value="Unknown">Unknown Labels</option>
            </select>
          </div>
        </div>
      </div>
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
            {paginatedImageDetails.length > 0 ? (
              paginatedImageDetails.map((detail, index) => (
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
                    {knownLabels.includes(detail.trueLabel)
                      ? detail.trueLabel
                      : "unknown"}
                    {!knownLabels.includes(detail.trueLabel) && (
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 ml-2"
                        title={`Original: ${detail.trueLabel}`}
                      >
                        (?)
                      </span>
                    )}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-700 dark:text-gray-300"
                >
                  No results for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        currentPage={validCurrentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
