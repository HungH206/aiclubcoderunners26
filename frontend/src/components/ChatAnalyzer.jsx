import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { Bot, MessageSquare, Sparkles } from "lucide-react"

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001/api" : "/api")
const ANALYZE_URL = import.meta.env.VITE_ANALYZE_URL || `${API_URL}/analyze`

const SUGGESTIONS = [
  "I want leadership experience",
  "Show cultural organizations",
  "Any gaming events?",
  "I am busy weekdays",
]

function pickTop(results, count) {
  return results.slice(0, count).map((r) => r.club?.name).filter(Boolean)
}

function normalizeRecommendations(recommendations, results) {
  const byId = new Map(results.map((r) => [r.club.id, r.club]))

  return recommendations
    .map((item) => {
      const id = item?.id ?? item?.clubId ?? item?.club_id ?? item?.club?.id
      const club = byId.get(String(id ?? "").trim()) ?? item?.club ?? null

      if (!club) {
        return null
      }

      return {
        club,
        score: Number(item?.score ?? item?.matchScore ?? 0) || 0,
        matchReasons: Array.isArray(item?.matchReasons) ? item.matchReasons : [],
      }
    })
    .filter(Boolean)
}

function inferNeeds(profile) {
  const text = [profile.major, profile.ethnicity, ...profile.interests].join(" ").toLowerCase()
  const needs = []

  if (text.includes("business") || text.includes("professional") || text.includes("entrepreneur")) {
    needs.push("Career growth")
  }
  if (text.includes("culture") || text.includes("vietnam") || text.includes("african") || text.includes("latino")) {
    needs.push("Cultural community")
  }
  if (text.includes("design") || text.includes("art") || text.includes("creative")) {
    needs.push("Creative outlet")
  }
  if (text.includes("gaming") || text.includes("esports")) {
    needs.push("Social play")
  }

  if (needs.length === 0) {
    needs.push("Connection", "Skill building", "Growth")
  }

  return needs.slice(0, 3)
}

function findMatchesByKeyword(results, keyword) {
  const k = keyword.toLowerCase()
  return results.filter((r) => {
    const club = r.club
    const inName = club.name.toLowerCase().includes(k)
    const inCategory = club.category.toLowerCase().includes(k)
    const inTags = club.tags.some((t) => t.toLowerCase().includes(k))
    return inName || inCategory || inTags
  })
}

function buildReply(message, profile, results) {
  const msg = message.toLowerCase()
  const top = pickTop(results, 3)

  if (msg.includes("leadership")) {
    const picks = findMatchesByKeyword(results, "leadership").slice(0, 3).map((r) => r.club?.name)
    return `Leadership is a great focus. Start with ${picks.join(", ") || top.join(", ")}. Want me to rank by officer mentorship or event cadence?`
  }

  if (msg.includes("cultural") || msg.includes("culture")) {
    const picks = findMatchesByKeyword(results, "culture")
      .concat(findMatchesByKeyword(results, "cultural"))
      .slice(0, 3)
      .map((r) => r.club?.name)
    return `For cultural community, try ${picks.join(", ") || top.join(", ")}. Any specific background you want prioritized?`
  }

  if (msg.includes("gaming") || msg.includes("esports")) {
    const picks = findMatchesByKeyword(results, "gaming").slice(0, 2).map((r) => r.club?.name)
    return `For gaming, ${picks.join(" and ") || top[0]} is the best fit. Want competitive leagues, casual hangouts, or content creation?`
  }

  if (msg.includes("busy") || msg.includes("weekdays")) {
    return "Got it. I will prioritize clubs with fewer or flexible events. Do you prefer weekends or lunch hours?"
  }

  if (msg.includes("major") || msg.includes("career") || msg.includes("professional")) {
    return `For career alignment with ${profile.major || "your major"}, check ${top.join(", ")}. Want internships, mentors, or project teams?`
  }

  return `Based on your profile, my top picks are ${top.join(", ")}. Tell me what you want to optimize: career, community, events, or fun.`
}

export default function ChatAnalyzer({ profile, results }) {
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: "I can help refine your matches. Ask about events, community fit, or your goals.",
    },
  ])
  const [input, setInput] = useState("")

  const needs = useMemo(() => inferNeeds(profile), [profile])

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    // Add the user message locally first
    setMessages((m) => [...m, { role: "user", text: trimmed }])

    // Try backend analyze API which can re-rank clubs based on the message
    try {
      const res = await fetch(`${ANALYZE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, query: trimmed }),
      })

      if (!res.ok) {
        throw new Error(`Analyze request failed with status ${res.status}`)
      }

      const matched = await res.json()

      let replyText = ""

      if (Array.isArray(matched)) {
        const normalized = normalizeRecommendations(matched, results)

        const top = pickTop(normalized, 3)
        replyText = top.length > 0 ? `Updated recommendations: ${top.join(", ")}` : buildReply(trimmed, profile, results)
      } else if (matched && typeof matched === "object") {
        const recommendations = Array.isArray(matched.recommendations) ? matched.recommendations : []
        const normalized = normalizeRecommendations(recommendations, results)
        const top = pickTop(normalized, 3)
        replyText = matched.reply || (top.length > 0 ? `Updated recommendations: ${top.join(", ")}` : buildReply(trimmed, profile, results))
      } else {
        replyText = buildReply(trimmed, profile, results)
      }

      setMessages((m) => [...m, { role: "assistant", text: replyText }])
    } catch (err) {
      // On error, fallback to local reply
      const reply = buildReply(trimmed, profile, results)
      setMessages((m) => [...m, { role: "assistant", text: reply }])
      console.error("ChatAnalyzer analyze error:", err)
    } finally {
      setInput("")
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "linear-gradient(135deg, rgba(168,226,55,0.25), rgba(168,226,55,0.05))",
            border: "1px solid rgba(168,226,55,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot style={{ width: 14, height: 14, color: "#A8E237" }} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#A8E237",
              marginBottom: 4,
            }}
          >
            Analyzer Chat
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#8C8890" }}>
            Refine your results with follow-up needs.
          </p>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(180deg, rgba(26,24,32,0.95), rgba(13,11,18,0.9))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% -20%, rgba(168,226,55,0.15), transparent 45%), radial-gradient(circle at 90% 0%, rgba(96,165,250,0.12), transparent 40%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {needs.map((need) => (
              <span
                key={need}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  padding: "4px 9px",
                  background: "rgba(168,226,55,0.12)",
                  color: "#A8E237",
                  borderRadius: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {need}
              </span>
            ))}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                padding: "4px 9px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Suggestions below
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <motion.div
                key={`${msg.role}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: msg.role === "user" ? "rgba(168,226,55,0.16)" : "rgba(255,255,255,0.06)",
                  color: msg.role === "user" ? "#E7F9B8" : "#F0EBE0",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                  border: msg.role === "user" ? "1px solid rgba(168,226,55,0.3)" : "1px solid transparent",
                }}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#B0AAA0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.56rem",
                  padding: "6px 10px",
                  borderRadius: 18,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(168,226,55,0.4)"
                  e.currentTarget.style.color = "#A8E237"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                  e.currentTarget.style.color = "#B0AAA0"
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(168,226,55,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare style={{ width: 14, height: 14, color: "#A8E237" }} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about goals, time, culture, or events..."
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#F0EBE0",
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => send(input)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#A8E237",
                color: "#0D0B12",
                border: "none",
                borderRadius: 8,
                padding: "10px 14px",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <Sparkles style={{ width: 12, height: 12 }} />Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
