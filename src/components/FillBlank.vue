<template>
  <div class="fb-question">
    <div class="question-header">
      <span class="question-num">{{ index + 1 }}</span>
      <span class="question-type-tag">填空题</span>
      <span class="question-score">2分</span>
    </div>

    <!-- Multi-blank: inline inputs within text -->
    <p class="question-text" v-if="blankCount > 1">
      <template v-for="(seg, i) in textSegments" :key="i">
        <span>{{ seg }}</span>
        <input
          v-if="i < blankCount"
          v-model="userAnswers[i]"
          class="fill-input inline-input"
          :class="inputClass(i)"
          :disabled="isSubmitted || readonly"
          :placeholder="'答案' + (i + 1)"
          @keyup.enter="submit"
        />
      </template>
    </p>

    <!-- Single blank: highlight blanks, input below -->
    <p v-else class="question-text" v-html="formattedQuestion"></p>

    <div class="answer-area">
      <input
        v-if="blankCount === 1"
        v-model="userAnswer"
        class="fill-input"
        :class="{ 'correct': showResult && isCorrect, 'wrong': showResult && !isCorrect }"
        :disabled="isSubmitted || readonly"
        placeholder="请输入答案..."
        @keyup.enter="submit"
      />
      <button v-if="!readonly" class="btn btn-primary submit-btn" @click="submit" :disabled="!canSubmit">确认</button>
      <button v-if="!readonly && isSubmitted && showResult" class="btn btn-outline retry-btn" @click="retry">重新作答</button>
    </div>

    <div v-if="showResult" class="explanation" :class="isCorrect ? 'exp-correct' : 'exp-wrong'">
      <strong>{{ isCorrect ? '✓ 回答正确' : '✗ 回答错误' }}</strong>
      <div class="correct-answers" v-if="!isCorrect">
        <strong>正确答案：</strong>{{ displayAnswer }}
      </div>
      <div class="knowledge-ref">
        <strong>📖 知识点解析：</strong>
        <p>{{ question.explanation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: Object,
  index: Number,
  showResult: Boolean,
  savedAnswer: { type: String, default: '' },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['answer', 'retry'])

const blankCount = computed(() => {
  const matches = props.question.question.match(/_+/g)
  return matches ? matches.length : 1
})

const textSegments = computed(() => {
  return props.question.question.split(/_+/g)
})

const expectedAnswers = computed(() => {
  const parts = props.question.answer.split('|').map(a => a.trim())
  if (blankCount.value > 1 && parts.length === blankCount.value) {
    return parts.map(p => [p.toLowerCase()])
  }
  // Single blank or mismatch: treat all parts as alternatives for one blank
  return [parts.map(p => p.toLowerCase())]
})

const userAnswer = ref('')
const userAnswers = ref([])
const isSubmitted = ref(false)

// Initialize from savedAnswer for readonly/review mode
if (props.readonly && props.savedAnswer) {
  if (blankCount.value > 1) {
    userAnswers.value = props.savedAnswer.split('|').map(a => a.trim())
  } else {
    userAnswer.value = props.savedAnswer
  }
  isSubmitted.value = true
} else if (blankCount.value > 1) {
  userAnswers.value = Array(blankCount.value).fill('')
}

const formattedQuestion = computed(() => {
  return props.question.question.replace(/_+/g, '<span class="blank-spot">___</span>')
})

const displayAnswer = computed(() => {
  if (blankCount.value > 1) {
    const parts = props.question.answer.split('|')
    return parts.map((p, i) => `${i + 1}. ${p.trim()}`).join('；')
  }
  return props.question.answer.replace(/\|/g, ' / ')
})

const canSubmit = computed(() => {
  if (isSubmitted.value) return false
  if (blankCount.value > 1) {
    return userAnswers.value.every(a => a.trim())
  }
  return userAnswer.value.trim() !== ''
})

const isCorrect = computed(() => {
  if (blankCount.value > 1) {
    if (userAnswers.value.some(a => !a.trim())) return false
    if (userAnswers.value.length !== expectedAnswers.value.length) return false

    // Position-based matching
    const posMatch = userAnswers.value.every((ans, i) => {
      const normalized = ans.trim().toLowerCase()
      return expectedAnswers.value[i].includes(normalized)
    })
    if (posMatch) return true

    // Set-based matching (order-independent)
    const userSorted = userAnswers.value.map(a => a.trim().toLowerCase()).sort()
    const expectedSorted = expectedAnswers.value.map(e => e[0]).sort()
    return userSorted.every((u, i) => u === expectedSorted[i])
  }
  if (!userAnswer.value.trim()) return false
  const normalized = userAnswer.value.trim().toLowerCase()
  return expectedAnswers.value[0].includes(normalized)
})

function inputClass(i) {
  if (!isSubmitted.value) return {}
  if (i >= expectedAnswers.value.length) return { 'wrong': true }
  const normalized = (userAnswers.value[i] || '').trim().toLowerCase()
  if (expectedAnswers.value[i].includes(normalized)) return { 'correct': true }
  if (expectedAnswers.value.some(e => e.includes(normalized))) return { 'correct': true }
  return { 'wrong': true }
}

function submit() {
  if (!canSubmit.value) return
  isSubmitted.value = true
  const score = isCorrect.value ? 2 : 0
  const answer = blankCount.value > 1 ? userAnswers.value.join('|') : userAnswer.value
  emit('answer', { questionId: props.question.id, score, answer })
}

function retry() {
  isSubmitted.value = false
  userAnswer.value = ''
  userAnswers.value = blankCount.value > 1 ? Array(blankCount.value).fill('') : []
  emit('retry', { questionId: props.question.id })
}
</script>

<style scoped>
.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.question-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(217, 119, 6, 0.1);
  color: var(--warning);
  font-size: 13px;
  font-weight: 700;
}

.question-type-tag {
  font-size: 12px;
  color: var(--text-secondary);
}

.question-score {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.question-text {
  font-size: 15px;
  line-height: 2.2;
  margin-bottom: 16px;
}

:deep(.blank-spot) {
  display: inline-block;
  min-width: 80px;
  border-bottom: 2px dashed var(--accent);
  margin: 0 4px;
  color: var(--accent);
}

.inline-input {
  width: 130px;
  margin: 0 4px;
  vertical-align: baseline;
}

.answer-area {
  display: flex;
  gap: 10px;
  align-items: center;
}

.fill-input {
  flex: 1;
  padding: 10px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s;
}

.fill-input:focus {
  border-color: var(--accent);
}

.fill-input.correct {
  border-color: var(--success);
  background: var(--success-bg);
}

.fill-input.wrong {
  border-color: var(--danger);
  background: var(--danger-bg);
}

.fill-input:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.submit-btn {
  padding: 10px 20px;
  flex-shrink: 0;
}

.retry-btn {
  padding: 10px 20px;
  flex-shrink: 0;
  font-size: 13px;
}

.explanation {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  line-height: 1.6;
}

.exp-correct {
  background: var(--success-bg);
  border: 1px solid rgba(22, 163, 74, 0.15);
  color: var(--success);
}

.exp-wrong {
  background: var(--danger-bg);
  border: 1px solid rgba(220, 38, 38, 0.15);
  color: var(--danger);
}

.exp-wrong .correct-answers {
  margin-top: 6px;
  color: var(--success);
}

.explanation p {
  margin-top: 4px;
  color: var(--text-secondary);
}

.explanation strong {
  color: inherit;
}

.knowledge-ref {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.knowledge-ref strong {
  font-size: 12px;
  color: var(--accent);
}

.knowledge-ref p {
  margin-top: 4px;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 13px;
}
</style>
