import { Sparkles } from "lucide-react"
import ProgressBar from "./ProgressBar"

export default function QuizShell({ step, steps, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <div style={{ padding: "20px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, marginBottom: 20 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 4,
              background: "#A8E237",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles style={{ width: 12, height: 12, color: "#0D0B12" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 800,
              color: "#F0EBE0",
              marginLeft: 8,
            }}
          >
            CLUBMATCH<span style={{ color: "#A8E237" }}>AI</span>
          </span>
        </div>
        {(steps.includes(step) || step === "review") && (
          <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
            <ProgressBar step={step} steps={steps} />
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 0 48px",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%" }}>{children}</div>
      </div>
    </div>
  )
}
