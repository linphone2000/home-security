import React, { useState } from "react";

export default function DetailedResultsTable({
  imageDetails,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const [resultFilter, setResultFilter] = useState("All");

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter image details based on result
  const filteredImageDetails = imageDetails.filter((detail) => {
    if (resultFilter === "All") return true;
    const isCorrect =
      detail.detected !== null && detail.detected === detail.expected;
    return resultFilter === "True" ? isCorrect : !isCorrect;
  });

  const totalItems = filteredImageDetails.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImageDetails = filteredImageDetails.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
                Expected
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Detected
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Result
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Processing Time
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
                      src={detail.image}
                      alt={detail.image.split("/").pop()}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {detail.expected ? "Person" : "No Person"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {detail.detected !== null
                      ? detail.detected
                        ? "Person"
                        : "No Person"
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {detail.detected === null ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {detail.error || "Failed"}
                      </span>
                    ) : detail.detected === detail.expected ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        True
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        False
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {detail.time
                      ? `${(detail.time / 1000).toFixed(3)}s`
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-3 text-center text-gray-700 dark:text-gray-300"
                >
                  No results for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
