import { AnimatePresence, motion } from 'framer-motion'
import useSubmit from '../hooks/useSubmit'
import FeedbackAlert from './FeedbackAlert'
import GlassCard from './GlassCard'

function Spinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
  )
}

export default function SubmitFormCard({ onOpenTokenHelp }) {
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
            className="w-full rounded-xl border border-teal-100/20 bg-black/20 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition duration-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/25"
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
            className="w-full rounded-xl border border-teal-100/20 bg-black/20 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition duration-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/25"
          />

          <button
            type="button"
            onClick={onOpenTokenHelp}
            className="mt-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200 hover:underline"
          >
            How to get token?
          </button>
        </label>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-900/40 transition duration-300 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-70"
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

        <FeedbackAlert feedback={feedback} onOpenTokenHelp={onOpenTokenHelp} />
      </form>
    </GlassCard>
  )
}