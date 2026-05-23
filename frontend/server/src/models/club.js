import mongoose from "mongoose"

const ClubSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  majorFocus: [String],
  ethnicFocus: [String],
  tags: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Club", ClubSchema)