<template>
  <div class="page-container">
    <button class="btn btn-outline" @click="$router.push('/')">← 返回首页</button>
    <h1 class="page-title" style="margin-top:20px">答题结果</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => router.replace('/'))
</script>
