<template>
  <div class="page-container" v-if="quizData">
    <div class="quiz-top">
      <button class="btn btn-outline" @click="goHome">← 返回</button>
      <div class="quiz-info">
        <span class="tag tag-chapter">第{{ chapter }}章</span>
        <h2 class="quiz-title">{{ quizData.chapterName }}</h2>
      </div>
      <div class="set-selector">
        <button
          v-for="(s, i) in quizData.sets"
          :key="i"
          class="set-btn"
          :class="{ active: currentSet === i }"
          @click="switchSet(i)"
        >套{{ i + 1 }}</button>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <p class="progress-text">已完成 {{ answeredCount }}/{{ totalQuestions }} 题</p>

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
        <h2>答题结果</h2>
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
import { useRoute, useRouter } from 'vue-router'
import MultipleChoice from '../components/MultipleChoice.vue'
import FillBlank from '../components/FillBlank.vue'
import ShortAnswer from '../components/ShortAnswer.vue'
import Essay from '../components/Essay.vue'
import { saveRecord } from '../utils/storage'

const route = useRoute()
const router = useRouter()
const chapter = parseInt(route.params.chapter)

const quizData = ref(null)
const currentSet = ref(0)
const answers = ref({})
const showResults = ref({})
const showFinalResult = ref(false)

const allData = {
  0: () => import('../data/ch0.json'),
  1: () => import('../data/ch1.json'),
  2: () => import('../data/ch2.json'),
  3: () => import('../data/ch3.json'),
  4: () => import('../data/ch4.json'),
  5: () => import('../data/ch5.json'),
  6: () => import('../data/ch6.json')
}

onMounted(async () => {
  const mod = await allData[chapter]()
  quizData.value = mod.default || mod
})

const currentQuestions = computed(() => {
  if (!quizData.value) return null
  return quizData.value.sets[currentSet.value].questions
})

const sections = computed(() => {
  if (!currentQuestions.value) return []
  const q = currentQuestions.value
  return [
    { label: '选择题（每题1分）', scoreInfo: '共15分', component: MultipleChoice, type: 'mc', questions: q.multipleChoice.map((item, i) => ({...item, _key: 'mc_' + i})) },
    { label: '填空题（每题2分）', scoreInfo: '共20分', component: FillBlank, type: 'fb', questions: q.fillBlank.map((item, i) => ({...item, _key: 'fb_' + i})) },
    { label: '简答题（每题5分）', scoreInfo: '共25分', component: ShortAnswer, type: 'sa', questions: q.shortAnswer.map((item, i) => ({...item, _key: 'sa_' + i})) },
    { label: '大题（每题10分）', scoreInfo: '共30分', component: Essay, type: 'es', questions: q.essay.map((item, i) => ({...item, _key: 'es_' + i})) }
  ]
})

const totalQuestions = computed(() => 15 + 10 + 5 + 3)
const answeredCount = computed(() => Object.keys(answers.value).length)
const progressPercent = computed(() => Math.round(answeredCount.value / totalQuestions.value * 100))
const allAnswered = computed(() => answeredCount.value >= totalQuestions.value)

const totalScore = computed(() => Object.values(answers.value).reduce((sum, a) => sum + a.score, 0))
const maxScore = computed(() => 15 * 1 + 10 * 2 + 5 * 5 + 3 * 10)

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
    { label: '大题', score: esScore, max: 30 }
  ]
})

function onAnswer(key, type, e) {
  answers.value[key] = e
  showResults.value[key] = true
}

function switchSet(i) {
  if (Object.keys(answers.value).length > 0 && !confirm('切换将清空当前答题记录，确定切换？')) return
  currentSet.value = i
  answers.value = {}
  showResults.value = {}
  showFinalResult.value = false
}

function goHome() {
  router.push('/')
}

function saveAndGoHistory() {
  saveRecord({
    type: 'chapter',
    chapter,
    chapterName: quizData.value.chapterName,
    setIndex: currentSet.value,
    score: totalScore.value,
    maxScore: maxScore.value,
    breakdown: breakdown.value
  })
  router.push('/history')
}
</script>

<style scoped>
.quiz-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.quiz-info {
  flex: 1;
}

.quiz-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 4px;
}

.set-selector {
  display: flex;
  gap: 6px;
}

.set-btn {
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 13px;
  transition: all 0.2s;
}

.set-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.set-btn:hover:not(.active) {
  border-color: var(--accent);
  color: var(--accent);
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
  background: linear-gradient(90deg, var(--accent), #7c3aed);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.section-divider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.section-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-score {
  font-size: 12px;
  color: var(--text-secondary);
}

.question-block {
  margin-bottom: 24px;
}

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

.result-header h2 {
  font-size: 22px;
  margin-bottom: 16px;
}

.result-score-big {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-rate {
  color: var(--text-secondary);
  margin-top: 4px;
  margin-bottom: 24px;
}

.result-breakdown {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.b-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.b-score {
  font-size: 18px;
  font-weight: 700;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
