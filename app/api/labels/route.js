import fs from "fs/promises";
import path from "path";

export async function GET() {
  const labeledImagesDir = path.join(process.cwd(), "public", "labeled_images");

  try {
    const files = await fs.readdir(labeledImagesDir);

    // Filter out hidden files (e.g., .DS_Store)
    const labels = files.filter(
      (file) => !file.startsWith(".") && !file.startsWith("_")
    );

    return Response.json(labels);
  } catch (error) {
    return Response.json({ error: "Failed to fetch labels" }, { status: 500 });
  }
}
