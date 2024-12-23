export function drawOnCanvas(predictions, ctx) {
  predictions.forEach((detectedObject) => {
    const { class: name, bbox, score } = detectedObject;
    const [x, y, width, height] = bbox;

    if (ctx) {
      ctx.beginPath();

      // Style for outline
      ctx.lineWidth = 2; // Set border width for the box
      ctx.strokeStyle = name === "person" ? "#FF0F0F" : "#00B612"; // Red for person, green for others
      ctx.globalAlpha = 0.7; // Set opacity of the border

      // Draw the outline (no fill, just a border)
      ctx.rect(x, y, width, height); // Normal box
      ctx.stroke(); // Apply the border

      // Text: class name and confidence score
      ctx.font = "12px Courier New";
      ctx.fillStyle = "white"; // Text color
      ctx.globalAlpha = 1;

      const confidenceText = `${Math.round(score * 100)}%`; // Confidence score as a percentage
      const textX = x + 10;
      const textY = y + 20;

      // Draw the class name and confidence score
      ctx.fillText(name, textX, textY);
      ctx.fillText(confidenceText, textX, textY + 15);
    }
  });
}
