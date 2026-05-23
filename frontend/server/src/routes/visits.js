import { Router } from "express"
import { getDb } from "../db.js"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const db = await getDb()
    const profile = req.body?.profile
    const userKey = req.body?.userKey || null

    if (!profile) {
      return res.status(400).json({ error: "missing_profile" })
    }

    const now = new Date()

    const visitDoc = {
      profile,
      createdAt: now,
      userKey,
      source: req.body?.source || "web",
    }

    await db.collection("visits").insertOne(visitDoc)

    if (userKey) {
      await db.collection("user_profiles").updateOne(
        { userKey },
        {
          $set: { profile, lastSeenAt: now },
          $setOnInsert: { createdAt: now, visitCount: 0 },
          $inc: { visitCount: 1 },
        },
        { upsert: true }
      )
    }

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: "failed_to_log_visit" })
  }
})

export default router
