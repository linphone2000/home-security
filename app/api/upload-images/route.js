import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { images, name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const personDir = path.join(process.cwd(), "../training_images", name);
  if (!fs.existsSync(personDir)) fs.mkdirSync(personDir, { recursive: true });

  // Loop through each image and save it with a unique filename
  images.forEach((image, index) => {
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    // Create a unique filename for each image to avoid overwriting
    let filePath = path.join(personDir, `image_${index}.jpg`);
    let counter = 1;

    // Check if the file already exists, and if it does, increment the filename
    while (fs.existsSync(filePath)) {
      filePath = path.join(personDir, `image_${index}_${counter}.jpg`);
      counter++;
    }

    // Write the image data to the file
    fs.writeFileSync(filePath, base64Data, "base64");
  });

  return NextResponse.json({ message: "Images uploaded successfully" });
}
