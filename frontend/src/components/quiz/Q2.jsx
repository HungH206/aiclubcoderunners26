import { motion } from "motion/react"
import QLabel from "../QLabel"
import UnderlineInput from "../UnderlineInput"
import NavButtons from "../NavButtons"

export default function Q2({ value, onChange, onNext, onBack }) {
  return (
    <motion.div
      key="q2"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <QLabel num="02 --" question={`WHAT'S YOUR\nMAJOR?`} hint="Type your field of study or area of focus." />
      <UnderlineInput
        value={value}
        onChange={onChange}
        placeholder="e.g. Computer Science, Nursing, Business..."
        onEnter={() => value.trim() && onNext()}
      />
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!value.trim()} />
    </motion.div>
  )
}
