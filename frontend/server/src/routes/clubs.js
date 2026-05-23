import { Router } from "express"
import { loadSharedClubs } from "../lib/clubsData.js"

const router = Router()

// GET all clubs
router.get("/", async (_req, res) => {
  try {
    const clubs = await loadSharedClubs()

    res.json(clubs)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "failed_to_fetch_clubs",
    })
  }
})

// GET single club
router.get("/:id", async (req, res) => {
  try {
    const clubs = await loadSharedClubs()
    const club = clubs.find((item) => item.id === req.params.id)

    if (!club) {
      return res.status(404).json({
        error: "not_found",
      })
    }

    res.json(club)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "failed_to_fetch_club",
    })
  }
})

export default router