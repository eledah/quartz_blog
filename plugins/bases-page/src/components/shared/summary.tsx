import type { SummaryType } from "../../types";

export function computeSummary(values: unknown[], summary: SummaryType): string {
  const nonEmpty = values.filter((value) => value !== undefined && value !== null && value !== "");
  if (summary === "Empty") return String(values.length - nonEmpty.length);
  if (summary === "Filled") return String(nonEmpty.length);
  if (summary === "Checked") return String(values.filter((value) => value === true).length);
  if (summary === "Unchecked") return String(values.filter((value) => value === false).length);
  if (summary === "Unique") return String(new Set(values.map((value) => String(value))).size);

  const numeric = nonEmpty
    .map((value) => (typeof value === "number" ? value : Number(value)))
    .filter((value) => !Number.isNaN(value));

  if (numeric.length === 0) return summary;
  if (summary === "Sum") return String(numeric.reduce((acc, value) => acc + value, 0));
  if (summary === "Average")
    return String(numeric.reduce((acc, value) => acc + value, 0) / numeric.length);
  if (summary === "Min") return String(Math.min(...numeric));
  if (summary === "Max") return String(Math.max(...numeric));
  if (summary === "Range") return String(Math.max(...numeric) - Math.min(...numeric));
  if (summary === "Median") {
    const sorted = [...numeric].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const upper = sorted[mid] ?? 0;
    const lower = sorted[mid - 1] ?? upper;
    const median = sorted.length % 2 === 0 ? (lower + upper) / 2 : upper;
    return String(median);
  }
  if (summary === "Stddev") {
    const mean = numeric.reduce((acc, value) => acc + value, 0) / numeric.length;
    const variance =
      numeric.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / numeric.length;
    return String(Math.sqrt(variance));
  }

  return summary;
}
