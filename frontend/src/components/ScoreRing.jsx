import { motion } from "motion/react"

export default function ScoreRing({ score, size = 64 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const c = size / 2
  const fs = size < 56 ? 9 : size < 72 ? 12 : 15

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(168,226,55,0.12)" strokeWidth="5" />
      <motion.circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="#A8E237"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (score / 100) * circ }}
        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text
        x={c}
        y={c + fs * 0.38}
        textAnchor="middle"
        fill="#A8E237"
        fontSize={fs}
        fontWeight="700"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {score}%
      </text>
    </svg>
  )
}
