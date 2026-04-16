import { AnimatePresence, motion } from 'framer-motion'

const alertStyles = {
  success: 'border border-emerald-300/20 bg-emerald-500/15 text-emerald-100',
  error: 'border border-rose-300/20 bg-rose-500/15 text-rose-100',
}

export default function FeedbackAlert({ feedback }) {
  return (
    <AnimatePresence mode="wait">
      {feedback ? (
        <motion.div
          key={feedback.type + feedback.message}
          initial={{ opacity: 0, y: 8 }}
          animate={
            feedback.type === 'error'
              ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }
              : { opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`rounded-xl px-4 py-3 text-sm font-medium ${alertStyles[feedback.type]}`}
        >
          {feedback.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}