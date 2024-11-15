"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useToast } from "@/hooks/use-toast";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const [personName, setPersonName] = useState("");
  const [capturing, setCapturing] = useState(false);
  const captureLimit = 250; // Updated to capture 250 images
  const { toast } = useToast();

  // Function to capture image from Webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setImages((prev) => [...prev, imageSrc]);
    }
  };

  // Start automatic capture of images
  const startAutoCapture = () => {
    setImages([]); // Reset images
    setCapturing(true); // Set capturing state

    let count = 0;
    const interval = setInterval(() => {
      if (count < captureLimit) {
        captureImage();
        count += 1;
      } else {
        clearInterval(interval); // Stop capturing after reaching the limit
        setCapturing(false);
      }
    }, 250); // Capture every 500ms (adjust as needed)
  };

  // Submit images to the server
  const submitImages = async () => {
    if (!personName) {
      alert("Please enter a name before uploading images.");
      return;
    }

    console.log("Uploading images:", images);
    try {
      const response = await fetch("/api/upload-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, name: personName }),
      });
      const result = await response.json();
      console.log("Upload result:", result);
      toast({
        title: "Photos Saved",
        description: "Data Training is ready!",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="flex flex-col my-4 items-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter person's name"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-center placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          className="w-full"
          videoConstraints={{
            facingMode: "user",
          }}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={startAutoCapture}
          disabled={capturing}
          className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 ${
            capturing ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {capturing ? "Capturing..." : "Start Capture"}
        </button>
        <button
          onClick={submitImages}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Upload All Photos
        </button>
      </div>

      <p className="mt-4">
        Captured {images.length}/{captureLimit} images
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Captured ${index}`}
            className="w-full h-auto border border-gray-200 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default WebcamCapture;
