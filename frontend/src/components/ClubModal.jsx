import { useEffect } from "react"
import { motion } from "motion/react"
import { Calendar, ExternalLink, Globe, MapPin, X } from "lucide-react"
import { CATEGORY_STYLE } from "../data/options"
import ScoreRing from "./ScoreRing"

export default function ClubModal({ result, onClose }) {
  const { club, score, matchReasons } = result
  const cat = CATEGORY_STYLE[club.category] ?? CATEGORY_STYLE.Professional

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 10,
          background: "#1A1820",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px 6px 0 0",
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        className="sm:rounded-md"
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#1A1820",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <ScoreRing score={score} size={44} />
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  padding: "1px 6px",
                  background: cat.bg,
                  color: cat.text,
                  borderRadius: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "inline-block",
                  marginBottom: 3,
                }}
              >
                {club.category}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#F0EBE0",
                  lineHeight: 1.1,
                }}
              >
                {club.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: 12, height: 12, color: "#8C8890" }} />
          </button>
        </div>
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 20 }}>
          <section>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.54rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 8,
              }}
            >
              Why you match
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {matchReasons.map((r) => (
                <span
                  key={r}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    padding: "4px 10px",
                    background: "rgba(168,226,55,0.12)",
                    border: "1px solid rgba(168,226,55,0.2)",
                    color: "#A8E237",
                    borderRadius: 3,
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </section>
          <section>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.54rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 8,
              }}
            >
              About
            </p>
            <p style={{ fontSize: "0.82rem", color: "#B0AAA0", lineHeight: 1.75 }}>{club.description}</p>
          </section>
          <section>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.54rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 10,
              }}
            >
              Upcoming Events
            </p>
            {club.events.map((ev) => (
              <div
                key={ev.name}
                style={{
                  background: "#0D0B12",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 3,
                  padding: "13px 15px",
                }}
              >
                <p style={{ fontWeight: 600, color: "#F0EBE0", fontSize: "0.84rem", marginBottom: 7 }}>
                  {ev.name}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#8C8890" }}>
                    <Calendar style={{ width: 11, height: 11, color: "#A8E237", opacity: 0.7 }} />
                    {ev.date}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#8C8890" }}>
                    <MapPin style={{ width: 11, height: 11, color: "#A8E237", opacity: 0.7 }} />
                    {ev.location}
                  </div>
                </div>
              </div>
            ))}
          </section>
          <section>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.54rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 10,
              }}
            >
              Officers
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {club.officers.map((o) => (
                <div
                  key={o.name}
                  style={{
                    background: "#0D0B12",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 3,
                    padding: "9px 13px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5rem",
                      color: "#8C8890",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 3,
                    }}
                  >
                    {o.role}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "#F0EBE0" }}>{o.name}</p>
                </div>
              ))}
            </div>
          </section>
          {club.address && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: "0.77rem", color: "#8C8890" }}>
              <MapPin style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2, color: "#A8E237", opacity: 0.7 }} />
              {club.address}
            </div>
          )}
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "13px",
              background: "#A8E237",
              color: "#0D0B12",
              fontFamily: "var(--font-display)",
              fontSize: "0.92rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 3,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#BEF264" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#A8E237" }}
          >
            <Globe style={{ width: 13, height: 13 }} />Visit Website
            <ExternalLink style={{ width: 11, height: 11, opacity: 0.7 }} />
          </a>
        </div>
      </motion.div>
    </div>
  )
}
