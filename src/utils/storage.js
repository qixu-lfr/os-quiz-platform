const STORAGE_KEY = 'os-quiz-history'

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
