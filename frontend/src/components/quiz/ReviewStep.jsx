import { motion } from "motion/react"
import NavButtons from "../NavButtons"

export default function ReviewStep({ profile, onBack, onFind }) {
  const fields = [
    { label: "Name", value: profile.name },
    { label: "Major", value: profile.major },
    { label: "Background", value: profile.ethnicity },
  ]

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div style={{ marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "#A8E237",
            letterSpacing: "0.2em",
          }}
        >
          FINAL CHECK --
        </span>
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3.4rem)",
          fontWeight: 800,
          color: "#F0EBE0",
          lineHeight: 0.92,
          marginBottom: 32,
        }}
      >
        DOES THIS
        <br />
        LOOK RIGHT?
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {fields.map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#1A1820",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "14px 18px",
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.56rem",
                color: "#8C8890",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                minWidth: 88,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "#F0EBE0",
                fontWeight: 500,
              }}
            >
              {value}
            </span>
          </div>
        ))}
        <div
          style={{
            background: "#1A1820",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            padding: "14px 18px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.56rem",
              color: "#8C8890",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              display: "block",
              marginBottom: 10,
            }}
          >
            Interests
          </span>
          {profile.interests.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.interests.map((i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    padding: "3px 8px",
                    background: "rgba(168,226,55,0.1)",
                    color: "#A8E237",
                    borderRadius: 20,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "0.82rem", color: "#3A3848" }}>None selected</span>
          )}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onFind} nextLabel="Find My Clubs" />
    </motion.div>
  )
}
