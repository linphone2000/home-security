"use client";

import React, { useRef, useState, useEffect } from "react";

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [images, setImages] = useState([]);
  const [personName, setPersonName] = useState("");
  const [mediaStream, setMediaStream] = useState(null);

  // Start video stream on component mount
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setMediaStream(stream);
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startVideo();

    // Cleanup video stream when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Capture image from the video stream
  const capture = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (videoRef.current && context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL("image/jpeg");
      setImages((prev) => [...prev, imageSrc]);
    }
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
        <video
          ref={videoRef}
          autoPlay
          width={400}
          height={300}
          className="w-full"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={capture}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Capture Photo
        </button>
        <button
          onClick={submitImages}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Upload All Photos
        </button>
      </div>

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
