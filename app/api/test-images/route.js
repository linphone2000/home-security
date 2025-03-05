import fs from "fs";
import path from "path";

export async function GET() {
  const testImagesDir = path.join(process.cwd(), "public", "test_images");
  try {
    const files = fs.readdirSync(testImagesDir);
    // Filter for .jpg files and return their names
    const imageFiles = files.filter((file) => file.endsWith(".jpg"));
    return new Response(JSON.stringify({ images: imageFiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading test_images directory:", error);
    return new Response(
      JSON.stringify({ error: "Unable to read test images" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
