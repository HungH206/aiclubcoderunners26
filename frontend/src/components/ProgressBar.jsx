export default function ProgressBar({ step, steps }) {
  const idx = steps.indexOf(step)
  const isReview = step === "review"
  const filled = isReview ? steps.length : idx + 1

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {steps.map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            background: i < filled ? "#A8E237" : "rgba(255,255,255,0.1)",
            transition: "background 0.4s ease",
          }}
        />
      ))}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          color: "#8C8890",
          marginLeft: 8,
          whiteSpace: "nowrap",
        }}
      >
        {isReview ? "READY" : `${idx + 1} of ${steps.length}`}
      </span>
    </div>
  )
}
