import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

import { analyzeProfile }
  from "../services/gemini.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const clubs = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../data/clubs.json`,
    "utf-8"
  )
)

const router = express.Router()

router.post("/", async (req, res) => {

  try {

    const { profile, query } = req.body

    const rankings =
      await analyzeProfile(
        profile,
        clubs,
        query
      )

    res.json(rankings)

  } catch (err) {

    console.error(
      "Analyze Route Error:",
      err
    )

    res.status(500).json({
      error: err.message
    })
  }
})

export default router
