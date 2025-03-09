// Fetch the list of test images
export const fetchTestImages = async () => {
  const testImages = [
    { src: "/test_set/image_withPerson_1.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_2.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_3.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_4.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_5.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_6.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_7.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_8.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_9.jpg", hasPerson: true },
    { src: "/test_set/image_withPerson_10.jpg", hasPerson: true },
    { src: "/test_set/image_noPerson_1.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_2.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_3.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_4.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_5.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_6.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_7.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_8.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_9.jpg", hasPerson: false },
    { src: "/test_set/image_noPerson_10.jpg", hasPerson: false },
  ];
  console.log("Fetched test images:", testImages);
  return testImages;
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
