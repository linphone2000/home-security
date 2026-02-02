import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "homesecurity",
    });
    isConnected = connection.readyState === 1;
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}
