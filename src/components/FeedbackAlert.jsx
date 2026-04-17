import { AnimatePresence, motion } from 'framer-motion'

const alertStyles = {
  success: 'border border-emerald-300/20 bg-emerald-500/15 text-emerald-100',
  error: 'border border-rose-300/20 bg-rose-500/15 text-rose-100',
}

export default function FeedbackAlert({ feedback, onOpenTokenHelp }) {
  const isTokenErrorHelp = feedback?.type === 'error' && feedback?.isTokenError

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
          {isTokenErrorHelp ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{feedback.message}</p>
                <p className="mt-2 text-rose-100/90">Your token may be invalid or expired.</p>
                <p className="text-rose-100/90">Please check eligibility and regenerate token.</p>
              </div>

              <div className="rounded-xl border border-rose-200/25 bg-black/20 p-3">
                <button
                  type="button"
                  onClick={onOpenTokenHelp}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300 transition hover:text-cyan-200 hover:underline"
                >
                  How to get token?
                </button>
              </div>
            </div>
          ) : (
            feedback.message
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}