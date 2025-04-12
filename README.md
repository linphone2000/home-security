# Intelligent Home Surveillance System

A real-time, browser-based surveillance system built with Next.js, integrating object detection and face recognition to distinguish between family members and strangers, with email alerts for enhanced security.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Custom Dataset](#custom-dataset)
- [Datasets](#datasets)
- [Models](#models)
- [Workflow](#workflow)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)

## Overview
The Intelligent Home Surveillance System is a web application that leverages machine learning to monitor environments in real-time. It uses object detection to identify "person" and other objects, then switches to face recognition to determine if detected individuals are family members or strangers. If a stranger is detected for more than 5 seconds, the system sends an email alert to the house owner. Designed for lightweight, browser-based operation, it’s scalable and efficient for home security.

## Features
- **Real-Time Processing**: Processes webcam feeds instantly in the browser.
- **Object Detection**: Detects 80+ object categories (e.g., "person") using COCO-SSD.
- **Face Recognition**: Identifies family vs. strangers with Faceapi.js (TinyFaceDetector, FaceLandmark68Net, FaceRecognitionNet).
- **Dynamic Component Switching**: Toggles between object detection and face recognition based on detections.
- **Email Alerts**: Sends notifications via EmailJS when a stranger is detected for >5 seconds (10-second cooldown).
- **Lightweight Design**: Optimized for web deployment, using pre-trained models (e.g., TinyFaceDetector at 190 KB).
- **Minimal Setup**: Requires only one image per person for face recognition.
- **Scalable**: Can expand to multi-camera setups with additional resources.

## Tech Stack
- **Framework**: Next.js (React-based JavaScript framework)
- **Object Detection**: ml5.js (COCO-SSD, TensorFlow.js-based)
- **Face Recognition**: Faceapi.js (TensorFlow.js-based)
- **Email Alerts**: EmailJS
- **Webcam**: React Webcam
- **Environment**: Node.js

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/linphone2000/home-security.git
   cd home-security
   ```

2. **Install Dependencies**:
   Ensure you have Node.js (v16 or later) installed. Then run:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set Up EmailJS**:
   - Create an EmailJS account and set up a service, template, and public key.
   - Update the `FaceRecognition` component with your EmailJS credentials:
     ```javascript
     emailjs.send("your_service_id", "your_template_id", emailData, "your_public_key")
     ```

4. **Prepare the Custom Dataset**:
   - Add reference images for family members in `public/labeled_images/<person_name>/ref.jpg` (see [Custom Dataset](#custom-dataset) for details).

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to view the app.

## Usage
1. **Start the App**:
   - Run the development server as described above.
   - Ensure your webcam is enabled; the app will request access.

2. **Monitor the Feed**:
   - The system starts in object detection mode, using COCO-SSD to scan for objects every 200ms.
   - If a "person" is detected for 5 frames, it switches to face recognition mode.

3. **Face Recognition**:
   - Faceapi.js detects faces, maps landmarks, and matches embeddings against your custom dataset.
   - Known faces are labeled (e.g., "Alice"); strangers trigger an email alert after 5 seconds.

4. **Switching Back**:
   - If no faces are detected for 200 frames, the system reverts to object detection, freeing up resources.


## Custom Dataset
- **Purpose**: Stores reference images for family members to generate face embeddings.
- **Structure**: Place one image per person in `public/labeled_images/<person_name>/ref.jpg`.
  - Example: `public/labeled_images/Alice/ref.jpg`
- **Usage**: The `FaceRecognition` component loads these images via `loadLabeledImages`, computes embeddings with FaceRecognitionNet, and stores them for real-time matching.
- **Scalability**: Add new family members by adding their image—no retraining needed.

## Datasets
The system leverages pre-trained models with the following datasets:
- **COCO-SSD**:
  - Dataset: COCO (Common Objects in Context)
  - Size: 330K+ images (~118K labeled for training)
  - Annotation: Bounding boxes + class labels for 80+ categories (e.g., "person", "car")
  - Source: Public, Microsoft COCO 2017; diverse scenes for object detection
- **TinyFaceDetector**:
  - Dataset: Custom Dataset
  - Size: ~14,000 images
  - Annotation: Bounding boxes covering facial features
  - Source: Faceapi.js custom, not public; optimized for speed and landmark synergy
- **FaceLandmark68Net**:
  - Dataset: Custom Dataset
  - Size: ~35,000 images
  - Annotation: 68 facial landmark points (eyes, nose, etc.)
  - Source: Faceapi.js custom, likely inspired by 300-W; tailored for efficiency
- **FaceRecognitionNet**:
  - Dataset: LFW (Labeled Faces in the Wild)
  - Size: ~13,000 images
  - Annotation: Identity labels for recognition (pairs for verification)
  - Source: Public, pre-trained by davisking; 99.38% LFW accuracy
- **Custom Dataset**:
  - Dataset: User-provided family member images
  - Structure: `public/labeled_images/<person_name>/ref.jpg`
  - Purpose: Generates embeddings for known individuals without retraining

## Models
- **Object Detection**:
  - **COCO-SSD**: Single Shot Detector (SSD) with MobileNetV1 backbone, ~5-6 MB, pre-trained on COCO dataset.
- **Face Detection and Recognition**:
  - **TinyFaceDetector**: Lightweight, single-shot (Tiny YOLO V2-based), 190 KB, for face localization.
  - **FaceLandmark68Net**: Efficient CNN, 350 KB, maps 68 facial landmarks for alignment.
  - **FaceRecognitionNet**: ResNet-34-like, 6.2 MB, generates 128D embeddings for recognition.

## Workflow
1. **Object Detection**:
   - COCO-SSD scans webcam feed every 200ms for objects.
   - If "person" is detected for 5 frames, switches to face recognition mode.
2. **Face Recognition**:
   - TinyFaceDetector locates faces with bounding boxes.
   - FaceLandmark68Net maps 68 landmarks for alignment and visualization.
   - FaceRecognitionNet generates 128D embeddings.
   - FaceMatcher compares embeddings (threshold 0.45) to label as family or stranger.
3. **Email Alerts**:
   - If a stranger is detected for >5 seconds, sends an email via EmailJS (10-second cooldown).
4. **Switch Back**:
   - If no faces are detected for 200 frames, reverts to object detection, freeing resources.

## Future Improvements
- Add support for multi-camera setups with stream selection.
- Implement voice mode for audio alerts (if available in your region).
- Enhance low-light performance with preprocessing (e.g., histogram equalization).
- Integrate with a backend for storing detection logs and history.

## Acknowledgements
- **ml5.js and Faceapi.js Teams**: For providing lightweight, pre-trained models for browser use.
- **EmailJS**: For enabling seamless email notifications.
- **Next.js Community**: For a robust framework and deployment support.
- **COCO and LFW Datasets**: For foundational training data enabling our models.
```