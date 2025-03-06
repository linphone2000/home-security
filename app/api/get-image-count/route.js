import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    console.error("[GET_IMAGE_COUNT] Name parameter missing");
    return NextResponse.json(
      { error: "Name parameter is required" },
      { status: 400 }
    );
  }

  const saveDir = path.join(process.cwd(), "public", "test_images"); // No subfolder
  console.log(`[GET_IMAGE_COUNT] Checking directory: ${saveDir}`);

  try {
    const files = await fs.readdir(saveDir);
    console.log(`[GET_IMAGE_COUNT] Files found: ${files.join(", ")}`);
    const count = files.filter(
      (file) => file.startsWith(`${name}_`) && file.endsWith(".jpg")
    ).length;
    console.log(
      `[GET_IMAGE_COUNT] Counted ${count} matching files for ${name}`
    );
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        `[GET_IMAGE_COUNT] Directory ${saveDir} does not exist, returning count: 0`
      );
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    console.error(
      `[GET_IMAGE_COUNT] Error reading directory ${saveDir}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to read directory" },
      { status: 500 }
    );
  }
}
