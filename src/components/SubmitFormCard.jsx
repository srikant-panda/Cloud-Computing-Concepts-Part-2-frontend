import { AnimatePresence, motion } from 'framer-motion'
import useSubmit from '../hooks/useSubmit'
import FeedbackAlert from './FeedbackAlert'
import GlassCard from './GlassCard'

function Spinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
  )
}

export default function SubmitFormCard() {
  const {
    formData,
    updateField,
    handleSubmit,
    cancelActiveJob,
    isLoading,
    feedback,
    jobId,
    progressLabel,
  } = useSubmit()

  return (
    <GlassCard>
      <header className="mb-6 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-white">Enter your details</h1>
        <p className="text-muted mt-2">
          Securely send your credentials to continue to the next step.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-left">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/75">
            Email
          </span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={updateField('email')}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white placeholder:text-slate-400/80 outline-none transition duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/25"
          />
        </label>

        <label className="block text-left">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/75">
            Token
          </span>
          <input
            type="text"
            required
            value={formData.token}
            onChange={updateField('token')}
            placeholder="Paste your token"
            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white placeholder:text-slate-400/80 outline-none transition duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/25"
          />
        </label>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40 transition duration-300 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Submitting...</span>
            </>
          ) : (
            'Submit'
          )}
        </motion.button>

        <AnimatePresence>
          {isLoading && jobId ? (
            <motion.button
              type="button"
              onClick={cancelActiveJob}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition duration-300 hover:bg-rose-500/20"
            >
              Cancel
            </motion.button>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-center text-xs text-slate-300/90"
            >
              {progressLabel} Please wait. This can take up to 5 minutes. If it takes longer, reload and
              try again.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <FeedbackAlert feedback={feedback} />
      </form>
    </GlassCard>
  )
}