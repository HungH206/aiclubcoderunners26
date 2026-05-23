import { motion } from "motion/react"
import { Check } from "lucide-react"
import { ETHNICITY_OPTIONS } from "../../data/options"
import QLabel from "../QLabel"
import NavButtons from "../NavButtons"

export default function Q3({ value, onChange, onNext, onBack }) {
  return (
    <motion.div
      key="q3"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <QLabel num="03 --" question={`WHAT'S YOUR\nNATIONALITY?`} hint="Helps us find clubs with cultural ties that match you." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {ETHNICITY_OPTIONS.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: "11px 14px",
                textAlign: "left",
                background: active ? "rgba(168,226,55,0.12)" : "#1A1820",
                border: active ? "1px solid #A8E237" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  color: active ? "#A8E237" : "#F0EBE0",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {opt}
              </span>
              {active && <Check style={{ width: 13, height: 13, color: "#A8E237", flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </motion.div>
  )
}
