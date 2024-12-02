"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as faceapi from "face-api.js/dist/face-api.min.js";
import { Rings } from "react-loader-spinner";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const MODEL_URL = "/models";

  // Face Matcher reference
  const faceMatcherRef = useRef(null);

  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Load labeled images and create face matcher
  const loadLabeledImages = async () => {
    const labels = ["ACM", "AKP", "EEHS", "LP"];
    const labeledFaceDescriptors = await Promise.all(
      labels.map(async (label) => {
        try {
          const imgUrl = `/labeled_images/${label}/ref.jpg`;
          const img = await faceapi.fetchImage(imgUrl);
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection && detection.descriptor) {
            return new faceapi.LabeledFaceDescriptors(label, [
              detection.descriptor,
            ]);
          } else {
            console.warn(`No face detected for ${label}`);
            return null;
          }
        } catch (error) {
          console.error(`Error loading image for ${label}:`, error);
          return null;
        }
      })
    );

    // Filter out any null entries (failed detections)
    return labeledFaceDescriptors.filter((descriptor) => descriptor !== null);
  };

  // Initialize models and data
  useEffect(() => {
    const loadModelsAndData = async () => {
      try {
        // Load only the Tiny Face Detector, Face Landmark 68 Net, and Face Recognition Net
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("Face recognition models loaded");

        // Load labeled images and create face matcher
        const labeledFaceDescriptors = await loadLabeledImages();
        if (labeledFaceDescriptors.length === 0) {
          console.warn("No labeled face descriptors found.");
          return;
        }
        faceMatcherRef.current = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.4 // Similarity threshold
        );
        console.log("Face Matcher initialized");

        // Start the face detection and recognition process
        startDetection();
      } catch (error) {
        console.error("Error loading models or labeled images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModelsAndData();
  }, []);

  // Function to start face detection and recognition
  const startDetection = () => {
    const video = webcamRef.current.video;

    // Ensure the video is ready
    if (video.readyState === 4) {
      // Set video and canvas dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Begin the detection loop
      const faceDetectionLoop = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          const detections = await faceapi
            .detectAllFaces(
              webcamRef.current.video,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceDescriptors();

          // Resize detections to match video dimensions
          const resizedDetections = faceapi.resizeResults(detections, {
            width: videoWidth,
            height: videoHeight,
          });

          // Clear the previous canvas drawings
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, videoWidth, videoHeight);

          // Perform face matching and draw results
          if (faceMatcherRef.current && resizedDetections.length > 0) {
            const results = resizedDetections.map((d) =>
              faceMatcherRef.current.findBestMatch(d.descriptor)
            );

            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box;
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: result.toString(),
              });
              drawBox.draw(canvas);
            });
          }

          // Continue the loop for the next frame
          requestAnimationFrame(faceDetectionLoop);
        } else {
          // Retry if the video is not ready
          setTimeout(startDetection, 100);
        }
      };

      faceDetectionLoop();
    } else {
      // Retry if the video is not ready
      setTimeout(startDetection, 100);
    }
  };

  return (
    <div className="flex flex-col my-4 items-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      {/* Webcam Preview with Canvas Overlay */}
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full"
          videoConstraints={{
            facingMode: "user",
          }}
        />
        {/* Canvas for drawing face detections */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center">
          <Rings height="80" width="80" color="#4fa94d" ariaLabel="loading" />
          <span className="ml-4 text-white">Loading Models...</span>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
