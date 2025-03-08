"use client";
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const NewImageComponent = () => {
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null); // Stores uploaded or captured image
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [useWebcam, setUseWebcam] = useState(false); // Toggle between upload and webcam
  const webcamRef = useRef(null); // Reference to Webcam component

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to Blob
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${label || "captured"}.jpg`, {
            type: "image/jpeg",
          });
          setImage(file);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label || !image) {
      setMessage("Please enter a label and select or capture an image.");
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
        setUseWebcam(false); // Reset to upload mode after success
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {useWebcam ? "Capture Image" : "Upload Image"}
            </label>
            <button
              type="button"
              onClick={() => {
                setUseWebcam(!useWebcam);
                setImage(null); // Clear previous image when switching
              }}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-500 text-sm"
            >
              {useWebcam ? "Switch to Upload" : "Use Webcam"}
            </button>
          </div>
          {useWebcam ? (
            <div className="space-y-2">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "user" }}
                className="rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={handleCapture}
                className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-cyan-400"
                disabled={loading}
              >
                Take Picture
              </button>
              {image && (
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Image captured! Ready to upload.
                </p>
              )}
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
              required={!image} // Only required if no image is set
            />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden px-6 py-3 font-semibold text-cyan-600 dark:text-cyan-400 rounded-md shadow-md border border-cyan-600 dark:border-cyan-400 bg-white dark:bg-gray-900 transition-all duration-500 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 disabled:bg-cyan-300 dark:disabled:bg-cyan-700"
        >
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
