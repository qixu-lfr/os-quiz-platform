import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/quiz/chapter/:chapter', name: 'ChapterQuiz', component: () => import('../views/ChapterQuiz.vue') },
  { path: '/quiz/exam', name: 'ExamQuiz', component: () => import('../views/ExamQuiz.vue') },
  { path: '/result', name: 'QuizResult', component: () => import('../views/QuizResult.vue') },
  { path: '/history', name: 'History', component: () => import('../views/History.vue') },
  { path: '/review/:recordId', name: 'QuizReview', component: () => import('../views/QuizReview.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
