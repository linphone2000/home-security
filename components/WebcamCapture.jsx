"use client";
// React
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Rings } from "react-loader-spinner";
// FaceAPI
import * as faceapi from "face-api.js/dist/face-api.min.js";
import { drawFaceDetections } from "@/lib/drawFace";
// Utils
import { drawOnCanvas } from "@/lib/drawObjects";

// Detector for objects
let detector = null;

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const WebcamCapture = () => {
  // Models
  const MODEL_URL = "/models";

  // Refs for face recognition
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRefObj = useRef(null);
  const canvasRefObj = useRef(null);

  // Face Matcher reference
  const faceMatcherRef = useRef(null);

  // State to manage loading status
  const [loading, setLoading] = useState(true);
  const [objectDetectionModel, setObjectDetectionModel] = useState(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  let interval = null;

  // Dynamically load CDN scripts and ensure they are loaded
  useEffect(() => {
    const loadScripts = () => {
      const script1 = document.createElement("script");
      script1.src =
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js";
      script1.async = true;
      script1.onload = () => checkScriptsLoaded();
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://unpkg.com/ml5@0.7.1/dist/ml5.min.js";
      script2.async = true;
      script2.onload = () => checkScriptsLoaded();
      document.body.appendChild(script2);
    };

    const checkScriptsLoaded = () => {
      // Check if all scripts are loaded
      if (typeof ml5 !== "undefined" && typeof p5 !== "undefined") {
        setScriptsLoaded(true);
      }
    };

    loadScripts();

    // Cleanup: remove scripts when the component is unmounted
    return () => {
      document.body
        .querySelectorAll("script")
        .forEach((script) => script.remove());
    };
  }, []); // Empty dependency array ensures this only runs once

  // Initialize object detection model after scripts are loaded
  useEffect(() => {
    if (scriptsLoaded) {
      setLoading(true);
      detector = ml5.objectDetector("cocossd");
      setObjectDetectionModel(detector);
      setLoading(false);
    }
  }, [scriptsLoaded]);

  // Resize canvas to match webcam video dimensions
  const resizeCanvas = (canvasRefObj, webcamRefObj) => {
    const canvas = canvasRefObj.current;
    const video = webcamRefObj.current?.video;

    if (canvas && video) {
      const { videoWidth, videoHeight } = video;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }
  };

  // Run predictions periodically and log them
  const runPredictions = async () => {
    if (
      objectDetectionModel &&
      webcamRefObj.current &&
      webcamRefObj.current.video &&
      webcamRefObj.current.video.readyState === 4
    ) {
      const predictions = await objectDetectionModel.detect(
        webcamRefObj.current.video
      );
      resizeCanvas(canvasRefObj, webcamRefObj);
      drawOnCanvas(predictions, canvasRefObj.current.getContext("2d"));
    }
  };

  // Start detection loop after model is loaded
  useEffect(() => {
    if (objectDetectionModel) {
      interval = setInterval(runPredictions, 100);
    }
    return () => clearInterval(interval);
  }, [objectDetectionModel]);

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
    <div className="flex flex-col my-4 items-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg mx-auto">
      {/* Container for Webcam Previews */}
      <div className="flex space-x-4 mb-4 w-full">
        {/* First Webcam Preview with Canvas Overlay */}
        <div className="relative flex-1 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full"
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>

        {/* Second Webcam Preview with Canvas Overlay */}
        <div className="relative flex-1 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRefObj}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full"
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <canvas
            ref={canvasRefObj}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
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
