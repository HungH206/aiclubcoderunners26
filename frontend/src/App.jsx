import { useState } from "react"
import { CLUBS } from "./data/clubs"
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
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = "gemini-2.0-flash"

async function analyzeWithGemini(profile) {
  if (!GEMINI_KEY) throw new Error("no-key")

  const clubsText = CLUBS.map((c) =>
    `ID: ${c.id}\nName: ${c.name}\nCategory: ${c.category}\nMajor Focus: ${c.majorFocus.join(", ")}\nEthnic Focus: ${c.ethnicFocus.join(", ")}\nTags: ${c.tags.join(", ")}\nDescription: ${c.description.slice(0, 180)}`
  ).join("\n---\n")

  const prompt = `You are a campus club matching AI for Houston Community College. Rank ALL ${CLUBS.length} organizations for this student.\n\nSTUDENT:\nName: ${profile.name}\nMajor: ${profile.major}\nBackground: ${profile.ethnicity}\nInterests: ${profile.interests.join(", ") || "None specified"}\n\nORGANIZATIONS:\n${clubsText}\n\nScoring (0-100 total):\n- Major alignment: 0-45pts (specific match scores higher; "all majors" = 20pts)\n- Cultural connection: 0-35pts (ethnic match = 35pts; open-to-all = 10pts)\n- Interest overlap: 0-20pts (7pts per matching interest, max 20)\n\nReturn ONLY a JSON array of all ${CLUBS.length} clubs sorted by score descending:\n[{"id":"club_id","score":85,"matchReasons":["reason 1","reason 2"]}]`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    }
  )

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("empty response")

  const rankings = JSON.parse(text)
  const byId = new Map(CLUBS.map((c) => [c.id, c]))

  return rankings
    .map((r) => {
      const club = byId.get(r.id)
      if (!club) return null
      const score = Math.max(0, Math.min(100, Number(r.score) || 0))
      const matchReasons = Array.isArray(r.matchReasons) ? r.matchReasons.slice(0, 3) : []
      return { club, score, matchReasons }
    })
    .filter(Boolean)
}

function localMatch(profile) {
  return getMatches(profile)
}

export default function App() {
  const [step, setStep] = useState("q1")
  const [profile, setProfile] = useState(createEmptyProfile())
  const [results, setResults] = useState([])
  const [usingGemini, setUsingGemini] = useState(false)

  const set = (key) => (val) => setProfile((p) => ({ ...p, [key]: val }))

  const handleFind = async () => {
    const hasKey = !!GEMINI_KEY
    setUsingGemini(hasKey)
    setStep("analyzing")

    try {
      const matched = hasKey ? await analyzeWithGemini(profile) : localMatch(profile)
      setResults(matched)
      setTimeout(() => setStep("results"), 500)
    } catch {
      setResults(localMatch(profile))
      setTimeout(() => setStep("results"), 500)
    }
  }

  const restart = () => {
    setProfile(createEmptyProfile())
    setResults([])
    setStep("q1")
  }

  if (step === "analyzing") {
    return (
      <div style={{ ...APP_VARS, background: "#0D0B12", color: "#F0EBE0", fontFamily: "var(--font-body)" }}>
        <AnalyzingStep profile={profile} usingGemini={usingGemini} modelName={GEMINI_MODEL} />
      </div>
    )
  }

  if (step === "results") {
    return (
      <div style={{ ...APP_VARS, background: "#0D0B12", color: "#F0EBE0", fontFamily: "var(--font-body)" }}>
        <ResultsStep profile={profile} results={results} onRestart={restart} />
      </div>
    )
  }

  return (
    <div style={{ ...APP_VARS, background: "#0D0B12", color: "#F0EBE0", fontFamily: "var(--font-body)" }}>
      <QuizShell step={step} steps={QUIZ_STEPS}>
        {step === "q1" && <Q1 value={profile.name} onChange={set("name")} onNext={() => setStep("q2")} />}
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
            onChange={(v) => set("interests")(v)}
            onNext={() => setStep("review")}
            onBack={() => setStep("q3")}
          />
        )}
        {step === "review" && <ReviewStep profile={profile} onBack={() => setStep("q4")} onFind={handleFind} />}
      </QuizShell>
    </div>
  )
}
