import { useEffect, useRef } from "react"

export default function UnderlineInput({
  value,
  onChange,
  placeholder,
  onEnter,
  autoFocus = true,
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!autoFocus) return
    const t = setTimeout(() => ref.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [autoFocus])

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid rgba(255,255,255,0.18)",
        outline: "none",
        color: "#F0EBE0",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        fontWeight: 700,
        padding: "10px 0 12px",
        letterSpacing: "0.01em",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => { e.target.style.borderBottomColor = "#A8E237" }}
      onBlur={(e) => { e.target.style.borderBottomColor = "rgba(255,255,255,0.18)" }}
    />
  )
}
