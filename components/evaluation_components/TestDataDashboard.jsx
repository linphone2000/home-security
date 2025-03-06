"use client";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const TestDataDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingImage, setEditingImage] = useState(null);
  const [editedName, setEditedName] = useState("");

  const imagesPerPage = 25;

  // Fetch test images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/test-images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        const imageList = data.images.map((name) => ({ name }));
        setImages(imageList);
      } catch (error) {
        setError("Failed to fetch test images");
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Delete an image
  const handleDelete = async (imageName) => {
    try {
      const response = await fetch(
        `/api/test-images/${encodeURIComponent(imageName)}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.name !== imageName));
      } else {
        setError("Failed to delete image");
      }
    } catch (error) {
      setError("An error occurred while deleting the image");
      console.error("Error deleting image:", error);
    }
  };

  // Start editing an image name
  const handleEdit = (imageName) => {
    setEditingImage(imageName);
    setEditedName(imageName);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingImage(null);
    setEditedName("");
  };

  // Save edited image name
  const handleSaveEdit = async (oldName) => {
    try {
      const response = await fetch(
        `/api/test-images/${encodeURIComponent(oldName)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName: editedName }),
        }
      );
      if (response.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img.name === oldName ? { ...img, name: editedName } : img
          )
        );
        setEditingImage(null);
        setEditedName("");
      } else {
        setError("Failed to update image name");
      }
    } catch (error) {
      setError("An error occurred while updating the image name");
      console.error("Error updating image:", error);
    }
  };

  // Filter and paginate images
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Manage Test Data
          </h1>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              className="pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow-md h-[calc(100vh-200px)] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-200 dark:bg-gray-700">
                    <tr className="text-gray-700 dark:text-gray-300">
                      <th className="p-3 border">Image Name</th>
                      <th className="p-3 border">Preview</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedImages.map(({ name }) => (
                      <tr
                        key={name}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b"
                      >
                        <td className="p-3">
                          {editingImage === name ? (
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="border rounded-md p-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                            />
                          ) : (
                            name
                          )}
                        </td>
                        <td className="p-3">
                          <img
                            src={`/test_images/${name}`}
                            alt={name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) =>
                              (e.target.src = "/fallback-image.jpg")
                            }
                          />
                        </td>
                        <td className="p-3 flex space-x-4">
                          {editingImage === name ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(name)}
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
                                onClick={() => handleEdit(name)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <PencilSquareIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(name)}
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
                  {Math.ceil(filteredImages.length / imagesPerPage)}
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
                          Math.ceil(filteredImages.length / imagesPerPage)
                        )
                      )
                    }
                    className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md"
                    disabled={
                      currentPage ===
                      Math.ceil(filteredImages.length / imagesPerPage)
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
    </div>
  );
};

export default TestDataDashboard;
