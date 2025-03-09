// Fetch the list of test images from the API endpoint
export const fetchTestImages = async () => {
  try {
    const response = await fetch("/api/get-test-images-od");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch test images");
    }

    const testImages = await response.json();
    console.log("[UTILS] Fetched test images:", testImages);
    return testImages;
  } catch (error) {
    console.error("[UTILS] Error fetching test images:", error);
    return [];
  }
};

// Run object detection test on all images
export const runObjectDetectionTest = async (
  detector,
  testImages,
  setLoading
) => {
  const results = {
    total: 0,
    truePositives: 0,
    falseNegatives: 0,
    falsePositives: 0,
    trueNegatives: 0,
    processingTime: 0, // Total time in milliseconds
    imageDetails: [],
  };

  const totalImages = testImages.length;
  let completedImages = 0;

  for (const image of testImages) {
    try {
      const startTime = performance.now();
      const img = new Image();
      img.src = image.src;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error(`Image loading timed out for ${image.src}`);
          reject(new Error(`Image loading timed out for ${image.src}`));
        }, 10000); // 10 seconds timeout

        img.onload = () => {
          console.log(`Image loaded successfully: ${image.src}`);
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${image.src}`);
          clearTimeout(timeout);
          reject(new Error(`Image load failed for ${image.src}`));
        };
      });

      const predictions = await detector.detect(img);
      const endTime = performance.now();
      const processingTime = endTime - startTime; // Time in milliseconds

      const foundPerson = predictions.some(
        (pred) => pred.label.toLowerCase() === "person" && pred.confidence > 0.5
      );
      console.log(`Person detected in ${image.src}: ${foundPerson}`);

      const newDetails = {
        image: image.src,
        detected: foundPerson,
        expected: image.hasPerson,
        time: processingTime, // Store individual time in milliseconds
      };

      results.total += 1;
      if (image.hasPerson && foundPerson) results.truePositives += 1;
      if (image.hasPerson && !foundPerson) results.falseNegatives += 1;
      if (!image.hasPerson && foundPerson) results.falsePositives += 1;
      if (!image.hasPerson && !foundPerson) results.trueNegatives += 1;
      results.processingTime += processingTime; // Accumulate total time in milliseconds
      results.imageDetails.push(newDetails);

      completedImages += 1;
      const progress = (completedImages / totalImages) * 100;
      setLoading({ isLoading: true, progress });
    } catch (error) {
      console.error(`Error during detection for ${image.src}:`, error.message);
      results.total += 1;
      results.imageDetails.push({
        image: image.src,
        detected: null,
        expected: image.hasPerson,
        time: 0, // Failed images have 0 processing time
        error: error.message,
      });

      completedImages += 1;
      const progress = (completedImages / totalImages) * 100;
      setLoading({ isLoading: true, progress });
    }
  }

  setLoading({ isLoading: false, progress: 100 });
  return results;
};
