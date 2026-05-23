import mongoose from "mongoose"

const VisitSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },

  major: {
    type: String,
    default: "",
  },

  ethnicity: {
    type: String,
    default: "",
  },

  interests: {
    type: [String],
    default: [],
  },

  profile: {
    name: String,
    major: String,
    ethnicity: String,
    interests: [String],
  },

  userKey: {
    type: String,
    default: null,
  },

  source: {
    type: String,
    default: "web",
  },

  path: {
    type: String,
    default: "/",
  },

  referrer: {
    type: String,
    default: "",
  },

  userAgent: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Visit", VisitSchema)
