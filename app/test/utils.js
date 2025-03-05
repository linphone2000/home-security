export const fetchLabels = async () => {
  try {
    const response = await fetch("/api/labels");
    if (!response.ok) throw new Error("Failed to fetch labels");
    const data = await response.json();
    console.log("Fetched labels:", data);
    return data.map((item) => item.label);
  } catch (error) {
    console.error("Error fetching labels:", error);
    return [];
  }
};

export const fetchTestImages = async () => {
  try {
    const response = await fetch("/api/test-images");
    if (!response.ok) throw new Error("Failed to fetch test images");
    const data = await response.json();
    console.log("Fetched test images:", data.images);
    return data.images;
  } catch (error) {
    console.error("Error fetching test images:", error);
    return [];
  }
};
