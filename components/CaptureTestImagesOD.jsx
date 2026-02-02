"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function CaptureTestImagesOD() {
  const [classification, setClassification] = useState(""); // "Person" or "NoPerson"
  const [selectedFiles, setSelectedFiles] = useState([]); // Store selected files
  const [previews, setPreviews] = useState([]); // Store image previews
  const [startIndices, setStartIndices] = useState({ Person: 0, NoPerson: 0 }); // Track indices for naming
  const [debugLog, setDebugLog] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const hasFetchedCounts = useRef(false); // Use ref to prevent re-renders from resetting
  const MAX_UPLOADS = 25;

  // Log debug messages
  const logDebug = useCallback((message, details = {}) => {
    console.log(`[DEBUG] ${message}`, details);
    setDebugLog((prev) =>
      [...prev, `[${new Date().toLocaleTimeString()}] ${message}`].slice(-5)
    );
  }, []);

  // Fetch existing image counts for both classifications
  const fetchExistingCounts = useCallback(async () => {
    if (hasFetchedCounts.current) {
      console.log("[DEBUG] Skipping fetch due to hasFetchedCounts");
      return;
    }
    logDebug("Fetching existing image counts for Person and NoPerson");
    try {
      const [personResponse, noPersonResponse] = await Promise.all([
        fetch("/api/get-image-count-od?name=image_withPerson"),
        fetch("/api/get-image-count-od?name=image_noPerson"),
      ]);

      logDebug("Fetch responses received", {
        personStatus: personResponse.status,
        noPersonStatus: noPersonResponse.status,
      });

      if (!personResponse.ok) {
        throw new Error(
          `Person count fetch failed with status ${
            personResponse.status
          }: ${await personResponse.text()}`
        );
      }
      if (!noPersonResponse.ok) {
        throw new Error(
          `NoPerson count fetch failed with status ${
            noPersonResponse.status
          }: ${await noPersonResponse.text()}`
        );
      }

      const personData = await personResponse.json();
      const noPersonData = await noPersonResponse.json();

      logDebug("Raw response data", { personData, noPersonData });

      if (
        typeof personData.count !== "number" ||
        typeof noPersonData.count !== "number"
      ) {
        throw new Error(
          "Invalid count data received: Expected { count: number }"
        );
      }

      logDebug("Fetched image counts", {
        Person: personData.count,
        NoPerson: noPersonData.count,
      });
      setStartIndices({
        Person: personData.count,
        NoPerson: noPersonData.count,
      });
      hasFetchedCounts.current = true;
    } catch (error) {
      logDebug(`Error fetching image counts: ${error.message}`, { error });
      // Fallback to 0 if fetch fails
      setStartIndices({ Person: 0, NoPerson: 0 });
      hasFetchedCounts.current = true;
    }
  }, [logDebug]);

  // Fetch counts on component mount
  useEffect(() => {
    fetchExistingCounts();
  }, [fetchExistingCounts]);

  // Handle file selection with .jpg validation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file extensions
    const invalidFiles = files.filter(
      (file) => !file.name.toLowerCase().endsWith(".jpg")
    );
    if (invalidFiles.length > 0) {
      logDebug(
        `Invalid file extensions: ${invalidFiles.map((f) => f.name).join(", ")}`
      );
      alert("Please upload only .jpg files (not .jpeg).");
      return;
    }

    if (uploadCount + files.length > MAX_UPLOADS) {
      logDebug(
        `Cannot upload ${files.length} files, exceeds limit of ${MAX_UPLOADS}`
      );
      alert(`You can only upload ${MAX_UPLOADS - uploadCount} more images.`);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploadCount((prev) => prev + files.length);
    logDebug(
      `Selected ${files.length} files, total: ${uploadCount + files.length}`
    );
  };

  // Handle image upload to server
  const saveImagesToServer = async () => {
    if (!classification) {
      logDebug("Upload failed: No classification selected");
      alert("Please select whether the images contain a person or not.");
      return;
    }

    if (selectedFiles.length === 0) {
      logDebug("No images to upload");
      alert("No images selected to upload.");
      return;
    }

    setIsUploading(true);
    logDebug(
      `Uploading ${selectedFiles.length} images with classification: ${classification}`
    );

    try {
      const imagesToUpload = selectedFiles.map((file, index) => {
        const baseName =
          classification === "Person" ? "image_withPerson" : "image_noPerson";
        const startIndex =
          classification === "Person"
            ? startIndices.Person
            : startIndices.NoPerson;
        const imageName = `${baseName}_${startIndex + index + 1}.jpg`;
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve({ name: imageName, dataUrl: reader.result });
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagesToUpload);
      const payload = JSON.stringify({ images }); // Removed 'name' since we're saving directly to test_set

      const response = await fetch("/api/save-images-od", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API response failed with status ${response.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const responseData = await response.json();
      logDebug(
        `Successfully uploaded ${images.length} images: ${JSON.stringify(
          responseData
        )}`
      );
      alert(
        `Successfully uploaded ${images.length} images as ${classification} images.`
      );

      // Update start indices
      setStartIndices((prev) => ({
        ...prev,
        [classification]: prev[classification] + images.length,
      }));

      // Reset state
      setSelectedFiles([]);
      setPreviews([]);
      setUploadCount(0);
      setClassification("");
    } catch (error) {
      logDebug(`Error uploading images: ${error.message}`, { error });
      alert("Failed to upload images: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs for previews
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className="flex flex-col items-center space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 dark:text-gray-100"
      >
        Upload Test Images for Object Detection
      </motion.h2>

      {/* Classification Selection */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Select Image Classification
        </h3>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="classification"
              value="Person"
              checked={classification === "Person"}
              onChange={(e) => setClassification(e.target.value)}
              className="form-radio h-5 w-5 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Contains a Person
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="classification"
              value="NoPerson"
              checked={classification === "NoPerson"}
              onChange={(e) => setClassification(e.target.value)}
              className="form-radio h-5 w-5 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-gray-700 dark:text-gray-300">No Person</span>
          </label>
        </div>
      </motion.div>

      {/* File Upload Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Upload Images
        </h3>
        <div className="flex flex-col items-center space-y-4">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
            <ArrowUpTrayIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Select images to upload (.jpg only)
            </span>
            <input
              type="file"
              accept=".jpg"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          <div className="w-full">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Uploaded:{" "}
              <span className="font-semibold text-cyan-600 dark:text-cyan-500">
                {uploadCount}/{MAX_UPLOADS}
              </span>
            </p>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(uploadCount / MAX_UPLOADS) * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={saveImagesToServer}
            disabled={isUploading || selectedFiles.length === 0}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${
              isUploading || selectedFiles.length === 0
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-cyan-700 dark:bg-cyan-600 hover:bg-cyan-800 dark:hover:bg-cyan-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>Upload Images</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Selected Images Preview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {previews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={160}
                    height={128}
                    sizes="(max-width: 640px) 50vw, 160px"
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <p className="text-white text-xs font-medium">
                      {classification === "Person"
                        ? `image_withPerson_${
                            startIndices.Person + index + 1
                          }.jpg`
                        : `image_noPerson_${
                            startIndices.NoPerson + index + 1
                          }.jpg`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Debug Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-400 mb-3">Debug Log</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          {debugLog.map((log, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-2"
            >
              {log.includes("Error") ? (
                <XCircleIcon className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
              )}
              <span>{log}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
