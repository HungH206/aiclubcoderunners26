import { Router } from "express"

import { loadSharedClubs } from "../lib/clubsData.js"

const router = Router()

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

function computeLocalMatch(profile, club) {
  let score = 0
  const reasons = []

  const majorLower = (profile.major || "").toLowerCase().trim()
  const hasMajorFocus = !club.majorFocus.includes("all")
  const majorMatch = club.majorFocus.some((major) => {
    const majorLowered = major.toLowerCase()
    return (
      majorLower.includes(majorLowered) ||
      majorLowered.includes(majorLower) ||
      majorLower.split(/[\s/,]+/).some((word) => word.length > 2 && (majorLowered.includes(word) || word.includes(majorLowered.split(" ")[0])))
    )
  })

  if (majorMatch && hasMajorFocus) {
    score += 45
    reasons.push(`Matches ${profile.major}`)
  } else if (!hasMajorFocus) {
    score += 20
    reasons.push("Open to all majors")
  }

  const ethWords = (profile.ethnicity || "")
    .toLowerCase()
    .split(/[\s/,]+/)
    .filter((word) => word.length > 2)

  const hasEthFocus = !club.ethnicFocus.includes("all")
  const ethMatch = club.ethnicFocus.some((ethnic) => {
    const lowered = ethnic.toLowerCase()
    return ethWords.some((word) => lowered.includes(word) || word.includes(lowered))
  })

  if (ethMatch && hasEthFocus) {
    score += 35
    reasons.push("Cultural connection")
  } else if (!hasEthFocus) {
    score += 10
    reasons.push("Welcoming all backgrounds")
  }

  const interests = Array.isArray(profile.interests) ? profile.interests : []
  const tagMatches = interests.filter((interest) => {
    const lowered = interest.toLowerCase()
    return club.tags.some((tag) => tag.toLowerCase().includes(lowered) || lowered.includes(tag.toLowerCase().split(/[&\s]+/)[0]))
  })

  score += Math.min(20, tagMatches.length * 7)
  if (tagMatches.length > 0) {
    reasons.push(`${tagMatches.length} shared interest${tagMatches.length > 1 ? "s" : ""}`)
  }

  return {
    club,
    score: Math.min(100, score),
    matchReasons: reasons,
  }
}

async function analyzeWithGemini(profile, clubs) {
  if (!GEMINI_KEY) {
    return clubs.map((club) => computeLocalMatch(profile, club)).sort((left, right) => right.score - left.score)
  }

  const clubsText = clubs
    .map(
      (club) => `ID: ${club.id}\nName: ${club.name}\nCategory: ${club.category}\nMajor Focus: ${club.majorFocus.join(", ")}\nEthnic Focus: ${club.ethnicFocus.join(", ")}\nTags: ${club.tags.join(", ")}\nDescription: ${club.description.slice(0, 180)}`
    )
    .join("\n---\n")

  const prompt = `
You are a campus club matching AI for Houston Community College.

IMPORTANT:
- Use ONLY IDs from the provided clubs
- Every recommendation MUST include an "id"
- Never invent IDs

STUDENT:
Name: ${profile.name}
Major: ${profile.major}
Background: ${profile.ethnicity}
Interests: ${Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(", ") : "None specified"}

ORGANIZATIONS:
${clubsText}

Scoring (0-100 total):
- Major alignment: 0-45pts
- Cultural connection: 0-35pts
- Interest overlap: 0-20pts

Return ONLY a JSON array:
[
  {
    "id":"club_id",
    "score":85,
    "matchReasons":["reason 1","reason 2"]
  }
]
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini HTTP ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("empty response")
  }

  const rankings = JSON.parse(text.replace(/```json|```/g, ""))
  const byId = new Map(clubs.map((club) => [club.id, club]))

  return rankings
    .map((rank) => {
      const club = byId.get(rank.id)
      if (!club) return null

      return {
        club,
        score: Math.max(0, Math.min(100, Number(rank.score) || 0)),
        matchReasons: Array.isArray(rank.matchReasons) ? rank.matchReasons.slice(0, 3) : [],
      }
    })
    .filter(Boolean)
}

async function chatWithGemini(profile, clubs, query) {
  if (!GEMINI_KEY) {
    const ranked = clubs.map((club) => computeLocalMatch(profile, club)).sort((left, right) => right.score - left.score)
    const topNames = ranked.slice(0, 3).map((item) => item.club.name)

    return {
      reply: `Based on your profile and question, my top picks are ${topNames.join(", ")}.`,
      recommendations: ranked.slice(0, 5),
    }
  }

  const clubsText = clubs
    .map(
      (club) => `ID: ${club.id}\nName: ${club.name}\nCategory: ${club.category}\nMajor Focus: ${club.majorFocus.join(", ")}\nEthnic Focus: ${club.ethnicFocus.join(", ")}\nTags: ${club.tags.join(", ")}\nDescription: ${club.description.slice(0, 180)}`
    )
    .join("\n---\n")

  const prompt = `
You are a campus club chat assistant for Houston Community College.

Use the student's profile and the club list to answer their follow-up question.

IMPORTANT:
- Use ONLY IDs from the provided clubs when naming recommendations
- Never invent IDs
- If you recommend clubs, include at most 3 in the reply

STUDENT PROFILE:
Name: ${profile.name || "Unknown"}
Major: ${profile.major || "Unknown"}
Background: ${profile.ethnicity || "Unknown"}
Interests: ${Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(", ") : "None specified"}

QUESTION:
${query}

CLUBS:
${clubsText}

Return ONLY valid JSON in this exact shape:
{
  "reply": "short helpful response",
  "recommendations": [
    {
      "id": "club_id",
      "score": 85,
      "matchReasons": ["reason 1", "reason 2"]
    }
  ]
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini HTTP ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("empty response")
  }

  const parsed = JSON.parse(text.replace(/```json|```/g, ""))
  const byId = new Map(clubs.map((club) => [club.id, club]))

  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
        .map((rank) => {
          const club = byId.get(rank.id)
          if (!club) return null

          return {
            club,
            score: Math.max(0, Math.min(100, Number(rank.score) || 0)),
            matchReasons: Array.isArray(rank.matchReasons) ? rank.matchReasons.slice(0, 3) : [],
          }
        })
        .filter(Boolean)
    : []

  return {
    reply: String(parsed.reply || "Here are the best matches based on your question."),
    recommendations,
  }
}

router.post("/", async (req, res) => {
  try {
    const profile = req.body?.profile ?? {}
    const query = String(req.body?.query || "").trim()
    const clubs = await loadSharedClubs()

    if (query) {
      const result = await chatWithGemini(profile, clubs, query)

      return res.json(result)
    }

    const rankings = await analyzeWithGemini(profile, clubs)

    res.json(rankings)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "failed_to_analyze",
    })
  }
})

export default router
