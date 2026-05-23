import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react"
import { CATEGORY_STYLE } from "../data/options"
import ClubCard from "./ClubCard"
import ClubModal from "./ClubModal"
import ChatAnalyzer from "./ChatAnalyzer"
import ScoreRing from "./ScoreRing"

export default function ResultsStep({ profile, results, onRestart }) {
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState("results")
  const top = results[0]
  const topCat = top ? CATEGORY_STYLE[top.club.category] ?? CATEGORY_STYLE.Professional : null

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px 60px" }} className="lg:px-12">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <button
          onClick={onRestart}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "#8C8890",
            transition: "color 0.2s",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#F0EBE0" }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#8C8890" }}
        >
          <ArrowLeft style={{ width: 13, height: 13 }} />Start Over
        </button>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.54rem",
              color: "#8C8890",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Clubs for
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#F0EBE0",
            }}
          >
            {profile.name}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {[
          { key: "results", label: "Results" },
          { key: "chat", label: "Analyzer Chat" },
        ].map((tab) => {
          const active = view === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: active ? "1px solid rgba(168,226,55,0.6)" : "1px solid rgba(255,255,255,0.08)",
                background: active ? "rgba(168,226,55,0.12)" : "transparent",
                color: active ? "#A8E237" : "#8C8890",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {view === "results" && top && topCat && (
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "#A8E237",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}
          >
            <Sparkles style={{ width: 10, height: 10 }} />Top Match
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelected(top)}
            style={{
              background: "#1A1820",
              border: "1px solid rgba(168,226,55,0.25)",
              borderRadius: 5,
              padding: 22,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            className="group card-hover-strong"
          >
            <div
              style={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168,226,55,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <ScoreRing score={top.score} size={84} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    padding: "2px 7px",
                    background: topCat.bg,
                    color: topCat.text,
                    borderRadius: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "inline-block",
                    marginBottom: 6,
                  }}
                >
                  {top.club.category}
                </span>
                <h2
                  className="group-hover-text"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.3rem,2.5vw,1.65rem)",
                    fontWeight: 800,
                    color: "#F0EBE0",
                    marginBottom: 7,
                    transition: "color 0.2s",
                  }}
                >
                  {top.club.name}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {top.matchReasons.map((r) => (
                    <span
                      key={r}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.58rem",
                        padding: "2px 7px",
                        background: "rgba(168,226,55,0.1)",
                        color: "#A8E237",
                        borderRadius: 2,
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <p className="line-clamp-2" style={{ fontSize: "0.79rem", color: "#8C8890", lineHeight: 1.65 }}>
                  {top.club.description}
                </p>
              </div>
              <div
                className="flex items-center gap-1 group-hover-gap"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "#A8E237",
                  flexShrink: 0,
                  transition: "gap 0.2s",
                }}
              >
                View <ChevronRight style={{ width: 13, height: 13 }} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {view === "results" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.56rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              All {results.length} Organizations
            </p>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#8C8890" }}>
              {results.filter((r) => r.score >= 50).length} strong matches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.slice(1).map((r, i) => (
              <ClubCard key={r.club.id} result={r} rank={i + 1} onClick={() => setSelected(r)} />
            ))}
          </div>
        </>
      )}

      {view === "chat" && <ChatAnalyzer profile={profile} results={results} />}

      {selected && <ClubModal result={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
