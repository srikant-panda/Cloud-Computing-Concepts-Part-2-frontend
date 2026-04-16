import { useEffect, useRef, useState } from 'react'
import {
  cancelSubmission,
  getCancelUrl,
  getSubmissionStatus,
  submitDetails,
} from '../api/client'

const STORAGE_JOB_ID_KEY = 'submit_job_id'
const STORAGE_FORM_KEY = 'submit_form_data'
const POLL_INTERVAL_MS = 2000

const statusLabels = {
  running: 'Starting...',
  grading: 'Running tests...',
  submitting: 'Submitting...',
}

function readStoredForm() {
  try {
    const raw = localStorage.getItem(STORAGE_FORM_KEY)
    if (!raw) {
      return { email: '', token: '' }
    }

    const parsed = JSON.parse(raw)
    return {
      email: parsed?.email || '',
      token: parsed?.token || '',
    }
  } catch {
    return { email: '', token: '' }
  }
}

function clearStoredJob() {
  localStorage.removeItem(STORAGE_JOB_ID_KEY)
}

function storeForm(formData) {
  localStorage.setItem(STORAGE_FORM_KEY, JSON.stringify(formData))
}

export default function useSubmit() {
  const [formData, setFormData] = useState(readStoredForm)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [jobId, setJobId] = useState(() => localStorage.getItem(STORAGE_JOB_ID_KEY))
  const [jobStatus, setJobStatus] = useState('idle')
  const pollTimerRef = useRef(null)

  const stopPolling = () => {
    if (pollTimerRef.current) {
      window.clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  const schedulePoll = (currentJobId, immediate = false) => {
    stopPolling()

    pollTimerRef.current = window.setTimeout(
      () => {
        void pollJobStatus(currentJobId)
      },
      immediate ? 0 : POLL_INTERVAL_MS,
    )
  }

  const pollJobStatus = async (currentJobId) => {
    if (!currentJobId) {
      return
    }

    try {
      const statusData = await getSubmissionStatus(currentJobId)
      const status = statusData?.status
      const result = statusData?.result

      if (status === 'done') {
        stopPolling()
        clearStoredJob()
        setJobId(null)
        setJobStatus('done')
        setIsLoading(false)
        setFeedback({
          type: 'success',
          message:
            result?.data?.message ||
            result?.message ||
            'Application submitted successfully. Check your progress on Coursera.',
        })
        return
      }

      if (status === 'failed') {
        const error = result?.error || ''
        const isTokenError = /token/i.test(error)

        stopPolling()
        clearStoredJob()
        setJobId(null)
        setJobStatus('failed')
        setIsLoading(false)
        setFeedback({
          type: 'error',
          message: error || 'Submission failed. Please try again.',
          isTokenError,
        })
        return
      }

      if (status === 'killed') {
        stopPolling()
        clearStoredJob()
        setJobId(null)
        setJobStatus('killed')
        setIsLoading(false)
        setFeedback({
          type: 'error',
          message: 'Submission cancelled.',
        })
        return
      }

      setIsLoading(true)
      setJobStatus(status || 'running')
      schedulePoll(currentJobId)
    } catch (error) {
      stopPolling()
      setIsLoading(false)
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to fetch submission status.',
      })
    }
  }

  useEffect(() => {
    storeForm(formData)
  }, [formData])

  useEffect(() => {
    const activeJobId = localStorage.getItem(STORAGE_JOB_ID_KEY)
    if (!activeJobId) {
      return undefined
    }

    setJobId(activeJobId)
    setJobStatus('running')
    setIsLoading(true)
    setFeedback(null)
    schedulePoll(activeJobId, true)

    return () => {
      stopPolling()
    }
  }, [])

  useEffect(() => {
    const hasActiveJob = Boolean(jobId) && !['done', 'failed', 'killed'].includes(jobStatus)

    if (!hasActiveJob) {
      window.onbeforeunload = null
      return undefined
    }

    window.onbeforeunload = () => 'Submission in progress. Leaving will cancel it.'

    const cancelOnExit = () => {
      if (!jobId) {
        return
      }
      navigator.sendBeacon(getCancelUrl(jobId))
    }

    window.addEventListener('pagehide', cancelOnExit)

    return () => {
      window.onbeforeunload = null
      window.removeEventListener('pagehide', cancelOnExit)
    }
  }, [jobId, jobStatus])

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const email = formData.email.trim()
    const token = formData.token.trim()

    if (!email || !token) {
      setFeedback({
        type: 'error',
        message: 'Email and token are required.',
      })
      return
    }

    setFeedback(null)
    setIsLoading(true)
    setJobStatus('running')

    try {
      const data = await submitDetails({ email, token })
      const newJobId = data?.job_id

      if (!newJobId) {
        throw new Error('Backend did not return a job ID.')
      }

      localStorage.setItem(STORAGE_JOB_ID_KEY, newJobId)
      setJobId(newJobId)
      setFeedback(null)
      schedulePoll(newJobId, true)

    } catch (error) {
      clearStoredJob()
      setJobId(null)
      setJobStatus('failed')
      setFeedback({
        type: 'error',
        message: error.message || 'Submission failed. Please try again.',
      })
      setIsLoading(false)
    }
  }

  const cancelActiveJob = async () => {
    if (!jobId) {
      setFeedback({
        type: 'error',
        message: 'No active job to cancel.',
      })
      return
    }

    try {
      await cancelSubmission(jobId)
      stopPolling()
      clearStoredJob()
      setJobId(null)
      setJobStatus('killed')
      setIsLoading(false)
      setFeedback({
        type: 'error',
        message: 'Submission cancelled.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to cancel the current submission.',
      })
    }
  }

  return {
    formData,
    updateField,
    handleSubmit,
    cancelActiveJob,
    isLoading,
    feedback,
    jobId,
    jobStatus,
    progressLabel: statusLabels[jobStatus] || 'Processing...',
  }
}