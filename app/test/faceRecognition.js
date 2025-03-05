import * as faceapi from "face-api.js/dist/face-api.min.js";

const MODEL_URL = "/models";

export const loadLabeledImages = async (labels) => {
  const labeledFaceDescriptors = await Promise.all(
    labels.map(async (label) => {
      try {
        const imgUrl = `/labeled_images/${label}/ref.jpg`;
        const img = await faceapi.fetchImage(imgUrl);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (!detection) {
          console.warn(`No face detected in reference image: ${imgUrl}`);
          return null;
        }
        return new faceapi.LabeledFaceDescriptors(label, [
          detection.descriptor,
        ]);
      } catch (error) {
        console.error(`Error loading reference for ${label}:`, error);
        return null;
      }
    })
  );
  return labeledFaceDescriptors.filter(Boolean);
};

export const runRecognitionTest = async (labels, testImages, setLoading) => {
  setLoading(true);

  console.log("Loading face-api.js models...");
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log("Models loaded successfully");

  const labeledFaceDescriptors = await loadLabeledImages(labels);
  if (labeledFaceDescriptors.length === 0) {
    console.warn("No valid labeled images found");
    setLoading(false);
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

  if (testImages.length === 0) {
    console.warn("No test images available to process");
    setLoading(false);
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
  for (const imageName of testImages) {
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
    }
  }

  testResults.processingTime = totalTime / 1000;
  console.log("Test results:", testResults);
  setLoading(false);
  return testResults;
};
