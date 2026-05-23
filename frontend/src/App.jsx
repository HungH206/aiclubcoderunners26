import { useEffect, useState } from "react"

import { createEmptyProfile, getMatches } from "./data/profile"

import QuizShell from "./components/QuizShell"
import AnalyzingStep from "./components/AnalyzingStep"
import ResultsStep from "./components/ResultsStep"

import Q1 from "./components/quiz/Q1"
import Q2 from "./components/quiz/Q2"
import Q3 from "./components/quiz/Q3"
import Q4 from "./components/quiz/Q4"

import ReviewStep from "./components/quiz/ReviewStep"

const APP_VARS = {
  "--background": "#0D0B12",
  "--foreground": "#F0EBE0",
  "--card": "#1A1820",
  "--primary": "#A8E237",
  "--primary-foreground": "#0D0B12",
  "--muted-foreground": "#8C8890",
  "--border": "rgba(255,255,255,0.08)",
  "--font-display": "'Barlow Condensed', sans-serif",
  "--font-body": "'Barlow', sans-serif",
  "--font-mono": "'DM Mono', monospace",
}

const QUIZ_STEPS = ["q1", "q2", "q3", "q4"]

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001/api" : "/api")
const ANALYZE_URL = import.meta.env.VITE_ANALYZE_URL || `${API_URL}/analyze`
const TRACKING_API_URL =
  import.meta.env.VITE_TRACKING_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5002/api" : "/api")
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"
const USE_GEMINI = import.meta.env.VITE_USE_GEMINI !== "false"

function normalizeRecommendationItem(item, byId) {
  const rawId =
    item?.id ??
    item?.clubId ??
    item?.club_id ??
    item?.club?.id ??
    item?.club?.clubId ??
    ""

  const id = String(rawId).trim()
  const club = byId.get(id) ?? item?.club ?? null

  if (!club) {
    return null
  }

  return {
    club,
    score: Number(item?.matchScore ?? item?.score ?? 0) || 0,
    matchReasons: Array.isArray(item?.matchReasons)
      ? item.matchReasons
      : item?.reasoning
        ? [item.reasoning]
        : [],
  }
}

function parseRecommendations(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.recommendations)) {
    return data.recommendations
  }

  if (Array.isArray(data?.rankings)) {
    return data.rankings
  }

  return null
}

function normalizeRecommendations(items, clubs) {
  const byId = new Map(clubs.map((c) => [c.id, c]))

  return items
    .map((item) => {
      const result = normalizeRecommendationItem(item, byId)

      if (!result) {
        console.warn("Missing club mapping from backend:", item)
      }

      return result
    })
    .filter(Boolean)
}

function getVisitorKey() {
  const storageKey = "clubmatch_visitor_key"
  const existing = localStorage.getItem(storageKey)

  if (existing) {
    return existing
  }

  const generated =
    crypto.randomUUID?.() ||
    `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`

  localStorage.setItem(storageKey, generated)

  return generated
}

async function logProfileVisit(profile) {
  try {
    const res = await fetch(`${TRACKING_API_URL}/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        userKey: getVisitorKey(),
        source: "quiz-submit",
        path: window.location.pathname,
        referrer: document.referrer,
        profile,
      }),
    })

    if (!res.ok) {
      throw new Error(`Profile visit tracking failed with status ${res.status}`)
    }
  } catch (err) {
    console.warn("Profile visit tracking failed:", err)
  }
}

// ================================
// MAIN APP
// ================================

export default function App() {
  const [step, setStep] = useState("q1")

  const [profile, setProfile] = useState(
    createEmptyProfile()
  )

  const [results, setResults] = useState([])

  const [usingGemini, setUsingGemini] =
    useState(false)

  const [clubs, setClubs] = useState([])

  const [loadingClubs, setLoadingClubs] =
    useState(true)

  const [clubsError, setClubsError] =
    useState("")

  useEffect(() => {
    const sessionKey = "clubmatch_visit_logged"

    if (sessionStorage.getItem(sessionKey)) {
      return
    }

    async function logVisit() {
      try {
        const res = await fetch(`${TRACKING_API_URL}/visits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
          body: JSON.stringify({
            userKey: getVisitorKey(),
            source: "frontend",
            path: window.location.pathname,
            referrer: document.referrer,
          }),
        })

        if (!res.ok) {
          throw new Error(`Visit tracking failed with status ${res.status}`)
        }

        sessionStorage.setItem(sessionKey, "true")
      } catch (err) {
        console.warn("Visit tracking failed:", err)
      }
    }

    logVisit()
  }, [])

  // ================================
  // FETCH CLUBS FROM BACKEND
  // ================================

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch(`${API_URL}/clubs`)

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        const data = await res.json()

        if (!Array.isArray(data)) {
          throw new Error("Backend did not return a clubs array")
        }

        setClubs(data)
        setClubsError("")
      } catch (err) {
        console.error(
          "Failed to fetch clubs:",
          err
        )
        setClubsError(
          "Could not load clubs from the backend. Make sure Backend/server.js is running on port 5001."
        )
      } finally {
        setLoadingClubs(false)
      }
    }

    fetchClubs()
  }, [])

  // ================================
  // PROFILE HELPER
  // ================================

  const set =
    (key) =>
    (val) =>
      setProfile((p) => ({
        ...p,
        [key]: val,
      }))

  // ================================
  // MAIN MATCHING FUNCTION
  // ================================

  const handleFind = async () => {
    setUsingGemini(USE_GEMINI)

    setStep("analyzing")

    logProfileVisit(profile)

    try {
      if (!clubs.length) {
        throw new Error("No clubs loaded")
      }

      if (!USE_GEMINI) {
        setResults(getMatches(profile, clubs))
        setTimeout(() => {
          setStep("results")
        }, 500)
        return
      }

      const res = await fetch(`${ANALYZE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      })

      if (!res.ok) {
        throw new Error(`Analyze request failed with status ${res.status}`)
      }

      const data = await res.json()

      const matched = parseRecommendations(data)

      if (!Array.isArray(matched)) {
        throw new Error(
          data?.error || "Backend did not return recommendations"
        )
      }

      const normalized = normalizeRecommendations(matched, clubs)

      if (!normalized.length) {
        throw new Error("Backend recommendations did not match loaded clubs")
      }

      setResults(normalized)
      setTimeout(() => {
        setStep("results")
      }, 500)
    } catch (err) {
      console.error(err)

      setUsingGemini(false)
      setResults(getMatches(profile, clubs))

      setTimeout(() => {
        setStep("results")
      }, 500)
    }
  }

  // ================================
  // RESTART
  // ================================

  const restart = () => {
    setProfile(createEmptyProfile())

    setResults([])

    setStep("q1")
  }

  // ================================
  // LOADING STATE
  // ================================

  if (loadingClubs) {
    return (
      <div
        style={{
          ...APP_VARS,
          background: "#0D0B12",
          color: "#F0EBE0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
        }}
      >
        Loading organizations...
      </div>
    )
  }

  if (clubsError) {
    return (
      <div
        style={{
          ...APP_VARS,
          background: "#0D0B12",
          color: "#F0EBE0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            background: "#1A1820",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "#A8E237",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              marginBottom: 10,
            }}
          >
            Backend unavailable
          </p>
          <p style={{ color: "#F0EBE0", lineHeight: 1.6 }}>
            {clubsError}
          </p>
        </div>
      </div>
    )
  }

  // ================================
  // ANALYZING STEP
  // ================================

  if (step === "analyzing") {
    return (
      <div
        style={{
          ...APP_VARS,
          background: "#0D0B12",
          color: "#F0EBE0",
          fontFamily: "var(--font-body)",
        }}
      >
        <AnalyzingStep
          profile={profile}
          usingGemini={usingGemini}
          modelName={GEMINI_MODEL}
          clubs={clubs}
        />
      </div>
    )
  }

  // ================================
  // RESULTS STEP
  // ================================

  if (step === "results") {
    return (
      <div
        style={{
          ...APP_VARS,
          background: "#0D0B12",
          color: "#F0EBE0",
          fontFamily: "var(--font-body)",
        }}
      >
        <ResultsStep
          profile={profile}
          results={results}
          clubs={clubs}
          onRestart={restart}
        />
      </div>
    )
  }

  // ================================
  // QUIZ FLOW
  // ================================

  return (
    <div
      style={{
        ...APP_VARS,
        background: "#0D0B12",
        color: "#F0EBE0",
        fontFamily: "var(--font-body)",
      }}
    >
      <QuizShell
        step={step}
        steps={QUIZ_STEPS}
      >
        {step === "q1" && (
          <Q1
            value={profile.name}
            onChange={set("name")}
            onNext={() => setStep("q2")}
          />
        )}

        {step === "q2" && (
          <Q2
            value={profile.major}
            onChange={set("major")}
            onNext={() => setStep("q3")}
            onBack={() => setStep("q1")}
          />
        )}

        {step === "q3" && (
          <Q3
            value={profile.ethnicity}
            onChange={set("ethnicity")}
            onNext={() => setStep("q4")}
            onBack={() => setStep("q2")}
          />
        )}

        {step === "q4" && (
          <Q4
            value={profile.interests}
            onChange={(v) =>
              set("interests")(v)
            }
            onNext={() => setStep("review")}
            onBack={() => setStep("q3")}
          />
        )}

        {step === "review" && (
          <ReviewStep
            profile={profile}
            onBack={() => setStep("q4")}
            onFind={handleFind}
          />
        )}
      </QuizShell>
    </div>
  )
}
