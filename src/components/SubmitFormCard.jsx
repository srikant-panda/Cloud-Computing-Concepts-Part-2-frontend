import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import useSubmit from '../hooks/useSubmit'
import FeedbackAlert from './FeedbackAlert'
import GlassCard from './GlassCard'

function Spinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
  )
}

export default function SubmitFormCard({ onOpenTokenHelp, onSemesterChange }) {
  const {
    formData,
    updateField,
    handleSubmit,
    cancelActiveJob,
    isLoading,
    feedback,
    jobId,
    jobStatus,
    progressLabel,
  } = useSubmit()

  const openTokenHelp = () => {
    if (!formData.semester) {
      return
    }

    if (typeof onOpenTokenHelp === 'function') {
      onOpenTokenHelp(formData.semester)
    }
  }

  const [isSemesterMenuOpen, setSemesterMenuOpen] = useState(false)
  const semesterMenuRef = useRef(null)
  const semesterOptions = ['SEM-3', 'SEM-4']
  const [terminalLines, setTerminalLines] = useState([])
  const [terminalVisible, setTerminalVisible] = useState(false)
  const terminalScrollRef = useRef(null)
  const prevIsLoadingRef = useRef(false)
  const lastLoggedStatusRef = useRef(null)
  const simulationTimersRef = useRef([])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!semesterMenuRef.current?.contains(event.target)) {
        setSemesterMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  useEffect(() => {
    if (!terminalScrollRef.current) {
      return
    }

    terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
  }, [terminalLines])

  useEffect(() => {
    return () => {
      simulationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      simulationTimersRef.current = []
    }
  }, [])

  const appendTerminalLine = (line) => {
    setTerminalLines((current) => [...current, line])
  }

  useEffect(() => {
    if (isLoading && !prevIsLoadingRef.current) {
      simulationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      simulationTimersRef.current = []

      setTerminalVisible(true)
      setTerminalLines([])
      lastLoggedStatusRef.current = null

      appendTerminalLine('> Initializing submission...')
      appendTerminalLine('> Creating job...')
      appendTerminalLine('> Initializing...')

      simulationTimersRef.current.push(
        window.setTimeout(() => {
          appendTerminalLine('> Preparing environment...')
        }, 500),
      )
      simulationTimersRef.current.push(
        window.setTimeout(() => {
          appendTerminalLine('> Starting grader...')
        }, 1000),
      )
    }

    prevIsLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    if (!terminalVisible || !jobStatus || lastLoggedStatusRef.current === jobStatus) {
      return
    }

    const statusLogMap = {
      running: '> Job started...',
      grading: '> Running tests...',
      submitting: '> Submitting to Coursera...',
      done: '> ✅ Submission successful',
      failed: '> ❌ Submission failed',
      killed: '> ⚠️ Job cancelled',
    }

    const message = statusLogMap[jobStatus]
    if (message) {
      appendTerminalLine(message)
      lastLoggedStatusRef.current = jobStatus
    }
  }, [jobStatus, terminalVisible])

  useEffect(() => {
    if (!terminalVisible || !feedback) {
      return
    }

    if (feedback.type === 'error' && feedback.message) {
      appendTerminalLine(`> Error: ${feedback.message}`)
    }
  }, [feedback, terminalVisible])

  const isSemesterSelected = Boolean(formData.semester)
  const selectedSemesterLabel = isSemesterSelected ? formData.semester : 'Select semester'
  const semesterSelectClass = [
    'w-full rounded-xl border bg-gradient-to-br px-4 py-3 pr-12 text-left',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_30px_rgba(0,0,0,0.28)]',
    'outline-none transition duration-300 focus:ring-4 focus:ring-cyan-400/25',
    isSemesterSelected
      ? 'border-cyan-300/45 from-slate-900 to-slate-800 text-cyan-100 focus:border-cyan-300'
      : 'border-slate-300/20 from-slate-950/95 to-slate-800/90 text-slate-300 focus:border-cyan-300',
  ].join(' ')

  const chooseSemester = (semester) => {
    updateField('semester')({ target: { value: semester } })
    if (typeof onSemesterChange === 'function') {
      onSemesterChange(semester)
    }
    setSemesterMenuOpen(false)
  }

  const disableInputs = isLoading
  const tokenHelpLabel =
    formData.semester === 'SEM-3'
      ? 'How to get SEM-3 token?'
      : formData.semester === 'SEM-4'
        ? 'How to get SEM-4 token?'
        : 'How to get token?'

  return (
    <div className="relative mx-auto w-full max-w-[980px]">
      <div className="mx-auto w-full max-w-[560px]">
        <motion.div layout transition={{ duration: 0.28, ease: 'easeInOut' }}>
          <GlassCard>
          <header className="mb-6 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">Enter your details</h1>
            <p className="text-muted mt-2">
              Securely send your credentials to continue to the next step.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`space-y-4 transition duration-300 ${disableInputs ? 'opacity-55' : ''}`}>
            <label className="block text-left">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/75">
                Email <span className="text-rose-300">*</span>
              </span>
              <input
                type="email"
                required
                disabled={disableInputs}
                value={formData.email}
                onChange={updateField('email')}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-teal-100/20 bg-black/20 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition duration-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/25"
              />
            </label>

            <label className="block text-left">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/75">
                Semester <span className="text-rose-300">*</span>
              </span>
              <div ref={semesterMenuRef} className="relative">
                <button
                  type="button"
                  disabled={disableInputs}
                  onClick={() => setSemesterMenuOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={isSemesterMenuOpen}
                  className={semesterSelectClass}
                >
                  {selectedSemesterLabel}
                </button>

                <input
                  type="text"
                  value={formData.semester}
                  readOnly
                  required
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />

                <AnimatePresence>
                  {isSemesterMenuOpen ? (
                    <motion.ul
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      role="listbox"
                      className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-cyan-200/25 bg-slate-950/95 p-1 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur"
                    >
                      {semesterOptions.map((option) => {
                        const isActive = formData.semester === option
                        return (
                          <li key={option}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              disabled={disableInputs}
                              onClick={() => chooseSemester(option)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                isActive
                                  ? 'bg-cyan-400/20 text-cyan-100'
                                  : 'text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-100'
                              }`}
                            >
                              <span>{option}</span>
                              {isActive ? (
                                <span className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/85">
                                  Selected
                                </span>
                              ) : null}
                            </button>
                          </li>
                        )
                      })}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-cyan-200/25 bg-gradient-to-b from-cyan-400/20 to-teal-400/10 text-cyan-200 shadow-inner"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </label>

            <AnimatePresence initial={false}>
              {isSemesterSelected ? (
                <motion.div
                  key="token-fields"
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <label className="block text-left">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/75">
                      Token <span className="text-rose-300">*</span>
                    </span>
                    <input
                      type="text"
                      required
                      disabled={disableInputs}
                      value={formData.token}
                      onChange={updateField('token')}
                      placeholder="Paste your token"
                      className="w-full rounded-xl border border-teal-100/20 bg-black/20 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition duration-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/25"
                    />

                    <button
                      type="button"
                      onClick={openTokenHelp}
                      disabled={disableInputs}
                      className="mt-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200 hover:underline"
                    >
                      {tokenHelpLabel}
                    </button>
                  </label>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={disableInputs}
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
            </div>

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

            <FeedbackAlert feedback={feedback} onOpenTokenHelp={openTokenHelp} />
          </form>
          </GlassCard>
        </motion.div>
      </div>

      <AnimatePresence>
        {terminalVisible ? (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="mt-6 h-[320px] overflow-hidden rounded-xl border border-emerald-300/20 bg-[#050706] shadow-[0_18px_45px_rgba(0,0,0,0.45)] lg:absolute lg:left-[calc(50%+304px)] lg:top-0 lg:mt-0 lg:h-[420px] lg:w-[360px]"
          >
            <div className="flex items-center justify-between border-b border-emerald-300/15 bg-gradient-to-r from-emerald-900/20 to-transparent px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/90">
                Live Execution
              </p>
              <span className="text-[11px] text-emerald-300/80">session: submit</span>
            </div>

            <div
              ref={terminalScrollRef}
              className="h-[calc(100%-37px)] overflow-y-auto px-3 py-3 font-mono text-sm leading-6 text-emerald-100"
            >
              {terminalLines.map((line, index) => (
                <p key={`${line}-${index}`} className="whitespace-pre-wrap break-words text-emerald-100/95">
                  {line}
                </p>
              ))}
              <span className="inline-block h-4 w-2 translate-y-1 animate-pulse bg-emerald-300/80" />

              {feedback?.type === 'error' && feedback?.isTokenError ? (
                <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-500/10 p-3">
                  <p className="text-xs text-amber-100/90">
                    Token appears invalid or expired. Open token help video guide:
                  </p>
                  <button
                    type="button"
                    onClick={openTokenHelp}
                    className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-200 hover:underline"
                  >
                    Open token help
                  </button>
                </div>
              ) : null}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}