import { useEffect, useMemo, useState } from 'react'
import { checkBackendHealth } from '../api/client'

const POLL_INTERVAL_MS = 3000

export default function BackendHealthIndicator({ semester = 'SEM-4' }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let isMounted = true
    setStatus('checking')

    const runHealthCheck = async () => {
      try {
        await checkBackendHealth(semester)
        if (isMounted) {
          setStatus('up')
        }
      } catch {
        if (isMounted) {
          setStatus('down')
        }
      }
    }

    runHealthCheck()
    const intervalId = window.setInterval(runHealthCheck, POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [semester])

  const indicator = useMemo(() => {
    const suffix = semester === 'SEM-3' || semester === 'SEM-4' ? ` (${semester})` : ''

    if (status === 'up') {
      return {
        dotClass: 'bg-emerald-400',
        label: `Backend running${suffix}`,
      }
    }

    if (status === 'down') {
      return {
        dotClass: 'bg-rose-400',
        label: `Backend offline${suffix}`,
      }
    }

    return {
      dotClass: 'bg-amber-300 animate-pulse',
      label: `Checking backend${suffix}...`,
    }
  }, [status, semester])

  return (
    <div className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-100 backdrop-blur-sm">
      <span className="inline-flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${indicator.dotClass}`} />
        {indicator.label}
      </span>
    </div>
  )
}
