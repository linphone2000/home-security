"use client";
import React, { useState } from "react";

const NewImageComponent = () => {
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label || !image) {
      setMessage("Please enter a label and select an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("label", label);
    formData.append("image", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Label and image uploaded successfully!");
        setLabel("");
        setImage(null);
      } else {
        setMessage("Failed to upload label and image.");
      }
    } catch (error) {
      setMessage("An error occurred while uploading.");
      console.error("Error uploading:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-200 text-center mb-4">
        Add New Label
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label Name
          </label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter label name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden px-6 py-3 font-semibold text-cyan-600 dark:text-cyan-400 rounded-md shadow-md border border-cyan-600 dark:border-cyan-400 bg-white dark:bg-gray-900 transition-all duration-500 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 disabled:bg-cyan-300 dark:disabled:bg-cyan-700"
        >
          {/* Gradient hover effect */}
          <span
            className="absolute inset-x-0 bottom-0 h-1/2 group-hover:h-full bg-gradient-to-t from-cyan-500/20 to-transparent dark:from-cyan-700/20 dark:to-transparent pointer-events-none transition-all duration-500"
            aria-hidden="true"
          />
          {loading ? "Uploading..." : "Upload"}
        </button>
        {message && (
          <p className="mt-4 text-center text-gray-800 dark:text-gray-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default NewImageComponent;
