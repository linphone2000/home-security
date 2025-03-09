import React from "react";

export default function DetailedResultsTable({
  imageDetails,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const totalItems = imageDetails.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDetails = imageDetails.slice(
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
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Detailed Results
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Image
              </th>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Expected
              </th>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Detected
              </th>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Result
              </th>
              <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white">
                Processing Time
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDetails.map((detail, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {detail.image.split("/").pop()}
                </td>
                <td className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {detail.expected ? "Person" : "No Person"}
                </td>
                <td className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {detail.detected !== null
                    ? detail.detected
                      ? "Person"
                      : "No Person"
                    : "N/A"}
                </td>
                <td
                  className={`py-2 px-4 border-t border-gray-200 dark:border-gray-600 ${
                    detail.detected === null
                      ? "text-red-600 dark:text-red-400"
                      : detail.detected === detail.expected
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {detail.detected === null
                    ? detail.error || "Failed"
                    : detail.detected === detail.expected
                    ? "Correct"
                    : "Incorrect"}
                </td>
                <td className="py-2 px-4 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {detail.time ? `${(detail.time / 1000).toFixed(3)}s` : "N/A"}
                </td>
              </tr>
            ))}
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
    </div>
  );
}
