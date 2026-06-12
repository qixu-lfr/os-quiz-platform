<template>
  <div class="page-container home">
    <div class="home-header">
      <div class="home-logo">
        <span class="logo-icon">OS</span>
        <div>
          <h1 class="page-title">计算机操作系统</h1>
          <p class="page-subtitle">刷题平台 · 共覆盖7章 + 综合考试</p>
        </div>
      </div>
      <router-link to="/history" class="btn btn-outline history-btn">📋 历史记录</router-link>
    </div>

    <h2 class="section-title">章节练习</h2>
    <p class="section-desc">每章3套试卷，选择一套开始练习</p>
    <div class="chapter-grid">
      <div
        v-for="ch in chapters"
        :key="ch.id"
        class="card chapter-card"
        @click="goChapter(ch.id)"
      >
        <div class="chapter-top">
          <span class="chapter-num">{{ ch.id }}</span>
          <span class="tag tag-chapter">3套</span>
        </div>
        <h3 class="chapter-name">{{ ch.name }}</h3>
        <p class="chapter-desc">{{ ch.desc }}</p>
        <div class="chapter-meta">
          <span>15选择 · 10填空 · 5简答 · 3大题</span>
        </div>
      </div>
    </div>

    <h2 class="section-title" style="margin-top:40px">综合考试</h2>
    <p class="section-desc">涵盖全部章节，模拟期末考试</p>
    <div class="card exam-card" @click="goExam">
      <div class="chapter-top">
        <span class="exam-icon">🎓</span>
        <span class="tag tag-exam">综合</span>
      </div>
      <h3 class="chapter-name">综合测试</h3>
      <p class="chapter-desc">覆盖全部章节知识点，包含5道大题</p>
      <div class="chapter-meta">
        <span>15选择 · 10填空 · 5简答 · 5大题 · 满分110</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const chapters = [
  { id: 0, name: '计算机系统概述', desc: '硬件结构、CPU、存储器、指令执行' },
  { id: 1, name: '操作系统引论', desc: '定义、发展历史、特性、功能、分类' },
  { id: 2, name: '操作系统用户界面', desc: '作业管理、命令控制、系统调用' },
  { id: 3, name: '进程与线程', desc: '进程定义、状态转换、PCB、线程、同步互斥、死锁' },
  { id: 4, name: '处理机调度', desc: '调度层次、FCFS/SJF/RR算法' },
  { id: 5, name: '存储管理', desc: '地址重定位、分页/分段/段页式' },
  { id: 6, name: '虚拟存储管理', desc: '局部性原理、页面置换算法、抖动' }
]

function goChapter(id) {
  router.push({ name: 'ChapterQuiz', params: { chapter: id } })
}

function goExam() {
  router.push({ name: 'ExamQuiz' })
}
</script>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.home-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6c7cff 0%, #a855f7 100%);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -1px;
}

.history-btn {
  font-size: 13px;
  padding: 8px 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 20px;
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.chapter-card {
  cursor: pointer;
}

.chapter-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.chapter-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(108, 124, 255, 0.12);
  color: var(--accent);
  font-size: 16px;
  font-weight: 700;
}

.chapter-name {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 6px;
}

.chapter-desc {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.chapter-meta {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.exam-card {
  cursor: pointer;
  background: linear-gradient(135deg, #1e2235 0%, #2a1e35 100%);
  border-color: rgba(251, 191, 36, 0.2);
}

.exam-card:hover {
  border-color: var(--warning);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.08);
}

.exam-icon {
  font-size: 32px;
}
</style>
