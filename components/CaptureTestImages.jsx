"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function CaptureTestImages() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [count, setCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [debugLog, setDebugLog] = useState([]);
  const NUM_IMAGES = 25;

  // Log debug messages
  const logDebug = useCallback((message) => {
    console.log(`[DEBUG] ${message}`);
    setDebugLog((prev) =>
      [...prev, `[${new Date().toLocaleTimeString()}] ${message}`].slice(-5)
    );
  }, []);

  // Fetch existing image count
  const fetchExistingCount = useCallback(
    async (name) => {
      logDebug(`Fetching existing image count for ${name}`);
      try {
        const response = await fetch(
          `/api/get-image-count?name=${encodeURIComponent(name)}`
        );
        logDebug(`Fetch response status: ${response.status}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "API response not OK");
        }
        const data = await response.json();
        logDebug(`Existing images for ${name}: ${data.count}`);
        setStartIndex(data.count);
        return data.count;
      } catch (error) {
        logDebug(`Error fetching image count: ${error.message}`);
        setStartIndex(0);
        return 0;
      }
    },
    [logDebug]
  );

  // Stop webcam
  const stopWebcam = useCallback(() => {
    logDebug("Attempting to stop webcam");
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.srcObject
    ) {
      const stream = webcamRef.current.video.srcObject;
      logDebug("Stopping webcam stream tracks");
      stream.getTracks().forEach((track) => {
        track.stop();
        logDebug(`Stopped track: ${track.kind}`);
      });
      webcamRef.current.video.srcObject = null;
      setIsWebcamActive(false);
      logDebug("Webcam stopped successfully");
    } else {
      logDebug("No active webcam stream to stop");
    }
  }, [logDebug]);

  // Capture image
  const captureImage = useCallback(() => {
    logDebug("Entering captureImage function");
    if (!isWebcamActive) {
      logDebug("Cannot capture: isWebcamActive is false");
      return;
    }
    if (!webcamRef.current) {
      logDebug("Cannot capture: webcamRef is null");
      return;
    }

    logDebug("Checking webcam video state");
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) {
      logDebug(
        `Cannot capture: Video not ready (readyState: ${
          video?.readyState || "undefined"
        })`
      );
      return;
    }

    logDebug("Attempting to get screenshot");
    try {
      const dataUrl = webcamRef.current.getScreenshot();
      if (!dataUrl) {
        logDebug("Capture failed: getScreenshot returned null");
        return;
      }

      setCount((prevCount) => {
        const newCount = prevCount + 1;
        const imageName = `${name}_${startIndex + newCount}.jpg`;
        logDebug(`Screenshot captured, creating image: ${imageName}`);
        setImages((prev) => {
          const newImages = [...prev, { name: imageName, dataUrl }];
          logDebug(
            `Image added to array, new length: ${
              newImages.length
            }, images: ${newImages.map((img) => img.name).join(", ")}`
          );
          return newImages;
        });
        return newCount;
      });
    } catch (error) {
      logDebug(`Capture error: ${error.message}`);
    }
  }, [isWebcamActive, logDebug, name, startIndex]);

  // Save images to server
  const saveImagesToServer = useCallback(async () => {
    logDebug("Entering saveImagesToServer function");
    if (images.length === 0) {
      logDebug("No images to save");
      alert("No images captured to save.");
      stopWebcam();
      return;
    }

    logDebug(
      `Preparing to save ${images.length} images: ${images
        .map((img) => img.name)
        .join(", ")}`
    );
    try {
      const payload = JSON.stringify({ name, images });
      logDebug(`Sending payload to server (size: ${payload.length} bytes)`);
      const response = await fetch("/api/save-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      logDebug(`Save API response status: ${response.status}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API response not OK");
      }
      const responseData = await response.json();
      logDebug(
        `Successfully saved ${
          images.length
        } images for ${name}: ${JSON.stringify(responseData)}`
      );
      alert(
        `Saved ${images.length} images for ${name} (starting from ${
          startIndex + 1
        })`
      );
      stopWebcam();
      setCount(0);
      setImages([]); // Reset only on success
      logDebug("Save process completed, reset state");
    } catch (error) {
      logDebug(`Error saving images: ${error.message}`);
      alert("Failed to save images to server: " + error.message);
      // Do not reset images on failure, allowing retry
    }
  }, [images, logDebug, name, startIndex, stopWebcam]);

  // Handle key presses
  const handleKeyPress = useCallback(
    (event) => {
      logDebug(`Key pressed: ${event.key}`);
      if (!isWebcamActive) {
        logDebug("Key press ignored: Webcam not active");
        return;
      }

      if (event.key === " " && count < NUM_IMAGES) {
        event.preventDefault();
        logDebug("Spacebar pressed: Initiating capture");
        captureImage();
      } else if (event.key === "q") {
        logDebug("Q pressed: Initiating save and quit");
        saveImagesToServer();
      }
    },
    [
      NUM_IMAGES,
      captureImage,
      count,
      isWebcamActive,
      logDebug,
      saveImagesToServer,
    ]
  );

  // Start capturing
  const handleStartCapture = useCallback(async () => {
    logDebug("Entering handleStartCapture");
    if (!name.trim()) {
      logDebug("Start capture failed: No name provided");
      alert("Please enter a name.");
      return;
    }
    logDebug(`Starting capture for ${name}`);
    const existingCount = await fetchExistingCount(name);
    setStartIndex(existingCount);
    setIsWebcamActive(true);
    logDebug("Webcam activation triggered");
  }, [fetchExistingCount, logDebug, name]);

  // Keypress listener
  useEffect(() => {
    logDebug("Adding keypress listener");
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      logDebug("Removing keypress listener");
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, logDebug]);

  // Auto-save when reaching NUM_IMAGES
  useEffect(() => {
    if (count === NUM_IMAGES) {
      logDebug(`Reached ${NUM_IMAGES} images, triggering auto-save`);
      saveImagesToServer();
    }
  }, [NUM_IMAGES, count, logDebug, saveImagesToServer]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      logDebug("Component unmounting");
      stopWebcam();
    };
  }, [logDebug, stopWebcam]);

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
        Capture Test Images for Face Recognition
      </h2>
      {!isWebcamActive && (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name for test dataset"
            className="w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleStartCapture}
            className="px-6 py-3 bg-cyan-700 dark:bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 dark:hover:bg-cyan-700 transition-all duration-300"
          >
            Start Webcam
          </button>
        </div>
      )}
      {isWebcamActive && (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="rounded-md shadow-md w-full max-w-lg"
              videoConstraints={{ facingMode: "user" }}
              onUserMedia={() => logDebug("Webcam stream started")}
              onUserMediaError={(error) => {
                logDebug(`Webcam error: ${error.message}`);
                alert("Failed to access webcam. Check permissions.");
                setIsWebcamActive(false);
              }}
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold drop-shadow-md">
                Recording
              </span>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <p className="text-gray-700 dark:text-gray-300 text-lg text-center">
            Position yourself in front of the camera.
            <br />
            Press{" "}
            <span className="font-semibold text-cyan-700 dark:text-cyan-500">
              space
            </span>{" "}
            to capture an image,{" "}
            <span className="font-semibold text-cyan-700 dark:text-cyan-500">
              q
            </span>{" "}
            to save and quit.
            <br />
            Captured:{" "}
            <span className="font-semibold text-cyan-700 dark:text-cyan-500">
              {count}/{NUM_IMAGES}
            </span>
            <br />
            Next image:{" "}
            <span className="font-semibold text-cyan-700 dark:text-cyan-500">
              {name ? `${name}_${startIndex + count + 1}.jpg` : "N/A"}
            </span>
          </p>
        </div>
      )}
      {/* Debug Overlay */}
      <div className="mt-4 w-full max-w-lg bg-gray-800 text-gray-300 p-4 rounded-md shadow-md">
        <h3 className="text-sm font-semibold text-gray-400">Debug Log</h3>
        <ul className="text-xs space-y-1 mt-2">
          {debugLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
