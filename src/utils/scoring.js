export function scoreChoice(question, selectedIndex) {
  return selectedIndex === question.answer ? 1 : 0
}

export function scoreFillBlank(question, userAnswer) {
  if (!userAnswer || !userAnswer.trim()) return 0
  const blankCount = (question.question.match(/_+/g) || []).length || 1
  const expectedParts = question.answer.split('|').map(a => a.trim().toLowerCase())

  if (blankCount > 1 && expectedParts.length === blankCount) {
    // Multi-blank: user answer is |-separated
    const userParts = userAnswer.split('|').map(a => a.trim().toLowerCase())
    if (userParts.length !== blankCount) return 0

    // Position-based matching
    if (userParts.every((p, i) => p && p === expectedParts[i])) return 2

    // Set-based matching (order-independent)
    const userSorted = [...userParts].sort()
    const expectedSorted = [...expectedParts].sort()
    return userSorted.every((u, i) => u === expectedSorted[i]) ? 2 : 0
  }

  // Single blank: | separates acceptable alternatives
  const normalized = userAnswer.trim().toLowerCase()
  return expectedParts.includes(normalized) ? 2 : 0
}

export const SHORT_ANSWER_SCORE = 5
export const ESSAY_SCORE = 10

export function calcChapterTotal() {
  return 15 * 1 + 10 * 2 + 5 * 5 + 3 * 10
}

export function calcExamTotal() {
  return 15 * 1 + 10 * 2 + 5 * 5 + 5 * 10
}
