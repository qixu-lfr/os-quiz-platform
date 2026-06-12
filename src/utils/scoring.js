export function scoreChoice(question, selectedIndex) {
  return selectedIndex === question.answer ? 1 : 0
}

export function scoreFillBlank(question, userAnswer) {
  if (!userAnswer || !userAnswer.trim()) return 0
  const normalized = userAnswer.trim().toLowerCase()
  const acceptedAnswers = question.answer.split('|').map(a => a.trim().toLowerCase())
  return acceptedAnswers.includes(normalized) ? 2 : 0
}

export const SHORT_ANSWER_SCORE = 5
export const ESSAY_SCORE = 10

export function calcChapterTotal() {
  return 15 * 1 + 10 * 2 + 5 * 5 + 3 * 10
}

export function calcExamTotal() {
  return 15 * 1 + 10 * 2 + 5 * 5 + 5 * 10
}
