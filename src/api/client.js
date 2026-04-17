import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_BASE_URL_1 = import.meta.env.VITE_API_BASE_URL_1 || ''
const API_BASE_URL_2 = import.meta.env.VITE_API_BASE_URL_2 || ''
const HEALTH_ENDPOINT = import.meta.env.VITE_HEALTH_ENDPOINT || '/health'

function resolveApiBaseUrl(semester = 'SEM-4') {
  if (semester === 'SEM-3') {
    return API_BASE_URL_1 || API_BASE_URL_2 || API_BASE_URL
  }

  return API_BASE_URL_2 || API_BASE_URL_1 || API_BASE_URL
}

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
  const detail = data?.detail
  const path = error.config?.url ?? null
  const method = error.config?.method ? String(error.config.method).toUpperCase() : null
  const isTimeout = code === 'ECONNABORTED'
  const isNetworkError = !error.response

  if (isTimeout) {
    return {
      status,
      code,
      detail,
      path,
      method,
      message: 'Request timed out after 5 minutes. Please try again.',
      raw: error,
    }
  }

  if (isNetworkError) {
    return {
      status,
      code,
      detail,
      path,
      method,
      message: 'Cannot reach backend service.',
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
    detail,
    path,
    method,
    message,
    raw: error,
  }
}

const clientsByBaseUrl = new Map()

function createClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeError(error)),
  )

  return client
}

function getClient(semester) {
  const baseURL = resolveApiBaseUrl(semester)

  if (!clientsByBaseUrl.has(baseURL)) {
    clientsByBaseUrl.set(baseURL, createClient(baseURL))
  }

  return clientsByBaseUrl.get(baseURL)
}

export function submitDetails(payload, semester) {
  return getClient(semester)
    .post('/submit', payload)
    .then((response) => response.data)
}

export function getSubmissionStatus(jobId, semester) {
  return getClient(semester)
    .get(`/status/${jobId}`)
    .then((response) => response.data)
}

export function cancelSubmission(jobId, semester) {
  return getClient(semester)
    .post(`/cancel/${jobId}`)
    .then((response) => response.data)
}

export function getCancelUrl(jobId, semester) {
  const path = `/cancel/${jobId}`
  const apiBaseUrl = resolveApiBaseUrl(semester)

  if (!apiBaseUrl) {
    return path
  }

  try {
    return new URL(path, apiBaseUrl).toString()
  } catch {
    return path
  }
}

export function checkBackendHealth(semester) {
  return getClient(semester)
    .get(HEALTH_ENDPOINT, {
      timeout: 5000,
      // Any non-5xx HTTP response means server is reachable, even if /health is not defined.
      validateStatus: () => true,
    })
    .then((response) => {
      if (response.status < 500) {
        return { reachable: true, status: response.status }
      }

      throw {
        status: response.status,
        message: `Health endpoint returned ${response.status}`,
      }
    })
}

export default getClient('SEM-4')