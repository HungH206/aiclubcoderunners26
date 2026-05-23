import { motion } from "motion/react"
import QLabel from "../QLabel"
import UnderlineInput from "../UnderlineInput"
import NavButtons from "../NavButtons"

export default function Q1({ value, onChange, onNext }) {
  return (
    <motion.div
      key="q1"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <QLabel num="01 --" question={`WHAT'S YOUR\nNAME?`} hint="This helps us personalize your results." />
      <UnderlineInput
        value={value}
        onChange={onChange}
        placeholder="e.g. Philippe Martinez"
        onEnter={() => value.trim() && onNext()}
      />
      <NavButtons showBack={false} onNext={onNext} nextDisabled={!value.trim()} />
    </motion.div>
  )
}
