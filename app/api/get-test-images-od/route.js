import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "test_set");

  try {
    if (!fs.existsSync(dir)) {
      console.log(`[API] Directory does not exist: ${dir}, creating it`);
      fs.mkdirSync(dir, { recursive: true });
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read all .jpg files from the directory
    const files = fs
      .readdirSync(dir)
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .map((file) => ({
        src: `/test_set/${file}`,
        hasPerson: file.toLowerCase().startsWith("image_withperson"),
      }));

    console.log(
      `[API] Fetched ${files.length} test images from ${dir}:`,
      files
    );
    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`[API] Error fetching test images from ${dir}:`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
