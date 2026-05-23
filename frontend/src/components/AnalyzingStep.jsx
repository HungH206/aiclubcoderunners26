import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Check, Sparkles } from "lucide-react"

const ANALYSIS_STEPS_TEXT = [
  "Parsing your profile...",
  "Mapping cultural connections...",
  "Scanning interest compatibility...",
  "Ranking organizations...",
  "Generating recommendations...",
]

export default function AnalyzingStep({ profile, usingGemini, modelName, clubs = [] }) {
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = p + (usingGemini ? 0.8 : 2)
        setActiveStep(
          Math.min(ANALYSIS_STEPS_TEXT.length - 1, Math.floor((next / 100) * ANALYSIS_STEPS_TEXT.length))
        )
        return next >= 90 ? 90 : next
      })
    }, 50)

    return () => clearInterval(iv)
  }, [usingGemini])

  const scanned = Math.floor((progress / 90) * clubs.length)

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 460, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: usingGemini ? "rgba(66,133,244,0.2)" : "rgba(168,226,55,0.15)",
              border: usingGemini ? "1px solid rgba(66,133,244,0.4)" : "1px solid rgba(168,226,55,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles style={{ width: 14, height: 14, color: usingGemini ? "#60A5FA" : "#A8E237" }} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: usingGemini ? "#60A5FA" : "#A8E237",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              {usingGemini ? `Gemini AI -- ${modelName}` : "Local Analyzer"}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#8C8890" }}>
              Analyzing {profile.name}'s profile
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {ANALYSIS_STEPS_TEXT.map((text, i) => {
            const done = i < activeStep
            const active = i === activeStep
            return (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: done || active ? 1 : 0.2,
                  transition: "opacity 0.4s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: done ? "#A8E237" : "transparent",
                    border: done
                      ? "none"
                      : active
                        ? "2px solid #A8E237"
                        : "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                  }}
                >
                  {done && <Check style={{ width: 10, height: 10, color: "#0D0B12" }} />}
                  {active && (
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#A8E237",
                        display: "block",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: done || active ? "#F0EBE0" : "#8C8890",
                  }}
                >
                  {text}
                </span>
              </div>
            )
          })}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Processing
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "#A8E237",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: 2, background: "#1A1820", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", background: usingGemini ? "#60A5FA" : "#A8E237", borderRadius: 2 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
          {clubs.map((club, i) => (
            <div
              key={club.id}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                padding: "4px 6px",
                borderRadius: 2,
                border: i < scanned ? "1px solid rgba(168,226,55,0.25)" : "1px solid rgba(255,255,255,0.05)",
                background: i < scanned ? "rgba(168,226,55,0.08)" : "transparent",
                color: i < scanned ? "#A8E237" : "#3A3848",
                transition: "all 0.3s",
                textAlign: "center",
              }}
            >
              {club.shortName}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
