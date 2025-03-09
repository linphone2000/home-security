"use client";

import { useState, useRef, useEffect } from "react";
import ObjectDetection from "./ObjectDetection";
import FaceRecognition from "./FaceRecognition";

export default function WebcamCapture() {
  const [mode, setMode] = useState("object");
  const [switching, setSwitching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
    if (mode === "object") {
      personCountRef.current += 1;
      noPersonCountRef.current = 0;

      if (personCountRef.current >= PERSON_THRESHOLD) {
        setSwitching(true);
        setMode("face");
        resetCounts();
      }
    }
  };

  // Handle switching back to object detection
  const handleNoFaceDetected = () => {
    if (mode === "face") {
      noPersonCountRef.current += 1;
      personCountRef.current = 0;

      if (noPersonCountRef.current >= NO_PERSON_THRESHOLD) {
        setSwitching(true);
        setMode("object");
        resetCounts();
      }
    }
  };

  // Cooldown for switching and initialization
  useEffect(() => {
    if (switching || isInitializing) {
      const cooldown = setTimeout(() => {
        setSwitching(false);
        setIsInitializing(false); 
      }, 500); // 500ms cooldown
      return () => clearTimeout(cooldown);
    }
  }, [switching, isInitializing]);

  // Remove semicolons from the page
  useEffect(() => {
    const removeSemicolonTextNodes = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            node.nodeValue.trim() === ";"
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        node.nodeValue = "";
      }
    };
    removeSemicolonTextNodes();
  }, []);

  // Determine the current message to display
  const getMessage = () => {
    if (isInitializing) {
      return mode === "object"
        ? "Initializing Object Detection..."
        : "Initializing Face Recognition...";
    }
    if (switching) {
      return mode === "face"
        ? "Switching to Face Recognition..."
        : "Switching to Object Detection...";
    }
    return mode === "object" ? "Object Detection" : "Face Recognition";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900">
      <h1
        className={`text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 transition-opacity duration-300 ${
          switching || isInitializing ? "opacity-75" : "opacity-100"
        }`}
      >
        {getMessage()}
      </h1>
      <div className="flex justify-center items-center w-full max-w-screen-lg">
        {isInitializing || switching ? (
          <div className="text-gray-600 dark:text-gray-400 animate-pulse">
            {getMessage()}
          </div>
        ) : mode === "object" ? (
          <ObjectDetection onPersonDetected={handlePersonDetected} />
        ) : (
          <FaceRecognition
            MODEL_URL="/models"
            onNoFaceDetected={handleNoFaceDetected}
          />
        )}
      </div>
    </div>
  );
}
