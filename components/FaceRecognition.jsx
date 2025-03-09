"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js/dist/face-api.min.js";
import Webcam from "react-webcam";
import { drawFaceDetections } from "@/lib/drawFace";
import DetectionWrapper from "./DetectionWrapper";
import emailjs from "@emailjs/browser";

export default function FaceRecognition({ MODEL_URL, onNoFaceDetected }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMatcherRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const noFaceCountRef = useRef(0);
  const strangerCountRef = useRef(0);
  const emailCooldownRef = useRef(false);

  const NO_FACE_THRESHOLD = 200;
  const STRANGER_THRESHOLD = 150; // 5 seconds at 30 FPS
  const EMAIL_COOLDOWN = 300; // 10 seconds cooldown at 30 FPS

  // Fetch labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("/api/labels");
        const data = await response.json();
        setLabels(data.map((item) => item.label));
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);
  console.log(labels);

  // Load labeled images for face recognition
  const loadLabeledImages = async () => {
    const labeledFaceDescriptors = await Promise.all(
      labels.map(async (label) => {
        try {
          const imgUrl = `/labeled_images/${label}/ref.jpg`;
          const img = await faceapi.fetchImage(imgUrl);
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          return detection?.descriptor
            ? new faceapi.LabeledFaceDescriptors(label, [detection.descriptor])
            : null;
        } catch (error) {
          console.error(`Error loading ${label}:`, error);
          return null;
        }
      })
    );

    return labeledFaceDescriptors.filter(Boolean);
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
          console.warn("No labeled images found");
          setLoading(false);
          return;
        }

        faceMatcherRef.current = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.45
        );

        setLoading(false);
        startDetection();
      } catch (error) {
        console.error("Error initializing:", error);
        setLoading(false);
      }
    };

    if (labels.length > 0) {
      loadModelsAndData();
    }
  }, [MODEL_URL, labels]);

  // Send email function
  const sendEmail = () => {
    const emailData = {
      name: "System Alert",
      email: "linphonem@gmail.com",
      subject: "Stranger Detected",
      message: "A stranger has been detected for more than 5 seconds.",
    };

    emailjs
      .send(
        "service_q74zcaq",
        "template_gntrvbi",
        emailData,
        "kQjJEVl8JnnnVr94r"
      )
      .then(
        () => console.log("Email sent: Stranger detected"),
        (error) => console.error("EmailJS error:", error)
      );

    // Start cooldown
    emailCooldownRef.current = true;
    setTimeout(() => {
      emailCooldownRef.current = false;
    }, (EMAIL_COOLDOWN * 1000) / 30); // Convert frames to milliseconds (~30 FPS)
  };

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

            // Check for unknown faces
            let hasStranger = false;
            resizedDetections.forEach((detection) => {
              const bestMatch = faceMatcherRef.current.findBestMatch(
                detection.descriptor
              );
              if (bestMatch.label === "unknown") {
                hasStranger = true;
              }
            });
            if (hasStranger) {
              strangerCountRef.current++;
              if (strangerCountRef.current >= STRANGER_THRESHOLD) {
                sendEmail();
                strangerCountRef.current = 0; // Reset after sending
              }
            } else {
              strangerCountRef.current = 0; // Reset if no stranger
            }

            drawFaceDetections(resizedDetections, ctx, faceMatcherRef.current);
          } else {
            strangerCountRef.current = 0; // Reset if no face matcher
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
    return <p className="">Loading Face Recognition...</p>;
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
