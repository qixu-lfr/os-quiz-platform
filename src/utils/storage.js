import { getCurrentUser } from './user'

function scope(key) {
  const user = getCurrentUser()
  return user ? `${user}:${key}` : key
}

const HISTORY_KEY = 'os-quiz-history'

export function getHistory() {
  try {
    const data = localStorage.getItem(scope(HISTORY_KEY))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveRecord(record) {
  const history = getHistory()
  history.unshift({
    ...record,
    id: Date.now(),
    date: new Date().toLocaleString('zh-CN')
  })
  if (history.length > 100) history.length = 100
  localStorage.setItem(scope(HISTORY_KEY), JSON.stringify(history))
}

export function clearHistory() {
  localStorage.removeItem(scope(HISTORY_KEY))
}

const PROGRESS_PREFIX = 'os-quiz-progress:'

export function saveProgress(key, data) {
  try {
    localStorage.setItem(scope(PROGRESS_PREFIX + key), JSON.stringify(data))
  } catch { /* quota exceeded, ignore */ }
}

export function loadProgress(key) {
  try {
    const data = localStorage.getItem(scope(PROGRESS_PREFIX + key))
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function clearProgress(key) {
  localStorage.removeItem(scope(PROGRESS_PREFIX + key))
}
