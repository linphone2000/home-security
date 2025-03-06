export default function PerLabelMetricsTable({ metricsPerLabel }) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Per-Label Metrics
      </h2>
      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Label
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                TP
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                FP
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                FN
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                TN
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Precision
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Recall
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                Specificity
              </th>
              <th className="p-3 border-b border-gray-200 dark:border-gray-600">
                F1 Score
              </th>
            </tr>
          </thead>
          <tbody>
            {metricsPerLabel.map(
              ({
                label,
                tp,
                fp,
                fn,
                tn,
                precision,
                recall,
                specificity,
                f1,
              }) => (
                <tr
                  key={label}
                  className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {label}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{tp}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{fp}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{fn}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{tn}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {(precision * 100).toFixed(2)}%
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {(recall * 100).toFixed(2)}%
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {(specificity * 100).toFixed(2)}%
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {(f1 * 100).toFixed(2)}%
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
