export const drawFaceDetections = (detections, ctx, faceMatcher) => {
  detections.forEach((detection) => {
    const box = detection.detection.box;

    // Validate that the box has valid values
    if (
      box.x == null ||
      box.y == null ||
      box.width == null ||
      box.height == null
    ) {
      return; // Skip detection
    }

    // Convert confidence score to percentage
    const confidence = Math.round(detection.detection.score * 100);

    // Perform face matching
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    // Custom styles for bounding box
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = bestMatch.label === "unknown" ? "red" : "lime"; // Red for unknown, lime for recognized
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Background for text
    ctx.fillStyle =
      bestMatch.label === "unknown"
        ? "rgba(255, 0, 0, 0.6)"
        : "rgba(0, 255, 0, 0.6)";
    const text = `${bestMatch.label} (${confidence}%)`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = 20;
    ctx.fillRect(box.x, box.y - textHeight - 5, textWidth + 10, textHeight);

    // Text label and confidence
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, box.x + 5, box.y - 10);
  });
};
