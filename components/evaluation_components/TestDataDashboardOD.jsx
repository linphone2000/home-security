"use client";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const TestDataDashboardOD = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newImage, setNewImage] = useState(null); // For file upload
  const imagesPerPage = 25;

  // Fetch object detection test images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/get-test-images-od");
        if (!response.ok)
          throw new Error("Failed to fetch object detection images");
        const data = await response.json();
        // Map to match expected structure ({ name }) and extract filename from src
        const imageList = data.map((img) => ({
          name: img.src.split("/").pop(), // e.g., "image_withPerson_1.jpg"
          hasPerson: img.hasPerson,
        }));
        setImages(imageList);
      } catch (error) {
        setError("Failed to fetch object detection test images");
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) {
      setError("Please select an image to upload");
      return;
    }

    const file = newImage;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      const imageName = file.name.toLowerCase().endsWith(".jpg")
        ? file.name
        : `${file.name}.jpg`; // Ensure .jpg extension

      try {
        const response = await fetch("/api/save-images-od", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ name: imageName, dataUrl }]),
        });
        if (!response.ok) throw new Error("Failed to save image");
        const result = await response.json();
        if (result.success) {
          setImages((prev) => [...prev, { name: imageName }]);
          setNewImage(null); // Reset file input
          setError("");
        }
      } catch (error) {
        setError("An error occurred while uploading the image");
        console.error("Error uploading image:", error);
      }
    };
    reader.readAsDataURL(file);
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
            Manage Object Detection Test Data
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search object detection images..."
                className="pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
              <div className="overflow-x-auto rounded-lg shadow-md h-[calc(100vh-250px)] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-200 dark:bg-gray-700">
                    <tr className="text-gray-700 dark:text-gray-300">
                      <th className="p-3 border">Image Name</th>
                      <th className="p-3 border">Preview</th>
                      <th className="p-3 border">Contains Person</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedImages.map(({ name, hasPerson }) => (
                      <tr
                        key={name}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b"
                      >
                        <td className="p-3">{name}</td>
                        <td className="p-3">
                          <img
                            src={`/test_set/${name}`}
                            alt={name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) =>
                              (e.target.src = "/fallback-image.jpg")
                            }
                          />
                        </td>
                        <td className="p-3">{hasPerson ? "Yes" : "No"}</td>
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

export default TestDataDashboardOD;
