"use client";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const LabelDashboard = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingLabel, setEditingLabel] = useState(null); // Stores the label currently being edited
  const [editedName, setEditedName] = useState("");

  const labelsPerPage = 5;

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("/api/labels");
        const data = await response.json();
        setLabels(data);
      } catch (error) {
        setError("Failed to fetch labels");
        console.error("Error fetching labels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabels();
  }, []);

  const handleDelete = async (label) => {
    try {
      const response = await fetch(`/api/labels/${label}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setLabels((prev) => prev.filter((l) => l.label !== label));
      } else {
        setError("Failed to delete label");
      }
    } catch (error) {
      setError("An error occurred while deleting the label");
      console.error("Error deleting label:", error);
    }
  };

  const handleEdit = (label) => {
    setEditingLabel(label);
    setEditedName(label); // Pre-fill input with current label name
  };

  const handleCancelEdit = () => {
    setEditingLabel(null);
    setEditedName("");
  };

  const handleSaveEdit = async (label) => {
    try {
      const formData = new FormData();
      formData.append("label", editedName);

      const response = await fetch(`/api/labels/${label}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setLabels((prev) =>
          prev.map((l) => (l.label === label ? { ...l, label: editedName } : l))
        );
        setEditingLabel(null);
        setEditedName("");
      } else {
        setError("Failed to update label");
      }
    } catch (error) {
      setError("An error occurred while updating the label");
      console.error("Error updating label:", error);
    }
  };

  const filteredLabels = labels.filter((l) =>
    l.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedLabels = filteredLabels.slice(
    (currentPage - 1) * labelsPerPage,
    currentPage * labelsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Manage Faces Labels
          </h1>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search labels..."
              className="pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-3 border">Label</th>
                    <th className="p-3 border">Image</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLabels.map(({ label, imageUrl }) => (
                    <tr
                      key={label}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b"
                    >
                      <td className="p-3">
                        {editingLabel === label ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border rounded-md p-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                          />
                        ) : (
                          label
                        )}
                      </td>
                      <td className="p-3">
                        <img
                          src={imageUrl}
                          alt={label}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 flex space-x-4">
                        {editingLabel === label ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(label)}
                              className="text-green-500 hover:text-green-700"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(label)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(label)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Page {currentPage} of{" "}
                {Math.ceil(filteredLabels.length / labelsPerPage)}
              </p>
              <div className="space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredLabels.length / labelsPerPage)
                      )
                    )
                  }
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md"
                  disabled={
                    currentPage ===
                    Math.ceil(filteredLabels.length / labelsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LabelDashboard;
