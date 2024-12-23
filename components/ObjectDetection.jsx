"use client";

// React
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
// Object Detection
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { Rings } from "react-loader-spinner";
import { drawOnCanvas } from "@/lib/drawObjects";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

let interval = null;

const resizeCanvas = (canvasRef, webcamRef) => {
  const canvas = canvasRef.current;
  const video = webcamRef.current?.video;

  if (canvas && video) {
    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
};

const ObjectDetection = () => {
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  const [objectDetectionModel, setObjectDetectionModel] = useState(null);

  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize object detection model
  const loadObjectDetectionModel = async () => {
    try {
      const loadedModel = await cocoSsd.load({
        base: "mobilenet_v2",
      });
      setObjectDetectionModel(loadedModel);
    } catch (error) {
      console.error("Error loading Mobilenet_v2:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run predictions on webcam feed
  const runPredictions = async () => {
    if (
      objectDetectionModel &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const predictions = await objectDetectionModel.detect(
        webcamRef.current.video
      );
      resizeCanvas(canvasRef, webcamRef);
      drawOnCanvas(predictions, canvasRef.current?.getContext("2d"));
    }
  };

  // Initial load of object detection model
  useEffect(() => {
    setLoading(true);
    loadObjectDetectionModel();
    // Cleanup function to release TensorFlow resources
    return () => {
      tf.disposeVariables(); // Dispose of TensorFlow.js variables
      console.log("TensorFlow resources disposed.");
    };
  }, []);

  // Start and clean up the interval for running predictions
  useEffect(() => {
    if (objectDetectionModel) {
      intervalRef.current = setInterval(runPredictions, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Prediction interval cleared.");
      }
    };
  }, [objectDetectionModel]);

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

export default ObjectDetection;
