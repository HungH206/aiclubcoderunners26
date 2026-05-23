import dotenv from "dotenv"
import { GoogleGenerativeAI }
  from "@google/generative-ai"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from Backend/.env
dotenv.config({ path: `${__dirname}/../.env` })

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  )

const model =
  genAI.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash",
  })

function computeLocalMatch(profile, club) {
  let score = 0
  const matchReasons = []

  const majorLower = (profile.major || "").toLowerCase().trim()
  const majorFocus = Array.isArray(club.majorFocus) ? club.majorFocus : []
  const hasMajorFocus = !majorFocus.includes("all")
  const majorMatch = majorFocus.some((major) => {
    const lowered = major.toLowerCase()

    return (
      majorLower.includes(lowered) ||
      lowered.includes(majorLower) ||
      majorLower
        .split(/[\s/,]+/)
        .some((word) => word.length > 2 && (lowered.includes(word) || word.includes(lowered.split(" ")[0])))
    )
  })

  if (majorMatch && hasMajorFocus) {
    score += 45
    matchReasons.push(`Matches ${profile.major}`)
  } else if (!hasMajorFocus) {
    score += 20
    matchReasons.push("Open to all majors")
  }

  const ethnicFocus = Array.isArray(club.ethnicFocus) ? club.ethnicFocus : []
  const ethnicityWords = (profile.ethnicity || "")
    .toLowerCase()
    .split(/[\s/,]+/)
    .filter((word) => word.length > 2)
  const hasEthnicFocus = !ethnicFocus.includes("all")
  const ethnicityMatch = ethnicFocus.some((ethnicity) => {
    const lowered = ethnicity.toLowerCase()

    return ethnicityWords.some((word) => lowered.includes(word) || word.includes(lowered))
  })

  if (ethnicityMatch && hasEthnicFocus) {
    score += 35
    matchReasons.push("Cultural connection")
  } else if (!hasEthnicFocus) {
    score += 10
    matchReasons.push("Welcoming all backgrounds")
  }

  const interests = Array.isArray(profile.interests) ? profile.interests : []
  const tags = Array.isArray(club.tags) ? club.tags : []
  const tagMatches = interests.filter((interest) => {
    const lowered = interest.toLowerCase()

    return tags.some((tag) => {
      const tagLower = tag.toLowerCase()

      return lowered.includes(tagLower) || tagLower.includes(lowered.split(/[&\s]+/)[0])
    })
  })

  score += Math.min(20, tagMatches.length * 7)

  if (tagMatches.length > 0) {
    matchReasons.push(`${tagMatches.length} shared interest${tagMatches.length > 1 ? "s" : ""}`)
  }

  return {
    id: club.id,
    score: Math.min(100, score),
    matchReasons,
  }
}

function getLocalRankings(profile, clubs) {
  return clubs
    .map((club) => computeLocalMatch(profile, club))
    .sort((left, right) => right.score - left.score)
}

function getLocalChatResponse(profile, clubs, query) {
  const recommendations = getLocalRankings(profile, clubs)
  const topIds = recommendations.slice(0, 3).map((item) => item.id)
  const topNames = topIds
    .map((id) => clubs.find((club) => club.id === id)?.name)
    .filter(Boolean)

  return {
    reply: `Gemini is temporarily unavailable, so I used the local matcher. For "${query}", start with ${topNames.join(", ")}.`,
    recommendations,
  }
}

export async function analyzeProfile(
  profile,
  clubs,
  query = ""
) {
  const isChatRequest = typeof query === "string" && query.trim().length > 0

  if (!process.env.GEMINI_API_KEY) {
    return isChatRequest
      ? getLocalChatResponse(profile, clubs, query.trim())
      : getLocalRankings(profile, clubs)
  }

  const prompt = `
You are a campus club recommendation AI.

STUDENT:
Name: ${profile.name}
Major: ${profile.major}
Ethnicity: ${profile.ethnicity}
Interests:
${profile.interests.join(", ")}

AVAILABLE CLUBS:
${JSON.stringify(clubs)}

${isChatRequest ? `STUDENT FOLLOW-UP QUESTION:
${query.trim()}

TASK:
- Answer the follow-up question in one concise, helpful sentence.
- Re-rank the clubs based on the student profile and this follow-up question.
` : `TASK:
- Rank the clubs based on the student profile.
`}

IMPORTANT:
- Use ONLY IDs from provided clubs
- Return ONLY raw JSON
- Do not use markdown

FORMAT:
${isChatRequest ? `{
  "reply":"CSA is your strongest option for project-based tech experience, with CEO also useful if you want startup exposure.",
  "recommendations":[
    {
      "id":"csa",
      "score":95,
      "matchReasons":[
        "Strong technology fit"
      ]
    }
  ]
}` : `[
  {
    "id":"vsa",
    "score":95,
    "matchReasons":[
      "Strong cultural fit"
    ]
  }
]`}
`

  try {
    const result =
      await model.generateContent(prompt)

    const response =
      await result.response

    let text = response.text()

    console.log(
      "\n=== GEMINI RESPONSE ===\n"
    )

    console.log(text)

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    return JSON.parse(text)
  } catch (err) {
    const isQuotaError = err?.status === 429

    console.warn(
      isQuotaError
        ? "Gemini quota exceeded. Falling back to local matcher."
        : "Gemini analyze failed. Falling back to local matcher.",
      err?.message || err
    )

    return isChatRequest
      ? getLocalChatResponse(profile, clubs, query.trim())
      : getLocalRankings(profile, clubs)
  }
}
