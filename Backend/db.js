import mongoose from "mongoose"

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/club_matcher"

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection failed")
    console.error(error)
  }
}

export default mongoose
