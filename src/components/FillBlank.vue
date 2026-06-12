<template>
  <div class="fb-question">
    <div class="question-header">
      <span class="question-num">{{ index + 1 }}</span>
      <span class="question-type-tag">填空题</span>
      <span class="question-score">2分</span>
    </div>
    <p class="question-text" v-html="formattedQuestion"></p>
    <div class="answer-area">
      <input
        v-model="userAnswer"
        class="fill-input"
        :class="{ 'correct': showResult && isCorrect, 'wrong': showResult && !isCorrect }"
        placeholder="请输入答案..."
        @keyup.enter="submit"
      />
      <button class="btn btn-primary submit-btn" @click="submit" :disabled="!userAnswer.trim()">确认</button>
    </div>
    <div v-if="showResult" class="explanation" :class="isCorrect ? 'exp-correct' : 'exp-wrong'">
      <strong>{{ isCorrect ? '✓ 回答正确' : '✗ 回答错误' }}</strong>
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
  showResult: Boolean
})

const emit = defineEmits(['answer'])
const userAnswer = ref('')

const formattedQuestion = computed(() => {
  return props.question.question.replace(/_+/g, '<span class="blank-spot">___</span>')
})

const isCorrect = computed(() => {
  if (!userAnswer.value.trim()) return false
  const normalized = userAnswer.value.trim().toLowerCase()
  const accepted = props.question.answer.split('|').map(a => a.trim().toLowerCase())
  return accepted.includes(normalized)
})

function submit() {
  if (!userAnswer.value.trim()) return
  const score = isCorrect.value ? 2 : 0
  emit('answer', { questionId: props.question.id, score, answer: userAnswer.value })
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
  line-height: 1.8;
  margin-bottom: 16px;
}

:deep(.blank-spot) {
  display: inline-block;
  min-width: 80px;
  border-bottom: 2px dashed var(--accent);
  margin: 0 4px;
  color: var(--accent);
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
