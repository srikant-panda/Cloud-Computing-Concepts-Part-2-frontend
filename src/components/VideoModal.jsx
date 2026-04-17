import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function VideoModal({ isOpen, onClose, title, src, description, linkUrl }) {
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)
    updateIsMobile()

    mediaQuery.addEventListener('change', updateIsMobile)
    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  const useLightweightMotion = prefersReducedMotion || isMobile
  const overlayAnimation = useMemo(
    () => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }),
    [],
  )
  const contentAnimation = useMemo(
    () =>
      useLightweightMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { opacity: 0, y: 18, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 18, scale: 0.98 },
          },
    [useLightweightMotion],
  )

  useEffect(() => {
    if (!isOpen || !videoRef.current || !src) {
      return
    }

    // Browsers often require muted autoplay, so we retry programmatically on open.
    const playPromise = videoRef.current.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  }, [isOpen, src])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          initial={overlayAnimation.initial}
          animate={overlayAnimation.animate}
          exit={overlayAnimation.exit}
          transition={{ duration: useLightweightMotion ? 0.16 : 0.22, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-4xl rounded-2xl border border-white/15 bg-slate-950/95 p-5 shadow-2xl shadow-black/50 will-change-transform md:p-6"
            initial={contentAnimation.initial}
            animate={contentAnimation.animate}
            exit={contentAnimation.exit}
            transition={{ duration: useLightweightMotion ? 0.16 : 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white md:text-xl">{title}</h2>
                {description ? <p className="mt-1 text-sm text-slate-300/90">{description}</p> : null}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/20 px-2.5 py-1 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            {src ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                preload="metadata"
                playsInline
                className="aspect-video w-full rounded-xl border border-white/15 bg-black"
                src={src}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-6 text-center text-sm text-slate-200/90">
                No video for this semester. Use the link below.
              </div>
            )}

            {linkUrl ? (
              <p className="mt-3 text-sm text-slate-200/95">
                Click this link and follow the video:{' '}
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-cyan-300 underline decoration-cyan-300/80 underline-offset-2 transition hover:text-cyan-200"
                >
                  {linkUrl}
                </a>
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
