<template>
  <div class="page-container" v-if="record && quizData">
    <button class="btn btn-outline" @click="$router.push('/history')">← 返回历史记录</button>

    <div class="review-header">
      <h1 class="page-title" style="margin-top:20px">
        <span class="tag" :class="record.type === 'exam' ? 'tag-exam' : 'tag-chapter'">
          {{ record.type === 'exam' ? '综合考试' : '第' + record.chapter + '章' }}
        </span>
        {{ record.chapterName }}
        <span v-if="record.setIndex !== undefined" class="review-set">第{{ record.setIndex + 1 }}套</span>
      </h1>
      <p class="page-subtitle">答题回顾 · {{ record.date }} · 完成 {{ record.answeredCount }}/{{ record.totalQuestions }} 题</p>
    </div>

    <div class="questions-area">
      <template v-for="(section, sIdx) in sections" :key="sIdx">
        <div class="section-divider">
          <span class="section-label">{{ section.label }}</span>
          <span class="section-score">{{ section.scoreInfo }}</span>
        </div>
        <component
          v-for="(q, qIdx) in section.questions"
          :key="q._key"
          :is="section.component"
          :question="q"
          :index="qIdx"
          :showResult="record.showResults[q._key] || false"
          :savedAnswer="q._savedAnswer"
          :readonly="true"
          class="question-block"
        />
      </template>
    </div>
  </div>

  <div class="page-container" v-else-if="!record">
    <button class="btn btn-outline" @click="$router.push('/history')">← 返回历史记录</button>
    <div class="empty-state">
      <p>未找到该答题记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MultipleChoice from '../components/MultipleChoice.vue'
import FillBlank from '../components/FillBlank.vue'
import ShortAnswer from '../components/ShortAnswer.vue'
import Essay from '../components/Essay.vue'
import { getHistory } from '../utils/storage'

const route = useRoute()
const recordId = parseInt(route.params.recordId)

const record = ref(null)
const quizData = ref(null)

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
  const history = getHistory()
  record.value = history.find(r => r.id === recordId)
  if (!record.value) return

  if (record.value.type === 'exam') {
    const mod = await import('../data/exam.json')
    quizData.value = (mod.default || mod).sets[0].questions
  } else {
    const mod = await allData[record.value.chapter]()
    const data = mod.default || mod
    quizData.value = data.sets[record.value.setIndex].questions
  }
})

const sections = computed(() => {
  if (!quizData.value) return []
  const q = quizData.value
  const answers = record.value.answers || {}

  return [
    {
      label: '选择题（每题1分）', scoreInfo: '共15分', component: MultipleChoice, type: 'mc',
      questions: q.multipleChoice.map((item, i) => ({
        ...item, _key: 'mc_' + i,
        _savedAnswer: answers['mc_' + i]?.answer
      }))
    },
    {
      label: '填空题（每题2分）', scoreInfo: '共20分', component: FillBlank, type: 'fb',
      questions: q.fillBlank.map((item, i) => ({
        ...item, _key: 'fb_' + i,
        _savedAnswer: answers['fb_' + i]?.answer || ''
      }))
    },
    {
      label: '简答题（每题5分）', scoreInfo: '共25分', component: ShortAnswer, type: 'sa',
      questions: q.shortAnswer.map((item, i) => ({
        ...item, _key: 'sa_' + i,
        _savedAnswer: answers['sa_' + i]?.answer || ''
      }))
    },
    {
      label: '大题（每题10分）', scoreInfo: record.value.type === 'exam' ? '共50分' : '共30分', component: Essay, type: 'es',
      questions: q.essay.map((item, i) => ({
        ...item, _key: 'es_' + i,
        _savedAnswer: answers['es_' + i]?.answer || ''
      }))
    }
  ]
})
</script>

<style scoped>
.review-header {
  margin-bottom: 8px;
}

.review-set {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
  margin-left: 8px;
}

.page-subtitle {
  font-size: 13px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}
</style>
