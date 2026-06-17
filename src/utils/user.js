const USER_KEY = 'os-quiz-current-user'
const USER_LIST_KEY = 'os-quiz-user-list'

export function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || ''
}

export function setCurrentUser(name) {
  const trimmed = name.trim()
  if (!trimmed) return
  localStorage.setItem(USER_KEY, trimmed)
  const users = getUserList()
  if (!users.includes(trimmed)) {
    users.push(trimmed)
    localStorage.setItem(USER_LIST_KEY, JSON.stringify(users))
  }
}

export function getUserList() {
  try {
    return JSON.parse(localStorage.getItem(USER_LIST_KEY)) || []
  } catch {
    return []
  }
}

export function removeUser(name) {
  const users = getUserList().filter(u => u !== name)
  localStorage.setItem(USER_LIST_KEY, JSON.stringify(users))
  // Clear that user's data
  const prefixes = [`${name}:os-quiz-history`, `${name}:os-quiz-progress:`]
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (prefixes.some(p => key.startsWith(p))) {
      localStorage.removeItem(key)
    }
  }
  if (getCurrentUser() === name) {
    localStorage.removeItem(USER_KEY)
  }
}
