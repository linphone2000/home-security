"use client";

import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

const WebcamCapture2 = () => {
  const webcamElementRef = useRef(null);
  const canvasElementRef = useRef(null);
  const [faceData, setFaceData] = useState([]);

  // Load FaceMesh model and start detection
  const startFacialRecognition = async () => {
    console.log("Starting face recognition");
    const video = webcamElementRef.current;
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "mediapipe", // or 'tfjs'
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    };
    const detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
    const faces = await detector.estimateFaces(video);
    setFaceData(faces); // Save face data to state
  };

  // Function to save facial data (console log for now)
  const saveFacialData = () => {
    console.log("Facial data saved:", faceData);
  };

  // Start the facial recognition when the component mounts
  useEffect(() => {
    // Start webcam video stream
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (webcamElementRef.current) {
          webcamElementRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startVideo();

    // Start facial recognition after video stream is set
    startFacialRecognition();

    return () => {
      // Cleanup stream on unmount
      if (webcamElementRef.current && webcamElementRef.current.srcObject) {
        const stream = webcamElementRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Webcam video element */}
      <video
        ref={webcamElementRef}
        autoPlay
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
      />
      {/* Canvas element for face landmarks */}
      <canvas
        ref={canvasElementRef}
        className="absolute top-0 left-0 w-full h-full z-20"
      />
      {/* Button to save facial data */}
      <button
        onClick={saveFacialData}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 z-30"
      >
        Save Facial Data
      </button>
    </div>
  );
};

export default WebcamCapture2;
