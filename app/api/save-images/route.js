import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  const { name, images } = await request.json();
  if (!name || !images || !Array.isArray(images)) {
    return NextResponse.json(
      { error: "Name and images array are required" },
      { status: 400 }
    );
  }

  const saveDir = path.join(process.cwd(), "public", "test_images"); // No subfolder

  try {
    await fs.mkdir(saveDir, { recursive: true });
    for (const image of images) {
      const { name: imageName, dataUrl } = image;
      if (!imageName || !dataUrl) {
        throw new Error("Invalid image data: missing name or dataUrl");
      }
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      const imgPath = path.join(saveDir, imageName);
      await fs.writeFile(imgPath, base64Data, "base64");
      console.log(`[SAVE_IMAGES] Saved ${imgPath}`);
    }
    return NextResponse.json(
      { message: "Images saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SAVE_IMAGES] Error saving images:", error);
    return NextResponse.json(
      { error: "Failed to save images" },
      { status: 500 }
    );
  }
}
