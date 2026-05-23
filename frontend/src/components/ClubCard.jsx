import { motion } from "motion/react"
import { Calendar, ChevronRight } from "lucide-react"
import { CATEGORY_STYLE } from "../data/options"
import ScoreRing from "./ScoreRing"

export default function ClubCard({ result, rank, onClick }) {
  const { club, score, matchReasons } = result
  const cat = CATEGORY_STYLE[club.category] ?? CATEGORY_STYLE.Professional

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      onClick={onClick}
      style={{
        background: "#1A1820",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4,
        padding: 18,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 11,
        transition: "border-color 0.2s",
      }}
      className="group card-hover"
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <ScoreRing score={score} size={54} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              padding: "2px 6px",
              background: cat.bg,
              color: cat.text,
              borderRadius: 2,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "inline-block",
              marginBottom: 4,
            }}
          >
            {club.category}
          </span>
          <h3
            className="group-hover-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.98rem",
              fontWeight: 700,
              color: "#F0EBE0",
              lineHeight: 1.2,
              transition: "color 0.2s",
            }}
          >
            {club.name}
          </h3>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {matchReasons.map((r) => (
          <span
            key={r}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.56rem",
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
      <p className="line-clamp-2" style={{ fontSize: "0.76rem", color: "#8C8890", lineHeight: 1.6 }}>
        {club.description}
      </p>
      {club.events[0] && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 10,
            fontSize: "0.68rem",
            color: "#8C8890",
          }}
        >
          <Calendar
            style={{
              width: 11,
              height: 11,
              flexShrink: 0,
              marginTop: 1,
              color: "#A8E237",
              opacity: 0.7,
            }}
          />
          <span>
            <span style={{ color: "#F0EBE0", opacity: 0.8 }}>{club.events[0].name}</span> --
            {club.events[0].date.split("·")[0].trim()}
          </span>
        </div>
      )}
      <div
        className="flex items-center gap-1 group-hover-gap"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "#A8E237",
          transition: "gap 0.2s",
        }}
      >
        View Details <ChevronRight style={{ width: 11, height: 11 }} />
      </div>
    </motion.div>
  )
}
