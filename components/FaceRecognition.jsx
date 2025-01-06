"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js/dist/face-api.min.js";
import Webcam from "react-webcam";
import { drawFaceDetections } from "@/lib/drawFace";
import DetectionWrapper from "./DetectionWrapper";

export default function FaceRecognition({ MODEL_URL, onNoFaceDetected }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMatcherRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const noFaceCountRef = useRef(0);
  const NO_FACE_THRESHOLD = 100;

  // Load labeled images for face recognition
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

    return labeledFaceDescriptors.filter((descriptor) => descriptor !== null);
  };

  // Initialize Face API models
  useEffect(() => {
    const loadModelsAndData = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        const labeledFaceDescriptors = await loadLabeledImages();
        if (labeledFaceDescriptors.length === 0) {
          console.warn("No labeled face descriptors found.");
          setLoading(false);
          return;
        }
        faceMatcherRef.current = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.45
        );

        console.log("Face Matcher initialized");
        setLoading(false);

        startDetection();
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setLoading(false);
      }
    };

    loadModelsAndData();
  }, [MODEL_URL]);

  // Start face detection
  const startDetection = () => {
    const video = webcamRef.current?.video;
    if (video && video.readyState === 4) {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const faceLoop = async () => {
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

          const resizedDetections = faceapi.resizeResults(detections, {
            width: videoWidth,
            height: videoHeight,
          });

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, videoWidth, videoHeight);

          if (faceMatcherRef.current && resizedDetections.length > 0) {
            noFaceCountRef.current = 0;
            drawFaceDetections(resizedDetections, ctx, faceMatcherRef.current);
          } else {
            noFaceCountRef.current++;
            if (
              onNoFaceDetected &&
              noFaceCountRef.current >= NO_FACE_THRESHOLD
            ) {
              console.log("No face detected for a while");
              onNoFaceDetected();
            }
          }

          requestAnimationFrame(faceLoop);
        } else {
          setTimeout(startDetection, 100);
        }
      };

      faceLoop();
    } else {
      setTimeout(startDetection, 100);
    }
  };

  // Loading state
  if (loading) {
    return <p className="text-white">Loading Face Recognition...</p>;
  }

  return (
    <DetectionWrapper>
      <div className="relative w-[640px] h-[480px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </DetectionWrapper>
  );
}
