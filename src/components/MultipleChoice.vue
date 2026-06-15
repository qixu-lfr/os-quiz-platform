<template>
  <div class="mc-question">
    <div class="question-header">
      <span class="question-num">{{ index + 1 }}</span>
      <span class="question-type-tag">选择题</span>
      <span class="question-score">1分</span>
    </div>
    <p class="question-text">{{ question.question }}</p>
    <div class="options-list">
      <div
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-item"
        :class="{
          'selected': selected === i && !showResult,
          'correct': showResult && i === question.answer,
          'wrong': showResult && selected === i && i !== question.answer
        }"
        @click="select(i)"
      >
        <span class="option-label">{{ ['A','B','C','D'][i] }}</span>
        <span class="option-text">{{ opt }}</span>
        <span v-if="showResult && isCorrect && i === question.answer" class="option-icon">✓</span>
        <span v-else-if="showResult && selected === i && i !== question.answer" class="option-icon wrong-icon">✗</span>
      </div>
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  question: Object,
  index: Number,
  showResult: Boolean
})

const emit = defineEmits(['answer'])
const selected = ref(null)

watch(() => props.question._savedIdx, (v) => {
  if (v != null && selected.value === null) selected.value = v
}, { immediate: true })

const isCorrect = computed(() => selected.value === props.question.answer)

function select(i) {
  selected.value = i
  emit('answer', { questionId: props.question.id, score: i === props.question.answer ? 1 : 0, answer: i })
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
  background: rgba(91, 99, 211, 0.08);
  color: var(--accent);
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
  line-height: 1.7;
  margin-bottom: 16px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover:not(.correct):not(.wrong) {
  border-color: var(--accent);
  background: rgba(91, 99, 211, 0.04);
}

.option-item.selected {
  border-color: var(--accent);
  background: rgba(91, 99, 211, 0.08);
}

.option-item.correct {
  border-color: var(--success);
  background: var(--success-bg);
}

.option-item.wrong {
  border-color: var(--danger);
  background: var(--danger-bg);
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-primary);
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  font-size: 14px;
}

.option-icon {
  color: var(--success);
  font-weight: 700;
  font-size: 16px;
}

.wrong-icon {
  color: var(--danger);
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
