"use client";
import React, { useEffect, useRef, useState } from "react";
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
  let interval = null;

  // Dynamically load p5.js + ml5.js
  useEffect(() => {
    const loadScripts = () => {
      const script2 = document.createElement("script");
      script2.src = "https://unpkg.com/ml5@0.7.1/dist/ml5.min.js";
      script2.async = true;
      script2.onload = () => checkScriptsLoaded();
      document.body.appendChild(script2);
    };

    const checkScriptsLoaded = () => {
      if (typeof ml5 !== "undefined") {
        setScriptsLoaded(true);
      }
    };

    loadScripts();
    return () => {
      document.body
        .querySelectorAll("script")
        .forEach((script) => script.remove());
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
  const resizeCanvas = () => {
    const canvas = canvasRefObj.current;
    const video = webcamRefObj.current?.video;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };

  // Periodically run object detection
  const runPredictions = async () => {
    if (
      objectDetectionModel &&
      webcamRefObj.current &&
      webcamRefObj.current.video.readyState === 4
    ) {
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

      drawOnCanvas(predictions, ctx);

      const foundPerson = predictions.some(
        (pred) => pred.label.toLowerCase() === "person"
      );
      if (foundPerson) {
        onPersonDetected();
      }
    }
  };

  //Start detection loop
  useEffect(() => {
    if (objectDetectionModel) {
      interval = setInterval(runPredictions, 200);
    }
    return () => clearInterval(interval);
  }, [objectDetectionModel]);

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
