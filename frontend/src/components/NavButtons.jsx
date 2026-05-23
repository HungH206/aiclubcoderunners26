import { ArrowLeft, ArrowRight } from "lucide-react"

export default function NavButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  showBack = true,
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
      <div>
        {showBack && onBack && (
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8C8890",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F0EBE0" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8C8890" }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 3,
          border: "none",
          cursor: nextDisabled ? "not-allowed" : "pointer",
          background: nextDisabled ? "rgba(168,226,55,0.2)" : "#A8E237",
          color: nextDisabled ? "rgba(168,226,55,0.4)" : "#0D0B12",
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!nextDisabled) e.currentTarget.style.background = "#BEF264"
        }}
        onMouseLeave={(e) => {
          if (!nextDisabled) e.currentTarget.style.background = "#A8E237"
        }}
      >
        {nextLabel} <ArrowRight style={{ width: 15, height: 15 }} />
      </button>
    </div>
  )
}
