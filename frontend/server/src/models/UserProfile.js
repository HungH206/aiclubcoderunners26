import mongoose from "mongoose"

const UserProfileSchema = new mongoose.Schema({
  userKey: {
    type: String,
    required: true,
    unique: true,
  },

  profile: {
    name: String,
    major: String,
    ethnicity: String,
    interests: [String],
  },

  visitCount: {
    type: Number,
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("UserProfile", UserProfileSchema)