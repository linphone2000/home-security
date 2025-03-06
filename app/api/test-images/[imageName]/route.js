import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(request, { params }) {
  const { imageName } = params;
  const filePath = path.join(process.cwd(), "public", "test_images", imageName);

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { imageName } = params;
  const { newName } = await request.json();
  const oldPath = path.join(process.cwd(), "public", "test_images", imageName);
  const newPath = path.join(process.cwd(), "public", "test_images", newName);

  try {
    await fs.rename(oldPath, newPath);
    return NextResponse.json({ message: "Image renamed" }, { status: 200 });
  } catch (error) {
    console.error("Error renaming image:", error);
    return NextResponse.json(
      { error: "Failed to rename image" },
      { status: 500 }
    );
  }
}
