import { Router } from "express"
import { getDb } from "../db.js"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const db = await getDb()
    const clubs = await db.collection("clubs").find({}).sort({ name: 1 }).toArray()
    res.json(clubs)
  } catch (err) {
    res.status(500).json({ error: "failed_to_fetch_clubs" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const db = await getDb()
    const club = await db.collection("clubs").findOne({ id: req.params.id })
    if (!club) return res.status(404).json({ error: "not_found" })
    res.json(club)
  } catch (err) {
    res.status(500).json({ error: "failed_to_fetch_club" })
  }
})

export default router
