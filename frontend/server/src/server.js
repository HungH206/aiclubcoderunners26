/* eslint-disable no-undef */
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { connectDB } from "./db.js"

import clubsRoutes from "./routes/clubs.js"
import analyzeRoutes from "./routes/analyze.js"
import visitsRoutes from "./routes/visits.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5002

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "HCC Club Matcher API running",
  })
})

// API routes
app.use("/api/clubs", clubsRoutes)
app.use("/api/analyze", analyzeRoutes)
app.use("/api/visits", visitsRoutes)

// Start server
async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()
