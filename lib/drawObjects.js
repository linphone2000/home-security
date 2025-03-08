export function drawOnCanvas(predictions, ctx) {
  predictions.forEach((detectedObject) => {
    const { label: name, confidence, x, y, width, height } = detectedObject;

    if (ctx) {
      // Start drawing
      ctx.beginPath();

      // Style for the bounding box (rounded corners)
      ctx.lineWidth = 3; // Border width
      ctx.strokeStyle = name === "person" ? "#FF6F61" : "#4CAF50"; // Soft red for person, green for others
      ctx.globalAlpha = 0.85; // Slightly more opaque for a clean, polished look

      // Draw rounded rectangle (bounding box with rounded corners)
      ctx.lineJoin = "round"; // Rounded corners
      ctx.lineCap = "round"; // Rounded edges for lines
      ctx.rect(x, y, width, height); // Bounding box
      ctx.stroke(); // Apply border

      // Apply shadow effect to make the box stand out
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Subtle shadow
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.shadowBlur = 8;

      // Draw the label and confidence text
      ctx.font = "bold 16px Arial"; // Bold text for better visibility
      ctx.fillStyle = "white"; // White text for contrast
      ctx.globalAlpha = 1; // Full opacity for text

      const confidenceText = `${Math.round(confidence * 100)}%`; // Confidence as percentage
      const textX = x + 10; // X position for text
      const textY = y + 24; // Y position for text

      // Draw the label
      ctx.fillText(name, textX, textY);

      // Draw the confidence score below the label
      ctx.fillText(`Confidence: ${confidenceText}`, textX, textY + 20);

      // Reset shadow effect for any subsequent drawings
      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }
  });
}
