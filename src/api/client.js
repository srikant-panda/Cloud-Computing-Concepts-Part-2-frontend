import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const HEALTH_ENDPOINT = import.meta.env.VITE_HEALTH_ENDPOINT || '/health'

function formatFastApiValidationErrors(detail) {
  if (!Array.isArray(detail)) {
    return null
  }

  return detail
    .map((item) => {
      const location = Array.isArray(item?.loc) ? item.loc.slice(1).join('.') : 'field'
      const reason = item?.msg || 'Invalid value'
      return `${location}: ${reason}`
    })
    .join(' | ')
}

function normalizeError(error) {
  const status = error.response?.status ?? null
  const code = error.code ?? null
  const data = error.response?.data
  const isTimeout = code === 'ECONNABORTED'
  const isNetworkError = !error.response

  if (isTimeout) {
    return {
      status,
      code,
      message: 'Request timed out after 5 minutes. Please try again.',
      raw: error,
    }
  }

  if (isNetworkError) {
    return {
      status,
      code,
      message: 'Cannot reach backend service. Verify that the API server is running and VITE_API_BASE_URL is correct.',
      raw: error,
    }
  }

  const validationMessage = formatFastApiValidationErrors(data?.detail)
  const message =
    (typeof data?.detail === 'string' && data.detail) ||
    validationMessage ||
    data?.message ||
    error.message ||
    'Unable to complete your request right now.'

  return {
    status,
    code,
    message,
    raw: error,
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
)

export function submitDetails(payload) {
  return client.post('/submit', payload).then((response) => response.data)
}

export function getSubmissionStatus(jobId) {
  return client.get(`/status/${jobId}`).then((response) => response.data)
}

export function cancelSubmission(jobId) {
  return client.post(`/cancel/${jobId}`).then((response) => response.data)
}

export function getCancelUrl(jobId) {
  const path = `/cancel/${jobId}`

  if (!API_BASE_URL) {
    return path
  }

  try {
    return new URL(path, API_BASE_URL).toString()
  } catch {
    return path
  }
}

export function checkBackendHealth() {
  return client.get(HEALTH_ENDPOINT, { timeout: 5000 }).then((response) => response.data)
}

export default client