<template>
  <div class="page-container">
    <button class="btn btn-outline" @click="$router.push('/')">← 返回首页</button>
    <h1 class="page-title" style="margin-top:20px">历史记录</h1>
    <p class="page-subtitle">查看过往的答题记录，便于回头复习</p>

    <div v-if="history.length === 0" class="empty-state">
      <p>暂无历史记录</p>
      <p class="empty-hint">完成部分题目后保存，记录会自动保存到这里</p>
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
          <div class="hc-progress">
            已完成 {{ record.answeredCount || 0 }}/{{ record.totalQuestions || '?' }} 题
          </div>
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

.hc-date {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.clear-btn {
  margin-top: 24px;
  color: var(--danger);
  border-color: rgba(220, 38, 38, 0.2);
}

.clear-btn:hover {
  border-color: var(--danger);
  background: var(--danger-bg);
}
</style>
