export default function QLabel({ num, question, hint }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "#A8E237",
          letterSpacing: "0.2em",
          display: "block",
          marginBottom: 10,
        }}
      >
        {num}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
          fontWeight: 800,
          color: "#F0EBE0",
          lineHeight: 0.92,
          margin: 0,
        }}
      >
        {question}
      </h1>
      {hint && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "#8C8890",
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  )
}
