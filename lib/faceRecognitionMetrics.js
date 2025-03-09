export function calculateMetrics(results, labels = []) {
  const accuracy =
    results.total > 0
      ? (results.truePositives + results.trueNegatives) / results.total
      : 0;
  const precision =
    results.truePositives + results.falsePositives > 0
      ? results.truePositives / (results.truePositives + results.falsePositives)
      : 0;
  const recall =
    results.truePositives + results.falseNegatives > 0
      ? results.truePositives / (results.truePositives + results.falseNegatives)
      : 0;
  const specificity =
    results.trueNegatives + results.falsePositives > 0
      ? results.trueNegatives / (results.trueNegatives + results.falsePositives)
      : 0;
  const falseNegativeRate =
    results.truePositives + results.falseNegatives > 0
      ? results.falseNegatives /
        (results.truePositives + results.falseNegatives)
      : 0;
  const avgTimePerImage = results.processingTime / results.total || 0;

  const { macroF1 } = calculateConfusionMatrix(results, labels);

  return {
    accuracy,
    precision,
    recall,
    specificity,
    falseNegativeRate,
    macroF1,
    avgTimePerImage,
  };
}

export function calculateConfusionMatrix(results, labels = []) {
  const knownLabels = labels;
  const allLabels = [...new Set([...knownLabels, "unknown"])];

  const confusionMatrix = allLabels.reduce((matrix, trueLabel) => {
    matrix[trueLabel] = allLabels.reduce((row, predLabel) => {
      row[predLabel] = 0;
      return row;
    }, {});
    return matrix;
  }, {});

  results.imageDetails.forEach(({ trueLabel, predictedLabel }) => {
    const effectiveTrueLabel = knownLabels.includes(trueLabel)
      ? trueLabel
      : "unknown";
    confusionMatrix[effectiveTrueLabel][predictedLabel]++;
  });

  const metricsPerLabel = allLabels.map((label) => {
    const tp = confusionMatrix[label][label] || 0;
    const fp = allLabels.reduce(
      (sum, pred) => sum + (pred !== label ? confusionMatrix[pred][label] : 0),
      0
    );
    const fn = allLabels.reduce(
      (sum, trueL) =>
        sum + (trueL !== label ? confusionMatrix[label][trueL] : 0),
      0
    );
    const tn = results.total - (tp + fp + fn);
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    const f1 =
      precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;
    return { label, tp, fp, fn, tn, precision, recall, specificity, f1 };
  });

  const macroF1 =
    metricsPerLabel.length > 0
      ? metricsPerLabel.reduce((sum, m) => sum + m.f1, 0) /
        metricsPerLabel.length
      : 0;

  return { confusionMatrix, allLabels, metricsPerLabel, macroF1 };
}
