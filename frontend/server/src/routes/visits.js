/* eslint-disable no-unused-vars */
import { Router } from "express"

import Visit from "../models/visit.js"
import UserProfile from "../models/UserProfile.js"

const router = Router()

// GET all visits
router.get("/", async (_req, res) => {
  try {
    const visits = await Visit.find()
      .sort({ createdAt: -1 })

    res.json(visits)
  } catch (err) {
    res.status(500).json({
      error: "failed_to_fetch_visits",
    })
  }
})

// GET visit totals
router.get("/summary", async (_req, res) => {
  try {
    const totalVisits = await Visit.countDocuments()
    const uniqueVisitors = await Visit.distinct("userKey", {
      userKey: {
        $ne: null,
      },
    })
    const latestVisits = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      latestVisits,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "failed_to_fetch_visit_summary",
    })
  }
})

// POST visit
router.post("/", async (req, res) => {
  try {
    const profile = req.body?.profile || null
    const userKey = req.body?.userKey || null
    const name = profile?.name || req.body?.name || ""
    const major = profile?.major || req.body?.major || ""
    const ethnicity = profile?.ethnicity || req.body?.ethnicity || ""
    const interests = Array.isArray(profile?.interests)
      ? profile.interests
      : Array.isArray(req.body?.interests)
        ? req.body.interests
        : []

    // Save visit
    const visit = await Visit.create({
      name,
      major,
      ethnicity,
      interests,
      profile,
      userKey,
      source: req.body?.source || "web",
      path: req.body?.path || "/",
      referrer: req.body?.referrer || "",
      userAgent: req.get("user-agent") || "",
    })

    // Track returning users
    if (userKey) {
      const update = {
        $set: {
          lastSeenAt: new Date(),
        },

        $inc: {
          visitCount: 1,
        },

        $setOnInsert: {
          createdAt: new Date(),
        },
      }

      if (profile) {
        update.$set.profile = profile
      }

      await UserProfile.findOneAndUpdate(
        { userKey },
        update,
        {
          upsert: true,
          new: true,
        }
      )
    }

    res.json({
      ok: true,
      visit,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "failed_to_log_visit",
    })
  }
})

export default router
