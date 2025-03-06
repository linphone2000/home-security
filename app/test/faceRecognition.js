import * as faceapi from "face-api.js/dist/face-api.min.js";

const MODEL_URL = "/models";

export const loadLabeledImages = async (labels, setProgress) => {
  const labeledFaceDescriptors = [];
  const increment = 10 / (labels.length || 1); // Avoid division by zero
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    try {
      const imgUrl = `/labeled_images/${label}/ref.jpg`;
      const img = await faceapi.fetchImage(imgUrl);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        console.warn(`No face detected in reference image: ${imgUrl}`);
      } else {
        labeledFaceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(label, [detection.descriptor])
        );
      }
      setProgress((prev) => {
        const newProgress = Math.min(prev + increment, 70); // Cap at 70% until test images
        console.log(
          `Reference image ${i + 1}/${labels.length}, Progress: ${newProgress}%`
        );
        return newProgress;
      });
    } catch (error) {
      console.error(`Error loading reference for ${label}:`, error);
      setProgress((prev) => prev + increment); // Still increment on error
    }
  }
  return labeledFaceDescriptors;
};

export const runRecognitionTest = async (labels, testImages, setLoading) => {
  setLoading({ isLoading: true, progress: 0 });
  console.log("Starting at 0%");

  console.log("Loading face-api.js models...");
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  setLoading({ isLoading: true, progress: 20 });
  console.log("tinyFaceDetector loaded, Progress: 20%");

  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  setLoading({ isLoading: true, progress: 40 });
  console.log("faceLandmark68Net loaded, Progress: 40%");

  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  setLoading({ isLoading: true, progress: 60 });
  console.log("faceRecognitionNet loaded, Progress: 60%");

  const labeledFaceDescriptors = await loadLabeledImages(labels, (progress) =>
    setLoading((prev) => ({
      isLoading: true,
      progress: Math.min(progress, 70),
    }))
  );
  if (labeledFaceDescriptors.length === 0) {
    console.warn("No valid labeled images found");
    setLoading({ isLoading: false, progress: 100 });
    return {
      total: 0,
      truePositives: 0,
      falseNegatives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      processingTime: 0,
      imageDetails: [],
    };
  }

  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.45);
  console.log("FaceMatcher initialized");
  setLoading({ isLoading: true, progress: 70 });
  console.log("Progress: 70%");

  if (testImages.length === 0) {
    console.warn("No test images available to process");
    setLoading({ isLoading: false, progress: 100 });
    return {
      total: 0,
      truePositives: 0,
      falseNegatives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      processingTime: 0,
      imageDetails: [],
    };
  }

  const testResults = {
    total: 0,
    truePositives: 0,
    falseNegatives: 0,
    falsePositives: 0,
    trueNegatives: 0,
    imageDetails: [],
  };
  let totalTime = 0;

  console.log(`Starting recognition for ${testImages.length} images...`);
  const progressPerImage = 30 / (testImages.length || 1); // Remaining 30% spread across images
  for (let i = 0; i < testImages.length; i++) {
    const imageName = testImages[i];
    const trueLabel = imageName.split("_")[0];
    const imgUrl = `/test_images/${imageName}`;
    const isKnown = labels.includes(trueLabel);

    try {
      const startTime = performance.now();
      const img = await faceapi.fetchImage(imgUrl);

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      let predictedLabel = "unknown";
      let isCorrect = false;

      if (detection) {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        predictedLabel = bestMatch.label;

        testResults.total++;
        if (isKnown) {
          if (predictedLabel === trueLabel) {
            testResults.truePositives++;
            isCorrect = true;
            console.log(`${imageName}: True Positive (${trueLabel})`);
          } else if (predictedLabel === "unknown") {
            testResults.falseNegatives++;
            console.log(`${imageName}: False Negative (True: ${trueLabel})`);
          } else {
            testResults.falsePositives++;
            console.log(
              `${imageName}: False Positive (Predicted: ${predictedLabel}, True: ${trueLabel})`
            );
          }
        } else {
          if (predictedLabel === "unknown") {
            testResults.trueNegatives++;
            isCorrect = true;
            console.log(
              `${imageName}: True Negative (Unknown correctly identified)`
            );
          } else {
            testResults.falsePositives++;
            console.log(
              `${imageName}: False Positive (Predicted: ${predictedLabel}, True: ${trueLabel})`
            );
          }
        }
      } else {
        testResults.total++;
        if (isKnown) {
          testResults.falseNegatives++;
          console.log(
            `${imageName}: False Negative (No face detected, True: ${trueLabel})`
          );
        } else {
          testResults.trueNegatives++;
          isCorrect = true;
          console.log(
            `${imageName}: True Negative (No face detected for unknown)`
          );
        }
      }

      testResults.imageDetails.push({
        filename: imageName,
        trueLabel,
        predictedLabel,
        isCorrect,
      });

      totalTime += performance.now() - startTime;
      setLoading((prev) => {
        const newProgress = Math.min(70 + (i + 1) * progressPerImage, 100);
        console.log(
          `Test image ${i + 1}/${testImages.length}, Progress: ${newProgress}%`
        );
        return { isLoading: true, progress: newProgress };
      });
    } catch (error) {
      console.error(`Error processing ${imgUrl}:`, error);
      testResults.total++;
      if (isKnown) {
        testResults.falseNegatives++;
      } else {
        testResults.trueNegatives++;
      }
      testResults.imageDetails.push({
        filename: imageName,
        trueLabel,
        predictedLabel: "unknown",
        isCorrect: !isKnown,
      });
      setLoading((prev) => {
        const newProgress = Math.min(70 + (i + 1) * progressPerImage, 100);
        console.log(
          `Test image ${i + 1}/${
            testImages.length
          } (error), Progress: ${newProgress}%`
        );
        return { isLoading: true, progress: newProgress };
      });
    }
  }

  testResults.processingTime = totalTime / 1000;
  console.log("Test results:", testResults);
  setLoading({ isLoading: false, progress: 100 });
  return testResults;
};
