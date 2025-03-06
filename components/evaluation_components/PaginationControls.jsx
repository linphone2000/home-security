export default function PaginationControls({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
