<template>
  <div class="page-container" v-if="examData">
    <div class="quiz-top">
      <button class="btn btn-outline" @click="goHome">← 返回</button>
      <div class="quiz-info">
        <span class="tag tag-exam">综合考试</span>
        <h2 class="quiz-title">计算机操作系统 · 综合测试</h2>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <div class="progress-info">
      <p class="progress-text">已完成 {{ answeredCount }}/{{ totalQuestions }} 题</p>
      <button v-if="answeredCount > 0" class="btn-clear-progress" title="清除答题记录" @click="clearCurrentProgress">清除记录</button>
    </div>

    <div class="questions-area">
      <template v-for="(section, sIdx) in sections" :key="sIdx">
        <div class="section-divider">
          <span class="section-label">{{ section.label }}</span>
          <span class="section-score">{{ section.scoreInfo }}</span>
        </div>
        <component
          v-for="(q, qIdx) in section.questions"
          :key="q.id"
          :is="section.component"
          :question="q"
          :index="qIdx"
          :showResult="showResults[q._key]"
          @answer="(e) => onAnswer(q._key, section.type, e)"
          @retry="(e) => onRetry(q._key)"
          class="question-block"
        />
      </template>
    </div>

    <div class="quiz-footer" v-if="!showFinalResult">
      <div class="submit-hint" v-if="!allAnswered">
        <span>还有 <strong>{{ totalQuestions - answeredCount }}</strong> 题未完成，完成后可提交试卷</span>
      </div>
      <button
        class="btn btn-primary btn-lg"
        :disabled="!allAnswered"
        @click="showFinalResult = true"
      >{{ allAnswered ? '提交试卷' : `还有 ${totalQuestions - answeredCount} 题未完成` }}</button>
    </div>

    <div v-if="showFinalResult" class="result-panel">
      <div class="result-header">
        <h2>考试结果</h2>
        <div class="result-score-big">{{ totalScore }} / {{ maxScore }}</div>
        <p class="result-rate">正确率 {{ Math.round(totalScore / maxScore * 100) }}%</p>
      </div>
      <div class="result-breakdown">
        <div class="breakdown-item" v-for="b in breakdown" :key="b.label">
          <span class="b-label">{{ b.label }}</span>
          <span class="b-score">{{ b.score }} / {{ b.max }}</span>
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-outline" @click="goHome">返回首页</button>
        <button class="btn btn-primary" @click="saveAndGoHistory">保存成绩并查看历史</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MultipleChoice from '../components/MultipleChoice.vue'
import FillBlank from '../components/FillBlank.vue'
import ShortAnswer from '../components/ShortAnswer.vue'
import Essay from '../components/Essay.vue'
import { saveRecord, saveProgress, loadProgress, clearProgress } from '../utils/storage'

const router = useRouter()
const examData = ref(null)
const answers = ref({})
const showResults = ref({})
const showFinalResult = ref(false)
const hasRestored = ref(false)

const progressKey = 'exam'

onMounted(async () => {
  const mod = await import('../data/exam.json')
  examData.value = mod.default || mod
  restoreProgress()
})

function restoreProgress() {
  const saved = loadProgress(progressKey)
  if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
    answers.value = saved.answers
    showResults.value = saved.showResults || {}
  }
  hasRestored.value = true
}

const currentQuestions = computed(() => {
  if (!examData.value) return null
  return examData.value.sets[0].questions
})

const sections = computed(() => {
  if (!currentQuestions.value) return []
  const q = currentQuestions.value
  return [
    { label: '选择题（每题1分）', scoreInfo: '共15分', component: MultipleChoice, type: 'mc', questions: q.multipleChoice.map((item, i) => ({...item, _key: 'mc_' + i, _savedIdx: answers.value['mc_' + i]?.answer})) },
    { label: '填空题（每题2分）', scoreInfo: '共20分', component: FillBlank, type: 'fb', questions: q.fillBlank.map((item, i) => ({...item, _key: 'fb_' + i})) },
    { label: '简答题（每题5分）', scoreInfo: '共25分', component: ShortAnswer, type: 'sa', questions: q.shortAnswer.map((item, i) => ({...item, _key: 'sa_' + i})) },
    { label: '大题（每题10分）', scoreInfo: '共50分', component: Essay, type: 'es', questions: q.essay.map((item, i) => ({...item, _key: 'es_' + i})) }
  ]
})

const totalQuestions = computed(() => 15 + 10 + 5 + 5)
const answeredCount = computed(() => Object.keys(answers.value).length)
const progressPercent = computed(() => Math.round(answeredCount.value / totalQuestions.value * 100))
const allAnswered = computed(() => answeredCount.value >= totalQuestions.value)

const totalScore = computed(() => Object.values(answers.value).reduce((sum, a) => sum + a.score, 0))
const maxScore = computed(() => 15 * 1 + 10 * 2 + 5 * 5 + 5 * 10)

const breakdown = computed(() => {
  const a = answers.value
  const mcScore = Object.entries(a).filter(([k]) => k.startsWith('mc')).reduce((s, [, v]) => s + v.score, 0)
  const fbScore = Object.entries(a).filter(([k]) => k.startsWith('fb')).reduce((s, [, v]) => s + v.score, 0)
  const saScore = Object.entries(a).filter(([k]) => k.startsWith('sa')).reduce((s, [, v]) => s + v.score, 0)
  const esScore = Object.entries(a).filter(([k]) => k.startsWith('es')).reduce((s, [, v]) => s + v.score, 0)
  return [
    { label: '选择题', score: mcScore, max: 15 },
    { label: '填空题', score: fbScore, max: 20 },
    { label: '简答题', score: saScore, max: 25 },
    { label: '大题', score: esScore, max: 50 }
  ]
})

function onAnswer(key, type, e) {
  answers.value[key] = e
  showResults.value[key] = true
  if (hasRestored.value) {
    saveProgress(progressKey, { answers: answers.value, showResults: showResults.value })
  }
}

function onRetry(key) {
  delete answers.value[key]
  showResults.value[key] = false
  if (hasRestored.value) {
    saveProgress(progressKey, { answers: answers.value, showResults: showResults.value })
  }
}

function clearCurrentProgress() {
  if (!confirm('确定清除当前答题记录？')) return
  answers.value = {}
  showResults.value = {}
  clearProgress(progressKey)
}

function goHome() { router.push('/') }

function saveAndGoHistory() {
  saveRecord({
    type: 'exam',
    chapterName: '综合考试',
    score: totalScore.value,
    maxScore: maxScore.value,
    breakdown: breakdown.value
  })
  clearProgress(progressKey)
  router.push('/history')
}
</script>

<style scoped>
.quiz-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.quiz-info { flex: 1; }

.quiz-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 4px;
}

.progress-bar {
  height: 4px;
  background: var(--bg-card);
  border-radius: 2px;
  margin-bottom: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--warning), #ea580c);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.btn-clear-progress {
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-clear-progress:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.section-divider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.section-label { font-size: 15px; font-weight: 600; }
.section-score { font-size: 12px; color: var(--text-secondary); }

.question-block { margin-bottom: 24px; }

.quiz-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
}

.submit-hint {
  font-size: 13px;
  color: var(--text-secondary);
}

.submit-hint strong {
  color: var(--accent);
  font-weight: 700;
}

.btn-lg {
  padding: 14px 40px;
  font-size: 16px;
}

.btn-lg:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-panel {
  margin-top: 40px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 32px;
  text-align: center;
}

.result-header h2 { font-size: 22px; margin-bottom: 16px; }

.result-score-big {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--warning), #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-rate { color: var(--text-secondary); margin: 4px 0 24px; }

.result-breakdown { display: flex; justify-content: center; gap: 24px; margin-bottom: 28px; }
.breakdown-item { display: flex; flex-direction: column; gap: 4px; }
.b-label { font-size: 12px; color: var(--text-secondary); }
.b-score { font-size: 18px; font-weight: 700; }
.result-actions { display: flex; justify-content: center; gap: 12px; }
</style>
