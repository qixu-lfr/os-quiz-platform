<template>
  <div class="page-container home">
    <div class="user-bar">
      <template v-if="currentUser">
        <span class="user-label">当前用户</span>
        <span class="user-name">{{ currentUser }}</span>
        <button class="user-switch-btn" @click="showSwitch = !showSwitch">{{ showSwitch ? '收起' : '切换' }}</button>
      </template>
      <div v-if="!currentUser || showSwitch" class="user-picker">
        <div class="user-picker-row">
          <input
            v-model="newName"
            class="user-input"
            placeholder="输入你的姓名..."
            @keyup.enter="setUser"
          />
          <button class="btn btn-primary user-confirm-btn" :disabled="!newName.trim()" @click="setUser">确认</button>
        </div>
        <div v-if="userList.length > 0" class="user-list-hint">
          <span v-if="currentUser">或切换到已有用户：</span>
          <span v-else>已有用户：</span>
          <span
            v-for="u in userList"
            :key="u"
            class="user-tag-wrap"
          >
            <button class="user-tag" @click="switchUser(u)">{{ u }}</button>
            <button class="user-tag-del" title="删除该用户" @click="deleteUser(u)">×</button>
          </span>
        </div>
      </div>
    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, setCurrentUser, getUserList, removeUser } from '../utils/user'

const router = useRouter()

const currentUser = ref(getCurrentUser())
const userList = ref(getUserList())
const newName = ref('')
const showSwitch = ref(false)

function setUser() {
  const name = newName.value.trim()
  if (!name) return
  setCurrentUser(name)
  currentUser.value = name
  userList.value = getUserList()
  newName.value = ''
  showSwitch.value = false
}

function switchUser(name) {
  setCurrentUser(name)
  currentUser.value = name
  newName.value = ''
  showSwitch.value = false
}

function deleteUser(name) {
  if (!confirm(`确定删除用户「${name}」及其所有答题数据？此操作不可恢复。`)) return
  removeUser(name)
  userList.value = getUserList()
  if (currentUser.value === name) {
    currentUser.value = ''
  }
}

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
.user-bar {
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.user-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-right: 8px;
}

.user-name {
  font-weight: 700;
  color: var(--accent);
  font-size: 15px;
}

.user-switch-btn {
  margin-left: 12px;
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.user-switch-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.user-picker {
  margin-top: 10px;
}

.user-picker-row {
  display: flex;
  gap: 8px;
}

.user-input {
  flex: 1;
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.user-input:focus {
  border-color: var(--accent);
}

.user-confirm-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 14px;
}

.user-list-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.user-tag {
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  background: rgba(91, 99, 211, 0.06);
  border: 1px solid rgba(91, 99, 211, 0.15);
  color: var(--accent);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.user-tag:hover {
  background: rgba(91, 99, 211, 0.12);
  border-color: var(--accent);
}

.user-tag-wrap {
  display: inline-flex;
  align-items: center;
}

.user-tag-del {
  margin-left: 2px;
  padding: 0 4px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
  border-radius: 3px;
}

.user-tag-del:hover {
  color: var(--danger);
  background: var(--danger-bg);
}

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
  background: linear-gradient(135deg, #5b63d3 0%, #7c3aed 100%);
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
  background: rgba(91, 99, 211, 0.08);
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
  background: linear-gradient(135deg, #fefcf7 0%, #fdf8f0 100%);
  border-color: rgba(217, 119, 6, 0.12);
}

.exam-card:hover {
  border-color: var(--warning);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.06);
}

.exam-icon {
  font-size: 32px;
}
</style>
