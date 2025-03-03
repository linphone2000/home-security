import fs from "fs/promises";
import path from "path";

export async function DELETE(request, { params }) {
  const { label } = params;
  const labeledImagesDir = path.join(process.cwd(), "public", "labeled_images");
  const labelDir = path.join(labeledImagesDir, label);

  try {
    // Delete the label directory and its contents
    await fs.rm(labelDir, { recursive: true, force: true });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete label" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { label } = params;
  const formData = await request.formData();
  const newLabel = formData.get("label");
  const newImage = formData.get("image");

  const labeledImagesDir = path.join(process.cwd(), "public", "labeled_images");
  const oldLabelDir = path.join(labeledImagesDir, label);
  const newLabelDir = path.join(labeledImagesDir, newLabel || label);

  try {
    // Rename the label directory if the label is updated
    if (newLabel && newLabel !== label) {
      await fs.rename(oldLabelDir, newLabelDir);
    }

    // Update the image if a new one is provided
    if (newImage) {
      const buffer = Buffer.from(await newImage.arrayBuffer());
      await fs.writeFile(path.join(newLabelDir, "ref.jpg"), buffer);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to update label" }, { status: 500 });
  }
}
