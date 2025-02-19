import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  const formData = await request.formData();
  const label = formData.get("label");
  const file = formData.get("image");

  if (!label || !file) {
    return NextResponse.json(
      { error: "Missing label or image" },
      { status: 400 }
    );
  }

  // Validate label name (e.g., no special characters)
  if (!/^[a-zA-Z0-9_-]+$/.test(label)) {
    return NextResponse.json({ error: "Invalid label name" }, { status: 400 });
  }

  const labeledImagesDir = path.join(process.cwd(), "public", "labeled_images");
  const labelDir = path.join(labeledImagesDir, label);

  try {
    // Create label directory if it doesn't exist
    await fs.mkdir(labelDir, { recursive: true });

    // Save the image as `ref.jpg`
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(labelDir, "ref.jpg"), buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
