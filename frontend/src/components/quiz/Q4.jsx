import { motion } from "motion/react"
import { Check } from "lucide-react"
import { INTEREST_OPTIONS } from "../../data/options"
import QLabel from "../QLabel"
import NavButtons from "../NavButtons"

export default function Q4({ value, onChange, onNext, onBack }) {
  const toggle = (i) => onChange(value.includes(i) ? value.filter((x) => x !== i) : [...value, i])

  return (
    <motion.div
      key="q4"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <QLabel
        num="04 --"
        question={`WHAT ARE YOUR\nINTERESTS?`}
        hint="Select everything that excites you -- the more you pick, the better the match."
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {INTEREST_OPTIONS.map((opt) => {
          const active = value.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: "9px 14px",
                background: active ? "rgba(168,226,55,0.12)" : "transparent",
                border: active ? "1px solid #A8E237" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              {active && <Check style={{ width: 11, height: 11, color: "#A8E237" }} />}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: active ? "#A8E237" : "#8C8890",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {opt}
              </span>
            </button>
          )
        })}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Review" />
    </motion.div>
  )
}
