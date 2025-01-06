"use client";

import React, { useState, useRef, useEffect } from "react";
import ObjectDetection from "./ObjectDetection";
import FaceRecognition from "./FaceRecognition";

export default function WebcamCapture() {
  const [mode, setMode] = useState("object");
  const [switching, setSwitching] = useState(false);
  const personCountRef = useRef(0);
  const noPersonCountRef = useRef(0);

  const PERSON_THRESHOLD = 5;
  const NO_PERSON_THRESHOLD = 5;

  const resetCounts = () => {
    personCountRef.current = 0;
    noPersonCountRef.current = 0;
  };

  // Handle switching to face recognition
  const handlePersonDetected = () => {
    if (mode === "object" && !switching) {
      personCountRef.current += 1;
      noPersonCountRef.current = 0;
      if (personCountRef.current >= PERSON_THRESHOLD) {
        setSwitching(true);
        setMode("face");
        resetCounts();
      }
    }
    setSwitching(false);
  };

  // Handle switching back to object detection
  const handleNoFaceDetected = () => {
    console.log(mode);
    console.log(switching);
    if (mode === "face" && !switching) {
      noPersonCountRef.current += 1;
      personCountRef.current = 0;
      if (noPersonCountRef.current >= NO_PERSON_THRESHOLD) {
        console.log("Switching back to object detection");
        setSwitching(true);
        setMode("object");
        resetCounts();
      }
    }
    setSwitching(false);
  };

  // Reset the switching state after a brief cooldown
  useEffect(() => {
    if (switching) {
      const cooldown = setTimeout(() => {
        setSwitching(false);
      }, 500);
      return () => clearTimeout(cooldown);
    }
  }, [switching]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {mode === "object"
          ? "Object Detection"
          : mode === "face"
          ? "Face Recognition"
          : "Loading..."}
      </h1>

      <div className="flex justify-center items-center w-full max-w-screen-lg">
        {mode === "object" && (
          <ObjectDetection onPersonDetected={handlePersonDetected} />
        )}
        {mode === "face" && (
          <FaceRecognition
            MODEL_URL="/models"
            onNoFaceDetected={handleNoFaceDetected}
          />
        )}
      </div>
    </div>
  );
}
