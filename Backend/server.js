import express from "express"
import cors from "cors"
import fs from "fs"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from Backend/.env
dotenv.config({ path: `${__dirname}/.env` })

import analyzeRoute
  from "./routes/analyze.js"

const clubs = JSON.parse(
  fs.readFileSync(
    `${__dirname}/data/clubs.json`,
    "utf-8"
  )
)

const app = express()

app.use(cors())

app.use(express.json())

app.use(
  "/api/analyze",
  analyzeRoute
)

app.get("/api/clubs", (req, res) => {
  res.json(clubs)
})

app.listen(5001, () => {
  console.log(
    "Server running on port 5001"
  )
})