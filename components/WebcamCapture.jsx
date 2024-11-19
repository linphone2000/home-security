"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import * as faceapi from "face-api.js";

// Dynamically import Webcam to avoid SSR issues
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const MODEL_URL = "/models";

  // Face Matcher variable
  const faceMatcherRef = useRef(null);

  // Load labeled images and create face matcher
  const loadLabeledImages = async () => {
    const labels = ["ACM", "AKP", "EEHS", "LP"];
    return Promise.all(
      labels.map(async (label) => {
        try {
          const imgUrl = `/labeled_images/${label}/ref.jpg`;
          const img = await faceapi.fetchImage(imgUrl);
          const detection = await faceapi
            .detectSingleFace(img)
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
    ).then((labeledFaceDescriptors) => {
      // Filter out null entries
      return labeledFaceDescriptors.filter((descriptor) => descriptor !== null);
    });
  };

  // Loading face recognition models and labeled images
  useEffect(() => {
    const loadModelsAndData = async () => {
      try {
        // Load the necessary models
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded");

        // Load labeled images and create face matcher
        const labeledFaceDescriptors = await loadLabeledImages();
        if (labeledFaceDescriptors.length === 0) {
          console.warn("No labeled face descriptors found.");
          return;
        }
        faceMatcherRef.current = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.4
        );
        console.log("Face Matcher ready");

        // Start video processing after models and data are loaded
        startDetection();
      } catch (error) {
        console.error("Error loading models or labeled images:", error);
      }
    };
    loadModelsAndData();
  }, []);

  // Starting recognition
  const startDetection = () => {
    // Ensure the video is ready
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      // Get the video properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Start face detection
      const faceDetection = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;

          // Detect faces with options
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          // Match the dimensions of the video and canvas
          const resizedDetections = faceapi.resizeResults(detections, {
            width: videoWidth,
            height: videoHeight,
          });

          // Clear the canvas before drawing
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, videoWidth, videoHeight);

          // Recognize faces and draw boxes with labels
          if (faceMatcherRef.current && resizedDetections.length > 0) {
            const results = resizedDetections.map((d) =>
              faceMatcherRef.current.findBestMatch(d.descriptor)
            );

            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box;
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: result.toString(),
              });
              drawBox.draw(canvasRef.current);
            });
          }

          // Continue the loop
          requestAnimationFrame(faceDetection);
        } else {
          // Retry if the video is not ready
          setTimeout(startDetection, 100);
        }
      };

      // Start the face detection loop
      faceDetection();
    } else {
      // Retry if the video is not ready
      setTimeout(startDetection, 100);
    }
  };

  return (
    <div className="flex flex-col my-4 items-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      {/* Webcam Preview with Canvas Overlay */}
      <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
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
    </div>
  );
};

export default WebcamCapture;
