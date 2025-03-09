import fs from "fs";
import path from "path";

export async function POST(req) {
  const { images } = await req.json();

  if (!images || !Array.isArray(images)) {
    console.log(`[API] Invalid request body: images=${JSON.stringify(images)}`);
    return new Response(JSON.stringify({ error: "Invalid images data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const dir = path.join(process.cwd(), "public", "test_set"); // Save directly to test_set

  console.log(`[API] Saving images to directory: ${dir}`);

  try {
    if (!fs.existsSync(dir)) {
      console.log(`[API] Directory does not exist, creating: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    images.forEach((img) => {
      if (
        !img.name ||
        !img.dataUrl ||
        !img.name.toLowerCase().endsWith(".jpg")
      ) {
        throw new Error(`Invalid image data: ${JSON.stringify(img)}`);
      }
      const buffer = Buffer.from(img.dataUrl.split(",")[1], "base64");
      const filePath = path.join(dir, img.name);
      console.log(`[API] Writing file: ${filePath}`);
      fs.writeFileSync(filePath, buffer);
    });

    console.log(`[API] Saved ${images.length} images to ${dir}`);
    return new Response(
      JSON.stringify({
        success: true,
        message: `Saved ${images.length} images`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`[API] Error saving images to ${dir}:`, error);
    return new Response(
      JSON.stringify({
        error: "Failed to save images",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
