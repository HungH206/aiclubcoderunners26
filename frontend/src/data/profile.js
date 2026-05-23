// src/data/profile.js
export const createEmptyProfile = () => ({
  name: "",
  ethnicity: "",
  major: "",
  interests: [],
})

export function computeMatch(profile, club) {
  let score = 0
  const reasons = []

  const majorLower = profile.major.toLowerCase().trim()
  const hasMajorFocus = !club.majorFocus.includes("all")
  const majorMatch = club.majorFocus.some((m) => {
    const ml = m.toLowerCase()
    return (
      majorLower.includes(ml) ||
      ml.includes(majorLower) ||
      majorLower
        .split(/[\s/,]+/)
        .some((w) => w.length > 2 && (ml.includes(w) || w.includes(ml.split(" ")[0])))
    )
  })

  if (majorMatch && hasMajorFocus) {
    score += 45
    reasons.push(`Matches ${profile.major}`)
  } else if (!hasMajorFocus) {
    score += 20
    reasons.push("Open to all majors")
  }

  const ethWords = profile.ethnicity
    .toLowerCase()
    .split(/[\s/,]+/)
    .filter((w) => w.length > 2)
  const hasEthFocus = !club.ethnicFocus.includes("all")
  const ethMatch = club.ethnicFocus.some((e) => {
    const el = e.toLowerCase()
    return ethWords.some((w) => el.includes(w) || w.includes(el))
  })

  if (ethMatch && hasEthFocus) {
    score += 35
    reasons.push("Cultural connection")
  } else if (!hasEthFocus) {
    score += 10
    reasons.push("Welcoming all backgrounds")
  }

  const tagMatches = profile.interests.filter((interest) => {
    const il = interest.toLowerCase()
    return club.tags.some(
      (tag) => il.includes(tag.toLowerCase()) || tag.toLowerCase().includes(il.split(/[&\s]+/)[0])
    )
  })

  score += Math.min(20, tagMatches.length * 7)
  if (tagMatches.length > 0) {
    reasons.push(
      `${tagMatches.length} shared interest${tagMatches.length > 1 ? "s" : ""}`
    )
  }

  return { club, score: Math.min(100, score), matchReasons: reasons }
}

export function getMatches(profile, clubs = []) {
  return clubs.map((c) => computeMatch(profile, c)).sort((a, b) => b.score - a.score)
}