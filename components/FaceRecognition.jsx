"use client";
// React
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Rings } from "react-loader-spinner";
// FaceAPI
import * as faceapi from "face-api.js/dist/face-api.min.js";
import { drawFaceDetections } from "@/lib/drawFace";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const FaceRecognition = () => {
  // Models
  const MODEL_URL = "/models";

  // Refs for face recognition
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionLoopRef = useRef(null);

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

  // Initialize models and data for face recognition
  useEffect(() => {
    const loadModelsAndData = async () => {
      try {
        // Load the Tiny Face Detector, Face Landmark 68 Net, and Face Recognition Net
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        // Load labeled images and create face matcher
        const labeledFaceDescriptors = await loadLabeledImages();
        if (labeledFaceDescriptors.length === 0) {
          console.warn("No labeled face descriptors found.");
          return;
        }
        faceMatcherRef.current = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.45 // Similarity threshold
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

    // Cleanup on unmount
    return () => {
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
      }
      faceapi.nets.tinyFaceDetector.dispose();
      faceapi.nets.faceLandmark68Net.dispose();
      faceapi.nets.faceRecognitionNet.dispose();
      console.log("Face API resources disposed");
    };
  }, []);

  // Function to start face detection and recognition
  const startDetection = () => {
    const video = webcamRef.current ? webcamRef.current.video : null;

    // Ensure the video is ready
    if (video && video.readyState === 4) {
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
          if (canvas) {
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, videoWidth, videoHeight);

            // Use utility function to draw detections
            if (faceMatcherRef.current && resizedDetections.length > 0) {
              drawFaceDetections(
                resizedDetections,
                context,
                faceMatcherRef.current
              );
            }
          }

          // Continue the loop for the next frame
          detectionLoopRef.current = requestAnimationFrame(faceDetectionLoop);
        }
      };
      detectionLoopRef.current = requestAnimationFrame(faceDetectionLoop);
    } else {
      // Retry if the video is not ready
      setTimeout(startDetection, 100);
    }
  };

  return (
    <div className="my-4 items-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg mx-auto">
      <div className="flex space-x-4 mb-4">
        {/* Face Recognition */}
        <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden flex-1">
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

        {/* <ObjectDetection /> */}
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

export default FaceRecognition;
