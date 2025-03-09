// Calculate overall metrics
export const calculateMetrics = (results) => {
  const total = results.total || 1;
  const accuracy = (results.truePositives + results.trueNegatives) / total || 0;
  const precision =
    results.truePositives / (results.truePositives + results.falsePositives) ||
    0;
  const recall =
    results.truePositives / (results.truePositives + results.falseNegatives) ||
    0;
  const specificity =
    results.trueNegatives / (results.trueNegatives + results.falsePositives) ||
    0;
  const falseNegativeRate =
    results.falseNegatives / (results.falseNegatives + results.truePositives) ||
    0;
  const macroF1 = (2 * (precision * recall)) / (precision + recall) || 0;
  const avgTimePerImage = (results.processingTime / total || 0) / 1000; // Convert milliseconds to seconds

  return {
    accuracy,
    precision,
    recall,
    specificity,
    falseNegativeRate,
    macroF1,
    avgTimePerImage,
  };
};

// Calculate confusion matrix for binary classification (person/no person)
export const calculateConfusionMatrix = (results) => {
  const allLabels = ["Person", "No Person"];
  const confusionMatrix = {
    Person: { Person: 0, "No Person": 0 },
    "No Person": { Person: 0, "No Person": 0 },
  };

  confusionMatrix["Person"]["Person"] = results.truePositives;
  confusionMatrix["Person"]["No Person"] = results.falseNegatives;
  confusionMatrix["No Person"]["Person"] = results.falsePositives;
  confusionMatrix["No Person"]["No Person"] = results.trueNegatives;

  return { confusionMatrix, allLabels };
};
