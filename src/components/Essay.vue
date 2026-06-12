<template>
  <div class="essay-question">
    <div class="question-header">
      <span class="question-num">{{ index + 1 }}</span>
      <span class="question-type-tag">大题</span>
      <span class="question-score">10分</span>
    </div>
    <p class="question-text">{{ question.question }}</p>
    <div class="answer-area">
      <textarea
        v-model="userAnswer"
        class="answer-textarea"
        placeholder="请详细作答..."
        rows="8"
      ></textarea>
      <button class="btn btn-primary submit-btn" @click="submit" :disabled="!userAnswer.trim()">提交答案</button>
    </div>
    <div v-if="submitted" class="explanation exp-ref">
      <strong>📝 参考答案</strong>
      <p class="ref-answer">{{ question.answer }}</p>
      <div class="knowledge-ref">
        <strong>📖 知识点解析：</strong>
        <p>{{ question.explanation }}</p>
      </div>
      <div class="self-score">
        <span>请对照参考答案自评：</span>
        <div class="score-btns">
          <button class="score-btn full" @click="score(10)">满分 (10分)</button>
          <button class="score-btn good" @click="score(7)">较好 (7分)</button>
          <button class="score-btn half" @click="score(5)">一般 (5分)</button>
          <button class="score-btn low" @click="score(2)">较差 (2分)</button>
          <button class="score-btn zero" @click="score(0)">未答对 (0分)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: Object,
  index: Number,
  showResult: Boolean
})

const emit = defineEmits(['answer'])
const userAnswer = ref('')
const submitted = ref(false)

function submit() {
  if (!userAnswer.value.trim()) return
  submitted.value = true
}

function score(s) {
  emit('answer', { questionId: props.question.id, score: s, answer: userAnswer.value })
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
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
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

.answer-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-textarea {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
}

.answer-textarea:focus {
  border-color: var(--accent);
}

.answer-textarea:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.submit-btn {
  align-self: flex-start;
}

.explanation {
  margin-top: 12px;
  padding: 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  line-height: 1.6;
}

.exp-ref {
  background: rgba(91, 99, 211, 0.06);
  border: 1px solid rgba(91, 99, 211, 0.15);
}

.exp-ref strong {
  color: var(--accent);
  font-size: 14px;
}

.ref-answer {
  margin-top: 10px;
  padding: 10px 14px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  line-height: 1.7;
}

.knowledge-ref {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
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

.ref-detail {
  margin-top: 8px;
  color: var(--text-secondary);
}

.self-score {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 13px;
}

.score-btns {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.score-btn {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.score-btn:hover {
  transform: translateY(-1px);
}

.score-btn.full { border-color: var(--success); color: var(--success); }
.score-btn.full:hover { background: var(--success-bg); }
.score-btn.good { border-color: #3b82f6; color: #3b82f6; }
.score-btn.good:hover { background: rgba(59, 130, 246, 0.1); }
.score-btn.half { border-color: var(--warning); color: var(--warning); }
.score-btn.half:hover { background: var(--warning-bg); }
.score-btn.low { border-color: #ea580c; color: #ea580c; }
.score-btn.low:hover { background: rgba(234, 88, 12, 0.1); }
.score-btn.zero { border-color: var(--danger); color: var(--danger); }
.score-btn.zero:hover { background: var(--danger-bg); }
</style>
