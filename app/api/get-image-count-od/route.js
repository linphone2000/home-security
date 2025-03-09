import fs from "fs";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name || typeof name !== "string" || name.trim() === "") {
    console.log(`[API] Invalid name parameter: ${name}`);
    return new Response(
      JSON.stringify({ error: "Name parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const sanitizedPrefix = name.trim().replace(/[^a-zA-Z0-9-_]/g, ""); // Sanitize prefix
  const dir = path.join(process.cwd(), "public", "test_set"); // Always read from test_set directly

  console.log(
    `[API] Checking directory: ${dir} for files starting with ${sanitizedPrefix}`
  );

  try {
    if (!fs.existsSync(dir)) {
      console.log(`[API] Directory does not exist, creating: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
      return new Response(JSON.stringify({ count: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Count files starting with the prefix (e.g., "image_withPerson_") and ending with ".jpg"
    const files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (item) =>
          item.isFile() &&
          item.name.toLowerCase().startsWith(sanitizedPrefix.toLowerCase()) &&
          item.name.toLowerCase().endsWith(".jpg")
      );

    console.log(
      `[API] Found ${
        files.length
      } .jpg files in ${dir} with prefix ${sanitizedPrefix}: ${files
        .map((f) => f.name)
        .join(", ")}`
    );
    return new Response(JSON.stringify({ count: files.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`[API] Error reading directory ${dir}:`, error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch image count",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
