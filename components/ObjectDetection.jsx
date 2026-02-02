"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { drawOnCanvas } from "@/lib/drawObjects";
import DetectionWrapper from "./DetectionWrapper";

let detector = null;

export default function ObjectDetection({ onPersonDetected }) {
  const [loading, setLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [objectDetectionModel, setObjectDetectionModel] = useState(null);

  const webcamRefObj = useRef(null);
  const canvasRefObj = useRef(null);
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);
  const fps = useRef(0);
  const animationFrameId = useRef(null);

  // Dynamically load ml5.js
  useEffect(() => {
    const loadScripts = () => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/ml5@0.7.1/dist/ml5.min.js";
      script.async = true;
      script.onload = () => checkScriptsLoaded();
      document.body.appendChild(script);
    };

    const checkScriptsLoaded = () => {
      if (typeof ml5 !== "undefined") {
        setScriptsLoaded(true);
      }
    };

    loadScripts();
    return () => {
      const script = document.querySelector(
        `script[src="https://unpkg.com/ml5@0.7.1/dist/ml5.min.js"]`
      );
      if (script) script.remove();
    };
  }, []);

  // Load the object detection model after scripts
  useEffect(() => {
    if (scriptsLoaded) {
      setLoading(true);
      detector = ml5.objectDetector("cocossd", () => {
        setObjectDetectionModel(detector);
        setLoading(false);
      });
    }
  }, [scriptsLoaded]);

  // Resize canvas to match the webcam
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRefObj.current;
    const video = webcamRefObj.current?.video;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, []);

  // Calculate FPS
  const calculateFps = useCallback((now) => {
    frameCount.current += 1;
    const elapsed = now - lastFrameTime.current;

    if (elapsed > 1000) {
      // Update FPS every 1 second
      fps.current = Math.round((frameCount.current * 1000) / elapsed);
      frameCount.current = 0;
      lastFrameTime.current = now;
    }
  }, []);

  // Run object detection and render
  const runPredictions = useCallback(
    async (timestamp) => {
      if (
        objectDetectionModel &&
        webcamRefObj.current &&
        webcamRefObj.current.video.readyState === 4
      ) {
        const startTime = performance.now(); // Start timing
        const predictions = await objectDetectionModel.detect(
          webcamRefObj.current.video
        );
        resizeCanvas();
        const ctx = canvasRefObj.current.getContext("2d");
        ctx.clearRect(
          0,
          0,
          canvasRefObj.current.width,
          canvasRefObj.current.height
        );

        // Draw bounding boxes and confidence scores
        drawOnCanvas(predictions, ctx);

        // Draw FPS on the canvas
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`FPS: ${fps.current}`, 10, 30);

        // Calculate FPS
        calculateFps(timestamp);

        const endTime = performance.now(); // End timing
        const processTime = endTime - startTime; // Calculate processing time
        console.log(`Processing Time: ${processTime.toFixed(2)}ms`); // Log processing time

        const foundPerson = predictions.some(
          (pred) => pred.label.toLowerCase() === "person"
        );
        if (foundPerson) {
          onPersonDetected();
        }
      }
      animationFrameId.current = requestAnimationFrame(runPredictions);
    },
    [calculateFps, objectDetectionModel, onPersonDetected, resizeCanvas]
  );

  // Start detection loop
  useEffect(() => {
    if (objectDetectionModel) {
      animationFrameId.current = requestAnimationFrame(runPredictions);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [objectDetectionModel, runPredictions]);

  if (loading) {
    return <p className="text-black">Loading Object Detection...</p>;
  }

  return (
    <DetectionWrapper>
      <div className="relative w-[640px] h-[480px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRefObj}
          audio={false}
          screenshotFormat="image/jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas
          ref={canvasRefObj}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </DetectionWrapper>
  );
}
