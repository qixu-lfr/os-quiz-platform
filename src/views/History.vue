<template>
  <div class="page-container">
    <button class="btn btn-outline" @click="$router.push('/')">← 返回首页</button>
    <h1 class="page-title" style="margin-top:20px">历史记录</h1>
    <p class="page-subtitle">查看过往的答题成绩</p>

    <div v-if="history.length === 0" class="empty-state">
      <p>暂无历史记录</p>
      <p class="empty-hint">完成一次答题后，成绩会自动保存到这里</p>
    </div>

    <div v-else class="history-list">
      <div v-for="record in history" :key="record.id" class="card history-card">
        <div class="hc-top">
          <div class="hc-type">
            <span class="tag" :class="record.type === 'exam' ? 'tag-exam' : 'tag-chapter'">
              {{ record.type === 'exam' ? '综合考试' : '第' + record.chapter + '章' }}
            </span>
            <span class="hc-name">{{ record.chapterName }}</span>
            <span v-if="record.setIndex !== undefined" class="hc-set">第{{ record.setIndex + 1 }}套</span>
          </div>
          <div class="hc-score" :class="getScoreClass(record)">
            {{ record.score }} / {{ record.maxScore }}
          </div>
        </div>
        <div class="hc-breakdown" v-if="record.breakdown">
          <span v-for="b in record.breakdown" :key="b.label" class="hc-item">
            {{ b.label }} {{ b.score }}/{{ b.max }}
          </span>
        </div>
        <div class="hc-date">{{ record.date }}</div>
      </div>
    </div>

    <button v-if="history.length > 0" class="btn btn-outline clear-btn" @click="clearAll">清空历史</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHistory, clearHistory } from '../utils/storage'

const history = ref([])

onMounted(() => {
  history.value = getHistory()
})

function getScoreClass(record) {
  const rate = record.score / record.maxScore
  if (rate >= 0.8) return 'score-high'
  if (rate >= 0.6) return 'score-mid'
  return 'score-low'
}

function clearAll() {
  if (!confirm('确定清空所有历史记录？')) return
  clearHistory()
  history.value = []
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  cursor: default;
}

.history-card:hover {
  transform: none;
  box-shadow: none;
}

.hc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.hc-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hc-name {
  font-size: 15px;
  font-weight: 600;
}

.hc-set {
  font-size: 12px;
  color: var(--text-secondary);
}

.hc-score {
  font-size: 20px;
  font-weight: 800;
}

.score-high { color: var(--success); }
.score-mid { color: var(--warning); }
.score-low { color: var(--danger); }

.hc-breakdown {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.hc-item {
  font-size: 12px;
  color: var(--text-secondary);
}

.hc-date {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.clear-btn {
  margin-top: 24px;
  color: var(--danger);
  border-color: rgba(248, 113, 113, 0.3);
}

.clear-btn:hover {
  border-color: var(--danger);
  background: var(--danger-bg);
}
</style>
