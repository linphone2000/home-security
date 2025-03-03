"use client";

import { useState, useRef, useEffect } from "react";
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
    if (mode === "object") {
      personCountRef.current += 1;
      noPersonCountRef.current = 0;

      if (personCountRef.current >= PERSON_THRESHOLD) {
        setMode("face");
        resetCounts();
        setSwitching(true);
      }
    }
  };

  // Handle switching back to object detection
  const handleNoFaceDetected = () => {
    if (mode === "face") {
      noPersonCountRef.current += 1;
      personCountRef.current = 0;

      if (noPersonCountRef.current >= NO_PERSON_THRESHOLD) {
        setMode("object");
        resetCounts();
        setSwitching(true);
      }
    }
  };

  // Cooldown to prevent immediate switching back and forth
  useEffect(() => {
    if (switching) {
      const cooldown = setTimeout(() => {
        setSwitching(false);
      }, 500);
      return () => clearTimeout(cooldown);
    }
  }, [switching]);

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
        node.nodeValue = ""; // Hide the semicolon
      }
    };
    removeSemicolonTextNodes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {mode === "object" ? "Object Detection" : "Face Recognition"}
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
