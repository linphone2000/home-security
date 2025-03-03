import fs from "fs/promises";
import path from "path";

export async function GET() {
  const labeledImagesDir = path.join(process.cwd(), "public", "labeled_images");

  try {
    const files = await fs.readdir(labeledImagesDir);

    // Filter out hidden files
    const labels = files.filter(
      (file) => !file.startsWith(".") && !file.startsWith("_")
    );

    // Fetch image URLs
    const labelsWithImages = await Promise.all(
      labels.map(async (label) => {
        const imagePath = path.join(labeledImagesDir, label, "ref.jpg");
        const imageUrl = `/labeled_images/${label}/ref.jpg`;
        return { label, imageUrl };
      })
    );

    return Response.json(labelsWithImages);
  } catch (error) {
    return Response.json({ error: "Failed to fetch labels" }, { status: 500 });
  }
}
